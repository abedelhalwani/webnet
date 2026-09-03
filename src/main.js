// Web Net Platform - Main Application Logic

let sitesData = [
  {
    id: "retro-shooter-live",
    name: "retro-shooter-live",
    domain: "retro-shooter-live.webnet.app",
    framework: "CANVAS",
    icon: "🎮",
    status: "Published",
    gitRepo: "abedel/retro-shooter",
    gitBranch: "main@8f3a1b",
    lastDeploy: "2 minutes ago",
    buildDuration: "28s",
    hasGame: true
  },
  {
    id: "nexus-storefront",
    name: "nexus-storefront",
    domain: "nexus-storefront.webnet.app",
    framework: "NEXT.JS",
    icon: "🛍️",
    status: "Published",
    gitRepo: "abedel/nexus-store",
    gitBranch: "main@d51e8a",
    lastDeploy: "3 hours ago",
    buildDuration: "44s",
    hasAnalytics: true
  },
  {
    id: "docs-webnet-platform",
    name: "docs-webnet-platform",
    domain: "docs-webnet-platform.webnet.app",
    framework: "ASTRO",
    icon: "📚",
    status: "Published",
    gitRepo: "abedel/docs-portal",
    gitBranch: "main@7c210f",
    lastDeploy: "Yesterday",
    buildDuration: "19s",
    hasSettings: true
  },
  {
    id: "dashboard-analytics-api",
    name: "dashboard-analytics-api",
    domain: "analytics.webnet.app",
    framework: "VITE / REACT",
    icon: "⚡",
    status: "Published",
    gitRepo: "abedel/analytics",
    gitBranch: "main@3a9b1c",
    lastDeploy: "4 days ago",
    buildDuration: "22s",
    hasAnalytics: true
  }
];

// User profile data
const currentUser = {
  name: "Abedel Halwani",
  email: "abedel@webnet.io",
  avatar: "/avatar.svg",
  initial: "A",
  status: "● Active User ▾"
};

// User Profile & Dynamic Sidebar Footer Template Rendering
function renderUserProfile(user = currentUser) {
  const profileContainer = document.querySelector(".sidebar .user-profile, .sidebar .sidebar-user-card, .profile-wrapper .user-profile, .sidebar-footer .user-profile");
  if (!profileContainer) return;

  const initial = user.initial || (user.name ? user.name.trim().charAt(0).toUpperCase() : "A");

  profileContainer.innerHTML = `
    <div class="user-avatar user-initial-avatar">${initial}</div>
    <div class="user-info">
      <span class="user-name">${user.name}</span>
      <span class="user-status">${user.status}</span>
    </div>
  `;
}

function renderSidebarFooter(user = currentUser) {
  renderUserProfile(user);
}

function renderUserProfileCard(user = currentUser) {
  renderUserProfile(user);
}

function renderSidebarUserProfile(user = currentUser) {
  renderUserProfile(user);
}

function renderSidebarProfile(user = currentUser) {
  renderUserProfile(user);
}

// Toast notification helper
function showToast(message) {
  let toast = document.getElementById("toast-msg");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-msg";
    toast.className = "toast-msg";
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3500);
}

// Authentication
function login(e) {
  if (e) e.preventDefault();
  const authScreen = document.getElementById("auth-screen");
  const appContainer = document.getElementById("app-container");
  if (authScreen) authScreen.style.display = "none";
  if (appContainer) appContainer.style.display = "flex";
  renderUserProfile();
  switchTab(0);
  showToast("Welcome back, Abedel Halwani!");
}

function logout(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  closeDropdown();
  const appContainer = document.getElementById("app-container");
  const authScreen = document.getElementById("auth-screen");
  if (appContainer) appContainer.style.display = "none";
  if (authScreen) authScreen.style.display = "flex";
  showToast("You have been successfully logged out.");
}

// Dropdown
function toggleDropdown(event) {
  if (event) event.stopPropagation();
  const dropdown = document.getElementById("userDropdown");
  if (dropdown) {
    dropdown.classList.toggle("show");
  }
}

function closeDropdown() {
  const dropdown = document.getElementById("userDropdown");
  if (dropdown) {
    dropdown.classList.remove("show");
  }
}

window.addEventListener("click", function(event) {
  if (!event.target.closest(".profile-wrapper")) {
    closeDropdown();
  }
});

// Tab Navigation
function switchTab(index) {
  const views = document.getElementsByClassName("tab-view");
  for (let i = 0; i < views.length; i++) {
    views[i].classList.remove("active-view");
  }
  const targetView = document.getElementById("view-" + index);
  if (targetView) {
    targetView.classList.add("active-view");
  }

  const tabsContainer = document.getElementById("nav-tabs");
  if (tabsContainer) {
    const tabSpans = tabsContainer.getElementsByTagName("li");
    for (let i = 0; i < tabSpans.length; i++) {
      if (i === index) {
        tabSpans[i].classList.add("active");
      } else {
        tabSpans[i].classList.remove("active");
      }
    }
  }
  closeDropdown();
}

