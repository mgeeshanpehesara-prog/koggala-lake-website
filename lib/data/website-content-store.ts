import { promises as fs } from "fs";
import path from "path";

export interface ReviewPlatformSettings {
  rating: number;
  reviewCount: number;
  url: string;
  links: string[];
  logoUrl: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  name: string;
  url: string;
  imageUrl: string;
}

export interface LocationDetails {
  name: string;
  description: string;
  url: string;
  buttonText: string;
  imageUrl: string;
  enabled: boolean;
}

export interface BookingNotificationSettings {
  businessName: string;
  businessLogoUrl: string;
  ownerEmail: string;
  ownerWhatsApp: string;
  bookingInstructions: string;
}

export interface ReviewSettings {
  heading: string;
  subtitle: string;
  totalReviewsOverride: number | null;
  google: ReviewPlatformSettings;
  getyourguide: ReviewPlatformSettings;
  tripadvisor: ReviewPlatformSettings;
}

export interface WebsiteContent {
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroBadge: string;
    heroImage: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    aboutTitle: string;
    aboutDescription: string;
    aboutImage: string;
  };
  about: {
    title: string;
    sections: string[];
    images: string[];
  };
  general: {
    contactPhone: string;
    whatsappNumber: string;
    email: string;
    meetingPoint: string;
    footerText: string;
    instagram: string;
    facebook: string;
    tripadvisor: string;
  };
  reviews: ReviewSettings;
  socialLinks: SocialLink[];
  locations: {
    ticketOffice: LocationDetails;
    boatPlace: LocationDetails;
  };
  bookingNotifications: BookingNotificationSettings;
}

export const defaultWebsiteContent: WebsiteContent = {
  home: {
    heroTitle: "Discover the Magic of Koggala Lake",
    heroSubtitle: "Private boat safaris and kayaking adventures with a local touch by Malish.",
    heroBadge: "Private • Safe • Unforgettable",
    heroImage: "https://picsum.photos/seed/koggala-hero-sunset/1920/1280",
    primaryButtonText: "Explore Experiences",
    secondaryButtonText: "Watch Video",
    aboutTitle: "A Personal Introduction to Koggala Lake",
    aboutDescription: "We're a small, local team based on Koggala Lake, offering private boat safaris and kayaking adventures led personally by Malish. Our focus is a relaxed, genuine experience — wildlife, mangroves and Cinnamon Island, shared with real local knowledge rather than a rushed group circuit.",
    aboutImage: "https://picsum.photos/seed/koggala-about-malish/1000/800",
  },
  about: {
    title: "A Local, Personal Way to Experience Koggala Lake",
    sections: [
      "Koggala Lake Boat Safari & Kayak Adventure with Malish is a small, locally run tourism experience based directly on Koggala Lake in southern Sri Lanka.",
      "We specialise in private boat safaris and kayaking adventures that move at a relaxed pace — giving guests time to take in the lake's mangroves, wildlife and small islands, including a stop at Cinnamon Island for a short cinnamon demonstration and a fresh cinnamon drink.",
      "Every tour is guided personally by Malish, whose local knowledge of the lake shapes each trip — from where the birds and monkeys tend to gather to the calmest channels for kayaking.",
      "Safety and comfort come first: life jackets are provided on every experience, and group sizes are kept small so the visit feels personal rather than rushed.",
      "Whether you choose the private boat safari, a guided kayaking adventure, or a self-guided kayak rental, our aim is the same — a genuine, unhurried introduction to Koggala Lake.",
    ],
    images: ["https://picsum.photos/seed/koggala-about-full/1000/800"],
  },
  general: {
    contactPhone: "+94 77 123 4567",
    whatsappNumber: "+94771234567",
    email: "boatsafariwithmalish@gmail.com",
    meetingPoint: "Koggala Lake meeting point",
    footerText: "Private boat safaris and kayaking adventures on Koggala Lake with Malish.",
    instagram: "https://www.instagram.com/koggalalakeboatsafarikayaking/",
    facebook: "",
    tripadvisor: "https://www.tripadvisor.co.uk/Attraction_Review-g1189030-d26934724-Reviews-Koggala_Lake_Boat_Safari_Kayak_Adventure_with_Malish-Koggala_Galle_District_Sou.html",
  },
  reviews: {
    heading: "Loved by travelers across Google, GetYourGuide & Tripadvisor",
    subtitle: "Real ratings from travelers who have experienced Koggala Lake with us.",
    totalReviewsOverride: null,
    google: {
      rating: 5,
      reviewCount: 505,
      url: "https://www.google.com/search?q=Koggala+Lake+Boat+Safari+%26+Kayak+Adventure+with+Malish",
      logoUrl: "",
      links: ["https://www.google.com/search?q=Koggala+Lake+Boat+Safari+%26+Kayak+Adventure+with+Malish"],
    },
    getyourguide: { rating: 0, reviewCount: 0, url: "", logoUrl: "", links: [] },
    tripadvisor: {
      rating: 0,
      reviewCount: 0,
      url: "https://www.tripadvisor.co.uk/Attraction_Review-g1189030-d26934724-Reviews-Koggala_Lake_Boat_Safari_Kayak_Adventure_with_Malish-Koggala_Galle_District_Sou.html",
      logoUrl: "",
      links: ["https://www.tripadvisor.co.uk/Attraction_Review-g1189030-d26934724-Reviews-Koggala_Lake_Boat_Safari_Kayak_Adventure_with_Malish-Koggala_Galle_District_Sou.html"],
    },
  },
  socialLinks: [
    { id: "instagram", platform: "Instagram", name: "Koggala Lake Boat Safari", url: "https://www.instagram.com/koggalalakeboatsafarikayaking/", imageUrl: "" },
    { id: "whatsapp", platform: "WhatsApp", name: "Chat on WhatsApp", url: "https://wa.me/94771234567", imageUrl: "" },
    { id: "tripadvisor", platform: "Tripadvisor", name: "Koggala Lake Boat Safari", url: "https://www.tripadvisor.co.uk/Attraction_Review-g1189030-d26934724-Reviews-Koggala_Lake_Boat_Safari_Kayak_Adventure_with_Malish-Koggala_Galle_District_Sou.html", imageUrl: "" },
  ],
  locations: {
    ticketOffice: { name: "Ticket Office", description: "Please visit our Ticket Office if you need assistance with your booking.", url: "", buttonText: "Open Ticket Office Location", imageUrl: "", enabled: true },
    boatPlace: { name: "Boat Place", description: "Please come directly to the Boat Place for your boat safari departure.", url: "", buttonText: "Open Boat Place Location", imageUrl: "", enabled: true },
  },
  bookingNotifications: {
    businessName: "Koggala Lake Boat Safari with Malish",
    businessLogoUrl: "",
    ownerEmail: "boatsafariwithmalish@gmail.com",
    ownerWhatsApp: "+94771234567",
    bookingInstructions: "Please arrive 15 minutes before departure and bring your booking reference.",
  },
};

