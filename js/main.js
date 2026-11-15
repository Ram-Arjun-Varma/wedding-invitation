/* ==========================================================================
   MAIN — reads WEDDING_CONFIG, renders every section, then hands over to
   the animation, gallery, countdown, audio and interaction modules.
   ========================================================================== */
(function () {
  "use strict";
  const WED = (window.WED = window.WED || {});
  const cfg = window.WEDDING_CONFIG;
  const O = window.ORNAMENTS;
  const esc = (s) => WED.escapeHtml(s == null ? "" : s);
  const TZ = "Asia/Kolkata";

  /* ------------------------------------------------------ formatting */
  const fmtDate = (iso) => new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: TZ }).format(new Date(iso));
  const fmtTime = (iso) => new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: TZ }).format(new Date(iso)).replace(/\s?(am|pm)/i, (m) => " " + m.trim().toUpperCase());
  const fmtShort = (iso) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: TZ }).format(new Date(iso));
  const dayKey = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d);
  const gcalStamp = (iso) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const hasAddress = (o) => !!((o.address && o.address.trim()) || (o.mapQuery && o.mapQuery.trim()));
  const mapsQuery = (o) => (o.mapQuery && o.mapQuery.trim()) || [o.venue || o.name, o.address].filter(Boolean).join(", ");
  const mapsLink = (o) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery(o))}`;

  const ICON = {
    cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 1 1 13 0c0 4.8-6.5 11-6.5 11z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    nav: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l7 19-7-4-7 4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  };

  /* --------------------------------------------------- text bindings */
  function bindText() {
    const g = cfg.couple.groom, b = cfg.couple.bride;
    const values = {
      namesShort: `${g.name} & ${b.name}`,
      loaderBlessing: cfg.invitation.loaderBlessing || "With the blessings of the Almighty",
      groomUpper: g.name.toUpperCase(),
      brideUpper: b.name.toUpperCase(),
      dateUpper: cfg.weddingDateDisplay.toUpperCase(),
      dateDisplay: cfg.weddingDateDisplay,
      dateTelugu: cfg.weddingDateTelugu,
      namesTelugu: `${g.teluguName} ❀ ${b.teluguName}`,
      srirastu: cfg.invitation.srirastu || "",
      invocation: cfg.invitation.invocation,
      blessing: cfg.invitation.blessing,
      invite: cfg.invitation.invite,
      closing: cfg.invitation.closing,
      hosts: cfg.invitation.hosts,
      groomName: g.fullName || g.name,
      brideName: b.fullName || b.name,
      groomParents: g.parents,
      brideParents: b.parents,
      groomTelugu: g.teluguName,
      brideTelugu: b.teluguName,
      groomIntro: g.intro,
      brideIntro: b.intro,
      muhurtham: fmtTime(cfg.weddingDateTime),
      muhurthamDisplay: cfg.muhurthamDisplay || `Muhurtham · ${fmtTime(cfg.weddingDateTime)} IST`,
      venueName: cfg.venue.name,
      venueNote: cfg.venue.note,
      hashtag: cfg.hashtag,
    };
    document.querySelectorAll("[data-bind]").forEach((el) => {
      const v = values[el.dataset.bind];
      if (v === undefined) return;
      el.textContent = v;
      if (!v) el.hidden = true;
    });
    const time = document.querySelector(".hero__date time");
    if (time) time.setAttribute("datetime", cfg.weddingDateTime.slice(0, 10));
    document.title = `${g.name} & ${b.name} — Wedding Invitation · ${cfg.weddingDateDisplay}`;
  }

  /* -------------------------------------------------------- portraits */
  function renderPortraits() {
    [["groom", "#641d2b"], ["bride", "#254c39"]].forEach(([who, tone]) => {
      const p = cfg.couple[who];
      const box = document.querySelector(`[data-photo="${who}"]`);
      if (!box) return;
      box.innerHTML = p.photo
        ? `<img src="${esc(p.photo)}" alt="Portrait of ${esc(p.name)}" loading="lazy" decoding="async" width="600" height="800" />`
        : O.portraitPlaceholder(p.name.charAt(0).toUpperCase(), tone);
    });
  }

  /* ----------------------------------------------------------- events */
  function renderEvents() {
    const list = document.getElementById("timeline");
    const today = dayKey(new Date());
    const events = cfg.events.filter((e) => e.enabled !== false).sort((a, b) => new Date(a.start) - new Date(b.start));
    if (!events.length) {
      document.getElementById("events").hidden = true;
      return;
    }
    list.innerHTML = events
      .map((ev) => {
        const icon = (O.icons[ev.icon] || O.icons.kalasham)();
        const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${ev.name} — ${cfg.couple.groom.name} & ${cfg.couple.bride.name}`)}&dates=${gcalStamp(ev.start)}/${gcalStamp(ev.end || ev.start)}&details=${encodeURIComponent(ev.description || "")}&location=${encodeURIComponent([ev.venue, ev.address].filter(Boolean).join(", "))}&ctz=${TZ}`;
        const isToday = dayKey(new Date(ev.start)) === today;
        return `<li class="tl-item">
          <span class="tl-node" aria-hidden="true">${icon}</span>
          <article class="ev-card${isToday ? " is-today" : ""}" aria-labelledby="ev-${esc(ev.name).replace(/\W+/g, "-")}">
            ${ev.telugu ? `<p class="ev-card__telugu" lang="te">${esc(ev.telugu)}</p>` : ""}
            <h3 class="ev-card__name" id="ev-${esc(ev.name).replace(/\W+/g, "-")}">${esc(ev.name)}${isToday ? " · Today" : ""}</h3>
            <div class="ev-card__meta">
              <div>${ICON.cal}<span><time datetime="${esc(ev.start)}">${fmtDate(ev.start)}</time></span></div>
              <div>${ICON.clock}<span>${fmtTime(ev.start)}${ev.end ? ` – ${fmtTime(ev.end)}${dayKey(new Date(ev.end)) !== dayKey(new Date(ev.start)) ? ` (${fmtShort(ev.end)})` : ""}` : ""} IST</span></div>
              <div>${ICON.pin}<span><strong>${esc(ev.venue)}</strong>${ev.address ? `<span class="ev-card__address">${esc(ev.address)}</span>` : ""}</span></div>
            </div>
            <p class="ev-card__desc">${esc(ev.description)}</p>
            <div class="ev-card__actions">
              <a class="btn btn--outline btn--small" href="${gcal}" target="_blank" rel="noopener">${ICON.plus}<span>Add to Calendar</span></a>
              ${hasAddress(ev) ? `<a class="btn btn--outline btn--small" href="${mapsLink(ev)}" target="_blank" rel="noopener">${ICON.nav}<span>Directions</span></a>` : ""}
            </div>
          </article></li>`;
      })
      .join("");
  }

  /* ------------------------------------------------------------ venue */
  function renderVenue() {
    const v = cfg.venue;
    const addr = document.getElementById("venue-address");
    const actions = document.getElementById("venue-actions");
    const mapBox = document.getElementById("venue-map");
    addr.textContent = v.address || "Full address will be shared soon.";
    if (v.photo) {
      document.getElementById("venue-art").insertAdjacentHTML("afterbegin", `<img src="${esc(v.photo)}" alt="${esc(v.name)}" loading="lazy" decoding="async" />`);
    }
    let html = "";
    if (hasAddress(v)) {
      html += `<a class="btn btn--gold" href="${mapsLink(v)}" target="_blank" rel="noopener">${ICON.nav}<span>Get Directions</span></a>`;
    }
    html += `<a class="btn btn--outline" href="#events"><span>All Ceremonies</span></a>`;
    actions.innerHTML = html;

    // Event-specific locations (distinct venues other than the main one)
    const groups = new Map();
    cfg.events.filter((e) => e.enabled !== false).forEach((e) => {
      const k = e.venue + "|" + (e.address || "");
      if (!groups.has(k)) groups.set(k, { venue: e.venue, address: e.address, mapQuery: e.mapQuery, names: [] });
      groups.get(k).names.push(e.name);
    });
    const list = document.getElementById("venue-list");
    list.innerHTML = [...groups.values()]
      .filter((g) => hasAddress(g) && g.venue !== v.name)
      .map((g) => `<div class="venue__item">
        <span class="venue__pin">${ICON.pin}</span>
        <div><h4>${esc(g.venue)}</h4><p>${esc(g.names.join(" · "))}</p></div>
        ${hasAddress(g) ? `<a class="btn btn--outline btn--small" href="${mapsLink(g)}" target="_blank" rel="noopener" aria-label="Directions to ${esc(g.venue)}"><span>Map</span></a>` : ""}
      </div>`)
      .join("");
    list.hidden = !list.innerHTML.trim();
  }

  /* ------------------------------------------------- LOADER → ENTRANCE */
  function runIntro() {
    const loader = document.getElementById("loader");
    loader.classList.add("is-inview");
    const reduced = WED.reducedMotion;
    const minShow = reduced ? 200 : 2300; // short: kolam draws, lamp lights, names appear
    const started = performance.now();
    const fontsReady = document.fonts ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1800))]) : Promise.resolve();
    fontsReady.then(() => {
      const wait = Math.max(0, minShow - (performance.now() - started));
      setTimeout(() => {
        loader.classList.add("is-done");
        document.getElementById("entrance").classList.add("is-inview");
        document.body.classList.remove("is-loading");
        setTimeout(() => loader.remove(), 900);
        if (window.gsap && !reduced) {
          gsap.from(".plaque", { y: 40, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.2 });
          gsap.from(".entrance__lamp", { y: 50, opacity: 0, duration: 1.2, stagger: 0.1, ease: "power3.out" });
          gsap.from(".entrance__toranam", { yPercent: -60, opacity: 0, duration: 1.4, ease: "power2.out" });
        }
        document.getElementById("open-invitation").focus({ preventScroll: true });
      }, wait);
    });

    const openBtn = document.getElementById("open-invitation");
    const skipBtn = document.getElementById("skip-entrance");
    let opened = false;
    const go = (opts) => {
      if (opened) return;
      opened = true;
      if (WED.audio) WED.audio.unlock(); // explicit user gesture → audio allowed
      WED.animations.openDoors(opts).then(() => {
        const main = document.getElementById("main");
        main.setAttribute("tabindex", "-1");
        main.focus({ preventScroll: true });
      });
    };
    openBtn.addEventListener("click", () => go({ withSound: true }));
    skipBtn.addEventListener("click", () => go({ withSound: false, instant: true }));

    // Deep links (e.g. shared …/#events) skip straight past the doors
    if (location.hash && location.hash.length > 1 && document.querySelector(location.hash)) {
      const target = location.hash;
      go({ withSound: false, instant: true });
      setTimeout(() => WED.scrollTo(target), 650);
    }
  }

  /* ============================================================= BOOT */
  function boot() {
    if (!cfg || !O) return;
    O.hydrate();
    bindText();
    renderPortraits();
    renderEvents();
    renderVenue();
    WED.gallery.init(cfg.gallery);
    WED.interactions.init(cfg);
    WED.animations.init();
    WED.countdown.init(cfg.weddingDateTime, () => {
      const eb = document.querySelector("#countdown .eyebrow");
      const t = document.getElementById("countdown-title");
      if (eb) eb.textContent = "Shubha Vivaham";
      if (t) t.textContent = "Happily Married";
    });
    runIntro();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
