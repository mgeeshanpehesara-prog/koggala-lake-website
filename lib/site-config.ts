export const siteConfig = {
  name: "Koggala Lake Boat Safari & Kayak Adventure with Malish",
  shortName: "Koggala Lake",
  tagline: "with Malish",
  description:
    "Private boat safaris and kayaking adventures on Koggala Lake, Sri Lanka — wildlife, mangroves and Cinnamon Island with a personal, local touch.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  phone: "+94 70 711 8528",
  whatsapp: "+94 70 711 8528",
  email: "boatsafariwithmalish@gmail.com",
  mapsLink: "https://maps.app.goo.gl/PVFnHSDheEPCm1pu7?g_st=ic",
  social: {
    facebook: "https://www.facebook.com/koggalalakeboatkayakadventurewithmalish",
    instagram: "https://www.instagram.com/koggalalakeboatsafarikayaking/",
    tripadvisor:
      "https://www.tripadvisor.co.uk/Attraction_Review-g1189030-d26934724-Reviews-Koggala_Lake_Boat_Safari_Kayak_Adventure_with_Malish-Koggala_Galle_District_Sou.html",
  },
  trust: {
    google: { rating: 5.0, reviews: 505, label: "Google" },
    tripadvisor: { label: "Tripadvisor" },
    getyourguide: { rating: 5.0, reviews: null, label: "GetYourGuide" },
  },
} as const;
