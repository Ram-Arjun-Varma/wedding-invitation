# Arjun & Alekhya — Wedding Invitation Website

A cinematic, mobile-first South Indian (Telugu) wedding invitation built with plain **HTML5, CSS3 and vanilla JavaScript**, plus GSAP, ScrollTrigger and Lenis from CDNs. There's no build step and no framework.

```
wedding-invitation/
├── index.html
├── css/        styles.css · animations.css · responsive.css
├── js/         config.js · ornaments.js · main.js · animations.js
│               countdown.js · gallery.js · audio.js · interactions.js
└── assets/
    ├── images/        og-image.jpg, favicons, placeholders/
    ├── audio/         (optional: your own music file)
    ├── illustrations/ (optional extra artwork)
    └── textures/      (optional extra textures)
```

## 1. Run it locally

You have two options:

- **Open it directly.** Double-click `index.html`. Everything works from disk, because the scripts are classic scripts rather than ES modules.
- **Run a local server** (recommended, and closer to production):
  ```bash
  cd wedding-invitation
  python3 -m http.server 8000      # then open http://localhost:8000
  # or: npx serve .
  ```

To test the mobile layout, open your browser's dev tools and turn on device emulation (iPhone or Pixel), or open the local server address on your phone over the same Wi-Fi.

## 2. Personalise everything in `js/config.js`

All names, dates, events, venues, photos, music and share text come from `window.WEDDING_CONFIG`. You don't need to edit the sections themselves.

| What | Where in config |
|---|---|
| Names, Telugu names, parents' names, short intros | `couple.groom` / `couple.bride` |
| Muhurtham date and time (drives the countdown) | `weddingDateTime` (e.g. `2027-02-11T10:30:00+05:30`) |
| Invitation wording | `invitation` |
| Main venue, address and map | `venue` |
| Ceremonies (Pellikuthuru, Haldi, Sangeet…) | `events[]`: set `enabled: false` to hide one |
| Gallery photos and categories | `gallery[]` |
| Background music | `music` |
| WhatsApp / share message | `share` |

**Placeholders.** Any text in `[square brackets]` is a placeholder for you to replace. No real addresses or family names have been made up.

**Maps and directions.** A Google Maps embed and the "Get Directions" and "Directions" buttons appear automatically once you fill in an `address` (or a `mapQuery`) for the venue or an event. Until then, guests see "Address to be shared soon".

**Calendar.** Every ceremony card has a working **Add to Calendar** link (Google Calendar). Times are always shown in IST.

### Photos

1. Export your photos as **WebP** or **AVIF** (JPG also works). About 1600 px on the long edge is plenty, and aim for under 300 KB each.
2. Put them in `assets/images/`.
3. Point the config at them:
   ```js
   groom: { photo: "assets/images/arjun.webp", ... }
   gallery: [{ src: "assets/images/engagement-1.webp", alt: "Exchanging rings at the engagement", category: "engagement", w: 4, h: 5 }, ...]
   ```
   `w` and `h` set the aspect ratio, which reserves space so nothing jumps while photos load. Gallery categories are `couple`, `engagement`, `prewedding`, `family` and `traditional`. A filter chip only appears for a category that has at least one photo.

### Music

By default the site plays a gentle **Mohanam veena-and-tanpura ambience** that is synthesised live in the browser (Web Audio API). It needs no audio file and has no licensing issues. The temple bell is synthesised the same way.

To use your own licensed recording (nadaswaram, flute, veena…), put an MP3 in `assets/audio/` and set:

```js
music: { src: "assets/audio/your-track.mp3", title: "Nadaswaram — Mangala Vadyam", defaultVolume: 0.5 }
```

Audio never autoplays. The bell rings only when a guest taps **Open the Invitation**, and music starts only when they tap the music button. A volume slider appears while music is playing.

## 3. Deploy to GitHub Pages (free)

1. Create a new GitHub repository, for example `wedding-invitation`.
2. Upload the **contents** of this folder (`index.html` must sit at the repository root).
   ```bash
   git init && git add . && git commit -m "Wedding invitation"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/wedding-invitation.git
   git push -u origin main
   ```
3. In the repository, go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, then select `main` and `/ (root)`, and click **Save**.
4. After a minute or so, the site is live at `https://YOUR-USERNAME.github.io/wedding-invitation/`.

**Other hosts** also work, with no configuration:
- **Netlify:** drag the folder onto <https://app.netlify.com/drop>.
- **Vercel:** run `npx vercel`.
- **Cloudflare Pages:** connect the repository.

### Make the WhatsApp preview work (important)

WhatsApp needs **absolute** URLs for the preview image. After deploying, open `index.html` and replace every `https://YOUR-SITE-URL/` with your real address, for example:

```html
<meta property="og:url"   content="https://your-username.github.io/wedding-invitation/" />
<meta property="og:image" content="https://your-username.github.io/wedding-invitation/assets/images/og-image.jpg" />
```

(There are three: `og:url`, `og:image` and `twitter:image`.)

WhatsApp caches previews. If you change the image later, share the link with `?v=2` added to the end to force a fresh preview.

## 4. What's inside

- **Scene flow.** Loader (kolam draws itself, bell rings silently, lamp lights) → carved temple doors with toranam, bells and brass lamps → hero → invitation card → couple → countdown → ceremonies timeline → traditions → venue → gallery → closing blessing.
- **Artwork.** The lamps, toranam, garlands, gopuram, kolam, kalasham, Ganesha motif, mandapam with banana plants, kasu-mala coin chain, peacock and zari borders are all procedural SVG drawn in `js/ornaments.js` and as CSS data-URI tiles. They stay crisp on any screen and add almost no download weight.
- **Motion.** GSAP drives the door opening, the hero title reveal and the scroll story. Lenis adds smooth wheel scrolling on desktop, while phones keep native touch scrolling. One shared `<canvas>` draws gold dust and jasmine, marigold and rose petals using pre-rendered sprites, with fewer particles on phones. It pauses when the tab is hidden.
- **Resilience.** If the CDNs are blocked, every section still appears, through an IntersectionObserver fallback.
- **Accessibility.** The site includes a skip link, semantic landmarks and headings, keyboard support everywhere (including arrow keys in the lightbox and traditions rail, and Esc to close), a focus trap in the lightbox, aria-pressed and aria-expanded states, and live regions. `prefers-reduced-motion` turns off particles and motion.
- **Mobile.** The layout uses `100svh`, safe-area insets for notched phones, touch targets of at least 44 px, swipeable traditions with scroll-snap, swipe, double-tap-to-zoom and drag-to-pan in the lightbox, and no horizontal overflow. It also works in landscape and on very small phones (320 px).
- **Sharing.** The **Share Invitation** button uses the native share sheet (Web Share API) and falls back to copying the link to the clipboard.

## 5. Customising the look

The colours, fonts and textures are CSS variables at the top of `css/styles.css`, such as `--maroon`, `--gold`, `--gold-metal`, `--f-display` and `--zari-tile`. The traditions text is in `js/interactions.js` (`TRADITIONS`).
