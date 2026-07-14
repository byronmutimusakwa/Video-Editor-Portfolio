# Portfolio Stats Widget

A small cozy-pastel widget that shows live view/like counts for your 6 showcase videos, with a count-up animation that plays as it scrolls into view. This runs *outside* Notion (Notion can't run live scripts), and gets embedded into your Notion page as an iframe embed once it's live.

## 1. Create the GitHub repo

1. Go to github.com, click **New repository**.
2. Name it something like `portfolio-stats` (public, since GitHub Pages needs a public repo on the free tier).
3. Don't initialize with a README (this folder already has one).
4. On your machine, from this folder:
   ```
   cd portfolio-stats-widget
   git init
   git add index.html style.css script.js README.md
   git commit -m "Live stats widget"
   git branch -M main
   git remote add origin https://github.com/<your-username>/portfolio-stats.git
   git push -u origin main
   ```

## 2. Turn on GitHub Pages

1. In the repo on GitHub: **Settings → Pages**.
2. Under "Build and deployment", set **Source: Deploy from a branch**.
3. Branch: `main`, folder: `/ (root)`. Save.
4. After a minute, your widget will be live at:
   `https://<your-username>.github.io/portfolio-stats/`

## 3. Get a free YouTube Data API key

1. Go to https://console.cloud.google.com/ and create a project (or reuse one).
2. **APIs & Services → Library** → search "YouTube Data API v3" → **Enable**.
3. **APIs & Services → Credentials → Create Credentials → API key**.
4. Click into the new key and set:
   - **Application restrictions**: Websites → add `https://<your-username>.github.io/*`
   - **API restrictions**: restrict to "YouTube Data API v3"
5. Copy the key.

This restriction matters: the key lives in public JS (anyone can view it in the page source), but the website restriction means it only works when called from your GitHub Pages domain, so it can't be abused elsewhere. The free tier (10,000 units/day) is far more than enough for a portfolio page — each visit costs 1 unit per video, so ~1,600 visits/day before any cost.

## 4. Add the key

Open `script.js`, replace:
```js
API_KEY: "YOUR_YOUTUBE_API_KEY_HERE",
```
with your real key. Commit and push:
```
git add script.js
git commit -m "Add API key"
git push
```

## 5. Embed it in Notion

In your Notion page, type `/embed`, paste:
`https://<your-username>.github.io/portfolio-stats/`

Resize the embed block tall enough to show all 6 cards (drag the bottom handle). That's it — every time someone loads the Notion page, the embed re-fetches live counts and animates them in as they scroll.

## Updating the video list later

Edit the `VIDEO_IDS` array at the top of `script.js`, commit, push. Live within ~1 minute.
