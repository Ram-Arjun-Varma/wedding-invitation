/* ==========================================================================
   WEDDING CONFIGURATION
   --------------------------------------------------------------------------
   Every name, date, venue, photo and event shown on the site comes from this
   one object. Edit the values below — you never need to touch the sections.

   • Text in [square brackets] is a placeholder: replace it with real details.
   • An event's "Directions" button and the venue map appear automatically as
     soon as you fill in its "address" (or "mapQuery").
   • Photos: drop files into assets/images/ and point "src" at them.
     WebP / AVIF / JPG all work. Leave "photo" empty to show the ornamental
     placeholder frame instead.
   ========================================================================== */

window.WEDDING_CONFIG = {
  couple: {
    groom: {
      name: "Arjun",
      teluguName: "అర్జున్",
      fullName: "Mudundi Ram Arjun Varma",
      photo: "assets/images/Arjun.jpeg", // e.g. "assets/images/arjun.webp"
      parents: "S/o Sri Mudundi Vasudeva Raju & Smt. Radhika Rani",
      intro:
        "Outgoing, active and endlessly curious — Arjun is an adventurer at heart, always ready for the next journey, the next challenge and the next good conversation.",
    },
    bride: {
      name: "Alekhya",
      teluguName: "అలేఖ్య",
      fullName: "Mudunuru Alekhya Varma",
      photo: "assets/images/Alekhya.jpeg", // e.g. "assets/images/alekhya.webp"
      parents: "D/o Late Sri Mudunuru Venkata Narayana Raju & Smt. Nagamani",
      intro:
        "Calm, reserved and brilliant — Alekhya brings a quiet strength and a sharp mind to everything she does, with a grace that puts everyone around her at ease.",
    },
  },

  // The sumuhurtham (the countdown counts down to this). Format: YYYY-MM-DDTHH:MM:SS+05:30 (IST)
  weddingDateTime: "2027-02-12T00:55:00+05:30",
  muhurthamDisplay: "Sumuhurtham · 12:55 AM IST, 12 February 2027 (night of 11 February)",
  weddingDateDisplay: "11 February 2027",
  weddingDateTelugu: "11 ఫిబ్రవరి 2027",

  hashtag: "#ArjunWedsAlekhya",

  invitation: {
    srirastu: "శ్రీరస్తు · శుభమస్తు · అవిఘ్నమస్తు",
    invocation: "ఓం శ్రీ గణేశాయ నమః",
    loaderBlessing: "With the blessings of Lord Sri Venkateswara",
    blessing: "", // optional opening line above the invitation; leave empty to hide
    invite: "We cordially invite you to join us in celebrating the wedding of",
    closing: "Your presence and blessings will make our special day even more memorable.",
    hosts: "With love and warm regards — Sri Mudundi Vasudeva Raju & Smt. Radhika Rani, Smt. Nagamani, and our families",
  },

  // Main venue (used in the Venue section)
  venue: {
    name: "Lee Paradise Convention",
    address: "100 Ft Ring Road, Near Ice Factory Junction, Vizianagaram, Andhra Pradesh",
    mapQuery: "Lee Paradise Convention, Vizianagaram, Andhra Pradesh 535002", // what Google Maps searches for
    note: "The wedding ceremony and the reception will both be held here. Assistance will be available for elders.",
    photo: "", // optional venue photograph, e.g. "assets/images/venue.webp"
  },

  /* Events — set "enabled: false" to hide one.
     icon options: kalasham, turmeric, mehendi, veena, lamp, garland, bangles
     (Haldi, Mehendi or Sangeet can be added back with icons turmeric / mehendi / veena) */
  events: [
    {
      enabled: false,
      name: "Pellikuthuru",
      telugu: "పెళ్లికూతురు",
      start: "2027-02-07T09:00:00+05:30",
      end: "2027-02-07T13:00:00+05:30",
      venue: "At the bride's home",
      address: "", // left blank on purpose — shared with guests personally
      description:
        "Alekhya is blessed and adorned as a bride-to-be, with turmeric, mangala snanam and the first green bangles of the celebrations.",
      icon: "bangles",
    },
    {
      enabled: false,
      name: "Pellikoduku",
      telugu: "పెళ్లికొడుకు",
      start: "2027-02-08T09:00:00+05:30",
      end: "2027-02-08T13:00:00+05:30",
      venue: "At the groom's home",
      address: "", // left blank on purpose — shared with guests personally
      description:
        "Arjun is blessed by the elders and prepared for the wedding with traditional rituals and a joyful family gathering.",
      icon: "garland",
    },
    {
      enabled: true,
      name: "Upanayanam",
      telugu: "ఉపనయనం",
      start: "2027-02-11T11:05:00+05:30",
      end: "2027-02-11T14:00:00+05:30",
      venue: "Lee Paradise",
      address: "100 Ft Ring Road, Near Ice Factory Junction, Vizianagaram, Andhra Pradesh",
      mapQuery: "Lee Paradise Convention, Vizianagaram, Andhra Pradesh 535002",
      description:
        "Arjun’s sacred-thread ceremony, performed with Vedic chants and the blessings of the elders on the wedding day.",
      icon: "thread",
    },
    {
      enabled: true,
      name: "Wedding Ceremony",
      telugu: "వివాహ మహోత్సవం",
      start: "2027-02-11T09:00:00+05:30",
      end: "2027-02-12T02:00:00+05:30",
      venue: "Lee Paradise Convention",
      address: "100 Ft Ring Road, Near Ice Factory Junction, Vizianagaram, Andhra Pradesh",
      mapQuery: "Lee Paradise Convention, Vizianagaram, Andhra Pradesh 535002",
      description:
        "A day-long celebration leading up to the sacred sumuhurtham at 12:55 AM on 12 February — Jeelakarra Bellam, Mangalyadharanam and Talambralu, with traditional meals and festivities through the day and night.",
      icon: "kalasham",
    },
    {
      enabled: true,
      name: "Reception",
      telugu: "విందు",
      start: "2027-02-11T19:00:00+05:30",
      end: "2027-02-11T22:30:00+05:30",
      venue: "Lee Paradise Convention", // same place as the wedding
      address: "100 Ft Ring Road, Near Ice Factory Junction, Vizianagaram, Andhra Pradesh",
      mapQuery: "Lee Paradise Convention, Vizianagaram, Andhra Pradesh 535002",
      description: "Held at the wedding venue as part of the celebrations — join us for dinner, music and blessings as we begin our new life together.",
      icon: "lamp",
    },
  ],

  /* Gallery — categories: couple, engagement, prewedding, family, traditional
     Replace the placeholder "src" values with your photographs. */
  gallery: [],

  /* Background music.
     Leave "src" empty to use the built-in, procedurally generated veena-and-tanpura
     ambience (no audio file needed). To use your own licensed track, put an mp3 in
     assets/audio/ and set src, e.g. "assets/audio/nadaswaram.mp3". */
  music: {
    src: "assets/audio/wedding-music.mp3",
    title: "Mohanam — veena & tanpura ambience",
    defaultVolume: 0.5,
  },

  share: {
    title: "Arjun & Alekhya — Wedding Invitation",
    text: "With the blessings of our families, we invite you to celebrate the wedding of Arjun & Alekhya on 11 February 2027.",
    // Leave empty to share the current page address
    url: "",
  },
};