const file = path.join(process.cwd(), "data", "website-content.json");

export async function getWebsiteContent(): Promise<WebsiteContent> {
  try {
    const parsed = JSON.parse(await fs.readFile(file, "utf8")) as Partial<WebsiteContent>;
    return {
      ...defaultWebsiteContent,
      ...parsed,
      home: { ...defaultWebsiteContent.home, ...(parsed.home || {}) },
      about: { ...defaultWebsiteContent.about, ...(parsed.about || {}) },
      general: { ...defaultWebsiteContent.general, ...(parsed.general || {}) },
      reviews: {
        ...defaultWebsiteContent.reviews,
        ...(parsed.reviews || {}),
        google: { ...defaultWebsiteContent.reviews.google, ...(parsed.reviews?.google || {}), links: parsed.reviews?.google?.links?.length ? parsed.reviews.google.links : (parsed.reviews?.google?.url ? [parsed.reviews.google.url] : defaultWebsiteContent.reviews.google.links) },
        getyourguide: { ...defaultWebsiteContent.reviews.getyourguide, ...(parsed.reviews?.getyourguide || {}), links: parsed.reviews?.getyourguide?.links || (parsed.reviews?.getyourguide?.url ? [parsed.reviews.getyourguide.url] : []) },
        tripadvisor: { ...defaultWebsiteContent.reviews.tripadvisor, ...(parsed.reviews?.tripadvisor || {}), links: parsed.reviews?.tripadvisor?.links?.length ? parsed.reviews.tripadvisor.links : (parsed.reviews?.tripadvisor?.url ? [parsed.reviews.tripadvisor.url] : defaultWebsiteContent.reviews.tripadvisor.links) },
      },
      socialLinks: Array.isArray(parsed.socialLinks) ? parsed.socialLinks : defaultWebsiteContent.socialLinks,
      locations: {
        ...defaultWebsiteContent.locations,
        ...(parsed.locations || {}),
        ticketOffice: { ...defaultWebsiteContent.locations.ticketOffice, ...(parsed.locations?.ticketOffice || {}) },
        boatPlace: { ...defaultWebsiteContent.locations.boatPlace, ...(parsed.locations?.boatPlace || {}) },
      },
      bookingNotifications: { ...defaultWebsiteContent.bookingNotifications, ...(parsed.bookingNotifications || {}) },
    };
  } catch {
    return defaultWebsiteContent;
  }
}

export async function saveWebsiteContent(content: WebsiteContent) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(content, null, 2), "utf8");
  return content;
}
