# MediaGrab — Zero-to-Hero Video & Image Downloader

A **100% free**, serverless media downloader powered by Cloudflare's edge network. Download thumbnails, videos, and images from YouTube, Twitter/X, Reddit, Instagram, and TikTok without signup, storage, or rate limits.

> **Cost to run:** $0/month forever (Free tier)

---

## Architecture

```
User → Cloudflare Pages (Frontend) → Cloudflare Workers (API) → Source Platform
                                    ↓
                              Direct Stream to User
```

- **No file storage** — everything streams directly from the source platform
- **No bandwidth costs** — Cloudflare CDN handles delivery globally
- **No API keys** — uses public endpoints and page scraping
- **Edge-computed** — runs in 300+ cities worldwide for sub-100ms latency

---

## What You Get

| Platform | Media Types | Reliability | Notes |
|----------|-------------|-------------|-------|
| **YouTube** | Thumbnails (all qualities), metadata | Stable | Video streams require yt-dlp (not included) |
| **Twitter / X** | Videos, images | Stable | Public tweets only |
| **Reddit** | Videos, images, galleries | Stable | Public posts only |
| **Instagram** | Videos, images, carousels | Fragile | Auth walls are aggressive; mobile share links work best |
| **TikTok** | Videos | Fragile | Page structure changes frequently |

---

## Deployment Options

We provide **two** deployment strategies. Pick one:

### Option A: Cloudflare Pages + Functions (Easiest — Recommended)

Everything in **one project**. The frontend and API deploy together.

**Pros:**
- Single repo, single deploy
- Frontend and API share the same `.workers.dev` or custom domain
- Perfect for beginners

**Cons:**
- Pages Functions free tier = 100,000 function invocations/day
- Slightly less flexible routing than standalone Workers

**Deploy in 3 minutes:**

