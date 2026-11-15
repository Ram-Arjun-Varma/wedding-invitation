/* ==========================================================================
   COUNTDOWN — ticks every second, rolls digits smoothly, and gracefully
   switches to a celebration message once the muhurtham has passed.
   ========================================================================== */
(function () {
  "use strict";
  const WED = (window.WED = window.WED || {});

  function setDigits(el, value) {
    if (el.dataset.value === value) return;
    const first = el.dataset.value === undefined;
    el.dataset.value = value;
    const old = el.querySelector("span:not(.is-out)");
    const next = document.createElement("span");
    next.textContent = value;
    if (!first && old) {
      old.classList.remove("is-in");
      old.classList.add("is-out");
      setTimeout(() => old.remove(), 650);
      next.classList.add("is-in");
    } else {
      el.textContent = "";
    }
    el.appendChild(next);
  }

  WED.countdown = {
    init(targetISO, onComplete) {
      const target = new Date(targetISO).getTime();
      const clock = document.getElementById("countdown-clock");
      const done = document.getElementById("countdown-done");
      const sr = document.getElementById("countdown-sr");
      if (!clock || isNaN(target)) return;
      const els = {};
      clock.querySelectorAll("[data-unit]").forEach((el) => (els[el.dataset.unit] = el));

      let timer = null;
      let lastSrHour = -1;

      const finish = () => {
        clock.hidden = true;
        done.hidden = false;
        if (timer) clearTimeout(timer);
        if (typeof onComplete === "function") onComplete();
      };

      const tick = () => {
        const diff = target - Date.now();
        if (diff <= 0) return finish();
        const s = Math.floor(diff / 1000);
        const d = Math.floor(s / 86400);
        const h = Math.floor((s % 86400) / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        setDigits(els.days, String(d).padStart(d > 99 ? 3 : 2, "0"));
        setDigits(els.hours, String(h).padStart(2, "0"));
        setDigits(els.minutes, String(m).padStart(2, "0"));
        setDigits(els.seconds, String(sec).padStart(2, "0"));
        // Screen readers: an update once an hour is plenty
        if (sr && h !== lastSrHour) {
          lastSrHour = h;
          sr.textContent = `${d} days and ${h} hours until the wedding.`;
        }
        // align the next tick with the next whole second
        timer = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
      };
      tick();
    },
  };
})();
