/* ==========================================================================
   ORNAMENTS — procedural SVG artwork
   Every traditional element (lamps, toranam, garlands, gopuram, kolam, bells,
   kalasham, tradition illustrations…) is drawn here as resolution-independent
   SVG so it stays crisp on any phone and weighs almost nothing.
   Usage in HTML:  <div data-ornament="lamp"></div>
   ========================================================================== */
(function () {
  "use strict";

  let uid = 0;
  const id = (p) => `${p}-${++uid}`;
  const r2 = (n) => Math.round(n * 100) / 100;

  /* Shared gradient definitions (antique brass / gold) */
  const brassDefs = (g) => `
    <linearGradient id="${g}" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#6e5222"/><stop offset=".35" stop-color="#d9b874"/>
      <stop offset=".55" stop-color="#f3dfa6"/><stop offset=".75" stop-color="#b48a45"/>
      <stop offset="1" stop-color="#5d441b"/>
    </linearGradient>`;

  /* ---------------------------------------------------------------- KOLAM */
  function kolam() {
    const c = 100;
    let paths = "";
    const petals = 8;
    for (let i = 0; i < petals; i++) {
      const a = (i / petals) * Math.PI * 2 - Math.PI / 2;
      const tip = [c + Math.cos(a) * 64, c + Math.sin(a) * 64];
      const base = [c + Math.cos(a) * 14, c + Math.sin(a) * 14];
      const l = [c + Math.cos(a - 0.42) * 46, c + Math.sin(a - 0.42) * 46];
      const r = [c + Math.cos(a + 0.42) * 46, c + Math.sin(a + 0.42) * 46];
      paths += `<path pathLength="1" class="draw" style="--d:${i * 0.07}s" d="M${r2(base[0])} ${r2(base[1])} Q${r2(l[0])} ${r2(l[1])} ${r2(tip[0])} ${r2(tip[1])} Q${r2(r[0])} ${r2(r[1])} ${r2(base[0])} ${r2(base[1])}Z"/>`;
      // looping sikku curve between petals
      const b = a + Math.PI / petals;
      const p1 = [c + Math.cos(b - 0.3) * 70, c + Math.sin(b - 0.3) * 70];
      const p2 = [c + Math.cos(b + 0.3) * 70, c + Math.sin(b + 0.3) * 70];
      const out = [c + Math.cos(b) * 96, c + Math.sin(b) * 96];
      paths += `<path pathLength="1" class="draw" style="--d:${0.5 + i * 0.06}s" d="M${r2(p1[0])} ${r2(p1[1])} C${r2(out[0] + Math.cos(b - 1.4) * 22)} ${r2(out[1] + Math.sin(b - 1.4) * 22)} ${r2(out[0] + Math.cos(b + 1.4) * 22)} ${r2(out[1] + Math.sin(b + 1.4) * 22)} ${r2(p2[0])} ${r2(p2[1])}"/>`;
    }
    let dots = "";
    for (let i = 0; i < petals; i++) {
      const b = (i / petals) * Math.PI * 2 - Math.PI / 2 + Math.PI / petals;
      dots += `<circle class="dot" style="--d:${0.9 + i * 0.05}s" cx="${r2(c + Math.cos(b) * 40)}" cy="${r2(c + Math.sin(b) * 40)}" r="2.6"/>`;
      dots += `<circle class="dot" style="--d:${1 + i * 0.05}s" cx="${r2(c + Math.cos(b) * 82)}" cy="${r2(c + Math.sin(b) * 82)}" r="2.2"/>`;
    }
    return `<svg class="kolam" viewBox="0 0 200 200" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
        <circle pathLength="1" class="draw" cx="100" cy="100" r="9"/>${paths}
      </g><g fill="currentColor">${dots}<circle class="dot" style="--d:1.2s" cx="100" cy="100" r="2.6"/></g></svg>`;
  }

  /* ---------------------------------------------------- KUTHUVILAKKU LAMP */
  function lamp() {
    const g = id("brass"),
      f = id("flame"),
      gl = id("glow");
    const flame = (x, y, s = 1, d = 0) => `
      <g class="flame" style="transform-origin:${x}px ${y}px;animation-delay:${d}s">
        <path d="M${x} ${y} c${-6 * s} ${-6 * s} ${-6 * s} ${-14 * s} 0 ${-24 * s} c${6 * s} ${10 * s} ${6 * s} ${18 * s} 0 ${24 * s}z" fill="url(#${f})"/>
        <path d="M${x} ${y - 2} c${-2.4 * s} ${-3 * s} ${-2.4 * s} ${-7 * s} 0 ${-11 * s} c${2.4 * s} ${4 * s} ${2.4 * s} ${8 * s} 0 ${11 * s}z" fill="#fffbe8"/>
      </g>`;
    return `<svg class="lamp-svg" viewBox="0 0 120 300" aria-hidden="true">
      <defs>${brassDefs(g)}
        <radialGradient id="${f}" cx=".5" cy=".75" r=".7"><stop offset="0" stop-color="#fff3c4"/><stop offset=".45" stop-color="#ffb43a"/><stop offset="1" stop-color="#d4501c" stop-opacity=".9"/></radialGradient>
        <radialGradient id="${gl}"><stop offset="0" stop-color="#ffc768" stop-opacity=".55"/><stop offset="1" stop-color="#ffc768" stop-opacity="0"/></radialGradient>
      </defs>
      <circle class="lamp-glow" cx="60" cy="100" r="58" fill="url(#${gl})"/>
      <g fill="url(#${g})" stroke="#4a3514" stroke-width=".6">
        <!-- peacock (annam) finial -->
        <path d="M60 10c-5 0-8 4-7 8 1 3 4 4 5 6-5 2-9 7-9 13h22c0-6-4-11-9-13 3-2 6-6 4-10-1-3-3-4-6-4z"/>
        <path d="M66 14l7-3-5 6z"/>
        <rect x="56" y="37" width="8" height="38" rx="3"/>
        <ellipse cx="60" cy="48" rx="8" ry="3"/><ellipse cx="60" cy="64" rx="7" ry="2.6"/>
        <!-- oil bowl with five wick spouts -->
        <path d="M14 100c0-8 20-12 46-12s46 4 46 12c-4 14-24 20-46 20S18 114 14 100z"/>
        <path d="M8 98l14-4 4 6zM112 98l-14-4-4 6zM60 84l-4 6h8z"/>
        <ellipse cx="60" cy="100" rx="46" ry="9" fill="#3c2a10" opacity=".55"/>
        <!-- stem -->
        <rect x="54" y="118" width="12" height="118" rx="4"/>
        <ellipse cx="60" cy="140" rx="12" ry="5"/><ellipse cx="60" cy="168" rx="10" ry="4"/>
        <ellipse cx="60" cy="196" rx="13" ry="5"/><ellipse cx="60" cy="222" rx="9" ry="3.5"/>
        <!-- stepped base -->
        <path d="M40 236h40l10 22H30z"/>
        <path d="M24 258h72c8 0 14 6 14 14v4H10v-4c0-8 6-14 14-14z"/>
        <ellipse cx="60" cy="282" rx="54" ry="10"/>
      </g>
      ${flame(14, 96, 1, 0)}${flame(60, 84, 1.15, 0.3)}${flame(106, 96, 1, 0.6)}
      ${flame(37, 92, 0.8, 0.9)}${flame(83, 92, 0.8, 0.45)}
    </svg>`;
  }

  /* --------------------------------------------------- MANGO LEAF TORANAM */
  function toranam(count = 14) {
    const W = count * 40;
    const lg = id("leaf"),
      mg = id("mari");
    let items = "";
    for (let i = 0; i < count; i++) {
      const x = 20 + i * 40;
      const sag = Math.sin((i / (count - 1)) * Math.PI) * 6;
      if (i % 3 === 1) {
        items += `<g class="sway" style="transform-origin:${x}px ${12 + sag}px;animation-delay:${(i % 5) * -0.7}s">
          <line x1="${x}" y1="${12 + sag}" x2="${x}" y2="${34 + sag}" stroke="#5c4320" stroke-width="1"/>
          ${marigold(x, 44 + sag, 11, mg)}${marigold(x, 66 + sag, 8, mg)}</g>`;
      } else {
        const len = 64 + (i % 2) * 10;
        items += `<g class="sway" style="transform-origin:${x}px ${12 + sag}px;animation-delay:${(i % 4) * -0.9}s">
          <path d="M${x} ${12 + sag}c-12 14-12 ${len - 26}-0 ${len}c12-${26} 12-${len - 14} 0-${len}z" fill="url(#${lg})"/>
          <path d="M${x} ${14 + sag}v${len - 4}" stroke="#16331f" stroke-width=".8" opacity=".7"/></g>`;
      }
    }
    return `<svg class="toranam-svg" viewBox="0 0 ${W} 100" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <defs>
        <linearGradient id="${lg}" x1="0" x2="1"><stop offset="0" stop-color="#1d4a2c"/><stop offset=".5" stop-color="#3f7a45"/><stop offset="1" stop-color="#21502f"/></linearGradient>
        <radialGradient id="${mg}" cx=".4" cy=".35"><stop offset="0" stop-color="#ffd166"/><stop offset=".55" stop-color="#f39a1e"/><stop offset="1" stop-color="#c25a0e"/></radialGradient>
      </defs>
      <path d="M0 10 Q${W / 2} 26 ${W} 10" stroke="#c6a15b" stroke-width="3" fill="none"/>
      <path d="M0 13 Q${W / 2} 29 ${W} 13" stroke="#7a5a26" stroke-width="1" fill="none"/>
      ${items}</svg>`;
  }

  function marigold(cx, cy, r, grad) {
    let petals = "";
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      petals += `<circle cx="${r2(cx + Math.cos(a) * r * 0.55)}" cy="${r2(cy + Math.sin(a) * r * 0.55)}" r="${r2(r * 0.52)}"/>`;
    }
    return `<g class="marigold" fill="url(#${grad})">${petals}<circle cx="${cx}" cy="${cy}" r="${r2(r * 0.55)}" fill="#e07a10"/></g>`;
  }

  /* ------------------------------------------------- JASMINE GARLAND SWAG */
  function garlandSwag(swags = 4) {
    const seg = 250,
      W = swags * seg;
    let out = "";
    const mg = id("mari");
    for (let s = 0; s < swags; s++) {
      const x0 = s * seg,
        x1 = x0 + seg,
        depth = 70;
      const pts = 26;
      for (let i = 0; i <= pts; i++) {
        const t = i / pts;
        const x = x0 + (x1 - x0) * t;
        const y = 8 + depth * 4 * t * (1 - t);
        out += i % 6 === 3 ? `<circle cx="${r2(x)}" cy="${r2(y)}" r="6.5" fill="url(#${mg})"/>` : `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="4.6" ry="3.6" fill="#fffaf0" stroke="#e9dcc0" stroke-width=".6"/>`;
      }
      // hanging tassel at each joint
      out += `<g class="sway" style="transform-origin:${x0}px 8px;animation-delay:${-s * 0.8}s">${tassel(x0, 8)}</g>`;
    }
    out += `<g class="sway" style="transform-origin:${W}px 8px">${tassel(W, 8)}</g>`;
    return `<svg class="garland-svg" viewBox="0 -4 ${W} 170" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <defs><radialGradient id="${mg}" cx=".4" cy=".35"><stop offset="0" stop-color="#ffd166"/><stop offset=".6" stop-color="#f08a12"/><stop offset="1" stop-color="#b8500c"/></radialGradient></defs>${out}</svg>`;
  }
  function tassel(x, y) {
    let b = "";
    for (let i = 0; i < 12; i++) b += `<ellipse cx="${x}" cy="${y + 8 + i * 9}" rx="3.6" ry="4.4" fill="#fffaf0" stroke="#e9dcc0" stroke-width=".5"/>`;
    return `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 120}" stroke="#7a9a5a" stroke-width=".8"/>${b}<circle cx="${x}" cy="${y + 128}" r="7" fill="#c0392b"/><circle cx="${x}" cy="${y + 128}" r="3" fill="#ffcf6b"/>`;
  }

  /* Vertical jasmine strand (hangs from top of hero) */
  function strand(len = 18) {
    let b = "";
    for (let i = 0; i < len; i++) {
      b += i % 7 === 6
        ? `<circle cx="10" cy="${10 + i * 11}" r="6" fill="#e8851a"/><circle cx="10" cy="${10 + i * 11}" r="2.5" fill="#ffd36e"/>`
        : `<ellipse cx="10" cy="${10 + i * 11}" rx="4.5" ry="5.2" fill="#fffaf0" stroke="#e5d6b6" stroke-width=".6"/>`;
    }
    return `<svg class="strand-svg" viewBox="0 0 20 ${len * 11 + 26}" aria-hidden="true"><line x1="10" y1="0" x2="10" y2="${len * 11 + 6}" stroke="#6f8f52" stroke-width=".8"/>${b}<path d="M10 ${len * 11 + 6}l-5 14h10z" fill="#c6a15b"/></svg>`;
  }

  /* ----------------------------------------------------------- GOPURAM */
  function gopuram() {
    let g = "";
    const cx = 200;
    // base walls + entrance
    g += `<path class="draw" pathLength="1" d="M40 520V420h320v100"/>`;
    g += `<path class="draw" pathLength="1" d="M168 520V462q32-34 64 0v58"/>`;
    g += `<path class="draw" pathLength="1" d="M30 420h340M36 412h328"/>`;
    for (let i = 0; i < 6; i++) g += `<path class="draw" pathLength="1" d="M${60 + i * 18} 510v-70M${340 - i * 18} 510v-70"/>`;
    // tiers
    let y = 412;
    const tiers = 7;
    for (let t = 0; t < tiers; t++) {
      const w = 312 - t * 36,
        h = 40 - t * 2,
        x0 = cx - w / 2,
        x1 = cx + w / 2;
      const inset = 9;
      g += `<path class="draw" pathLength="1" d="M${x0} ${y}L${x0 + inset} ${y - h}H${x1 - inset}L${x1} ${y}"/>`;
      g += `<path class="draw" pathLength="1" d="M${x0 + inset - 4} ${y - h}H${x1 - inset + 4}"/>`;
      const niches = Math.max(1, Math.floor((w - 30) / 28));
      const sp = (w - 2 * inset - 8) / niches;
      for (let n = 0; n < niches; n++) {
        const nx = x0 + inset + 4 + sp * n + sp / 2;
        g += `<path class="draw" pathLength="1" d="M${r2(nx - 6)} ${y - 4}v${-(h - 18)}q6-8 12 0v${h - 18}"/>`;
      }
      y -= h;
    }
    // shala vault + kalasams
    g += `<path class="draw" pathLength="1" d="M128 ${y}q72-60 144 0"/><path class="draw" pathLength="1" d="M140 ${y}q60-44 120 0"/>`;
    g += `<path class="draw" pathLength="1" d="M128 ${y}c-14 0-18-12-10-20M272 ${y}c14 0 18-12 10-20"/>`;
    for (let k = 0; k < 5; k++) {
      const kx = 152 + k * 24,
        ky = y - 38 + Math.abs(k - 2) * 6;
      g += `<path class="draw" pathLength="1" d="M${kx - 5} ${ky}q5-12 10 0q-5 6-10 0M${kx} ${ky - 9}v-8"/>`;
    }
    return `<svg class="gopuram-svg" viewBox="0 60 400 465" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round">${g}</g></svg>`;
  }

  /* --------------------------------------------------- ORNAMENTAL DIVIDER */
  function divider() {
    return `<svg class="divider-svg" viewBox="0 0 400 40" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
      <path class="draw" pathLength="1" d="M8 20H150"/><path class="draw" pathLength="1" d="M392 20H250"/>
      <path class="draw" pathLength="1" d="M150 20c10-12 22-12 30-2M250 20c-10-12-22-12-30-2"/>
      <path class="draw" pathLength="1" d="M150 20c10 12 22 12 30 2M250 20c-10 12-22 12-30 2"/>
      <path class="draw" pathLength="1" d="M200 4c-10 8-14 12-14 16s4 8 14 16c10-8 14-12 14-16s-4-8-14-16z"/>
      <path class="draw" pathLength="1" d="M200 12c-4 4-6 6-6 8s2 4 6 8c4-4 6-6 6-8s-2-4-6-8z"/></g>
      <g fill="currentColor"><circle cx="120" cy="20" r="2"/><circle cx="280" cy="20" r="2"/><circle cx="96" cy="20" r="1.4"/><circle cx="304" cy="20" r="1.4"/><circle cx="183" cy="20" r="1.8"/><circle cx="217" cy="20" r="1.8"/></g></svg>`;
  }

  /* ------------------------------------------------------ FLORAL CORNER */
  function corner() {
    return `<svg class="corner-svg" viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round">
      <path class="draw" pathLength="1" d="M4 96V20Q4 4 20 4h76"/>
      <path class="draw" pathLength="1" d="M10 96V26Q10 10 26 10h70"/>
      <path class="draw" pathLength="1" d="M18 60c0-22 10-38 34-42"/>
      <path class="draw" pathLength="1" d="M22 40c8 2 12 8 10 16-8-2-12-8-10-16zM40 22c2 8 8 12 16 10-2-8-8-12-16-10z"/>
      <path class="draw" pathLength="1" d="M28 28c-6-6-6-12 0-16 6 4 6 10 0 16zM28 28c6 6 12 6 16 0-4-6-10-6-16 0z"/>
      <path class="draw" pathLength="1" d="M18 70c4 4 4 9 0 13-4-4-4-9 0-13zM70 18c4 4 9 4 13 0-4-4-9-4-13 0z"/></g>
      <g fill="currentColor"><circle cx="28" cy="28" r="2.4"/><circle cx="18" cy="90" r="1.6"/><circle cx="90" cy="18" r="1.6"/></g></svg>`;
  }

  /* ------------------------------------------------------- KALASHAM */
  function kalasham() {
    const g = id("brass"),
      lg = id("leaf");
    let leaves = "";
    [-62, -38, -14, 14, 38, 62].forEach((a, i) => {
      leaves += `<path transform="rotate(${a} 60 58)" d="M60 58c-7-10-7-26 0-38 7 12 7 28 0 38z" fill="url(#${lg})"/>`;
    });
    return `<svg class="kalasham-svg" viewBox="0 0 120 140" aria-hidden="true"><defs>${brassDefs(g)}
      <linearGradient id="${lg}" x1="0" x2="1"><stop offset="0" stop-color="#1f4a2c"/><stop offset=".5" stop-color="#4b8a4f"/><stop offset="1" stop-color="#1f4a2c"/></linearGradient></defs>
      ${leaves}
      <ellipse cx="60" cy="40" rx="15" ry="19" fill="#8a5a2b"/><path d="M50 30q10-8 20 0" stroke="#5a3a1a" fill="none"/>
      <path d="M60 30v12" stroke="#c0392b" stroke-width="3"/><circle cx="60" cy="47" r="2.4" fill="#f2c94c"/>
      <path d="M44 60h32v8H44z" fill="url(#${g})"/>
      <path d="M46 68c-24 8-30 46 0 60h28c30-14 24-52 0-60z" fill="url(#${g})" stroke="#4a3514" stroke-width=".6"/>
      <path d="M36 92h48M38 102h44" stroke="#a52a2a" stroke-width="2.4"/>
      <circle cx="60" cy="97" r="4" fill="#a52a2a"/><circle cx="60" cy="97" r="1.6" fill="#f2c94c"/></svg>`;
  }

  /* ------------------------------------- GANESHA IDOL (seated, golden) */
  function ganesha() {
    const P = id("gn");
    const g=`${P}-g`, r=`${P}-r`, v=`${P}-v`, l=`${P}-l`;
    const OL='#5d441b';
    const arm=(d)=>`<path d="${d}" stroke="${OL}" stroke-width="11.5" fill="none" stroke-linecap="round"/><path d="${d}" stroke="url(#${g})" stroke-width="9" fill="none" stroke-linecap="round"/>`;
    let aura='';
    for(let a=180;a<=360;a+=12){const t=a*Math.PI/180;aura+=`<circle cx="${(100+Math.cos(t)*80).toFixed(1)}" cy="${(122+Math.sin(t)*80).toFixed(1)}" r="3.4" fill="url(#${g})" stroke="${OL}" stroke-width=".5"/>`;}
    let lotusBack='',lotusFront='';
    for(let i=0;i<8;i++){const x=56+i*12.6;lotusBack+=`<path d="M${x-8} 214Q${x-8} 200 ${x} 194Q${x+8} 200 ${x+8} 214Z"/>`;}
    for(let i=0;i<9;i++){const x=50+i*12.5;lotusFront+=`<path d="M${x-8} 224Q${x-9} 213 ${x} 208Q${x+9} 213 ${x+8} 224Z"/>`;}
    return `<svg class="ganesha-svg" viewBox="16 22 168 220" role="img" aria-label="Lord Ganesha">
    <defs>
      <linearGradient id="${g}" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#f6e3a8"/><stop offset=".45" stop-color="#d4ae62"/><stop offset="1" stop-color="#8a6a2c"/></linearGradient>
      <radialGradient id="${r}" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#fbedc2"/><stop offset=".5" stop-color="#d9b46a"/><stop offset="1" stop-color="#8a6a2c"/></radialGradient>
      <linearGradient id="${v}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#c0392b"/><stop offset="1" stop-color="#7a1f24"/></linearGradient>
      <linearGradient id="${l}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f2a3a0"/><stop offset="1" stop-color="#b8433f"/></linearGradient>
    </defs>
    <!-- prabhavali (aura arch) -->
    <path d="M24 216V122A76 76 0 0 1 176 122V216" fill="none" stroke="url(#${g})" stroke-width="3"/>
    <path d="M34 216V124A66 66 0 0 1 166 124V216" fill="none" stroke="#c6a15b" stroke-width="1" stroke-dasharray="2 4" stroke-linecap="round"/>
    ${aura}
    <!-- lotus seat (back row) -->
    <g fill="url(#${l})" stroke="#8a2a2a" stroke-width=".6">${lotusBack}</g>
    <!-- ears -->
    <g stroke="${OL}" stroke-width="1"><path d="M81 80C63 66 42 72 42 92C42 110 58 121 79 109Z" fill="url(#${r})"/><path d="M119 80C137 66 158 72 158 92C158 110 142 121 121 109Z" fill="url(#${r})"/></g>
    <g fill="none" stroke="#a52a2a" stroke-width="1.4"><path d="M78 86C66 78 52 82 52 93C52 104 62 110 76 104"/><path d="M122 86C134 78 148 82 148 93C148 104 138 110 124 104"/></g>
    <g fill="#a52a2a">${[[50,98],[56,108],[150,98],[144,108],[48,88],[152,88]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.5"/>`).join('')}</g>
    <!-- upper arms with ankusha & pasha -->
    ${arm("M78 132C62 132 44 126 38 112")}${arm("M122 132C138 132 156 126 162 112")}
    <path d="M34 114L29 76" stroke="${OL}" stroke-width="2.2" stroke-linecap="round"/><path d="M29 76C24 70 30 64 36 68" fill="none" stroke="${OL}" stroke-width="2.2" stroke-linecap="round"/><path d="M29 76l-4-6 5 1z" fill="${OL}"/>
    <ellipse cx="166" cy="90" rx="7" ry="11" fill="none" stroke="#a52a2a" stroke-width="2"/><path d="M166 101C169 108 167 112 164 114" fill="none" stroke="#a52a2a" stroke-width="2"/>
    <circle cx="37" cy="108" r="5.5" fill="url(#${r})" stroke="${OL}"/><circle cx="163" cy="108" r="5.5" fill="url(#${r})" stroke="${OL}"/>
    <!-- torso -->
    <path d="M74 126C68 140 68 152 72 162H128C132 152 132 140 126 126C114 119 86 119 74 126Z" fill="url(#${r})" stroke="${OL}" stroke-width="1"/>
    <!-- lower arms: blessing hand & modak bowl -->
    ${arm("M76 142C66 154 62 168 64 180")}${arm("M124 142C134 154 138 166 136 176")}
    <ellipse cx="64" cy="186" rx="7" ry="9" fill="url(#${r})" stroke="${OL}"/><circle cx="64" cy="186" r="2" fill="#a52a2a"/>
    <path d="M60 177h8M132 172h8M70 148l-6 6M130 148l6 6" stroke="#a52a2a" stroke-width="2"/>
    <!-- seated legs with silk dhoti -->
    <path d="M54 202C54 186 80 180 100 186C120 180 146 186 146 200C146 212 122 214 100 210C78 214 54 212 54 202Z" fill="url(#${v})" stroke="${OL}" stroke-width="1"/>
    <path d="M60 204C78 198 122 198 140 204" fill="none" stroke="#e9d29a" stroke-width="1.6" stroke-dasharray="3 3"/>
    <ellipse cx="74" cy="206" rx="9" ry="4.5" fill="url(#${r})" stroke="${OL}" stroke-width=".8"/><ellipse cx="128" cy="204" rx="9" ry="4.5" fill="url(#${r})" stroke="${OL}" stroke-width=".8"/>
    <!-- belly -->
    <ellipse cx="100" cy="166" rx="31" ry="28" fill="url(#${r})" stroke="${OL}" stroke-width="1"/>
    <path d="M71 168Q100 182 129 168" fill="none" stroke="url(#${v})" stroke-width="4"/>
    <circle cx="100" cy="166" r="2.2" fill="${OL}"/>
    <!-- modak bowl -->
    <path d="M122 178H150C150 187 142 192 136 192C130 192 122 187 122 178Z" fill="url(#${g})" stroke="${OL}"/>
    ${[[129,174],[136,171],[143,174]].map(([x,y])=>`<path d="M${x-5} ${y+4}C${x-5} ${y-2} ${x} ${y-6} ${x} ${y-7}C${x} ${y-6} ${x+5} ${y-2} ${x+5} ${y+4}Z" fill="#fbf1dc" stroke="${OL}" stroke-width=".6"/>`).join('')}
    <!-- sacred thread & necklaces -->
    <path d="M82 124Q98 158 126 182" fill="none" stroke="#fff3d6" stroke-width="1.1" opacity=".8"/>
    <path d="M80 127Q100 146 120 127" fill="none" stroke="#a52a2a" stroke-width="2.4"/>
    <path d="M77 127Q100 158 123 127" fill="none" stroke="url(#${g})" stroke-width="2" stroke-dasharray=".1 4.2" stroke-linecap="round"/>
    <circle cx="100" cy="150" r="3.6" fill="#a52a2a" stroke="#e9d29a"/>
    <!-- head -->
    <ellipse cx="100" cy="94" rx="21" ry="19" fill="url(#${r})" stroke="${OL}" stroke-width="1"/>
    <!-- kireetam (crown) -->
    <g fill="url(#${g})" stroke="${OL}" stroke-width=".9" stroke-linejoin="round">
      <path d="M76 80H124L120 70H80Z"/><path d="M83 70H117L112 58H88Z"/><path d="M89 58H111L106 47H94Z"/><path d="M94 47H106L100 34Z"/>
    </g>
    <circle cx="100" cy="32" r="3" fill="#a52a2a" stroke="#e9d29a"/>
    <g fill="#a52a2a">${[[100,75],[88,75],[112,75],[100,64],[100,52.5]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.1"/>`).join('')}</g>
    <path d="M80 70H120M84 58H116" stroke="#fff3c4" stroke-width=".6"/>
    <!-- face -->
    <path d="M100 82V89" stroke="#c0392b" stroke-width="2.4" stroke-linecap="round"/><circle cx="100" cy="91.5" r="1.3" fill="#c0392b"/>
    <path d="M86 94Q91 89 96 94Q91 96 86 94Z M104 94Q109 89 114 94Q109 96 104 94Z" fill="#2a1a10"/>
    <path d="M85 90Q91 86 96 89M104 89Q109 86 115 90" stroke="${OL}" stroke-width=".8" fill="none"/>
    <!-- trunk -->
    <path d="M100 100C99 114 95 126 99 136C103 145 114 145 117 137C118 131 113 128 109 131" stroke="${OL}" stroke-width="12.5" fill="none" stroke-linecap="round"/>
    <path d="M100 100C99 114 95 126 99 136C103 145 114 145 117 137C118 131 113 128 109 131" stroke="url(#${r})" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M95 108h9M94 115h9M95 122h8" stroke="${OL}" stroke-width=".7" opacity=".7"/>
    <path d="M90 103C85 108 84 113 86 117C89 113 92 109 94 106Z" fill="#fffaf0" stroke="${OL}" stroke-width=".7"/>
    <!-- lotus seat (front row) + pedestal -->
    <g fill="url(#${l})" stroke="#8a2a2a" stroke-width=".6">${lotusFront}</g>
    <path d="M40 224H160L154 234H46Z" fill="url(#${g})" stroke="${OL}" stroke-width=".8"/>
    <path d="M46 234H154V239H46Z" fill="#8a6a2c"/>
    </svg>`;
  }

  /* ------------------------------------------------------- TEMPLE BELL */
  function bell() {
    const g = id("brass");
    return `<svg class="bell-svg" viewBox="0 0 60 110" aria-hidden="true"><defs>${brassDefs(g)}</defs>
      <g fill="none" stroke="#c6a15b" stroke-width="1.6">${[0, 1, 2, 3].map((i) => `<ellipse cx="30" cy="${6 + i * 9}" rx="3" ry="5"/>`).join("")}</g>
      <g class="bell-body" style="transform-origin:30px 40px"><path d="M30 40c-12 0-16 10-16 24 0 12-4 18-8 22h48c-4-4-8-10-8-22 0-14-4-24-16-24z" fill="url(#${g})" stroke="#4a3514" stroke-width=".6"/>
      <rect x="4" y="85" width="52" height="5" rx="2" fill="url(#${g})"/><circle cx="30" cy="97" r="5" fill="url(#${g})"/>
      <path d="M18 66h24" stroke="#5d441b" stroke-width="1"/><circle cx="30" cy="38" r="3.4" fill="url(#${g})"/></g></svg>`;
  }

  /* ----------------------------------------------- DOOR ROSETTE (carving) */
  function rosette() {
    let petals = "";
    for (let i = 0; i < 8; i++) petals += `<path transform="rotate(${i * 45} 50 50)" d="M50 50c-7-8-7-22 0-32 7 10 7 24 0 32z"/>`;
    let inner = "";
    for (let i = 0; i < 8; i++) inner += `<path transform="rotate(${i * 45 + 22.5} 50 50)" d="M50 50c-4-5-4-13 0-19 4 6 4 14 0 19z"/>`;
    return `<svg class="rosette-svg" viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="50" cy="50" r="44"/><circle cx="50" cy="50" r="38" stroke-dasharray="1 4" stroke-linecap="round" stroke-width="2.4"/>${petals}${inner}<circle cx="50" cy="50" r="6"/></g></svg>`;
  }

  /* ----------------------------------------------- MANDAPAM (venue art) */
  function mandapam() {
    const g = id("brass"),
      lf = id("ban");
    const pillar = (x) => `<g><rect x="${x - 7}" y="96" width="14" height="128" fill="#f4e8d0" stroke="#c6a15b"/>
      <rect x="${x - 11}" y="92" width="22" height="8" fill="url(#${g})"/><rect x="${x - 11}" y="220" width="22" height="10" fill="url(#${g})"/>
      <path d="M${x - 7} 130h14M${x - 7} 170h14" stroke="#c6a15b"/><circle cx="${x}" cy="150" r="4" fill="none" stroke="#c6a15b"/></g>`;
    const banana = (x, flip) => `<g transform="translate(${x} 0) scale(${flip} 1)">
      <rect x="-3" y="120" width="6" height="110" fill="#5d7d3c"/>
      <path d="M0 130c-30-10-46-40-44-70 16 16 30 40 44 70z" fill="url(#${lf})"/>
      <path d="M0 140c26-14 40-46 34-78-14 20-26 46-34 78z" fill="url(#${lf})"/>
      <path d="M0 125c-6-30 0-60 14-84 6 30 2 58-14 84z" fill="url(#${lf})"/></g>`;
    let kal = "";
    [140, 200, 260].forEach((x, i) => (kal += `<path d="M${x - 8} ${i === 1 ? 36 : 44}q8-18 16 0q-8 8-16 0z" fill="url(#${g})"/><path d="M${x} ${i === 1 ? 26 : 34}v-8" stroke="#c6a15b"/>`));
    return `<svg class="mandapam-svg" viewBox="0 0 400 240" aria-hidden="true"><defs>${brassDefs(g)}
      <linearGradient id="${lf}" x1="0" x2="1"><stop offset="0" stop-color="#2d5e34"/><stop offset="1" stop-color="#5f9a4e"/></linearGradient></defs>
      ${banana(38, 1)}${banana(362, -1)}
      <path d="M90 92L120 50h160l30 42z" fill="#641d2b" stroke="#c6a15b" stroke-width="1.5"/>
      <path d="M104 74h192" stroke="#c6a15b" stroke-dasharray="2 5" stroke-linecap="round" stroke-width="2"/>
      ${kal}
      <path d="M100 92h200" stroke="#c6a15b" stroke-width="3"/>
      ${pillar(112)}${pillar(162)}${pillar(238)}${pillar(288)}
      <path d="M112 104q38 26 50 0q38 30 76 0q12 26 50 0" fill="none" stroke="#f08a12" stroke-width="5" stroke-dasharray="1 6" stroke-linecap="round"/>
      <rect x="80" y="230" width="240" height="8" fill="url(#${g})"/></svg>`;
  }

  /* ----------------------------------------------- KASU MALA (coin chain) */
  function coinChain(n = 15) {
    const g = id("brass");
    let c = "";
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1),
        x = 10 + t * 280,
        y = 8 + 26 * 4 * t * (1 - t);
      c += `<circle cx="${r2(x)}" cy="${r2(y)}" r="${i === (n - 1) / 2 ? 9 : 6}" fill="url(#${g})" stroke="#5d441b" stroke-width=".5"/><circle cx="${r2(x)}" cy="${r2(y)}" r="2" fill="none" stroke="#5d441b" stroke-width=".5"/>`;
    }
    return `<svg class="coin-svg" viewBox="0 0 300 50" aria-hidden="true"><defs>${brassDefs(g)}</defs>
      <path d="M10 8Q150 60 290 8" fill="none" stroke="#c6a15b"/>${c}</svg>`;
  }

  /* ------------------------------------------------------ EVENT ICONS */
  const icons = {
    kalasham: () => kalasham(),
    turmeric: () => `<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M8 32h48c0 14-10 22-24 22S8 46 8 32z"/><path d="M14 32c2-6 10-8 18-8s16 2 18 8"/><path d="M26 54l-4 6h20l-4-6"/><path d="M44 14c6 0 10 4 10 8M48 8c4 2 6 6 6 10"/></g><ellipse cx="32" cy="30" rx="16" ry="4" fill="#e6b422"/></svg>`,
    mehendi: () => `<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M14 50L44 10l8 6-30 38z"/><path d="M14 50l-4 8 8-4"/><path d="M30 46c6-2 12 0 14 6M36 40c8-2 14 2 16 8"/><circle cx="46" cy="50" r="3"/></g><path d="M44 10l8 6 4-6-8-6z" fill="currentColor"/></svg>`,
    veena: () => `<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="46" cy="44" r="12"/><circle cx="14" cy="16" r="6"/><path d="M18 20l20 16M20 18l22 18"/><path d="M38 36l14 14"/><path d="M8 10c2-4 6-4 8-2"/></g><circle cx="46" cy="44" r="4" fill="currentColor"/></svg>`,
    lamp: () => `<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M10 40c6 10 38 10 44 0-8-4-36-4-44 0z"/><path d="M54 40l6-4"/><path d="M26 54h12M32 48v6"/></g><path class="mini-flame" d="M56 34c-4-4-4-10 0-16 4 6 4 12 0 16z" fill="#f4a72a"/></svg>`,
    garland: () => `<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="currentColor">${Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return `<circle cx="${r2(32 + Math.cos(a) * 20)}" cy="${r2(30 + Math.sin(a) * 20)}" r="${i % 4 === 0 ? 4 : 2.6}" ${i % 4 === 0 ? 'fill="#e8851a"' : ""}/>`; }).join("")}</g><path d="M32 50v10" stroke="currentColor" stroke-width="1.6"/><circle cx="32" cy="60" r="3" fill="#a52a2a"/></svg>`,
    bangles: () => `<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke-width="3">${[0, 1, 2, 3, 4].map((i) => `<ellipse cx="32" cy="${20 + i * 6}" rx="20" ry="7" stroke="${i % 2 ? "#c6a15b" : "#2f7d4a"}"/>`).join("")}</g></svg>`,
  };

  /* ------------------------------------------- TRADITION ILLUSTRATIONS */
  const traditions = {
    jeelakarra: () => `<svg viewBox="0 0 160 140" aria-hidden="true">
      <path d="M80 128C40 104 22 70 34 42c8-18 30-22 46-6 16-16 38-12 46 6 12 28-6 62-46 86z" fill="#3f7a45" stroke="#c6a15b" stroke-width="1.5"/>
      <path d="M80 36v90M80 60l-24-14M80 80l-28-12M80 60l24-14M80 80l28-12" stroke="#254c39" stroke-width="1.2" fill="none"/>
      <ellipse cx="80" cy="74" rx="22" ry="13" fill="#8b5a2b"/><ellipse cx="80" cy="70" rx="15" ry="8" fill="#a8743a"/>
      ${Array.from({ length: 14 }, (_, i) => `<ellipse cx="${66 + (i * 7) % 28}" cy="${66 + Math.floor(i / 4) * 4}" rx="1.8" ry=".8" fill="#4a3014" transform="rotate(${i * 37} ${66 + (i * 7) % 28} ${66 + Math.floor(i / 4) * 4})"/>`).join("")}
      <g class="tw" fill="#f3dfa6"><circle cx="40" cy="22" r="2"/><circle cx="124" cy="26" r="1.6"/><circle cx="132" cy="96" r="1.4"/></g></svg>`,
    kanyadanam: () => `<svg viewBox="0 0 160 140" aria-hidden="true">
      <g transform="rotate(-28 60 50)"><path d="M40 34c-16 6-20 34 0 44h32c20-10 16-38 0-44z" fill="#c6a15b" stroke="#6e5222"/><rect x="46" y="26" width="20" height="9" fill="#d9b874"/><path d="M72 50l26-8-4 8-20 10" fill="#c6a15b" stroke="#6e5222"/></g>
      <path class="stream" d="M104 56c2 20 0 40-2 58" stroke="#9ed6e8" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-dasharray="6 6"/>
      <ellipse cx="102" cy="122" rx="30" ry="8" fill="none" stroke="#c6a15b" stroke-width="1.5"/>
      <path d="M78 120c6 10 42 10 48 0" fill="#a8743a"/>
      <g fill="#f08a12"><circle cx="20" cy="118" r="5"/><circle cx="32" cy="124" r="4"/><circle cx="140" cy="20" r="4"/></g></svg>`,
    mangalyam: () => `<svg viewBox="0 0 160 140" aria-hidden="true">
      <path d="M22 20c10 70 30 96 58 96s48-26 58-96" fill="none" stroke="#e6b422" stroke-width="3"/>
      <path d="M22 20c10 70 30 96 58 96s48-26 58-96" fill="none" stroke="#fff3c4" stroke-width="1" stroke-dasharray="2 4"/>
      ${[48, 112].map((x) => `<g><circle cx="${x}" cy="${x < 80 ? 92 : 92}" r="12" fill="#d9b874" stroke="#6e5222"/><circle cx="${x}" cy="92" r="7" fill="none" stroke="#6e5222"/><circle cx="${x}" cy="92" r="2.2" fill="#a52a2a"/></g>`).join("")}
      ${[64, 80, 96].map((x) => `<circle cx="${x}" cy="114" r="3.6" fill="#a52a2a" stroke="#e6b422"/>`).join("")}
      <circle cx="80" cy="126" r="5" fill="#c6a15b"/></svg>`,
    talambralu: () => `<svg viewBox="0 0 160 140" aria-hidden="true">
      <path d="M30 120c10-30 90-30 100 0z" fill="#e6b422"/>
      ${Array.from({ length: 40 }, (_, i) => { const x = 36 + (i * 37) % 90, y = 96 + (i * 13) % 22; return `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.2" fill="#f7d26b" transform="rotate(${i * 41} ${x} ${y})"/>`; }).join("")}
      <g class="falling">${Array.from({ length: 18 }, (_, i) => { const x = 30 + (i * 53) % 100, y = 14 + (i * 29) % 66; return `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.2" fill="#f7d26b" transform="rotate(${i * 67} ${x} ${y})"/>`; }).join("")}
      ${[44, 92, 120, 70].map((x, i) => `<circle cx="${x}" cy="${24 + i * 14}" r="2.6" fill="#fffaf0"/>`).join("")}</g></svg>`,
    saptapadi: () => `<svg viewBox="0 0 160 140" aria-hidden="true">
      <path d="M66 96h28l-6 18H72z" fill="#a52a2a" stroke="#c6a15b"/>
      <path class="agni" d="M80 94c-12-8-10-22 0-32 2 8 8 8 8 16 4-4 4-8 2-12 8 8 8 22-10 28z" fill="#f4a72a"/>
      <path d="M80 92c-5-4-4-10 0-14 3 4 5 8 0 14z" fill="#fff3c4"/>
      ${Array.from({ length: 7 }, (_, i) => { const a = Math.PI * (0.92 + i * 0.193); const x = 80 + Math.cos(a) * 58, y = 80 + Math.sin(a) * 46; return `<g class="step" style="--i:${i}" transform="translate(${r2(x)} ${r2(y)}) rotate(${r2((a * 180) / Math.PI + 90)})"><ellipse rx="5" ry="8" fill="#c6a15b"/><circle cx="-3" cy="-11" r="1.6" fill="#c6a15b"/><circle cx="1" cy="-12" r="1.6" fill="#c6a15b"/><circle cx="4.5" cy="-10" r="1.4" fill="#c6a15b"/></g>`; }).join("")}</svg>`,
    arundhati: () => `<svg viewBox="0 0 160 140" aria-hidden="true">
      <circle cx="80" cy="70" r="62" fill="#1b2240" stroke="#c6a15b" stroke-width="1.5"/>
      ${[[38, 40, 1.2], [52, 96, 1], [120, 44, 1.4], [112, 104, 1], [64, 30, 0.9], [96, 118, 0.8], [130, 76, 1.1]].map(([x, y, r]) => `<circle class="tw" cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`).join("")}
      <path d="M44 84l18-10 16 4 14-12 22 6" stroke="#c6a15b" stroke-width=".7" stroke-dasharray="2 3" fill="none"/>
      <g class="pair"><circle cx="92" cy="66" r="4" fill="#fff3c4"/><circle cx="92" cy="66" r="10" fill="#fff3c4" opacity=".18"/><circle cx="101" cy="60" r="2" fill="#bfe3ff"/><circle cx="101" cy="60" r="6" fill="#bfe3ff" opacity=".2"/></g>
      <path d="M36 112a18 18 0 1 0 14-28 14 14 0 1 1-14 28z" fill="#f3dfa6" opacity=".9"/></svg>`,
  };

  /* -------------------------------------------- placeholder portrait */
  function portraitPlaceholder(initial, tone) {
    return `<svg class="portrait-ph" viewBox="0 0 300 380" role="img" aria-label="Portrait placeholder — photograph coming soon">
      <rect width="300" height="380" fill="${tone}"/>
      <g fill="none" stroke="#c6a15b" stroke-width="1" opacity=".5">${Array.from({ length: 6 }, (_, i) => `<circle cx="150" cy="170" r="${40 + i * 22}"/>`).join("")}</g>
      <text x="150" y="196" text-anchor="middle" font-family="Cinzel, serif" font-size="92" fill="#c6a15b">${initial}</text>
      <text x="150" y="300" text-anchor="middle" font-family="Cormorant Garamond, serif" font-style="italic" font-size="20" fill="#f4e8d0" opacity=".8">photograph coming soon</text></svg>`;
  }

  window.ORNAMENTS = {
    kolam, lamp, toranam, garlandSwag, strand, gopuram, divider, corner, kalasham, ganesha, bell, rosette, mandapam, coinChain, icons, traditions, portraitPlaceholder,
  };

  /* Garlands & toranams fill any screen width: instead of stretching (which
     clipped them on wide desktops) they get more leaves / swags. */
  const FIT = {
    toranam: (w, h) => Math.max(6, Math.ceil(w / (40 * (h / 100))) + 1),
    garlandSwag: (w, h) => Math.max(2, Math.round(w / (250 * (h / 170)))),
  };
  const countFor = (el) => {
    const name = el.dataset.ornament;
    if (FIT[name] && el.clientWidth && el.clientHeight) return FIT[name](el.clientWidth, el.clientHeight);
    return el.dataset.count ? +el.dataset.count : undefined;
  };

  /* Hydrate every [data-ornament] placeholder in the markup */
  window.ORNAMENTS.hydrate = function (root = document) {
    root.querySelectorAll("[data-ornament]").forEach((el) => {
      const fn = window.ORNAMENTS[el.dataset.ornament];
      if (typeof fn !== "function") return;
      const n = countFor(el);
      el.dataset.drawn = n;
      el.innerHTML = fn(n);
    });
  };

  // Redraw the width-fitted ornaments when the screen size changes
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.querySelectorAll('[data-ornament="toranam"], [data-ornament="garlandSwag"]').forEach((el) => {
        const n = countFor(el);
        if (String(n) !== el.dataset.drawn) {
          el.dataset.drawn = n;
          el.innerHTML = window.ORNAMENTS[el.dataset.ornament](n);
        }
      });
    }, 250);
  }, { passive: true });
})();