// Modals
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("show");
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("show");
  }
  if (modalId === "modal-game-preview") {
    stopGame();
  }
}

// Render Sites Cards
function renderSites() {
  const grid = document.getElementById("sites-grid");
  const countBadge = document.getElementById("sites-count");
  const searchInput = document.getElementById("site-search");
  const statusFilter = document.getElementById("status-filter");
  const frameworkFilter = document.getElementById("framework-filter");

  if (!grid) return;

  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const selectedStatus = statusFilter ? statusFilter.value : "all";
  const selectedFramework = frameworkFilter ? frameworkFilter.value : "all";

  const filtered = sitesData.filter(site => {
    const matchesSearch =
      site.name.toLowerCase().includes(searchTerm) ||
      site.domain.toLowerCase().includes(searchTerm) ||
      site.framework.toLowerCase().includes(searchTerm) ||
      site.gitRepo.toLowerCase().includes(searchTerm);

    const matchesStatus =
      selectedStatus === "all" ||
      site.status.toLowerCase() === selectedStatus.toLowerCase();

    const matchesFramework =
      selectedFramework === "all" ||
      site.framework.toLowerCase().includes(selectedFramework.toLowerCase());

    return matchesSearch && matchesStatus && matchesFramework;
  });

  if (countBadge) {
    countBadge.innerText = `Showing ${filtered.length} site${filtered.length === 1 ? "" : "s"}`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #112238; border-radius: 12px; border: 1px dashed #1e3a5f;">
        <div style="font-size: 36px; margin-bottom: 12px;">🔍</div>
        <h3 style="color: #fff; margin-bottom: 8px;">No sites match your filter</h3>
        <p style="color: #94a3b8; font-size: 14px;">Try refining your search keyword or resetting the status/framework filter.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(site => {
    const statusClass = site.status.toLowerCase();
    
    let actionButtons = "";
    if (site.hasGame || site.framework === "CANVAS") {
      actionButtons = `
        <button class="btn btn-secondary btn-sm" onclick="openPlayPreview('${site.name}')">▶ Play / Preview</button>
        <button class="btn btn-secondary btn-sm" onclick="openDeploysModal('${site.name}')">📄 Deploys</button>
        <button class="btn btn-secondary btn-sm" onclick="openSettingsModal('${site.name}')">⚙️ Settings</button>
      `;
    } else if (site.hasAnalytics) {
      actionButtons = `
        <a href="https://${site.domain}" target="_blank" class="btn btn-secondary btn-sm" style="text-align:center;">🔗 Visit Site</a>
        <button class="btn btn-secondary btn-sm" onclick="openDeploysModal('${site.name}')">📄 Deploys</button>
        <button class="btn btn-secondary btn-sm" onclick="openAnalyticsModal('${site.name}')">📊 Analytics</button>
      `;
    } else {
      actionButtons = `
        <a href="https://${site.domain}" target="_blank" class="btn btn-secondary btn-sm" style="text-align:center;">🔗 Visit Site</a>
        <button class="btn btn-secondary btn-sm" onclick="openDeploysModal('${site.name}')">📄 Deploys</button>
        <button class="btn btn-secondary btn-sm" onclick="openSettingsModal('${site.name}')">⚙️ Settings</button>
      `;
    }

    return `
      <div class="site-card">
        <div class="site-top">
          <div class="site-framework-icon">${site.icon}</div>
          <div class="site-meta">
            <div class="site-framework-tag">${site.framework}</div>
            <div class="site-name">${site.name}</div>
            <a href="https://${site.domain}" target="_blank" class="site-domain-link">
              ${site.domain} ↗
            </a>
          </div>
        </div>

        <div class="site-status-row">
          <span style="color: #94a3b8;">Production:</span>
          <span class="status-badge ${statusClass}">
            <span class="status-dot"></span>
            ${site.status}
          </span>
        </div>

        <div class="site-git-info">
          <div class="git-repo-line">
            <span>🐙 github:</span>
            <span style="color: #f1f5f9; font-weight: 500;">${site.gitRepo}</span>
          </div>
          <div class="git-branch-commit">
            <span>${site.gitBranch}</span>
          </div>
        </div>

        <div class="site-deploy-stats">
          <span>Last deploy: ${site.lastDeploy}</span>
          <span>Build: ${site.buildDuration}</span>
        </div>

        <div class="site-actions">
          ${actionButtons}
        </div>
      </div>
    `;
  }).join("");
}

// Add New Site
function handleAddSite(event) {
  event.preventDefault();
  const nameInput = document.getElementById("new-site-name");
  const frameworkSelect = document.getElementById("new-site-framework");
  const repoInput = document.getElementById("new-site-repo");

  const name = nameInput.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const framework = frameworkSelect.value;
  const repo = repoInput.value.trim() || `abedel/${name}`;

  if (!name) {
    alert("Please enter a site name.");
    return;
  }

  let icon = "🌐";
  if (framework === "NEXT.JS") icon = "🛍️";
  else if (framework === "CANVAS") icon = "🎮";
  else if (framework === "ASTRO") icon = "📚";
  else if (framework === "VITE / REACT") icon = "⚡";
  else if (framework === "VUE") icon = "💚";
  else if (framework === "SVELTE") icon = "🔥";

  const newSite = {
    id: name,
    name: name,
    domain: `${name}.webnet.app`,
    framework: framework,
    icon: icon,
    status: "Published",
    gitRepo: repo,
    gitBranch: "main@" + Math.random().toString(16).substring(2, 8),
    lastDeploy: "Just now",
    buildDuration: `${Math.floor(Math.random() * 25 + 15)}s`,
    hasSettings: true,
    hasAnalytics: true
  };

  sitesData.unshift(newSite);
  renderSites();
  closeModal("modal-new-site");
  nameInput.value = "";
  repoInput.value = "";
  showToast(`🚀 Successfully created and deployed site: ${name}!`);
}

// Manual Deploy Simulation
function handleManualDeploy(event) {
  if (event) event.preventDefault();
  const fileInput = document.getElementById("manual-deploy-file");
  const progressContainer = document.getElementById("deploy-progress-container");
  const progressBar = document.getElementById("deploy-progress-bar");
  const statusText = document.getElementById("deploy-status-label");
  const percentText = document.getElementById("deploy-percent-label");
  const startBtn = document.getElementById("deploy-start-btn");

  if (progressContainer) progressContainer.style.display = "block";
  if (startBtn) startBtn.disabled = true;

  let progress = 0;
  const steps = [
    { p: 20, text: "Uploading site assets (HTML/CSS/JS)..." },
    { p: 45, text: "Optimizing images and running edge bundling..." },
    { p: 75, text: "Deploying to WebNet Global Edge Network (240+ PoPs)..." },
    { p: 100, text: "Deployment published and verified live!" }
  ];

  let stepIdx = 0;
  const interval = setInterval(() => {
    progress += 5;
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (percentText) percentText.innerText = `${progress}%`;

    if (stepIdx < steps.length && progress >= steps[stepIdx].p) {
      if (statusText) statusText.innerText = steps[stepIdx].text;
      stepIdx++;
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        closeModal("modal-deploy-manual");
        if (progressContainer) progressContainer.style.display = "none";
        if (progressBar) progressBar.style.width = "0%";
        if (startBtn) startBtn.disabled = false;
        showToast("✅ Manual deploy completed and published!");
      }, 1000);
    }
  }, 100);
}

