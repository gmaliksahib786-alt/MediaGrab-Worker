

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...extraHeaders,
    },
  });
}

function errorResponse(message, status = 400) {
  return jsonResponse({ error: message, success: false }, status);
}

/* ─── URL Extractors ─── */
function extractYouTubeId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  return url.match(regex)?.[1] || null;
}

function extractTwitterId(url) {
  const regex = /(?:twitter|x)\.com\/\w+\/status\/(\d+)/;
  return url.match(regex)?.[1] || null;
}

function extractInstagramShortcode(url) {
  const regex = /instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/;
  return url.match(regex)?.[1] || null;
}

function extractTikTokUniqueId(url) {
  const regex = /tiktok\.com\/@[\w.]+\/video\/(\d+)/;
  return url.match(regex)?.[1] || null;
}

function extractRedditJsonUrl(url) {
  if (url.endsWith('.json')) return url;
  // Ensure we don't double-add .json to query strings
  const clean = url.split('?')[0];
  return clean.replace(/\/?$/, '.json');
}

/* ─── Platform Handlers ─── */

async function handleYouTube(url) {
  const videoId = extractYouTubeId(url);
  if (!videoId) throw new Error('Invalid YouTube URL. Expected formats: youtube.com/watch?v=ID or youtu.be/ID');

  const thumbnails = {
    maxres: { url: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`, width: 1280, height: 720 },
    standard: { url: `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`, width: 640, height: 480 },
    high: { url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`, width: 480, height: 360 },
    medium: { url: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`, width: 320, height: 180 },
    default: { url: `https://i.ytimg.com/vi/${videoId}/default.jpg`, width: 120, height: 90 },
  };

  let title = 'YouTube Video';
  let author = 'Unknown';
  let duration = null;

  try {
    const oembed = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    if (oembed.ok) {
      const data = await oembed.json();
      title = data.title || title;
      author = data.author_name || author;
    }
  } catch (e) { /* silent fail */ }

  // Build media array (thumbnails only — direct video streams require yt-dlp)
  const media = Object.entries(thumbnails).map(([quality, info]) => ({
    type: 'image',
    url: info.url,
    quality,
    resolution: `${info.width}x${info.height}`,
    note: quality === 'maxres' ? 'May not exist for all videos' : undefined,
  }));

  return {
    platform: 'youtube',
    title,
    author,
    duration,
    videoId,
    media,
    disclaimer: 'YouTube video streams are not directly exposed by public APIs. This endpoint provides thumbnails and metadata. For full video extraction, a server-side tool like yt-dlp is required.',
  };
}

async function handleTwitter(url) {
  const tweetId = extractTwitterId(url);
  if (!tweetId) throw new Error('Invalid Twitter/X URL. Expected format: twitter.com/username/status/ID or x.com/username/status/ID');

  const syndicationUrl = `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&lang=en`;
  const response = await fetch(syndicationUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Referer': 'https://twitter.com/',
    },
  });

  if (!response.ok) {
    if (response.status === 404) throw new Error('Tweet not found or account is private/suspended.');
    throw new Error(`Twitter syndication API returned ${response.status}`);
  }

  const data = await response.json();
  const media = [];

  // Videos
  if (data.video) {
    const variants = (data.video.variants || [])
      .filter(v => v.type === 'video/mp4' && v.src)
      .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));

    for (const v of variants) {
      media.push({
        type: 'video',
        url: v.src,
        quality: v.bitrate ? `${Math.round(v.bitrate / 1000)}kbps` : 'unknown',
        thumbnail: data.video.poster,
        duration: data.video.durationMs ? `${Math.round(data.video.durationMs / 1000)}s` : undefined,
      });
    }
  }

  // Photos
  if (data.mediaDetails) {
    for (const m of data.mediaDetails) {
      if (m.type === 'photo' && m.media_url_https) {
        media.push({
          type: 'image',
          url: m.media_url_https + '?name=large',
          quality: 'large',
          resolution: `${m.original_info?.width || 0}x${m.original_info?.height || 0}`,
        });
      }
    }
  }

  if (!media.length) {
    throw new Error('No downloadable media found in this tweet. It may contain only text or the media is restricted.');
  }

  return {
    platform: 'twitter',
    title: data.text?.substring(0, 200) || 'Twitter/X Media',
    author: data.user?.screen_name || data.user?.name || 'Unknown',
    tweetId,
    media,
  };
}

