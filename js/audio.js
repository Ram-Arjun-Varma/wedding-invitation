/* ==========================================================================
   AUDIO — temple bell + optional background ambience
   • Nothing plays until the guest taps (browser autoplay rules respected).
   • The bell and the default "Mohanam" veena-and-tanpura ambience are
     synthesised live with the Web Audio API — no audio files, no licensing
     concerns. Set WEDDING_CONFIG.music.src to use your own licensed track.
   ========================================================================== */
(function () {
  "use strict";
  const WED = (window.WED = window.WED || {});
  const cfg = (window.WEDDING_CONFIG && window.WEDDING_CONFIG.music) || {};

  let ctx = null;
  let master = null; // music bus
  let reverb = null;
  let volume = typeof cfg.defaultVolume === "number" ? cfg.defaultVolume : 0.5;

  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    return ctx;
  }

  function makeReverb(c, seconds = 2.8) {
    const len = Math.floor(c.sampleRate * seconds);
    const buf = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    const conv = c.createConvolver();
    conv.buffer = buf;
    return conv;
  }

  /* ---------------------------------------------------------- TEMPLE BELL */
  function bell() {
    const c = getCtx();
    if (!c) return;
    const now = c.currentTime + 0.02;
    const out = c.createGain();
    out.gain.value = 0.32;
    const rv = makeReverb(c, 3.4);
    const wet = c.createGain();
    wet.gain.value = 0.35;
    out.connect(c.destination);
    out.connect(rv);
    rv.connect(wet);
    wet.connect(c.destination);

    const base = 588;
    // Inharmonic partials typical of a cast-bronze temple bell
    const partials = [
      [0.5, 0.5, 5.5], [1, 0.9, 4], [1.19, 0.45, 3], [1.5, 0.3, 2.6],
      [2, 0.35, 2.2], [2.52, 0.18, 1.6], [2.74, 0.16, 1.4], [3.36, 0.08, 1],
    ];
    partials.forEach(([ratio, amp, decay]) => {
      [0, 1.6].forEach((detune) => {
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = "sine";
        o.frequency.value = base * ratio + detune; // slight beating = shimmer
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(amp * 0.5, now + 0.006);
        g.gain.exponentialRampToValueAtTime(0.0001, now + decay);
        o.connect(g);
        g.connect(out);
        o.start(now);
        o.stop(now + decay + 0.1);
      });
    });
    // metallic strike transient
    const n = c.createBuffer(1, c.sampleRate * 0.05, c.sampleRate);
    const d = n.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = c.createBufferSource();
    const hp = c.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 2500;
    const sg = c.createGain();
    sg.gain.value = 0.25;
    src.buffer = n;
    src.connect(hp);
    hp.connect(sg);
    sg.connect(out);
    src.start(now);
  }

  /* ---------------------------------------- PLUCKED STRING (Karplus–Strong) */
  const pluckCache = new Map();
  function pluckBuffer(c, freq, seconds, damping, brightness) {
    const key = `${freq.toFixed(2)}|${seconds}|${damping}`;
    if (pluckCache.has(key)) return pluckCache.get(key);
    const sr = c.sampleRate;
    const len = Math.floor(sr * seconds);
    const buf = c.createBuffer(1, len, sr);
    const out = buf.getChannelData(0);
    const N = Math.max(2, Math.round(sr / freq));
    const line = new Float32Array(N);
    let prev = 0;
    for (let i = 0; i < N; i++) {
      // low-passed noise burst: softer, more "veena" than raw noise
      prev = prev * (1 - brightness) + (Math.random() * 2 - 1) * brightness;
      line[i] = prev;
    }
    let idx = 0;
    for (let i = 0; i < len; i++) {
      const next = (idx + 1) % N;
      const v = line[idx];
      line[idx] = damping * 0.5 * (v + line[next]);
      // a whisper of jawari buzz
      out[i] = Math.tanh(v * 1.6) * 0.8;
      idx = next;
    }
    pluckCache.set(key, buf);
    return buf;
  }

  /* -------------------------------------- GENERATIVE MOHANAM AMBIENCE */
  const SA = 146.83; // D3
  const MOHANAM = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3]; // S R2 G3 P D2
  let scheduler = null;
  let nextDrone = 0,
    nextNote = 0,
    droneStep = 0,
    melodyPos = 5,
    phraseLeft = 0;

  function synthPlay(buffer, when, gain, rate = 1, bend = 0) {
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.playbackRate.setValueAtTime(rate, when);
    if (bend) {
      // gamaka — a gentle oscillation into the note
      src.playbackRate.setValueAtTime(rate * (1 + bend), when);
      src.playbackRate.linearRampToValueAtTime(rate, when + 0.18);
    }
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(g);
    g.connect(master);
    src.start(when);
  }

  function scheduleAhead() {
    const t = ctx.currentTime;
    // Tanpura: Pa — Sa' — Sa' — Sa  (classic four-string cycle)
    const drone = [SA * 1.5, SA * 2, SA * 2, SA];
    while (nextDrone < t + 0.6) {
      const f = drone[droneStep % 4] / 2;
      synthPlay(pluckBuffer(ctx, f, 5, 0.9992, 0.35), nextDrone, 0.22);
      nextDrone += 1.15;
      droneStep++;
    }
    // Veena melody: wandering phrases within Mohanam
    while (nextNote < t + 0.6) {
      if (phraseLeft <= 0) {
        nextNote += 1.6 + Math.random() * 2.4; // breathing space between phrases
        phraseLeft = 4 + Math.floor(Math.random() * 6);
        continue;
      }
      melodyPos += Math.random() < 0.5 ? -1 : 1;
      if (Math.random() < 0.25) melodyPos += Math.random() < 0.5 ? -1 : 1;
      melodyPos = Math.max(0, Math.min(11, melodyPos));
      const octave = Math.floor(melodyPos / 5);
      const f = SA * 2 * MOHANAM[melodyPos % 5] * Math.pow(2, octave);
      const bend = Math.random() < 0.3 ? (Math.random() < 0.5 ? -0.03 : 0.04) : 0;
      synthPlay(pluckBuffer(ctx, f, 2.6, 0.9985, 0.6), nextNote, 0.32, 1, bend);
      phraseLeft--;
      nextNote += [0.42, 0.56, 0.7, 0.84][Math.floor(Math.random() * 4)];
    }
  }

  /* ------------------------------------------------------- PUBLIC MUSIC */
  let fileAudio = null;
  let playing = false;
  const listeners = new Set();
  const notify = () => listeners.forEach((fn) => fn(playing));

  function ensureBus() {
    const c = getCtx();
    if (!c) return null;
    if (!master) {
      master = c.createGain();
      master.gain.value = 0;
      const comp = c.createDynamicsCompressor();
      reverb = makeReverb(c, 3);
      const wet = c.createGain();
      wet.gain.value = 0.45;
      master.connect(comp);
      master.connect(reverb);
      reverb.connect(wet);
      wet.connect(comp);
      comp.connect(c.destination);
    }
    return c;
  }

  function fadeTo(target, secs) {
    if (fileAudio) {
      const start = fileAudio.volume,
        t0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - t0) / (secs * 1000));
        fileAudio.volume = start + (target - start) * k;
        if (k < 1) requestAnimationFrame(step);
        else if (target === 0) fileAudio.pause();
      };
      requestAnimationFrame(step);
      return;
    }
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(target, now + secs);
  }

  function play() {
    if (playing) return Promise.resolve(true);
    if (cfg.src) {
      if (!fileAudio) {
        fileAudio = new Audio(cfg.src);
        fileAudio.loop = true;
        fileAudio.preload = "auto";
      }
      fileAudio.volume = 0;
      return fileAudio
        .play()
        .then(() => {
          playing = true;
          fadeTo(volume, 1.5);
          notify();
          return true;
        })
        .catch(() => false);
    }
    const c = ensureBus();
    if (!c) return Promise.resolve(false);
    nextDrone = Math.max(nextDrone, c.currentTime + 0.1);
    nextNote = Math.max(nextNote, c.currentTime + 1.2);
    scheduleAhead();
    scheduler = setInterval(scheduleAhead, 200);
    fadeTo(volume * 0.9, 2.5);
    playing = true;
    notify();
    return Promise.resolve(true);
  }

  function pause() {
    if (!playing) return;
    playing = false;
    fadeTo(0, 0.8);
    if (scheduler) {
      clearInterval(scheduler);
      scheduler = null;
    }
    notify();
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    if (!playing) return;
    if (fileAudio) fileAudio.volume = volume;
    else {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setTargetAtTime(volume * 0.9, now, 0.08);
    }
  }

  // Pause politely when the tab is hidden, resume when visible again
  let resumeOnShow = false;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && playing) {
      resumeOnShow = true;
      pause();
    } else if (!document.hidden && resumeOnShow) {
      resumeOnShow = false;
      play();
    }
  });

  WED.audio = {
    unlock: getCtx,
    bell,
    music: {
      play,
      pause,
      toggle: () => (playing ? (pause(), Promise.resolve(false)) : play()),
      setVolume,
      get volume() { return volume; },
      get playing() { return playing; },
      onChange: (fn) => listeners.add(fn),
      title: cfg.title || "Ambience",
    },
  };
})();