// Modals Triggers
function openDeploysModal(siteName) {
  const title = document.getElementById("deploys-modal-title");
  if (title) title.innerText = `Deployments & Build Logs — ${siteName}`;
  openModal("modal-deploys-history");
}

function openSettingsModal(siteName) {
  const title = document.getElementById("settings-modal-title");
  const nameInput = document.getElementById("settings-site-name");
  const domainInput = document.getElementById("settings-site-domain");
  if (title) title.innerText = `Site Settings — ${siteName}`;
  if (nameInput) nameInput.value = siteName;
  if (domainInput) domainInput.value = `${siteName}.webnet.app`;
  openModal("modal-site-settings");
}

function openAnalyticsModal(siteName) {
  const title = document.getElementById("analytics-modal-title");
  if (title) title.innerText = `Real-time Analytics — ${siteName}`;
  openModal("modal-analytics");
}

function saveSiteSettings(event) {
  if (event) event.preventDefault();
  closeModal("modal-site-settings");
  showToast("⚙️ Site settings saved successfully!");
}

// Interactive Retro Shooter Canvas Game
let gameAnimationId = null;
let gameRunning = false;

function openPlayPreview(siteName) {
  openModal("modal-game-preview");
  startGame();
}

function startGame() {
  const canvas = document.getElementById("game-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  canvas.width = 600;
  canvas.height = 400;

  let player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 40,
    width: 30,
    height: 20,
    speed: 5,
    dx: 0
  };

  let bullets = [];
  let enemies = [];
  let stars = [];
  let score = 0;
  let gameOver = false;
  let lastSpawn = 0;

  for (let i = 0; i < 60; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 1.5 + 0.5
    });
  }

  const keys = {};

  window.onkeydown = (e) => {
    keys[e.code] = true;
    if (e.code === "Space") {
      bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10, speed: 7 });
      e.preventDefault();
    }
  };

  window.onkeyup = (e) => {
    keys[e.code] = false;
  };

  function update() {
    if (keys["ArrowLeft"] || keys["KeyA"]) {
      player.x -= player.speed;
      if (player.x < 0) player.x = 0;
    }
    if (keys["ArrowRight"] || keys["KeyD"]) {
      player.x += player.speed;
      if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    }

    // Stars
    stars.forEach(star => {
      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    });

    // Bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].y -= bullets[i].speed;
      if (bullets[i].y < -10) bullets.splice(i, 1);
    }

    // Spawn enemies
    const now = Date.now();
    if (now - lastSpawn > 800) {
      enemies.push({
        x: Math.random() * (canvas.width - 30),
        y: -30,
        width: 26,
        height: 20,
        speed: Math.random() * 2 + 1.5,
        color: ["#ef4444", "#f59e0b", "#a855f7", "#ec4899"][Math.floor(Math.random() * 4)]
      });
      lastSpawn = now;
    }

    // Enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
      enemies[i].y += enemies[i].speed;

      // Check collision with bullets
      for (let j = bullets.length - 1; j >= 0; j--) {
        if (
          bullets[j].x < enemies[i].x + enemies[i].width &&
          bullets[j].x + bullets[j].width > enemies[i].x &&
          bullets[j].y < enemies[i].y + enemies[i].height &&
          bullets[j].y + bullets[j].height > enemies[i].y
        ) {
          enemies.splice(i, 1);
          bullets.splice(j, 1);
          score += 100;
          break;
        }
      }

      if (enemies[i] && enemies[i].y > canvas.height) {
        enemies.splice(i, 1);
      }
    }
  }

  function draw() {
    ctx.fillStyle = "#070d19";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    ctx.fillStyle = "#ffffff";
    stars.forEach(star => {
      ctx.fillRect(star.x, star.y, star.size, star.size);
    });

    // Draw player ship
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y);
    ctx.lineTo(player.x, player.y + player.height);
    ctx.lineTo(player.x + player.width, player.y + player.height);
    ctx.closePath();
    ctx.fill();

    // Draw bullets
    ctx.fillStyle = "#4ade80";
    bullets.forEach(b => {
      ctx.fillRect(b.x, b.y, b.width, b.height);
    });

    // Draw enemies
    enemies.forEach(e => {
      ctx.fillStyle = e.color;
      ctx.beginPath();
      ctx.moveTo(e.x, e.y);
      ctx.lineTo(e.x + e.width, e.y);
      ctx.lineTo(e.x + e.width / 2, e.y + e.height);
      ctx.closePath();
      ctx.fill();
    });

    // Score & Controls info
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px 'JetBrains Mono', monospace";
    ctx.fillText(`SCORE: ${score}`, 16, 26);
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`Controls: [A/D or Arrows] Move, [Space] Shoot`, 16, canvas.height - 14);
  }

  function loop() {
    update();
    draw();
    gameAnimationId = requestAnimationFrame(loop);
  }

  gameRunning = true;
  loop();
}

