const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Free video and image downloader for YouTube, Twitter/X, Instagram, TikTok, and Reddit. No limits, no watermarks, 100% free.">
  <title>MediaGrab — Free Video & Image Downloader</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: { sans: ['Inter', 'sans-serif'] },
          animation: {
            'fade-in': 'fadeIn 0.3s ease-out',
            'slide-up': 'slideUp 0.4s ease-out',
            'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          },
          keyframes: {
            fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
            slideUp: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
          }
        }
      }
    }
  </script>
  <style>
    body { font-family: 'Inter', sans-serif; }
    .glass { background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); }
    .dark .glass { background: rgba(17,24,39,0.95); }
    .gradient-bg { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%); }
    .platform-btn.active { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; box-shadow: 0 4px 14px rgba(79,70,229,0.4); }
    .platform-btn:not(.active):hover { background: #f3f4f6; }
    .result-card { transition: all 0.2s ease; }
    .result-card:hover { transform: translateY(-2px); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); }
    .toast { animation: slideUp 0.3s ease-out; }
    /* Custom scrollbar */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  </style>
</head>
<body class="gradient-bg min-h-screen text-slate-800">

  <!-- Toast Container -->
  <div id="toastContainer" class="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none"></div>

  <div class="container mx-auto px-4 py-8 max-w-5xl">

    <!-- Header -->
    <header class="text-center mb-10 animate-fade-in">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mb-4">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
      </div>
      <h1 class="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">MediaGrab</h1>
      <p class="text-lg text-slate-300 max-w-2xl mx-auto">Download videos, images, and thumbnails from YouTube, Twitter/X, Reddit, Instagram, and TikTok. No signup. No limits. No watermark.</p>
      <div class="flex flex-wrap justify-center gap-3 mt-5 text-sm font-medium">
        <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">✓ 100% Free</span>
        <span class="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">✓ No Rate Limits</span>
        <span class="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">✓ Edge-Powered</span>
        <span class="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">✓ No Watermark</span>
      </div>
    </header>

    <!-- Main Card -->
    <main class="glass rounded-3xl shadow-2xl p-6 md:p-8 mb-8 animate-slide-up">

      <!-- Platform Selector -->
      <div class="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide" id="platformTabs">
        <button onclick="selectPlatform('youtube')" class="platform-btn active flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all" data-platform="youtube">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          YouTube
        </button>
        <button onclick="selectPlatform('twitter')" class="platform-btn flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all bg-white text-slate-600 border border-slate-200" data-platform="twitter">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          Twitter / X
        </button>
        <button onclick="selectPlatform('reddit')" class="platform-btn flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all bg-white text-slate-600 border border-slate-200" data-platform="reddit">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.561-1.249-1.249-1.249z"/></svg>
          Reddit
        </button>
        <button onclick="selectPlatform('instagram')" class="platform-btn flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all bg-white text-slate-600 border border-slate-200" data-platform="instagram">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
          Instagram
        </button>
        <button onclick="selectPlatform('tiktok')" class="platform-btn flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all bg-white text-slate-600 border border-slate-200" data-platform="tiktok">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
          TikTok
        </button>
      </div>

      <!-- URL Input -->
      <div class="relative mb-4">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
        </div>
        <input 
          type="url" 
          id="urlInput" 
          placeholder="Paste video or image URL here..."
          class="w-full pl-12 pr-24 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-base focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all"
          onpaste="handlePaste(event)"
          onkeydown="handleKeydown(event)"
        >
        <div class="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
          <button onclick="clearInput()" id="clearBtn" class="hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors" title="Clear">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <button onclick="download()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg">
            Fetch
          </button>
        </div>
      </div>

      <!-- Platform Hint -->
      <div id="platformHint" class="text-xs text-slate-500 mb-6 flex items-center gap-1.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span id="hintText">Paste a YouTube link to extract thumbnails and metadata</span>
      </div>

      <!-- Loading State -->
      <div id="loadingState" class="hidden py-12 text-center">
        <div class="relative w-12 h-12 mx-auto mb-4">
          <div class="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
          <div class="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
        <p class="text-slate-600 font-medium">Fetching media from edge servers...</p>
        <p class="text-slate-400 text-sm mt-1">This usually takes 1-3 seconds</p>
      </div>

      <!-- Results -->
      <div id="resultsArea" class="hidden space-y-6"></div>

      <!-- Empty State -->
      <div id="emptyState" class="py-10 text-center">
        <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
        </div>
        <p class="text-slate-500">Enter a URL above to get started</p>
      </div>
    </main>

    <!-- History Section -->
    <section id="historySection" class="hidden mb-8 animate-slide-up">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-white font-semibold text-lg flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Recent Fetches
        </h2>
        <button onclick="clearHistory()" class="text-sm text-slate-400 hover:text-white transition-colors">Clear all</button>
      </div>
      <div id="historyList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
    </section>

    <!-- Features Grid -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div class="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-sm">
        <div class="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <h3 class="text-white font-semibold mb-2">Lightning Fast</h3>
        <p class="text-slate-400 text-sm">Runs on Cloudflare's global edge network. Requests hit the nearest data center.</p>
      </div>
      <div class="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-sm">
        <div class="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h3 class="text-white font-semibold mb-2">Zero Storage</h3>
        <p class="text-slate-400 text-sm">We never store your files. Everything streams directly from source to you.</p>
      </div>
      <div class="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-sm">
        <div class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>
        </div>
        <h3 class="text-white font-semibold mb-2">Truly Unlimited</h3>
        <p class="text-slate-400 text-sm">No daily caps. No premium tiers. Built on free-tier infrastructure that scales.</p>
      </div>
    </section>

    <!-- Supported Platforms Detail -->
    <section class="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
      <h3 class="text-white font-semibold mb-4 flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Platform Support & Status
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3" id="platformStatus">
        <!-- Populated by JS -->
      </div>
    </section>

    <!-- Footer -->
    <footer class="text-center text-slate-500 text-sm pb-8">
      <p class="mb-2">MediaGrab is an open-source educational tool. Respect copyright and terms of service.</p>
      <p class="text-slate-600">Built with Cloudflare Workers & Pages. No cookies. No tracking.</p>
    </footer>
  </div>

  <script>
    // ─── Config ───
    const API_BASE = ''; // Same-origin for Pages deployment, or set to Worker URL
    let selectedPlatform = 'youtube';
    let isLoading = false;

    const platformConfig = {
      youtube: {
        placeholder: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        hint: 'Paste a YouTube link to extract thumbnails and metadata',
        color: 'red',
      },
      twitter: {
        placeholder: 'https://twitter.com/username/status/1234567890',
        hint: 'Paste a tweet containing video or images',
        color: 'sky',
      },
      reddit: {
        placeholder: 'https://reddit.com/r/subreddit/comments/xxxxx/title/',
        hint: 'Paste a Reddit post link (image, video, or gallery)',
        color: 'orange',
      },
      instagram: {
        placeholder: 'https://instagram.com/p/AbCdEfGh/',
        hint: 'Paste a public Instagram post, reel, or story link',
        color: 'pink',
      },
      tiktok: {
        placeholder: 'https://tiktok.com/@user/video/1234567890',
        hint: 'Paste a TikTok video link (no watermark extraction)',
        color: 'teal',
      },
    };

    // ─── Init ───
    document.addEventListener('DOMContentLoaded', () => {
      selectPlatform('youtube');
      loadHistory();
      fetchPlatforms();
    });

    // ─── Platform Selection ───
    function selectPlatform(platform) {
      selectedPlatform = platform;
      const cfg = platformConfig[platform];

      // Update tabs
      document.querySelectorAll('.platform-btn').forEach(btn => {
        const isActive = btn.dataset.platform === platform;
        btn.classList.toggle('active', isActive);
        if (!isActive) {
          btn.className = 'platform-btn flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all bg-white text-slate-600 border border-slate-200';
        }
      });

      // Update input
      const input = document.getElementById('urlInput');
      input.placeholder = cfg.placeholder;
      document.getElementById('hintText').textContent = cfg.hint;

      // Focus input if empty
      if (!input.value.trim()) input.focus();
    }

    // ─── Auto-detect platform from URL ───
    function detectPlatform(url) {
      if (/youtube\\.com|youtu\\.be/.test(url)) return 'youtube';
      if (/twitter\\.com|x\\.com/.test(url)) return 'twitter';
      if (/reddit\\.com/.test(url)) return 'reddit';
      if (/instagram\\.com/.test(url)) return 'instagram';
      if (/tiktok\\.com/.test(url)) return 'tiktok';
      return null;
    }

    function handlePaste(e) {
      setTimeout(() => {
        const url = e.target.value;
        const detected = detectPlatform(url);
        if (detected && detected !== selectedPlatform) {
          selectPlatform(detected);
          showToast(\`Auto-detected \${platformConfig[detected].placeholder.split('/')[2]} link\`, 'info');
        }
      }, 0);
    }

    function handleKeydown(e) {
      if (e.key === 'Enter') download();
      if (e.key === 'Escape') clearInput();
    }

    function clearInput() {
      const input = document.getElementById('urlInput');
      input.value = '';
      input.focus();
      document.getElementById('clearBtn').classList.add('hidden');
      document.getElementById('resultsArea').classList.add('hidden');
      document.getElementById('emptyState').classList.remove('hidden');
    }

    document.getElementById('urlInput').addEventListener('input', (e) => {
      document.getElementById('clearBtn').classList.toggle('hidden', !e.target.value);
    });

    // ─── Main Download Logic ───
    async function download() {
      const input = document.getElementById('urlInput');
      const url = input.value.trim();

      if (!url) {
        showToast('Please enter a URL first', 'error');
        input.focus();
        return;
      }

      // Auto-detect if platform doesn't match URL
      const detected = detectPlatform(url);
      if (detected && detected !== selectedPlatform) {
        selectPlatform(detected);
      }

      isLoading = true;
      toggleLoading(true);
      document.getElementById('resultsArea').classList.add('hidden');

      try {
        const apiUrl = \`\${API_BASE}/api/download?platform=\${selectedPlatform}&url=\${encodeURIComponent(url)}\`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || \`Server error: \${res.status}\`);
        }

        renderResults(data);
        addToHistory(data, url);
        showToast(\`Found \${data.media?.length || 0} item(s)\`, 'success');
      } catch (err) {
        console.error(err);
        renderError(err.message);
        showToast(err.message, 'error');
      } finally {
        isLoading = false;
        toggleLoading(false);
      }
    }

    function toggleLoading(show) {
      document.getElementById('loadingState').classList.toggle('hidden', !show);
      document.getElementById('emptyState').classList.toggle('hidden', show || document.getElementById('resultsArea').classList.contains('hidden') === false);
    }

    // ─── Render Results ───
    function renderResults(data) {
      const container = document.getElementById('resultsArea');
      container.classList.remove('hidden');
      document.getElementById('emptyState').classList.add('hidden');

      let html = '';

      // Header info
      html += \`
        <div class="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h2 class="font-bold text-slate-800 text-lg truncate" title="\${escapeHtml(data.title)}">\${escapeHtml(data.title)}</h2>
              <p class="text-slate-500 text-sm mt-1">\${escapeHtml(data.author || 'Unknown author')} • \${capitalize(data.platform)}</p>
              \${data.subreddit ? \`<p class="text-slate-400 text-xs mt-0.5">\${escapeHtml(data.subreddit)}</p>\` : ''}
              \${data.disclaimer ? \`<p class="text-amber-600 text-xs mt-2 bg-amber-50 inline-block px-2 py-1 rounded">\${escapeHtml(data.disclaimer)}</p>\` : ''}
            </div>
            \${data.videoId ? \`<span class="shrink-0 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">\${data.videoId}</span>\` : ''}
          </div>
        </div>
      \`;

      // Media grid
      if (data.media && data.media.length) {
        html += \`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">\`;

        for (const item of data.media) {
          const isVideo = item.type === 'video';
          const ext = isVideo ? 'mp4' : (item.url.match(/\\.([a-zA-Z0-9]+)(?:\\?|$)/)?.[1] || (isVideo ? 'mp4' : 'jpg'));
          const filename = \`\${data.platform}_\${(data.title || 'media').substring(0, 30).replace(/[^a-z0-9]/gi, '_')}.\${ext}\`;

          html += \`
            <div class="result-card bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
              <div class="aspect-video bg-slate-100 relative group">
                \${isVideo 
                  ? \`<video src="\${item.url}" preload="metadata" controls class="w-full h-full object-cover" poster="\${item.thumbnail || ''}" onerror="this.parentElement.innerHTML='<div class=\\\\'flex items-center justify-center h-full text-slate-400\\\\'>Video preview unavailable</div>'"></video>\`
                  : \`<img src="\${item.url}" alt="\${item.quality}" class="w-full h-full object-cover" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\\\'flex items-center justify-center h-full text-slate-400\\\\'>Image preview unavailable</div>'" referrerpolicy="no-referrer">\`
                }
                <div class="absolute top-2 right-2">
                  <span class="px-2 py-0.5 rounded-md text-xs font-bold \${isVideo ? 'bg-red-500 text-white' : 'bg-indigo-500 text-white'}">
                    \${isVideo ? 'VIDEO' : 'IMAGE'}
                  </span>
                </div>
              </div>
              <div class="p-4 flex-1 flex flex-col">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">\${item.quality || 'Original'}</span>
                  \${item.resolution ? \`<span class="text-xs text-slate-400">\${item.resolution}</span>\` : ''}
                </div>
                <div class="mt-auto flex gap-2">
                  <a 
                    href="/api/proxy?url=\${encodeURIComponent(item.url)}&filename=\${encodeURIComponent(filename)}" 
                    class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Download
                  </a>
                  <button onclick="copyToClipboard('\${item.url}')" class="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors" title="Copy direct URL">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  </button>
                </div>
                \${item.note ? \`<p class="text-amber-600 text-xs mt-2">\${escapeHtml(item.note)}</p>\` : ''}
              </div>
            </div>
          \`;
        }
        html += \`</div>\`;
      }

      container.innerHTML = html;
    }

    function renderError(message) {
      const container = document.getElementById('resultsArea');
      container.classList.remove('hidden');
      document.getElementById('emptyState').classList.add('hidden');

      container.innerHTML = \`
        <div class="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center">
          <div class="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h3 class="font-semibold text-rose-800 mb-1">Fetch Failed</h3>
          <p class="text-rose-600 text-sm">\${escapeHtml(message)}</p>
          <div class="mt-4 text-xs text-rose-500 bg-white rounded-lg p-3 text-left max-w-md mx-auto">
            <strong>Troubleshooting:</strong>
            <ul class="list-disc list-inside mt-1 space-y-1">
              <li>Ensure the URL is public (not private/login-required)</li>
              <li>For Instagram/TikTok, links from mobile apps work best</li>
              <li>Twitter/X requires the tweet to be public</li>
              <li>Try refreshing if the platform recently changed</li>
            </ul>
          </div>
        </div>
      \`;
    }

    // ─── History ───
    function addToHistory(data, url) {
      const history = JSON.parse(localStorage.getItem('mediagrab_history') || '[]');
      const entry = {
        id: Date.now(),
        platform: data.platform,
        title: data.title,
        author: data.author,
        url,
        count: data.media?.length || 0,
        timestamp: new Date().toISOString(),
      };
      history.unshift(entry);
      if (history.length > 10) history.pop();
      localStorage.setItem('mediagrab_history', JSON.stringify(history));
      loadHistory();
    }

    function loadHistory() {
      const history = JSON.parse(localStorage.getItem('mediagrab_history') || '[]');
      const section = document.getElementById('historySection');
      const list = document.getElementById('historyList');

      if (!history.length) {
        section.classList.add('hidden');
        return;
      }

      section.classList.remove('hidden');
      list.innerHTML = history.map(h => \`
        <div class="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer" onclick="restoreHistory('\${escapeHtml(h.url)}', '\${h.platform}')">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-white">\${h.platform}</span>
            <span class="text-xs text-slate-400">\${h.count} item\${h.count !== 1 ? 's' : ''}</span>
          </div>
          <p class="text-white text-sm font-medium truncate">\${escapeHtml(h.title)}</p>
          <p class="text-slate-400 text-xs mt-1 truncate">\${escapeHtml(h.author || 'Unknown')}</p>
        </div>
      \`).join('');
    }

    function restoreHistory(url, platform) {
      document.getElementById('urlInput').value = url;
      selectPlatform(platform);
      download();
    }

    function clearHistory() {
      localStorage.removeItem('mediagrab_history');
      loadHistory();
      showToast('History cleared', 'info');
    }

    // ─── Platform Status ───
    async function fetchPlatforms() {
      try {
        const res = await fetch(\`\${API_BASE}/api/platforms\`);
        if (!res.ok) return;
        const data = await res.json();
        const container = document.getElementById('platformStatus');

        const statusColors = {
          stable: 'bg-emerald-500',
          fragile: 'bg-amber-500',
          unstable: 'bg-rose-500',
        };

        container.innerHTML = data.platforms.map(p => \`
          <div class="bg-white/5 rounded-lg p-3 border border-white/10">
            <div class="flex items-center gap-2 mb-1">
              <span class="w-2 h-2 rounded-full \${statusColors[p.status] || 'bg-slate-500'}"></span>
              <span class="text-white font-medium text-sm">\${p.name}</span>
            </div>
            <p class="text-slate-400 text-xs">\${p.types.join(', ')}</p>
            \${p.notes ? \`<p class="text-slate-500 text-[10px] mt-1 italic">\${p.notes}</p>\` : ''}
          </div>
        \`).join('');
      } catch (e) { /* silent */ }
    }

    // ─── Utilities ───
    function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Direct URL copied to clipboard', 'success');
      }).catch(() => {
        showToast('Failed to copy', 'error');
      });
    }

    function showToast(message, type = 'info') {
      const container = document.getElementById('toastContainer');
      const toast = document.createElement('div');

      const colors = {
        success: 'bg-emerald-600',
        error: 'bg-rose-600',
        info: 'bg-slate-800',
      };

      const icons = {
        success: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
        error: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
        info: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
      };

      toast.className = \`toast pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl text-white shadow-lg \${colors[type]} min-w-[280px]\`;
      toast.innerHTML = \`\${icons[type]}<span class="text-sm font-medium">\${message}</span>\`;

      container.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    }

    function escapeHtml(text) {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    function capitalize(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
  </script>
</body>
</html>`;



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

