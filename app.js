/*
  Thanks to a Reddit user for vibe coding this documentation!
*/

import { marked as marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

document.addEventListener("DOMContentLoaded", async () => {
  if (window.lucide && typeof lucide.createIcons === "function") {
    lucide.createIcons();
  }

  const sidebarBtn = document.getElementById("sidebarBtnLeft");
  const sidebar = document.getElementById("sidebarLeft");
  const sidebarOverlay = document.getElementById("sidebarOverlayLeft");
  const sidebarClose = document.getElementById("sidebarCloseLeft");
  const sidebarList = document.getElementById("sidebarList");
  const contentHtml = document.getElementById("contentHtml");
  const siteTitle = document.getElementById("siteTitle");
  const sidebarHeading = document.getElementById("sidebarHeading");
  const messages = document.getElementById("messages");
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const mdTheme = document.getElementById("mdTheme");
  const hlTheme = document.getElementById("hlTheme");

  function setTheme(theme) {
    const isDark = theme === "dark";

    document.documentElement.classList.toggle("dark", isDark);

    mdTheme.href = isDark
      ? "https://cdn.jsdelivr.net/npm/github-markdown-css@5.8.1/github-markdown-dark.min.css"
      : "https://cdn.jsdelivr.net/npm/github-markdown-css@5.8.1/github-markdown-light.min.css";

    hlTheme.href = isDark
      ? "https://cdn.jsdelivr.net/npm/highlight.js@11.11.0/styles/github-dark.min.css"
      : "https://cdn.jsdelivr.net/npm/highlight.js@11.11.0/styles/github.min.css";

    themeIcon.setAttribute("data-lucide", isDark ? "sun" : "moon");
    lucide.createIcons();
    localStorage.setItem("ripe:theme", theme);
  }

  function showWelcome() {
    contentHtml.classList.add("hidden");
    siteTitle.style.visibility = "visible";
    messages.classList.remove("hidden");
    localStorage.removeItem("ripe:lastPath");
  }

  function renderMarkdown(markdown) {
    contentHtml.classList.remove("hidden");
    contentHtml.innerHTML = `<div class="markdown-body" style="padding:1rem;">${marked.parse(markdown)}</div>`;

    try {
      hljs.highlightAll();
    } catch {}

    siteTitle.style.visibility = "hidden";
    messages.classList.add("hidden");
  }

  async function loadContent(path) {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error("Failed to load");
    }

    const text = await response.text();
    renderMarkdown(text);
    localStorage.setItem("ripe:lastPath", path);
  }

  async function init() {
    try {
      const indexPath = window.location.pathname.startsWith("/src")
        ? "../content/index.json"
        : "./content/index.json";

      const response = await fetch(indexPath);
      const index = await response.json();

      for (const item of index) {
        const link = document.createElement("a");
        link.textContent = item.title;
        link.href = "#";
        link.dataset.path = item.path;

        link.addEventListener("click", async (e) => {
          e.preventDefault();
          await loadContent(item.path);

          sidebarList
            .querySelectorAll("a")
            .forEach((a) =>
              a.classList.toggle("active", a.dataset.path === item.path),
            );

          sidebar.classList.remove("active");
          sidebarOverlay.classList.remove("active");
        });

        sidebarList.appendChild(link);
      }

      const lastPath = localStorage.getItem("ripe:lastPath");

      if (lastPath) {
        await loadContent(lastPath);
        sidebarList
          .querySelectorAll("a")
          .forEach((a) =>
            a.classList.toggle("active", a.dataset.path === lastPath),
          );
      } else {
        showWelcome();
      }
    } catch {
      showWelcome();
    } finally {
      document.body.classList.remove("initially-hidden");
    }
  }

  setTheme(window.__ripeTheme__ || "light");

  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");

    if (!contentHtml.classList.contains("hidden")) {
      try {
        hljs.highlightAll();
      } catch {}
    }
  });

  await init();

  sidebarBtn.onclick = () => {
    sidebar.classList.toggle("active");
    sidebarOverlay.classList.toggle("active");
  };

  sidebarOverlay.onclick = sidebarClose.onclick = () => {
    sidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");
  };

  siteTitle.onclick = showWelcome;

  sidebarHeading.onclick = () => {
    showWelcome();
    sidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");
  };
});