function stopGame() {
  if (gameAnimationId) {
    cancelAnimationFrame(gameAnimationId);
    gameAnimationId = null;
  }
  gameRunning = false;
}

// Attach functions to window object for inline HTML handlers
window.currentUser = currentUser;
window.renderUserProfile = renderUserProfile;
window.renderSidebarFooter = renderSidebarFooter;
window.renderUserProfileCard = renderUserProfileCard;
window.renderSidebarUserProfile = renderSidebarUserProfile;
window.renderSidebarProfile = renderSidebarProfile;
window.login = login;
window.logout = logout;
window.switchTab = switchTab;
window.toggleDropdown = toggleDropdown;
window.closeDropdown = closeDropdown;
window.openModal = openModal;
window.closeModal = closeModal;
window.renderSites = renderSites;
window.handleAddSite = handleAddSite;
window.handleManualDeploy = handleManualDeploy;
window.openDeploysModal = openDeploysModal;
window.openSettingsModal = openSettingsModal;
window.openAnalyticsModal = openAnalyticsModal;
window.openPlayPreview = openPlayPreview;
window.saveSiteSettings = saveSiteSettings;
window.showToast = showToast;

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  renderUserProfile();
  renderSites();

  const searchInput = document.getElementById("site-search");
  const statusFilter = document.getElementById("status-filter");
  const frameworkFilter = document.getElementById("framework-filter");

  if (searchInput) searchInput.addEventListener("input", renderSites);
  if (statusFilter) statusFilter.addEventListener("change", renderSites);
  if (frameworkFilter) frameworkFilter.addEventListener("change", renderSites);
});