async function handleInstagram(url) {
  const shortcode = extractInstagramShortcode(url);
  if (!shortcode) throw new Error('Invalid Instagram URL. Expected formats: instagram.com/p/ID, instagram.com/reel/ID, instagram.com/reels/ID');

  const pageUrl = `https://www.instagram.com/p/${shortcode}/`;
  const response = await fetch(pageUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://www.instagram.com/',
    },
  });

  if (!response.ok) {
    throw new Error(`Instagram returned ${response.status}. The post may be private, deleted, or require login.`);
  }

  const html = await response.text();
  let media = [];
  let title = 'Instagram Post';
  let author = 'Unknown';

  // Strategy 1: window._sharedData
  const sharedMatch = html.match(/<script[^>]*>window\._sharedData\s*=\s*({.+?});<\/script>/);
  const additionalMatch = html.match(/<script[^>]*>window\.__additionalDataLoaded\s*\(\s*['"][^'"]+['"]\s*,\s*({.+?})\s*\);<\/script>/);

  if (sharedMatch || additionalMatch) {
    try {
      const raw = (additionalMatch?.[1] || sharedMatch?.[1]).replace(/\\u0026/g, '&');
      const data = JSON.parse(raw);
      const post = data.entry_data?.PostPage?.[0]?.graphql?.shortcode_media ||
                   data.entry_data?.PostPage?.[0]?.media ||
                   data.graphql?.shortcode_media;

      if (post) {
        author = post.owner?.username || author;
        title = post.edge_media_to_caption?.edges?.[0]?.node?.text?.substring(0, 120) || title;

        if (post.__typename === 'GraphSidecar' && post.edge_sidecar_to_children?.edges) {
          for (const edge of post.edge_sidecar_to_children.edges) {
            const node = edge.node;
            if (node.is_video) {
              media.push({ type: 'video', url: node.video_url, quality: `${node.dimensions?.width}x${node.dimensions?.height}` });
            } else {
              media.push({ type: 'image', url: node.display_url, quality: `${node.dimensions?.width}x${node.dimensions?.height}` });
            }
          }
        } else if (post.is_video) {
          media.push({ type: 'video', url: post.video_url, quality: `${post.dimensions?.width}x${post.dimensions?.height}` });
        } else {
          media.push({ type: 'image', url: post.display_url, quality: `${post.dimensions?.width}x${post.dimensions?.height}` });
        }
      }
    } catch (e) { /* continue to fallback */ }
  }

  // Strategy 2: Meta tags
  if (!media.length) {
    const ogVideo = html.match(/property="og:video" content="([^"]+)"/i)?.[1] ||
                    html.match(/property="og:video:url" content="([^"]+)"/i)?.[1] ||
                    html.match(/"video_url":"([^"]+)"/)?.[1];
    const ogImage = html.match(/property="og:image" content="([^"]+)"/i)?.[1] ||
                    html.match(/"display_url":"([^"]+)"/)?.[1];
    const ogTitle = html.match(/property="og:title" content="([^"]+)"/i)?.[1];
    const ogDesc = html.match(/property="og:description" content="([^"]+)"/i)?.[1];

    if (ogVideo) media.push({ type: 'video', url: ogVideo.replace(/\\u0026/g, '&'), quality: 'unknown' });
    else if (ogImage) media.push({ type: 'image', url: ogImage.replace(/\\u0026/g, '&'), quality: 'unknown' });

    if (ogTitle) title = ogTitle;
    if (ogDesc) author = ogDesc.split(' ')[0].replace('@', '');
  }

  if (!media.length) {
    throw new Error('Unable to extract Instagram media. The platform now requires authentication for most public posts. Consider using the mobile app share URL or ensure the post is public.');
  }

  return { platform: 'instagram', title, author, shortcode, media };
}

