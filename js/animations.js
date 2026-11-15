/* ==========================================================================
   ANIMATIONS — particle canvas, smooth scrolling and GSAP choreography
   • One shared <canvas> draws gold dust, jasmine & marigold petals and the
     desktop cursor sparkle, from pre-rendered sprites (cheap per frame).
   • GSAP + ScrollTrigger drive the cinematic scroll story; if the CDN is
     unreachable everything still appears via IntersectionObserver.
   ========================================================================== */
(function () {
  "use strict";
  const WED = (window.WED = window.WED || {});
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
  WED.reducedMotion = reduced;

  /* ===================================================== PARTICLE SYSTEM */
  const Particles = (function () {
    const canvas = document.getElementById("particles");
    if (!canvas || reduced) return { burst() {}, sparkle() {}, rain() {}, start() {}, setAmbient() {} };
    const ctx = canvas.getContext("2d");
    const DPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
    let W = 0, H = 0, raf = null, running = false;
    const parts = [];
    let ambientTarget = { dust: isMobile ? 16 : 34, petals: isMobile ? 6 : 12 };

    /* sprites */
    const sprite = (w, h, draw) => {
      const c = document.createElement("canvas");
      c.width = w * 2; c.height = h * 2;
      const x = c.getContext("2d");
      x.scale(2, 2);
      draw(x, w, h);
      return c;
    };
    const SPR = {
      dust: sprite(16, 16, (x) => {
        const g = x.createRadialGradient(8, 8, 0, 8, 8, 8);
        g.addColorStop(0, "rgba(255,244,205,1)");
        g.addColorStop(0.3, "rgba(233,210,154,.85)");
        g.addColorStop(1, "rgba(198,161,91,0)");
        x.fillStyle = g; x.fillRect(0, 0, 16, 16);
      }),
      jasmine: sprite(14, 20, (x) => {
        const g = x.createLinearGradient(0, 0, 14, 20);
        g.addColorStop(0, "#ffffff"); g.addColorStop(1, "#efe4cc");
        x.fillStyle = g;
        x.beginPath(); x.moveTo(7, 0);
        x.bezierCurveTo(14, 5, 13, 15, 7, 20); x.bezierCurveTo(1, 15, 0, 5, 7, 0); x.fill();
        x.strokeStyle = "rgba(200,180,140,.5)"; x.lineWidth = .6; x.beginPath(); x.moveTo(7, 3); x.lineTo(7, 17); x.stroke();
      }),
      marigold: sprite(14, 16, (x) => {
        const g = x.createRadialGradient(7, 5, 1, 7, 8, 9);
        g.addColorStop(0, "#ffd166"); g.addColorStop(.7, "#f08a12"); g.addColorStop(1, "#c2560c");
        x.fillStyle = g;
        x.beginPath(); x.moveTo(7, 16);
        x.bezierCurveTo(0, 12, 0, 3, 3, 1); x.quadraticCurveTo(5, 3, 7, 0); x.quadraticCurveTo(9, 3, 11, 1);
        x.bezierCurveTo(14, 3, 14, 12, 7, 16); x.fill();
      }),
      rose: sprite(14, 16, (x) => {
        x.fillStyle = "#a52a2a";
        x.beginPath(); x.moveTo(7, 16); x.bezierCurveTo(0, 11, 1, 2, 7, 1); x.bezierCurveTo(13, 2, 14, 11, 7, 16); x.fill();
      }),
    };

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    }

    function make(type, opts = {}) {
      const p = { type, life: 0, max: Infinity, ...opts };
      if (type === "dust") {
        p.x = opts.x ?? Math.random() * W; p.y = opts.y ?? H + Math.random() * H * 0.2 - (opts.seed ? Math.random() * H : 0);
        p.vx = opts.vx ?? (Math.random() - 0.5) * 0.15; p.vy = opts.vy ?? -(0.15 + Math.random() * 0.35);
        p.s = opts.s ?? 2 + Math.random() * 5; p.a = 0; p.tw = Math.random() * 6.28;
      } else {
        p.x = opts.x ?? Math.random() * W; p.y = opts.y ?? -20 - (opts.seed ? -Math.random() * H : Math.random() * 60);
        p.vx = opts.vx ?? (Math.random() - 0.5) * 0.4; p.vy = opts.vy ?? 0.45 + Math.random() * 0.6;
        p.s = opts.s ?? 0.7 + Math.random() * 0.6; p.r = Math.random() * 6.28; p.vr = (Math.random() - 0.5) * 0.04;
        p.sw = Math.random() * 6.28; p.flip = Math.random() * 6.28; p.a = 1;
      }
      parts.push(p);
      return p;
    }

    function seed() {
      for (let i = 0; i < ambientTarget.dust; i++) make("dust", { seed: true, ambient: true });
      for (let i = 0; i < ambientTarget.petals; i++) make(Math.random() < 0.65 ? "jasmine" : "marigold", { seed: true, ambient: true });
    }

    function frame() {
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, W, H);
      let ambDust = 0, ambPet = 0;
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life++;
        if (p.type === "dust") {
          p.tw += 0.04; p.x += p.vx + Math.sin(p.tw) * 0.12; p.y += p.vy;
          if (p.drag) { p.vx *= 0.94; p.vy *= 0.94; p.vy -= 0.01; }
          p.a = Math.min(1, p.a + 0.02) * (p.max === Infinity ? 1 : Math.max(0, 1 - p.life / p.max));
          const tw = 0.55 + Math.sin(p.tw * 2) * 0.45;
          ctx.globalAlpha = p.a * tw * 0.85;
          ctx.drawImage(SPR.dust, p.x - p.s, p.y - p.s, p.s * 2, p.s * 2);
          if (p.ambient) ambDust++;
        } else {
          p.sw += 0.02; p.flip += 0.05;
          p.x += p.vx + Math.sin(p.sw) * 0.6; p.y += p.vy; p.r += p.vr;
          if (p.drag) { p.vx *= 0.97; p.vy = p.vy * 0.97 + 0.04; }
          const fade = p.max === Infinity ? 1 : Math.max(0, 1 - p.life / p.max);
          ctx.globalAlpha = 0.92 * fade;
          const img = SPR[p.type];
          const sx = Math.cos(p.flip) * p.s; // 3-D tumble illusion
          const c = Math.cos(p.r), s = Math.sin(p.r);
          ctx.setTransform(c * sx * DPR, s * sx * DPR, -s * p.s * DPR, c * p.s * DPR, p.x * DPR, p.y * DPR);
          ctx.drawImage(img, -img.width / 4, -img.height / 4, img.width / 2, img.height / 2);
          ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
          if (p.ambient) ambPet++;
        }
        const out = p.y < -40 || p.y > H + 40 || p.x < -60 || p.x > W + 60 || p.life > p.max;
        if (out) parts.splice(i, 1);
      }
      ctx.globalAlpha = 1;
      // replenish ambient field gently
      if (ambDust < ambientTarget.dust && Math.random() < 0.3) make("dust", { ambient: true });
      if (ambPet < ambientTarget.petals && Math.random() < 0.04) make(Math.random() < 0.65 ? "jasmine" : "marigold", { ambient: true });
      raf = running ? requestAnimationFrame(frame) : null;
    }

    function start() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    seed();

    return {
      start,
      setAmbient(dust, petals) { ambientTarget = { dust, petals }; },
      /* explosion of petals + gold from a point (door opening) */
      burst(x = W / 2, y = H / 2, n = isMobile ? 46 : 90) {
        for (let i = 0; i < n; i++) {
          const a = Math.random() * Math.PI * 2, sp = 2 + Math.random() * (isMobile ? 6 : 9);
          const t = Math.random();
          make(t < 0.45 ? "jasmine" : t < 0.8 ? "marigold" : "rose", { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2, drag: true, max: 260 + Math.random() * 120, s: 0.8 + Math.random() * 0.7 });
          if (i % 2) make("dust", { x, y, vx: Math.cos(a) * sp * 0.8, vy: Math.sin(a) * sp * 0.8, drag: true, max: 120 + Math.random() * 60, s: 2 + Math.random() * 4 });
        }
      },
      /* gentle shower from the top (closing section / celebration) */
      rain(n = isMobile ? 18 : 36) {
        for (let i = 0; i < n; i++) make(Math.random() < 0.5 ? "jasmine" : "marigold", { y: -20 - Math.random() * 200 });
      },
      sparkle(x, y) {
        make("dust", { x, y, vx: (Math.random() - 0.5) * 1.2, vy: (Math.random() - 0.5) * 1.2 - 0.3, drag: true, max: 50, s: 1.5 + Math.random() * 2.5 });
      },
    };
  })();
  WED.particles = Particles;

  /* ===================================================== SMOOTH SCROLL */
  let lenis = null;
  function initLenis() {
    if (reduced || typeof window.Lenis !== "function") return null;
    lenis = new window.Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    if (window.gsap && window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const loop = (t) => { lenis.raf(t); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    }
    lenis.stop(); // locked until the doors open
    return lenis;
  }
  WED.scrollTo = (target) => {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (!el) return;
    const offset = -(document.getElementById("nav")?.offsetHeight || 60) + 1;
    if (lenis) lenis.scrollTo(el, { offset, duration: 1.4 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: reduced ? "auto" : "smooth" });
  };
  WED.scrollLock = (lock) => {
    document.body.style.overflow = lock ? "hidden" : "";
    if (lenis) lock ? lenis.stop() : lenis.start();
  };

  /* ================================ IN-VIEW observer (ornaments drawing) */
  function observeInView() {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-inview"); io.unobserve(e.target); }
      }),
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
    );
    document.querySelectorAll(".section__head, .card, .venue__card, .blessing__content, .reveal, [data-ornament='divider'], [data-ornament='corner'], [data-ornament='gopuram'], [data-ornament='kolam']").forEach((el) => {
      if (!el.closest("#loader") && !el.closest("#home") && !el.closest("#entrance")) io.observe(el);
    });
  }

  /* ========================================================= helpers */
  function splitChars(el) {
    const text = el.textContent;
    el.setAttribute("aria-label", text);
    el.innerHTML = [...text].map((c) => `<span class="char" aria-hidden="true">${c === " " ? "&nbsp;" : c}</span>`).join("");
    return el.querySelectorAll(".char");
  }
  function splitWords(el) {
    const text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    el.innerHTML = text.split(/\s+/).map((w) => `<span class="word" aria-hidden="true">${w}</span>`).join(" ");
    return el.querySelectorAll(".word");
  }

  /* ============================================== GSAP: SCROLL STORY */
  function scrollStory() {
    const hasGsap = window.gsap && window.ScrollTrigger;
    if (!hasGsap || reduced) {
      // Fallback: CSS reveal classes + IntersectionObserver
      document.querySelectorAll(".ev-card, .profile, .cd-unit, .tcard, .m-item, .venue__item").forEach((el) => el.classList.add("reveal"));
      observeInView();
      const line = document.querySelector(".timeline");
      if (line) line.style.setProperty("--line", "100%");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    observeInView();
    const ease = "power3.out";

    // Parallax depth
    gsap.utils.toArray(".parallax").forEach((el) => {
      const sp = parseFloat(el.dataset.speed || 0.2);
      gsap.to(el, { yPercent: sp * 40, ease: "none", scrollTrigger: { trigger: el.closest("section"), start: "top top", end: "bottom top", scrub: true } });
    });
    gsap.to(".hero__content", { yPercent: 18, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    // Invitation card — rises like a card drawn from its envelope
    const card = document.getElementById("invite-card");
    if (card) {
      gsap.from(card, { y: 90, rotateX: 14, opacity: 0, transformPerspective: 1200, duration: 1.4, ease, scrollTrigger: { trigger: card, start: "top 85%" } });
      gsap.from(card.querySelectorAll(".card__srirastu, .card__ganesha, .card__invocation, .reveal-line"), {
        y: 24, opacity: 0, filter: "blur(4px)", duration: 1, stagger: 0.09, ease, scrollTrigger: { trigger: card, start: "top 70%" },
      });
    }

    // Couple — portraits unveil through their arches
    gsap.utils.toArray(".profile").forEach((p, i) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: p, start: "top 80%" } });
      tl.from(p.querySelector(".profile__photo"), { clipPath: "inset(100% 0 0 0 round 50% 50% 8px 8px)", duration: 1.4, ease: "power4.inOut" })
        .from(p.querySelector(".profile__frame"), { scale: 0.92, opacity: 0, duration: 1, ease }, "-=1")
        .from(p.querySelectorAll(".profile__role, .profile__name, .profile__telugu, .profile__intro"), { y: 26, opacity: 0, stagger: 0.1, duration: 0.9, ease }, "-=.7");
      gsap.from(p, { x: (i ? 1 : -1) * (isMobile ? 24 : 60), duration: 1.4, ease, scrollTrigger: { trigger: p, start: "top 85%" } });
    });
    gsap.from(".couple__knot", { scale: 0.6, opacity: 0, duration: 1.2, ease: "back.out(1.4)", scrollTrigger: { trigger: ".couple__knot", start: "top 85%" } });

    // Countdown units
    gsap.from(".cd-unit", { y: 50, opacity: 0, duration: 1, stagger: 0.12, ease, scrollTrigger: { trigger: ".countdown__clock", start: "top 85%" } });

    // Timeline — the gold thread fills as you scroll, cards glide in
    const tl = document.querySelector(".timeline");
    if (tl) {
      ScrollTrigger.create({
        trigger: tl, start: "top 70%", end: "bottom 70%", scrub: true,
        onUpdate: (self) => tl.style.setProperty("--line", `${(self.progress * 100).toFixed(1)}%`),
      });
      gsap.utils.toArray(".tl-item").forEach((item, i) => {
        const fromX = window.innerWidth >= 900 ? (i % 2 ? 60 : -60) : 30;
        gsap.from(item.querySelector(".ev-card"), { x: fromX, opacity: 0, duration: 1.1, ease, scrollTrigger: { trigger: item, start: "top 85%" } });
        gsap.from(item.querySelector(".tl-node"), { scale: 0, rotate: -90, duration: 0.9, ease: "back.out(1.7)", scrollTrigger: { trigger: item, start: "top 85%" } });
      });
    }

    // Traditions
    gsap.from(".tcard", { y: 60, opacity: 0, duration: 1, stagger: 0.08, ease, scrollTrigger: { trigger: ".rail", start: "top 85%" } });

    // Venue
    gsap.from(".venue__card", { y: 60, opacity: 0, duration: 1.2, ease, scrollTrigger: { trigger: ".venue__card", start: "top 85%" } });
    gsap.from(".mandapam-svg", { scale: 0.9, opacity: 0, y: 30, duration: 1.4, ease, scrollTrigger: { trigger: ".venue__card", start: "top 75%" } });

    // Gallery — batched cinematic reveals
    ScrollTrigger.batch(".m-item", {
      start: "top 92%",
      onEnter: (els) => gsap.fromTo(els, { y: 40, opacity: 0, clipPath: "inset(12% 0 0 0)" }, { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 1.1, stagger: 0.08, ease, overwrite: true }),
    });
    gsap.set(".m-item", { opacity: 0 });

    // Closing blessing
    const title = document.querySelector(".blessing__title");
    if (title) {
      const words = splitWords(title);
      gsap.from(words, { y: 30, opacity: 0, filter: "blur(6px)", duration: 1.1, stagger: 0.08, ease, scrollTrigger: { trigger: title, start: "top 80%" } });
      gsap.from(".blessing__text, .blessing__names, .blessing__date, .blessing__actions, .blessing__hashtag", { y: 24, opacity: 0, duration: 1, stagger: 0.12, ease, scrollTrigger: { trigger: title, start: "top 70%" } });
      ScrollTrigger.create({ trigger: ".blessing", start: "top 40%", once: true, onEnter: () => Particles.rain() });
    }

    // Recalculate once fonts/images settle
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }

  /* ================================================ ENTRANCE: OPEN DOORS */
  function openDoors({ withSound = true, instant = false } = {}) {
    return new Promise((resolve) => {
      const entrance = document.getElementById("entrance");
      if (!entrance || entrance.classList.contains("is-gone")) return resolve();
      if (withSound && WED.audio) WED.audio.bell();
      entrance.querySelectorAll(".entrance__bells > span").forEach((b) => b.classList.add("bell-ring"));

      const finish = () => {
        entrance.classList.add("is-gone");
        document.body.classList.remove("is-locked");
        document.body.classList.add("is-entered");
        if (lenis) lenis.start();
        if (window.ScrollTrigger) ScrollTrigger.refresh();
        heroIntro();
        resolve();
      };

      if (instant || reduced || !window.gsap) {
        if (window.gsap && !reduced) gsap.to(entrance, { opacity: 0, duration: 0.5, onComplete: finish });
        else {
          entrance.style.transition = "opacity .5s"; entrance.style.opacity = 0;
          setTimeout(finish, reduced ? 0 : 500);
        }
        return;
      }

      const W = window.innerWidth, H = window.innerHeight;
      const tl = gsap.timeline({ onComplete: finish });
      tl.to(".plaque", { scale: 0.94, opacity: 0, y: 20, duration: 0.6, ease: "power2.in" })
        .to(".entrance__light", { opacity: 1, width: 40, duration: 0.5, ease: "power2.out" }, "-=.2")
        .to(".door--left", { rotateY: -108, duration: 2, ease: "power3.inOut" }, "-=.1")
        .to(".door--right", { rotateY: 108, duration: 2, ease: "power3.inOut" }, "<")
        .to(".entrance__light", { width: W * 1.4, height: H * 1.4, duration: 1.9, ease: "power2.inOut" }, "<")
        .add(() => Particles.burst(W / 2, H * 0.5), "<.5")
        .to(".entrance__lamp--left", { x: -40, opacity: 0, duration: 1.2, ease: "power2.in" }, "<.4")
        .to(".entrance__lamp--right", { x: 40, opacity: 0, duration: 1.2, ease: "power2.in" }, "<")
        .to(".entrance__frame", { y: -60, opacity: 0, duration: 1, ease: "power2.in" }, "<.2")
        .to(entrance, { opacity: 0, duration: 0.8, ease: "power1.inOut" }, "-=.5");
    });
  }

  /* ===================================================== HERO INTRO */
  let heroDone = false;
  function heroIntro() {
    if (heroDone) return;
    heroDone = true;
    const hero = document.getElementById("home");
    hero.classList.add("is-inview");
    if (!window.gsap || reduced) return;
    const names = [...hero.querySelectorAll(".hero__name.split")];
    const chars = names.flatMap((n) => { n.classList.add("is-split"); return [...splitChars(n)]; });
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero__eyebrow", { y: 16, opacity: 0, duration: 0.9 })
      .from(chars, { yPercent: 80, opacity: 0, rotateX: -60, duration: 1.2, stagger: 0.055, transformPerspective: 600 }, "-=.5")
      .from(".hero__amp", { scale: 0.4, opacity: 0, duration: 1, ease: "back.out(1.6)" }, "-=.9")
      .from(".hero__date", { letterSpacing: "0.8em", opacity: 0, duration: 1.4 }, "-=.6")
      .from(".hero__telugu", { y: 10, opacity: 0, duration: 0.8 }, "-=1")
      .from(".hero__lamp", { y: 60, opacity: 0, duration: 1.2, stagger: 0.12 }, 0.2)
      .from(".hero__garland, .hero__strands", { yPercent: -40, opacity: 0, duration: 1.6, ease: "power2.out" }, 0)
      .from(".scroll-cue", { opacity: 0, y: -10, duration: 0.8 }, "-=.4");
  }

  WED.animations = {
    init() {
      initLenis();
      scrollStory();
      Particles.start();
    },
    openDoors,
    heroIntro,
    get lenis() { return lenis; },
  };
})();