1. **Create a Cloudflare account** at [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Install Wrangler CLI** (requires Node.js 18+):
   ```bash
   npm install -g wrangler
   wrangler login
   ```
3. **Create a new Pages project**:
   ```bash
   # In the pages-deployment/ folder
   npx wrangler pages project create mediagrab
   ```
4. **Deploy**:
   ```bash
   npx wrangler pages deploy . --project-name=mediagrab
   ```
5. **Done.** Your site is live at `https://mediagrab.pages.dev`

> **Note:** If you use Git integration instead of direct upload, push `pages-deployment/` contents to a GitHub repo and connect it in Cloudflare Dashboard → Pages → Create a project.

---

### Option B: Separate Pages + Worker (Scalable)

Frontend on **Cloudflare Pages**, API on **Cloudflare Workers**. This matches the original roadmap exactly.

**Pros:**
- Worker can be reused by multiple frontends or mobile apps
- Independent scaling (100k req/day on Pages + 100k req/day on Worker = 200k total)
- Cleaner separation of concerns

**Deploy the Worker:**

1. Go to `worker-deployment/` folder
2. Deploy:
   ```bash
   npm install   # installs wrangler locally
   npx wrangler deploy
   ```
3. Copy the Worker URL (e.g., `https://mediagrab-api.your-subdomain.workers.dev`)

**Deploy the Frontend:**

1. Edit `index.html` line ~9:
   ```javascript
   const API_BASE = 'https://mediagrab-api.your-subdomain.workers.dev'; // <-- paste your worker URL
   ```
2. Deploy to Pages:
   ```bash
   npx wrangler pages deploy . --project-name=mediagrab-frontend
   ```

---

## Custom Domain (Optional, ~$1-10/year)

1. Buy a domain on Namecheap, Cloudflare Registrar, or Porkbun
2. In Cloudflare Dashboard, add the domain
3. Update nameservers
4. In **Pages** → Your Project → Custom Domains → Add domain
5. SSL is auto-configured (Universal SSL — free)

---

## Scaling Beyond Free Tier

| Limit | Free Tier | How to Scale |
|-------|-----------|--------------|
| Worker requests | 100,000/day | Deploy identical workers with different names; round-robin in frontend |
| Pages requests | 100,000/day | Use standalone Worker (Option B) to split load |
| Bandwidth | Unlimited | Cloudflare CDN has no bandwidth cap on free tier |
| Build minutes | 500/month (Pages) | Use direct upload (`wrangler pages deploy`) instead of Git CI |

**Multi-Worker Round-Robin (Advanced):**

```javascript
// In frontend
const WORKERS = [
  'https://mediagrab-1.your-subdomain.workers.dev',
  'https://mediagrab-2.your-subdomain.workers.dev',
  'https://mediagrab-3.your-subdomain.workers.dev',
];
const API_BASE = WORKERS[Math.floor(Math.random() * WORKERS.length)];
```

---

## API Reference

### `GET /api/download`

Fetch media metadata and direct URLs.

**Query Parameters:**
- `platform` — `youtube`, `twitter`, `instagram`, `tiktok`, `reddit`
- `url` — The full post/video URL

**Example:**
```bash
curl "https://your-site.com/api/download?platform=twitter&url=https://twitter.com/elonmusk/status/123456"
```

**Response:**
```json
{
  "success": true,
  "platform": "twitter",
  "title": "Tweet text...",
  "author": "elonmusk",
  "media": [
    {
      "type": "video",
      "url": "https://video.twimg.com/ext_tw_video/.../pu/vid/1280x720/....mp4",
      "quality": "2176000kbps",
      "thumbnail": "https://pbs.twimg.com/ext_tw_video_thumb/..."
    }
  ]
}
```

### `GET /api/proxy?url=...&filename=...`

Streams media through the worker with `Content-Disposition: attachment` so browsers download the file instead of opening it.

**Use this for the actual download button.**

### `GET /api/platforms`

Returns supported platforms and their current status.

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| "Instagram requires authentication" | Meta blocks datacenter IPs | Try a mobile share URL (`instagram.com/share/...`) or retry |
| "Tweet not found" | Private/suspended account or deleted tweet | Ensure the tweet is public |
| "Video preview unavailable" | CORS or expired CDN URL | Click Download anyway — proxy bypasses CORS |
| "Failed to proxy media" | Source URL expired (TikTok/IG) | Re-fetch the post to get fresh URLs |
| 429 errors | Too many requests | Wait 1 minute; Cloudflare rate-limits aggressive scraping |

---

## Legal & Ethics

- This tool is for **personal, educational use** only.
- Respect copyright. Do not redistribute content you do not own.
- Respect platform Terms of Service. YouTube, Instagram, and TikTok explicitly prohibit scraping in their ToS for commercial use.
- Add a `Terms of Service` and `Privacy Policy` page before monetizing with ads.
- We **strongly recommend** you do not monetize this tool without legal consultation.

---

## Roadmap / Bonus Features

- [ ] **Browser Extension** — Chrome/Firefox extension that adds a "Download" button to each platform's UI
- [ ] **Batch Processing** — Paste multiple URLs, download a ZIP
- [ ] **Telegram Bot** — `@YourBot` that accepts links and returns files
- [ ] **yt-dlp Integration** — For actual YouTube video/audio extraction, integrate a micro-VM or external service (not free tier)
- [ ] **Analytics** — Cloudflare Web Analytics (add beacon script, free)
- [ ] **AdSense** — Add non-intrusive ads after you have real traffic ($2-10 CPM)

---

## Tech Stack

- **Frontend:** Vanilla HTML/JS, Tailwind CSS (CDN), inline SVG icons
- **Backend:** Cloudflare Workers / Pages Functions (V8 isolates)
- **CDN:** Cloudflare (unlimited free bandwidth)
- **Hosting:** Cloudflare Pages (unlimited free sites)
- **DNS/SSL:** Cloudflare (free, auto-provisioned)

---

## License

MIT. Use at your own risk. No warranty provided.