async function handleTikTok(url) {
  const cleanUrl = url.split('?')[0];
  let title = 'TikTok Video';
  let author = 'Unknown';

  // oembed for metadata
  try {
    const oembedRes = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(cleanUrl)}`);
    if (oembedRes.ok) {
      const data = await oembedRes.json();
      title = data.title || title;
      author = data.author_name || author;
    }
  } catch (e) { /* silent */ }

  // Page scrape for video URL
  const response = await fetch(cleanUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://www.tiktok.com/',
    },
  });

  let media = [];

  if (response.ok) {
    const html = await response.text();

    // JSON-LD
    const ldMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
    if (ldMatch) {
      try {
        const ld = JSON.parse(ldMatch[1]);
        if (ld.video?.contentUrl) {
          media.push({ type: 'video', url: ld.video.contentUrl, quality: 'original' });
        }
        if (ld.video?.thumbnailUrl) {
          // Could add thumbnail as separate image if needed
        }
      } catch (e) {}
    }

    // Meta video tags
    if (!media.length) {
      const vidMatch = html.match(/property="og:video:url" content="([^"]+)"/i)?.[1] ||
                       html.match(/property="og:video" content="([^"]+)"/i)?.[1];
      if (vidMatch) media.push({ type: 'video', url: vidMatch, quality: 'original' });
    }

    // SIGI_STATE (legacy but sometimes present)
    if (!media.length) {
      const sigiMatch = html.match(/<script[^>]*>window\['SIGI_STATE'\]\s*=\s*({.+?});<\/script>/);
      if (sigiMatch) {
        try {
          const sigi = JSON.parse(sigiMatch[1]);
          const item = Object.values(sigi.ItemModule || {})[0];
          if (item?.video?.downloadAddr) {
            media.push({ type: 'video', url: item.video.downloadAddr, quality: `${item.video.width}x${item.video.height}` });
          } else if (item?.video?.playAddr) {
            media.push({ type: 'video', url: item.video.playAddr, quality: `${item.video.width}x${item.video.height}` });
          }
        } catch (e) {}
      }
    }
  }

  if (!media.length) {
    throw new Error('Unable to extract TikTok video URL. TikTok actively blocks automated access. Try refreshing or using a share link directly from the app.');
  }

  return { platform: 'tiktok', title, author, media };
}

async function handleReddit(url) {
  const jsonUrl = extractRedditJsonUrl(url);
  const response = await fetch(jsonUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; MediaGrab/1.0; +https://github.com/yourname/mediagrab)',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Reddit returned ${response.status}. Ensure the URL is a post, not a subreddit homepage.`);
  }

  const data = await response.json();
  const post = data[0]?.data?.children?.[0]?.data;
  if (!post) throw new Error('No post data found in Reddit response.');

  const media = [];

  // v.redd.it videos
  if (post.media?.reddit_video?.fallback_url) {
    media.push({
      type: 'video',
      url: post.media.reddit_video.fallback_url,
      quality: `${post.media.reddit_video.width}x${post.media.reddit_video.height}`,
      hasAudio: !!post.media.reddit_video.hls_url,
    });
  }

  // Gallery
  if (post.gallery_data?.items && post.media_metadata) {
    for (const item of post.gallery_data.items) {
      const meta = post.media_metadata[item.media_id];
      if (meta?.s?.u) {
        media.push({ type: 'image', url: meta.s.u.replace(/&amp;/g, '&'), quality: 'original' });
      } else if (meta?.s?.gif) {
        media.push({ type: 'video', url: meta.s.gif.replace(/&amp;/g, '&'), quality: 'gif' });
      }
    }
  }

  // Direct image/video links in post
  const dest = post.url_overridden_by_dest;
  if (dest && !post.is_self && !media.length) {
    if (dest.match(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i)) {
      media.push({ type: 'image', url: dest, quality: 'original' });
    } else if (dest.match(/\.(mp4|webm)(\?.*)?$/i)) {
      media.push({ type: 'video', url: dest, quality: 'original' });
    } else if (dest.includes('i.redd.it') || dest.includes('i.imgur.com')) {
      media.push({ type: 'image', url: dest, quality: 'original' });
    } else if (dest.includes('v.redd.it') && !media.length) {
      // Sometimes fallback_url isn't present but url is v.redd.it
      media.push({ type: 'video', url: dest + '/DASH_720.mp4', quality: '720p (guess)' });
    }
  }

  // Preview images as last resort
  if (!media.length && post.preview?.images?.[0]?.source?.url) {
    media.push({
      type: 'image',
      url: post.preview.images[0].source.url.replace(/&amp;/g, '&'),
      quality: 'preview',
    });
  }

  if (!media.length) {
    throw new Error('No downloadable media found. The post may be text-only or link to an external site.');
  }

  return {
    platform: 'reddit',
    title: post.title,
    author: post.author,
    subreddit: post.subreddit_name_prefixed,
    permalink: `https://reddit.com${post.permalink}`,
    media,
  };
}

