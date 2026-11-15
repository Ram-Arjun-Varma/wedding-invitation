/* ==========================================================================
   INTERACTIONS — navigation, sharing, traditions rail, music controls and
   the small delights (lamp glow, card depth, cursor gold dust).
   ========================================================================== */
(function () {
  "use strict";
  const WED = (window.WED = window.WED || {});
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ------------------------------------------------------------- TOAST */
  let toastTimer = null;
  WED.toast = (msg) => {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-visible"), 2800);
  };

  /* --------------------------------------------------------- NAVIGATION */
  function initNav() {
    const nav = document.getElementById("nav");
    const toggle = document.getElementById("nav-toggle");
    const links = document.getElementById("nav-links");

    const setOpen = (open) => {
      links.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", () => setOpen(!links.classList.contains("is-open")));
    document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
    document.addEventListener("click", (e) => {
      if (links.classList.contains("is-open") && !e.target.closest("#nav")) setOpen(false);
    });

    // In-page anchors use the smooth scroller
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (id.length < 2 || !document.querySelector(id)) return;
      e.preventDefault();
      setOpen(false);
      WED.scrollTo(id);
      history.replaceState(null, "", id);
    });

    // Solid bar after the hero; active section indicator
    const onScroll = () => nav.classList.toggle("is-solid", window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const map = new Map([...links.querySelectorAll("a")].map((a) => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        map.forEach((a) => a.classList.remove("is-active"));
        const a = map.get(e.target.id);
        if (a) { a.classList.add("is-active"); a.setAttribute("aria-current", "true"); }
        map.forEach((x) => x !== a && x.removeAttribute("aria-current"));
      }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    document.querySelectorAll("main > section[id]").forEach((s) => io.observe(s));
  }

  /* ------------------------------------------------------------- SHARE */
  function initShare(cfg) {
    const data = () => ({
      title: cfg.share.title,
      text: cfg.share.text,
      url: cfg.share.url || location.href.split("#")[0],
    });
    const copy = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {
        // legacy fallback
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.cssText = "position:fixed;opacity:0;top:0";
        document.body.appendChild(ta);
        ta.select();
        let ok = false;
        try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
        ta.remove();
        return ok;
      }
    };
    document.querySelectorAll(".share-btn").forEach((btn) =>
      btn.addEventListener("click", async () => {
        const d = data();
        if (navigator.share) {
          try {
            await navigator.share(d);
            return;
          } catch (err) {
            if (err && err.name === "AbortError") return; // guest closed the sheet
          }
        }
        const ok = await copy(`${d.text}\n${d.url}`);
        WED.toast(ok ? "Invitation link copied — paste it into WhatsApp ✿" : `Copy this link: ${d.url}`);
      })
    );
  }

  /* --------------------------------------------------- TRADITIONS RAIL */
  const TRADITIONS = [
    { key: "jeelakarra", te: "జీలకర్ర బెల్లం", en: "Jeelakarra Bellam", tag: "The sacred moment", text: "At the exact muhurtham, the couple place a paste of cumin and jaggery on each other’s heads — a promise to stay together through the bitter and the sweet. This is the moment they are considered married." },
    { key: "kanyadanam", te: "కన్యాదానం", en: "Kanyadanam", tag: "The most sacred gift", text: "The bride’s parents place her hand in the groom’s and pour sacred water over their joined hands, entrusting their daughter to him with love and blessings." },
    { key: "mangalyam", te: "మాంగల్యధారణ", en: "Mangalyadharanam", tag: "Three knots, one bond", text: "Amid Vedic chants and the sound of the nadaswaram, the groom ties the mangalsutra — two golden discs, one from each family — around the bride’s neck with three knots." },
    { key: "talambralu", te: "తలంబ్రాలు", en: "Talambralu", tag: "A shower of prosperity", text: "The couple joyfully shower each other with turmeric-coloured rice, sometimes mixed with pearls — a playful wish for abundance, happiness and a fruitful life together." },
    { key: "saptapadi", te: "సప్తపది", en: "Saptapadi", tag: "Seven steps, seven vows", text: "Hand in hand, the couple take seven steps around the sacred fire. Each step is a vow — for nourishment, strength, prosperity, happiness, family, harmony and lifelong friendship." },
    { key: "arundhati", te: "అరుంధతీ నక్షత్రం", en: "Arundhati Nakshatram", tag: "A star of devotion", text: "The groom shows the bride the twin stars Arundhati and Vasishta — a timeless symbol of a devoted couple who stay side by side, forever." },
  ];

  function initTraditions() {
    const rail = document.getElementById("traditions-rail");
    const dotsEl = document.getElementById("rail-dots");
    if (!rail) return;
    const O = window.ORNAMENTS;
    rail.innerHTML = TRADITIONS.map((t, i) => `
      <button class="tcard" type="button" aria-pressed="false" aria-label="${t.en}: ${t.tag}. Tap to read more.">
        <span class="tcard__inner">
          <span class="tcard__face tcard__face--front">
            <span class="tcard__num">${String(i + 1).padStart(2, "0")} / ${String(TRADITIONS.length).padStart(2, "0")}</span>
            <span class="tcard__art">${O.traditions[t.key]()}</span>
            <span class="tcard__te" lang="te">${t.te}</span>
            <span class="tcard__en">${t.en}</span>
            <span class="tcard__tag">${t.tag}</span>
            <span class="tcard__hint">Tap to reveal ✦</span>
          </span>
          <span class="tcard__face tcard__face--back" aria-hidden="true">
            <span class="tcard__te" lang="te" style="color:var(--vermilion)">${t.te}</span>
            <span class="tcard__back-title">${t.en}</span>
            <span class="tcard__text">${t.text}</span>
            <span class="tcard__hint">Tap to turn back ✦</span>
          </span>
        </span>
      </button>`).join("");
    dotsEl.innerHTML = TRADITIONS.map(() => "<i></i>").join("");
    const cards = [...rail.querySelectorAll(".tcard")];
    const dots = [...dotsEl.children];

    rail.addEventListener("click", (e) => {
      const c = e.target.closest(".tcard");
      if (!c) return;
      const on = c.getAttribute("aria-pressed") !== "true";
      c.setAttribute("aria-pressed", String(on));
      c.querySelector(".tcard__face--back").setAttribute("aria-hidden", String(!on));
      c.querySelector(".tcard__face--front").setAttribute("aria-hidden", String(on));
    });

    const current = () => {
      const mid = rail.scrollLeft + rail.clientWidth / 2;
      let best = 0, bestD = Infinity;
      cards.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      return best;
    };
    const updateDots = () => {
      const i = current();
      dots.forEach((d, k) => d.classList.toggle("is-active", k === i));
    };
    const go = (i) => {
      const c = cards[Math.max(0, Math.min(cards.length - 1, i))];
      rail.scrollTo({ left: c.offsetLeft - (rail.clientWidth - c.offsetWidth) / 2, behavior: WED.reducedMotion ? "auto" : "smooth" });
    };
    rail.addEventListener("scroll", () => requestAnimationFrame(updateDots), { passive: true });
    document.querySelector('[data-rail="prev"]').addEventListener("click", () => go(current() - 1));
    document.querySelector('[data-rail="next"]').addEventListener("click", () => go(current() + 1));
    rail.addEventListener("keydown", (e) => {
      if (e.target !== rail) return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(current() + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(current() - 1); }
    });
    updateDots();
  }

  /* -------------------------------------------------------- MUSIC UI */
  function initMusic() {
    const m = WED.audio && WED.audio.music;
    const toggle = document.getElementById("music-toggle");
    const more = document.getElementById("music-more");
    const panel = document.getElementById("music-panel");
    const vol = document.getElementById("music-volume");
    const title = document.getElementById("music-title");
    if (!m || !toggle) return;
    title.textContent = m.title;
    vol.value = m.volume;
    const sync = (playing) => {
      document.getElementById("music").classList.toggle("is-playing", playing);
      toggle.setAttribute("aria-pressed", String(playing));
      toggle.setAttribute("aria-label", playing ? "Pause background music" : "Play background music");
    };
    m.onChange(sync);
    toggle.addEventListener("click", () => {
      const wasPlaying = m.playing;
      m.toggle().then((ok) => {
        if (!wasPlaying && !ok) WED.toast("Music couldn’t start on this device");
      });
    });
    more.addEventListener("click", () => {
      const open = panel.hidden;
      panel.hidden = !open;
      more.setAttribute("aria-expanded", String(open));
    });
    vol.addEventListener("input", () => m.setVolume(parseFloat(vol.value)));
    document.addEventListener("click", (e) => {
      if (!panel.hidden && !e.target.closest("#music")) {
        panel.hidden = true;
        more.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ------------------------------------------------- MICRO-INTERACTIONS */
  function initDelights() {
    // Tap a lamp on touch screens: its glow blooms for a moment
    document.querySelectorAll(".lamp").forEach((l) =>
      l.addEventListener("pointerdown", () => {
        l.classList.add("is-glowing");
        setTimeout(() => l.classList.remove("is-glowing"), 1400);
      })
    );

    if (!finePointer || WED.reducedMotion) return;

    // Invitation card: subtle paper depth following the cursor
    const card = document.getElementById("invite-card");
    if (card) {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(1400px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
      });
      card.addEventListener("pointerleave", () => (card.style.transform = ""));
      card.style.transition = "transform .6s cubic-bezier(.16,1,.3,1)";
    }

    // Cursor trail of gold dust (desktop only, throttled)
    let last = 0;
    window.addEventListener("pointermove", (e) => {
      const now = performance.now();
      if (now - last < 45 || !WED.particles) return;
      last = now;
      WED.particles.sparkle(e.clientX, e.clientY);
    }, { passive: true });
  }

  WED.interactions = {
    init(cfg) {
      initNav();
      initShare(cfg);
      initTraditions();
      initMusic();
      initDelights();
    },
  };
})();
