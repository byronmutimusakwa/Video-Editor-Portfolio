// ---- CONFIG: fill these in, then read README.md before publishing ----
const CONFIG = {
  // Get a free key at https://console.cloud.google.com/apis/credentials
  // Restrict it (Application restrictions -> Websites) to your GitHub Pages
  // domain before going live, e.g. https://yourusername.github.io/*
  API_KEY: "YOUR_YOUTUBE_API_KEY_HERE",

  // Order = display order. Replace/reorder freely.
  VIDEO_IDS: [
    "hOe31Ifv2kw",
    "_cEqQ2SBDSQ",
    "UZdItupSTmE",
    "DEKCTFp7kF0",
    "myvzrIsO_5c",
    "9pBvObenU5k",
  ],
};
// ------------------------------------------------------------------

const grid = document.getElementById("grid");
const footnote = document.getElementById("footnote");

function formatCompact(n) {
  if (n === null || n === undefined) return "—";
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

function skeletonCard(id) {
  const a = document.createElement("a");
  a.className = "card is-loading";
  a.href = `https://youtu.be/${id}`;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.innerHTML = `
    <div class="thumb-wrap">
      <img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy" />
      <span class="play-badge">▶</span>
    </div>
    <div class="card-body">
      <p class="card-title">Loading…</p>
      <div class="stat-row">
        <span class="stat-pill views"><span class="stat-icon">👁</span><span class="stat-num" data-target="0">—</span></span>
        <span class="stat-pill likes"><span class="stat-icon">💚</span><span class="stat-num" data-target="0">—</span></span>
      </div>
    </div>
  `;
  return a;
}

async function fetchStats(ids) {
  if (!CONFIG.API_KEY || CONFIG.API_KEY === "YOUR_YOUTUBE_API_KEY_HERE") {
    return null;
  }
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${ids.join(",")}&key=${CONFIG.API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`YouTube API ${res.status}`);
    const data = await res.json();
    const byId = {};
    (data.items || []).forEach((item) => {
      byId[item.id] = {
        title: item.snippet?.title || "Untitled",
        views: Number(item.statistics?.viewCount ?? 0),
        likes: Number(item.statistics?.likeCount ?? 0),
      };
    });
    return byId;
  } catch (err) {
    console.error("Stats fetch failed:", err);
    return null;
  }
}

function animateCount(el, target, duration = 1400) {
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = Math.round(target * eased);
    el.textContent = formatCompact(value);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = formatCompact(target);
  }
  requestAnimationFrame(tick);
}

function setUpScrollAnimation() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const nums = entry.target.querySelectorAll(".stat-num[data-target]");
          nums.forEach((num) => {
            const target = Number(num.dataset.target || 0);
            animateCount(num, target);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 }
  );
  document.querySelectorAll(".card").forEach((card) => observer.observe(card));
}

async function render() {
  grid.innerHTML = "";
  CONFIG.VIDEO_IDS.forEach((id) => grid.appendChild(skeletonCard(id)));

  const stats = await fetchStats(CONFIG.VIDEO_IDS);

  if (!stats) {
    footnote.textContent = "add a YouTube API key in script.js to show live view/like counts · 🌾";
  }

  grid.querySelectorAll(".card").forEach((card, i) => {
    const id = CONFIG.VIDEO_IDS[i];
    const info = stats && stats[id];
    card.classList.remove("is-loading");
    const titleEl = card.querySelector(".card-title");
    titleEl.textContent = info ? info.title : "View on YouTube";

    const [viewsNum, likesNum] = card.querySelectorAll(".stat-num");
    viewsNum.dataset.target = info ? info.views : 0;
    likesNum.dataset.target = info ? info.likes : 0;
    viewsNum.textContent = "0";
    likesNum.textContent = "0";
  });

  setUpScrollAnimation();
}

render();
