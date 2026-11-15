/* ==========================================================================
   GALLERY — editorial masonry, category filters, lazy loading and a
   full-screen lightbox with keyboard, swipe, zoom and pan.
   ========================================================================== */
(function () {
  "use strict";
  const WED = (window.WED = window.WED || {});

  const LABELS = { all: "All", couple: "Couple", engagement: "Engagement", prewedding: "Pre-wedding", family: "Family", traditional: "Traditional" };

  WED.gallery = {
    init(items) {
      const grid = document.getElementById("masonry");
      const filters = document.getElementById("gallery-filters");
      const lb = document.getElementById("lightbox");
      if (!grid || !items || !items.length) {
        const sec = document.getElementById("gallery");
        if (sec) sec.hidden = true;
        return;
      }
      const img = document.getElementById("lightbox-img");
      const cap = document.getElementById("lightbox-caption");
      const stage = document.getElementById("lightbox-stage");
      const zoomBtn = lb.querySelector('[data-lb="zoom"]');

      /* ---------- render grid */
      grid.innerHTML = items
        .map((it, i) => {
          const w = (it.w || 4) * 200,
            h = (it.h || 3) * 200;
          return `<figure class="m-item" data-cat="${it.category || ""}">
            <button class="m-btn" type="button" data-index="${i}" aria-label="Open photo: ${escapeHtml(it.alt || "photo")}">
              <img src="${it.src}" alt="${escapeHtml(it.alt || "")}" width="${w}" height="${h}" loading="lazy" decoding="async" />
              <span class="m-cap">${LABELS[it.category] || ""}</span>
            </button></figure>`;
        })
        .join("");

      /* ---------- filters (only categories that actually have photos) */
      const cats = ["all", ...Object.keys(LABELS).filter((k) => k !== "all" && items.some((i) => i.category === k))];
      filters.innerHTML = cats.map((c) => `<button class="chip" type="button" data-filter="${c}" aria-pressed="${c === "all"}">${LABELS[c]}</button>`).join("");
      let visible = items.map((_, i) => i);
      filters.addEventListener("click", (e) => {
        const b = e.target.closest("[data-filter]");
        if (!b) return;
        const f = b.dataset.filter;
        filters.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
        visible = [];
        grid.querySelectorAll(".m-item").forEach((fig, i) => {
          const show = f === "all" || fig.dataset.cat === f;
          fig.hidden = !show;
          if (show) visible.push(i);
        });
        if (window.gsap) gsap.fromTo(grid.querySelectorAll(".m-item:not([hidden])"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power2.out" });
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      });

      /* ---------- lightbox */
      let current = 0,
        zoomed = false,
        lastFocus = null,
        pan = { x: 0, y: 0 };

      const applyTransform = () => {
        img.style.transform = zoomed ? `translate(${pan.x}px, ${pan.y}px) scale(2.2)` : "";
      };
      const setZoom = (z) => {
        zoomed = z;
        pan = { x: 0, y: 0 };
        lb.classList.toggle("is-zoomed", z);
        zoomBtn.setAttribute("aria-pressed", String(z));
        applyTransform();
      };
      const show = (i) => {
        const pos = (visible.indexOf(i) + visible.length) % visible.length;
        current = visible[pos] ?? i;
        const it = items[current];
        setZoom(false);
        img.style.opacity = 0;
        const pre = new Image();
        pre.onload = pre.onerror = () => {
          img.src = it.src;
          img.alt = it.alt || "";
          img.style.opacity = 1;
        };
        pre.src = it.src;
        cap.textContent = `${it.alt || ""} · ${pos + 1} / ${visible.length}`;
      };
      const step = (dir) => {
        const pos = visible.indexOf(current);
        show(visible[(pos + dir + visible.length) % visible.length]);
      };
      const open = (i) => {
        lastFocus = document.activeElement;
        lb.hidden = false;
        requestAnimationFrame(() => lb.classList.add("is-open"));
        show(i);
        WED.scrollLock && WED.scrollLock(true);
        lb.querySelector('[data-lb="close"]').focus();
      };
      const close = () => {
        lb.classList.remove("is-open");
        WED.scrollLock && WED.scrollLock(false);
        setTimeout(() => (lb.hidden = true), 400);
        if (lastFocus) lastFocus.focus();
      };

      grid.addEventListener("click", (e) => {
        const b = e.target.closest(".m-btn");
        if (b) open(+b.dataset.index);
      });
      lb.addEventListener("click", (e) => {
        const a = e.target.closest("[data-lb]");
        if (a) {
          const act = a.dataset.lb;
          if (act === "close") close();
          else if (act === "prev") step(-1);
          else if (act === "next") step(1);
          else if (act === "zoom") setZoom(!zoomed);
        } else if (e.target === stage && !suppressClick) close();
        suppressClick = false;
      });
      img.addEventListener("dblclick", () => setZoom(!zoomed));

      document.addEventListener("keydown", (e) => {
        if (lb.hidden) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowRight") step(1);
        else if (e.key === "ArrowLeft") step(-1);
        else if (e.key === "Tab") {
          // keep focus inside the dialog
          const f = [...lb.querySelectorAll("button")];
          const idx = f.indexOf(document.activeElement);
          e.preventDefault();
          f[(idx + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
        }
      });

      /* ---------- touch: swipe to navigate, double-tap to zoom, drag to pan */
      let start = null,
        suppressClick = false,
        lastTap = 0,
        panStart = null;
      stage.addEventListener("pointerdown", (e) => {
        start = { x: e.clientX, y: e.clientY, t: Date.now() };
        panStart = { ...pan };
        stage.setPointerCapture(e.pointerId);
      });
      stage.addEventListener("pointermove", (e) => {
        if (!start || !zoomed) return;
        pan.x = panStart.x + (e.clientX - start.x);
        pan.y = panStart.y + (e.clientY - start.y);
        img.style.transition = "none";
        applyTransform();
      });
      stage.addEventListener("pointerup", (e) => {
        if (!start) return;
        img.style.transition = "";
        const dx = e.clientX - start.x,
          dy = e.clientY - start.y,
          dt = Date.now() - start.t;
        suppressClick = Math.abs(dx) > 8 || Math.abs(dy) > 8;
        if (!zoomed && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) && dt < 700) step(dx < 0 ? 1 : -1);
        else if (!zoomed && dy > 90 && Math.abs(dy) > Math.abs(dx)) close();
        else if (Math.abs(dx) < 8 && Math.abs(dy) < 8 && e.pointerType === "touch") {
          const now = Date.now();
          if (now - lastTap < 320) setZoom(!zoomed);
          lastTap = now;
        }
        start = null;
      });
      stage.addEventListener("pointercancel", () => (start = null));
    },
  };

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  WED.escapeHtml = escapeHtml;
})();