/* ─── API Routers ─── */

async function handleDownload(request) {
  const reqUrl = new URL(request.url);
  const platform = reqUrl.searchParams.get('platform');
  const mediaUrl = reqUrl.searchParams.get('url');

  if (!platform) return errorResponse('Missing "platform" query parameter.', 400);
  if (!mediaUrl) return errorResponse('Missing "url" query parameter.', 400);

  let result;
  switch (platform.toLowerCase()) {
    case 'youtube': result = await handleYouTube(mediaUrl); break;
    case 'twitter':
    case 'x': result = await handleTwitter(mediaUrl); break;
    case 'instagram': result = await handleInstagram(mediaUrl); break;
    case 'tiktok': result = await handleTikTok(mediaUrl); break;
    case 'reddit': result = await handleReddit(mediaUrl); break;
    default:
      return errorResponse(`Unsupported platform: ${platform}. Supported: youtube, twitter/x, instagram, tiktok, reddit.`, 400);
  }

  return jsonResponse({ success: true, ...result });
}

async function handleProxy(request) {
  const reqUrl = new URL(request.url);
  const target = reqUrl.searchParams.get('url');
  const filename = reqUrl.searchParams.get('filename') || 'download';

  if (!target) return errorResponse('Missing "url" query parameter.', 400);

  // Security: only allow http/https
  let parsed;
  try {
    parsed = new URL(target);
  } catch {
    return errorResponse('Invalid target URL.', 400);
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return errorResponse('Only HTTP/HTTPS URLs are allowed.', 400);
  }

  const proxyRes = await fetch(target, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': '*/*',
      'Referer': parsed.origin,
    },
  });

  if (!proxyRes.ok) {
    return errorResponse(`Upstream returned ${proxyRes.status}. The media may be expired or protected.`, 502);
  }

  const contentType = proxyRes.headers.get('content-type') || 'application/octet-stream';
  const contentLength = proxyRes.headers.get('content-length');

  const headers = {
    'Content-Type': contentType,
    'Content-Disposition': `attachment; filename="${filename.replace(/[^a-z0-9_.-]/gi, '_')}"`,
    'Cache-Control': 'public, max-age=3600',
    ...corsHeaders,
  };
  if (contentLength) headers['Content-Length'] = contentLength;

  return new Response(proxyRes.body, { status: 200, headers });
}

function handlePlatforms() {
  return jsonResponse({
    success: true,
    platforms: [
      { id: 'youtube', name: 'YouTube', status: 'stable', types: ['thumbnails', 'metadata'], notes: 'Video streams require yt-dlp' },
      { id: 'twitter', name: 'Twitter / X', status: 'stable', types: ['videos', 'images'], notes: 'Public tweets only' },
      { id: 'reddit', name: 'Reddit', status: 'stable', types: ['videos', 'images', 'galleries'], notes: 'Public posts only' },
      { id: 'instagram', name: 'Instagram', status: 'fragile', types: ['videos', 'images'], notes: 'Requires public post; may break due to auth walls' },
      { id: 'tiktok', name: 'TikTok', status: 'fragile', types: ['videos'], notes: 'Frequently changes page structure; retry if failed' },
    ],
  });
}


export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (url.pathname === '/api/download') return await handleDownload(request);
      if (url.pathname === '/api/proxy') return await handleProxy(request);
      if (url.pathname === '/api/platforms') return handlePlatforms();
      return new Response('MediaGrab API v1.0\nEndpoints: /api/download, /api/proxy, /api/platforms', {
        status: 404,
        headers: { 'Content-Type': 'text/plain', ...corsHeaders },
      });
    } catch (err) {
      console.error(err);
      return jsonResponse({ error: err.message || 'Internal server error', success: false }, 500);
    }
  },
};
