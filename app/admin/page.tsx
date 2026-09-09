"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Booking, GalleryImage, PriceTier, Product, Review, TimeSlotCutoff, TimeSlotCutoffUnit } from "@/lib/types";
import type { ManagedReview } from "@/lib/data/reviews-store";
import type { SocialLink, WebsiteContent } from "@/lib/data/website-content-store";

/* eslint-disable @next/next/no-img-element */
const MAX_IMAGE_DIMENSION = 2400;
const LARGE_IMAGE_SIZE = 8 * 1024 * 1024;
const SUPPORTED_IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|gif|svg|heic|heif)$/i;
const galleryCategories: GalleryImage["category"][] = ["Boat", "Kayaking", "Wildlife", "Cinnamon", "Lake", "Sunset"];

const categoryLabels: Record<Product["category"], string> = {
  "boat-safari": "Boat Safari",
  "kayak-tour": "Kayak Adventure",
  "kayak-rental": "Kayak Rental",
};

const toLines = (value?: string[] | string) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  return value.split(/\n+/).map((item) => item.trim()).filter(Boolean);
};

const formatBookingDate = (value?: string) => {
  if (!value) return "Not provided";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
};

const formatBookingDateTime = (value?: string) => {
  if (!value) return "Not provided";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" });
};

const isImageFile = (file: File) => file.type.startsWith("image/") || SUPPORTED_IMAGE_EXTENSIONS.test(file.name);

const getImageDimensions = (file: File) => new Promise<{ width: number; height: number }>((resolve, reject) => {
  const source = URL.createObjectURL(file);
  const image = new window.Image();
  image.onload = () => {
    URL.revokeObjectURL(source);
    resolve({ width: image.naturalWidth, height: image.naturalHeight });
  };
  image.onerror = () => {
    URL.revokeObjectURL(source);
    reject(new Error("This image format cannot be processed by the browser."));
  };
  image.src = source;
});

const processImageFile = async (file: File) => {
  if (!isImageFile(file)) throw new Error("Selected file is not an image.");
  if (/\.svg$/i.test(file.name) || file.type === "image/svg+xml") return file;

  const { width, height } = await getImageDimensions(file);
  const largestSide = Math.max(width, height);
  const isHeic = /\.(heic|heif)$/i.test(file.name) || /image\/(heic|heif)/i.test(file.type);
  if (!isHeic && file.size <= LARGE_IMAGE_SIZE && largestSide <= MAX_IMAGE_DIMENSION) return file;

  const scale = Math.min(1, MAX_IMAGE_DIMENSION / largestSide);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image processing failed. Please try another image.");

  const source = URL.createObjectURL(file);
  const image = new window.Image();
  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("This image format cannot be processed by the browser."));
      image.src = source;
    });
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.86));
    if (!blob) throw new Error("Image processing failed. Please try another image.");
    return new File([blob], `${file.name.replace(/\.[^/.]+$/, "")}.webp`, { type: "image/webp", lastModified: Date.now() });
  } finally {
    URL.revokeObjectURL(source);
  }
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "new-experience";

const blankProduct = (slug = "new-experience"): Product => ({
  slug,
  category: "kayak-tour",
  categoryLabel: "Kayak Adventure",
  badge: "New",
  name: "New Experience",
  shortDescription: "",
  fullDescription: [""],
  duration: "2 Hours",
  experienceType: "Private Tour",
  equipment: "Double Kayak",
  maxPeople: 8,
  timeSlots: ["06:30 AM", "08:30 AM", "10:30 AM", "12:30 PM", "02:30 PM", "04:30 PM"],
  childrenFree: true,
  requiresHotelPickupDropoff: false,
  priceDisplay: "From USD 20 / adult",
  priceBase: { amount: 20, currency: "USD", unit: "/ adult" },
  pricingTiers: [
    { minPeople: 1, maxPeople: 1, pricePerPerson: 20 },
    { minPeople: 2, maxPeople: 2, pricePerPerson: 18 },
    { minPeople: 3, maxPeople: null, pricePerPerson: 16 },
  ],
  rating: 4.8,
  reviewCount: 0,
  ratingSource: "Google",
  highlights: [],
  included: [],
  excluded: [],
  meetingPoint: "Koggala Lake meeting point",
  cancellationPolicy: "Free cancellation up to 24 hours before the experience.",
  mainImage: "",
  galleryImages: [],
});

const normalizeProduct = (input: Product): Product => {
  const slug = slugify(input.slug || input.name || "new-experience");
  const category = input.category || "kayak-tour";
  const categoryLabel = input.categoryLabel || categoryLabels[category];
  const currency = input.priceBase?.currency || "USD";
  const baseAmount = Number(input.priceBase?.amount || 0);
  const tiers = (input.pricingTiers || [])
    .map((tier) => ({
      minPeople: Number(tier.minPeople || 1),
      maxPeople: tier.maxPeople === null || tier.maxPeople === undefined ? null : Number(tier.maxPeople),
      pricePerPerson: Number(tier.pricePerPerson || 0),
    }))
    .sort((a, b) => a.minPeople - b.minPeople);

  return {
    ...input,
    slug,
    category,
    categoryLabel,
    timeSlots: (input.timeSlots || []).filter(Boolean),
    fullDescription: toLines(input.fullDescription).length ? toLines(input.fullDescription) : [""],
    highlights: toLines(input.highlights),
    included: toLines(input.included),
    excluded: toLines(input.excluded),
    galleryImages: toLines(input.galleryImages),
    pricingTiers: tiers,
    priceDisplay: `From ${currency} ${baseAmount.toLocaleString()} / adult`,
    priceBase: {
      ...input.priceBase,
      amount: baseAmount,
      currency,
      unit: input.priceBase?.unit || "/ adult",
    },
    maxPeople: Number(input.maxPeople || 8),
    requiresHotelPickupDropoff: Boolean(input.requiresHotelPickupDropoff),
    rating: Number(input.rating || 0),
    reviewCount: Number(input.reviewCount || 0),
    badge: input.badge || "",
  };
};

export default function AdminPage() {
  const [logged, setLogged] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingSort, setBookingSort] = useState<"upcoming" | "activity-oldest" | "activity-newest" | "created-newest" | "created-oldest">("upcoming");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("All");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");
  const [message, setMessage] = useState("");
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [managedReviews, setManagedReviews] = useState<ManagedReview[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [editingReview, setEditingReview] = useState<ManagedReview | null>(null);
  const [activeSection, setActiveSection] = useState<"products" | "bookings" | "reviews" | "ratings" | "social" | "content" | "gallery">("products");
  const [savingProduct, setSavingProduct] = useState(false);
  const [socialUploadState, setSocialUploadState] = useState<Record<string, "idle" | "uploading" | "error">>({});

  const load = async () => {
    const [productResponse, bookingResponse, contentResponse, reviewResponse, galleryResponse] = await Promise.all([
      fetch("/api/products", { cache: "no-store" }),
      fetch("/api/booking", { cache: "no-store" }),
      fetch("/api/admin/content", { cache: "no-store" }),
      fetch("/api/admin/reviews", { cache: "no-store" }),
      fetch("/api/admin/gallery", { cache: "no-store" }),
    ]);

    if (productResponse.ok) {
      const data = await productResponse.json();
      setProducts(data);
      setLogged(true);
    } else {
      setLogged(false);
    }

    if (bookingResponse.ok) {
      const data = await bookingResponse.json();
      setBookings(Array.isArray(data) ? data : []);
    }
    if (contentResponse.ok) setContent(await contentResponse.json());
    if (reviewResponse.ok) setManagedReviews(await reviewResponse.json());
    if (galleryResponse.ok) setGallery(await galleryResponse.json());
  };

  useEffect(() => {
    load();
  }, []);

  const productCount = useMemo(() => products.length, [products]);
  const filteredBookings = useMemo(() => {
    const term = bookingSearch.trim().toLowerCase();
    const filtered = bookings.filter((booking) => {
      const matchesSearch = !term || [
        booking.bookingReference,
        booking.productName,
        booking.firstName,
        booking.lastName,
        booking.email,
        booking.phone,
        booking.country,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);
      return matchesSearch &&
        (bookingStatusFilter === "All" || booking.bookingStatus === bookingStatusFilter) &&
        (paymentStatusFilter === "All" || booking.paymentStatus === paymentStatusFilter);
    });

    return [...filtered].sort((first, second) => {
      if (bookingSort === "created-newest" || bookingSort === "created-oldest") {
        const difference = new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime();
        return bookingSort === "created-newest" ? -difference : difference;
      }
      const firstActivity = new Date(`${first.date}T00:00:00`).getTime();
      const secondActivity = new Date(`${second.date}T00:00:00`).getTime();
      if (bookingSort === "upcoming") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const firstUpcoming = firstActivity >= today.getTime();
        const secondUpcoming = secondActivity >= today.getTime();
        if (firstUpcoming !== secondUpcoming) return firstUpcoming ? -1 : 1;
      }
      const difference = firstActivity - secondActivity;
      return bookingSort === "activity-newest" ? -difference : difference;
    });
  }, [bookings, bookingSearch, bookingSort, bookingStatusFilter, paymentStatusFilter]);

  const login = async () => {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      setLogged(true);
      setMessage("Logged in");
      await load();
      return;
    }

    setMessage("Login failed. Add ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SESSION_TOKEN to .env.local.");
  };

  const save = async () => {
    if (!editing) return;
    if (savingProduct) return;
    if (mainImageState.status === "uploading" || galleryImageState.status === "uploading" || editing.mainImage.startsWith("blob:") || editing.galleryImages.some((src) => src.startsWith("blob:"))) {
      setMessage("Please wait for product images to finish uploading before saving.");
      return;
    }

    const product = normalizeProduct(editing);
    const method = products.some((item) => item.slug === product.slug) ? "PUT" : "POST";
    const scrollPosition = window.scrollY;
    setSavingProduct(true);

    try {
      const response = await fetch("/api/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        setMessage("This action is not authorized for the current admin session.");
        return;
      }

      const savedProduct = await response.json() as Product;
      setEditing(savedProduct);
      setMessage("Product saved successfully ✓");
      await load();
      requestAnimationFrame(() => window.scrollTo({ top: scrollPosition, behavior: "auto" }));
    } finally {
      setSavingProduct(false);
    }
  };

  const saveContent = async () => {
    if (!content) return;
    if (content.home.heroImage.startsWith("blob:") || content.home.aboutImage.startsWith("blob:")) {
      setMessage("Please wait for content images to finish uploading before saving.");
      return;
    }
    const response = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
    setMessage(response.ok ? "Website content saved." : "Website content could not be saved.");
  };

  const saveReview = async () => {
    if (!editingReview) return;
    const response = await fetch("/api/admin/reviews", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingReview) });
    if (response.ok) {
      setEditingReview(null);
      setMessage("Review saved.");
      await load();
    } else setMessage("Review could not be saved.");
  };

  const removeReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    const response = await fetch("/api/admin/reviews", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (response.ok) { setMessage("Review deleted."); await load(); }
  };

  const saveGallery = async () => {
    if (gallery.some((image) => image.src.startsWith("blob:"))) {
      setMessage("Please wait for gallery images to finish uploading before saving.");
      return;
    }

    const response = await fetch("/api/admin/gallery", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(gallery) });
    setMessage(response.ok ? "Gallery saved." : "Gallery could not be saved.");
  };

  const updateHomeContent = (field: keyof WebsiteContent["home"], value: string) => {
    setContent((current) => current ? { ...current, home: { ...current.home, [field]: value } } : current);
  };

  const updateGeneralContent = (field: keyof WebsiteContent["general"], value: string) => {
    setContent((current) => current ? { ...current, general: { ...current.general, [field]: value } } : current);
  };

  const updateLocation = (location: "ticketOffice" | "boatPlace", updates: Partial<WebsiteContent["locations"]["ticketOffice"]>) => {
    setContent((current) => current ? { ...current, locations: { ...current.locations, [location]: { ...current.locations[location], ...updates } } } : current);
  };

  const uploadLocationImage = async (location: "ticketOffice" | "boatPlace", file: File) => {
    try {
      const url = await uploadImageFile(file);
      updateLocation(location, { imageUrl: url });
    } catch (error) { setMessage(error instanceof Error ? error.message : "Location image upload failed."); }
  };

  const uploadBusinessLogo = async (file: File) => {
    try {
      const url = await uploadImageFile(file);
      setContent((current) => current ? { ...current, bookingNotifications: { ...current.bookingNotifications, businessLogoUrl: url } } : current);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Business logo upload failed."); }
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    setContent((current) => current ? { ...current, socialLinks: current.socialLinks.map((link) => link.id === id ? { ...link, ...updates } : link) } : current);
  };

  const addSocialLink = () => {
    const id = `social-${Date.now()}`;
    setContent((current) => current ? { ...current, socialLinks: [...current.socialLinks, { id, platform: "Instagram", name: "", url: "", imageUrl: "" }] } : current);
  };

  const removeSocialLink = (id: string) => {
    setContent((current) => current ? { ...current, socialLinks: current.socialLinks.filter((link) => link.id !== id) } : current);
  };

  const uploadSocialImage = async (id: string, file: File) => {
    if (!isImageFile(file)) {
      setMessage("Selected social icon is not an image.");
      setSocialUploadState((current) => ({ ...current, [id]: "error" }));
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    updateSocialLink(id, { imageUrl: previewUrl });
    setSocialUploadState((current) => ({ ...current, [id]: "uploading" }));
    try {
      const uploadedUrl = await uploadImageFile(file);
      updateSocialLink(id, { imageUrl: uploadedUrl });
      URL.revokeObjectURL(previewUrl);
      setSocialUploadState((current) => ({ ...current, [id]: "idle" }));
    } catch (error) {
      setSocialUploadState((current) => ({ ...current, [id]: "error" }));
      setMessage(error instanceof Error ? error.message : "Social icon upload failed.");
    }
  };

  const removeSocialImage = (id: string) => {
    const currentLogo = content?.socialLinks.find((link) => link.id === id)?.imageUrl;
    if (currentLogo?.startsWith("blob:")) URL.revokeObjectURL(currentLogo);
    updateSocialLink(id, { imageUrl: "" });
  };

  const saveSocialLinks = async () => {
    if (!content) return;
    if (Object.values(socialUploadState).some((state) => state === "uploading") || content.socialLinks.some((link) => link.imageUrl.startsWith("blob:"))) {
      setMessage("Please wait for social icons to finish uploading before saving.");
      return;
    }
    const response = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
    setMessage(response.ok ? "Social media links saved." : "Social media links could not be saved.");
  };

  const updateReviewSetting = (field: keyof WebsiteContent["reviews"], value: string | number | null) => {
    setContent((current) => current ? { ...current, reviews: { ...current.reviews, [field]: value } } : current);
  };

  const updatePlatformReview = (platform: "google" | "getyourguide" | "tripadvisor", field: keyof WebsiteContent["reviews"]["google"], value: string | number) => {
    setContent((current) => current ? { ...current, reviews: { ...current.reviews, [platform]: { ...current.reviews[platform], [field]: value } } } : current);
  };

  const updatePlatformLink = (platform: "google" | "getyourguide" | "tripadvisor", index: number, value: string) => {
    setContent((current) => {
      if (!current) return current;
      const links = [...current.reviews[platform].links];
      links[index] = value;
      return { ...current, reviews: { ...current.reviews, [platform]: { ...current.reviews[platform], links, url: links[0] || "" } } };
    });
  };

  const addPlatformLink = (platform: "google" | "getyourguide" | "tripadvisor") => {
    setContent((current) => current ? { ...current, reviews: { ...current.reviews, [platform]: { ...current.reviews[platform], links: [...current.reviews[platform].links, ""] } } } : current);
  };

  const removePlatformLink = (platform: "google" | "getyourguide" | "tripadvisor", index: number) => {
    setContent((current) => {
      if (!current) return current;
      const links = current.reviews[platform].links.filter((_, linkIndex) => linkIndex !== index);
      return { ...current, reviews: { ...current.reviews, [platform]: { ...current.reviews[platform], links, url: links[0] || "" } } };
    });
  };

  const uploadReviewLogo = async (platform: "google" | "getyourguide" | "tripadvisor", file: File) => {
    if (!isImageFile(file)) {
      setMessage("Selected logo file is not an image.");
      setReviewLogoState((current) => ({ ...current, [platform]: "error" }));
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    updatePlatformReview(platform, "logoUrl", previewUrl);
    setReviewLogoState((current) => ({ ...current, [platform]: "uploading" }));
    try {
      const uploadedUrl = await uploadImageFile(file);
      updatePlatformReview(platform, "logoUrl", uploadedUrl);
      URL.revokeObjectURL(previewUrl);
      setReviewLogoState((current) => ({ ...current, [platform]: "idle" }));
    } catch (error) {
      setReviewLogoState((current) => ({ ...current, [platform]: "error" }));
      setMessage(error instanceof Error ? error.message : "Logo upload failed.");
    }
  };

  const removeReviewLogo = (platform: "google" | "getyourguide" | "tripadvisor") => {
    const currentLogo = content?.reviews[platform].logoUrl;
    if (currentLogo?.startsWith("blob:")) URL.revokeObjectURL(currentLogo);
    updatePlatformReview(platform, "logoUrl", "");
    setReviewLogoState((current) => ({ ...current, [platform]: "idle" }));
  };

  const saveReviews = async () => {
    if (!content) return;
    const hasUploadingLogo = Object.values(reviewLogoState).some((state) => state === "uploading");
    const hasPreviewLogo = ["google", "getyourguide", "tripadvisor"].some((platform) => content.reviews[platform as "google" | "getyourguide" | "tripadvisor"].logoUrl.startsWith("blob:"));
    if (hasUploadingLogo || hasPreviewLogo) {
      setMessage("Please wait for review logos to finish uploading before saving.");
      return;
    }
    const response = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
    setMessage(response.ok ? "Reviews saved." : "Reviews could not be saved.");
  };

  const uploadContentImage = async (field: "heroImage" | "aboutImage", file: File) => {
    if (!isImageFile(file)) {
      setMessage("Selected file is not an image.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    updateHomeContent(field, previewUrl);
    try {
      const url = await uploadImageFile(file);
      updateHomeContent(field, url);
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Image upload failed.");
    }
  };

  const addGalleryFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;

    const invalid = files.find((file) => !isImageFile(file));

    if (invalid) {
      setMessage("One or more selected files are not valid images.");
      return;
    }

    const previewItems = files.map((file, index) => ({
      id: `gallery-${Date.now()}-${index}`,
      src: URL.createObjectURL(file),
      alt: file.name.replace(/\.[^/.]+$/, "") || "Koggala Lake experience",
      category: "Lake" as GalleryImage["category"],
    }));

    setGallery((current) => [...current, ...previewItems]);
    setMessage(`Uploading ${files.length} image${files.length === 1 ? "" : "s"}...`);

    try {
      const results = await Promise.allSettled(files.map(uploadImageFile));
      const failed = results.find((result) => result.status === "rejected");

      setGallery((current) => current.map((image) => {
        const previewIndex = previewItems.findIndex((preview) => preview.id === image.id);
        const result = previewIndex === -1 ? undefined : results[previewIndex];
        return result?.status === "fulfilled" ? { ...image, src: result.value } : image;
      }));

      setMessage(failed ? (failed.reason instanceof Error ? failed.reason.message : "Some gallery images could not be uploaded.") : "Gallery images uploaded. Click Save Gallery to publish them.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gallery upload failed.");
    }
  };

  const updateBookingStatus = async (bookingId: string, paymentStatus?: string, bookingStatus?: string) => {
    const response = await fetch("/api/booking", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: bookingId, paymentStatus, bookingStatus }),
    });

    if (!response.ok) {
      setMessage("Booking status update failed.");
      return;
    }

    setMessage("Booking status updated.");
    await load();
  };

  const removeProduct = async (slug: string) => {
    if (!confirm("Delete this product from the website?")) return;

    const response = await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });

    if (response.ok) {
      setMessage("Product deleted.");
      await load();
      return;
    }

    setMessage("Delete failed. The admin session may be invalid.");
  };

  const updateEditing = (updates: Partial<Product>) => {
    setEditing((current) => {
      if (!current) return current;
      return { ...current, ...updates };
    });
  };

  const addTimeSlot = () => {
    setEditing((current) => {
      if (!current) return current;
      const slot = "06:30 AM";
      return { ...current, timeSlots: [...(current.timeSlots || []), slot], timeSlotCutoffs: { ...(current.timeSlotCutoffs || {}), [slot]: { value: 0, unit: "none" } } };
    });
  };

  const updateTimeSlot = (index: number, value: string) => {
    setEditing((current) => {
      if (!current) return current;
      const timeSlots = [...(current.timeSlots || [])];
      const previousSlot = timeSlots[index];
      timeSlots[index] = value;
      const timeSlotCutoffs = { ...(current.timeSlotCutoffs || {}) };
      if (previousSlot !== value && timeSlotCutoffs[previousSlot]) {
        timeSlotCutoffs[value] = timeSlotCutoffs[previousSlot];
        delete timeSlotCutoffs[previousSlot];
      }
      return { ...current, timeSlots, timeSlotCutoffs };
    });
  };

  const updateTimeSlotCutoff = (slot: string, field: keyof TimeSlotCutoff, value: string | number) => {
    setEditing((current) => current ? { ...current, timeSlotCutoffs: { ...(current.timeSlotCutoffs || {}), [slot]: { ...(current.timeSlotCutoffs?.[slot] || { value: 0, unit: "none" }), [field]: value } } } : current);
  };

  const removeTimeSlot = (index: number) => {
    setEditing((current) => {
      if (!current) return current;
      const timeSlots = [...(current.timeSlots || [])];
      const removedSlot = timeSlots[index];
      timeSlots.splice(index, 1);
      const timeSlotCutoffs = { ...(current.timeSlotCutoffs || {}) };
      delete timeSlotCutoffs[removedSlot];
      return { ...current, timeSlots, timeSlotCutoffs };
    });
  };

  const addTier = () => {
    setEditing((current) => {
      if (!current) return current;
      return {
        ...current,
        pricingTiers: [...(current.pricingTiers || []), { minPeople: 1, maxPeople: null, pricePerPerson: 0 }],
      };
    });
  };

  const updateTier = (index: number, field: keyof PriceTier, value: string | number | null) => {
    setEditing((current) => {
      if (!current) return current;
      const pricingTiers = [...(current.pricingTiers || [])];
      const currentTier = pricingTiers[index] || { minPeople: 1, maxPeople: null, pricePerPerson: 0 };
      const nextTier = { ...currentTier };

      if (field === "maxPeople") {
        nextTier.maxPeople = value === "" ? null : Number(value);
      } else if (field === "minPeople") {
        nextTier.minPeople = Number(value);
      } else if (field === "pricePerPerson") {
        nextTier.pricePerPerson = Number(value);
      }

      pricingTiers[index] = nextTier;
      return { ...current, pricingTiers };
    });
  };

  const removeTier = (index: number) => {
    setEditing((current) => {
      if (!current) return current;
      const pricingTiers = [...(current.pricingTiers || [])];
      pricingTiers.splice(index, 1);
      return { ...current, pricingTiers };
    });
  };

  const [mainImageState, setMainImageState] = useState<{ status: "idle" | "uploading" | "error"; message?: string }>({ status: "idle" });
  const [galleryImageState, setGalleryImageState] = useState<{ status: "idle" | "uploading" | "error"; message?: string }>({ status: "idle" });
  const [reviewLogoState, setReviewLogoState] = useState<Record<"google" | "getyourguide" | "tripadvisor", "idle" | "uploading" | "error">>({ google: "idle", getyourguide: "idle", tripadvisor: "idle" });

  const uploadImageFile = async (file: File) => {
    if (!isImageFile(file)) {
      throw new Error("Selected file is not an image.");
    }

    const processedFile = await processImageFile(file);
    const formData = new FormData();
    formData.append("file", processedFile);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.url) {
      throw new Error(data?.error || "Image upload failed.");
    }

    return data.url as string;
  };

  const handleMainImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = "";
    if (!isImageFile(file)) {
      setMainImageState({ status: "error", message: "Selected file is not an image." });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    updateEditing({ mainImage: previewUrl });
    setMainImageState({ status: "uploading", message: "Uploading image..." });

    try {
      const uploadedUrl = await uploadImageFile(file);
      updateEditing({ mainImage: uploadedUrl });
      URL.revokeObjectURL(previewUrl);
      setMainImageState({ status: "idle", message: "Main image uploaded." });
    } catch (error) {
      setMainImageState({ status: "error", message: error instanceof Error ? error.message : "Image upload failed." });
    }
  };

  const handleGalleryImagesChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const invalid = files.find((file) => !isImageFile(file));

    if (invalid) {
      setGalleryImageState({ status: "error", message: "One or more selected files are not valid images." });
      event.target.value = "";
      return;
    }

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    updateEditing({ galleryImages: [...(editing?.galleryImages || []), ...previewUrls] });
    setGalleryImageState({ status: "uploading", message: `Uploading ${files.length} images...` });

    try {
      const results = await Promise.allSettled(files.map((file) => uploadImageFile(file)));
      setEditing((current) => {
        if (!current) return current;
        const previewIndexByUrl = new Map(previewUrls.map((url, index) => [url, index]));
        return {
          ...current,
          galleryImages: current.galleryImages.map((src) => {
            const previewIndex = previewIndexByUrl.get(src);
            const result = previewIndex === undefined ? undefined : results[previewIndex];
            return result?.status === "fulfilled" ? result.value : src;
          }),
        };
      });
      results.forEach((result, index) => {
        if (result.status === "fulfilled") URL.revokeObjectURL(previewUrls[index]);
      });
      const failed = results.find((result) => result.status === "rejected");
      if (failed) throw failed.reason;
      setGalleryImageState({ status: "idle", message: "Gallery images uploaded." });
    } catch (error) {
      setGalleryImageState({ status: "error", message: error instanceof Error ? error.message : "Gallery upload failed." });
    } finally {
      event.target.value = "";
    }
  };

  const removeMainImage = () => {
    updateEditing({ mainImage: "" });
    setMainImageState({ status: "idle" });
  };

  const removeGalleryImage = (index: number) => {
    setEditing((current) => {
      if (!current) return current;
      return { ...current, galleryImages: (current.galleryImages || []).filter((_, itemIndex) => itemIndex !== index) };
    });
  };

  if (!logged) {
    return (
      <main className="admin-shell">
        <div className="admin-login glass-panel">
          <p className="eyebrow">Private area</p>
          <h1 className="mt-3 text-3xl font-semibold text-sand-50">Admin Control Room</h1>
          <p className="mt-3 text-sm text-sand-200/70">This area is restricted to the website administrator.</p>
          <div className="mt-6 grid gap-3">
            <input placeholder="Admin email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          <button className="cta-button full mt-4" onClick={login}>Sign in securely</button>
          {message && <p className="mt-3 text-xs text-sand-200/70">{message}</p>}
          <Link href="/" className="back-button mt-4 inline-flex">← Back to website</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <div className="container-premium">
        <header className="admin-header">
          <div>
            <p className="eyebrow">Private admin</p>
            <h1 className="mt-2 text-4xl font-medium text-sand-50">Website Control Room</h1>
            <p className="mt-2 text-sm text-sand-200/70">Manage products, pricing, availability, and booking records.</p>
          </div>
          <div className="admin-actions">
            <Link href="/" className="back-button">View website</Link>
            <button
              className="back-button"
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" });
                location.reload();
              }}
            >
              Log out
            </button>
          </div>
        </header>

        <nav className="admin-tabs" aria-label="Admin sections">
          {([
            ["products", "Products"],
            ["bookings", "Bookings"],
            ["reviews", "Featured Reviews"],
            ["ratings", "Reviews & Online Ratings"],
            ["social", "Social Media Links"],
            ["content", "Website Content"],
            ["gallery", "Gallery"],
          ] as const).map(([value, label]) => (
            <button key={value} type="button" className={activeSection === value ? "admin-tab active" : "admin-tab"} onClick={() => setActiveSection(value)}>
              {label}
            </button>
          ))}
        </nav>

        <div className="admin-grid">
          <section className="admin-list glass-panel">
            <div className="section-top">
              <div>
                <h2>Products</h2>
                <p>{productCount} live product records</p>
              </div>
              <button className="cta-button" onClick={() => setEditing(blankProduct())}>+ Create New Product</button>
            </div>

            {products.map((product) => (
              <div className="admin-product" key={product.slug}>
                <div>
                  <strong>{product.name}</strong>
                  <span>
                    {product.categoryLabel} · {product.priceDisplay} · {product.timeSlots?.length || 0} time slots
                  </span>
                </div>
                <div className="admin-product-actions">
                  <button className="back-button" onClick={() => setEditing(product)}>Edit</button>
                  <button className="danger-button" onClick={() => removeProduct(product.slug)}>Delete</button>
                </div>
              </div>
            ))}
          </section>

          {editing && (
            <section className="admin-editor glass-panel">
              <div className="section-top">
                <div>
                  <h2>{products.some((product) => product.slug === editing.slug) ? "Edit Product" : "Create Product"}</h2>
                  <p>Every product can own its own time slots, pricing tiers, and content.</p>
                </div>
                <button className="back-button" onClick={() => setEditing(null)}>Close</button>
              </div>

              <div className="editor-form">
                <div className="two">
                  <label>
                    Product name
                    <input value={editing.name} onChange={(event) => updateEditing({ name: event.target.value })} />
                  </label>
                  <label>
                    Slug
                    <input value={editing.slug} onChange={(event) => updateEditing({ slug: slugify(event.target.value) })} />
                  </label>
                </div>

                <div className="two">
                  <label>
                    Category
                    <select
                      value={editing.category}
                      onChange={(event) =>
                        updateEditing({
                          category: event.target.value as Product["category"],
                          categoryLabel: categoryLabels[event.target.value as Product["category"]],
                        })
                      }
                    >
                      <option value="boat-safari">Boat Safari</option>
                      <option value="kayak-tour">Kayak Adventure</option>
                      <option value="kayak-rental">Kayak Rental</option>
                    </select>
                  </label>
                  <label>
                    Category label
                    <input value={editing.categoryLabel} onChange={(event) => updateEditing({ categoryLabel: event.target.value })} />
                  </label>
                </div>

                <div className="two">
                  <label>
                    Badge
                    <input value={editing.badge || ""} onChange={(event) => updateEditing({ badge: event.target.value })} />
                  </label>
                  <label>
                    Duration
                    <input value={editing.duration} onChange={(event) => updateEditing({ duration: event.target.value })} />
                  </label>
                </div>

                <label>
                  Short description
                  <textarea value={editing.shortDescription} onChange={(event) => updateEditing({ shortDescription: event.target.value })} />
                </label>

                <label>
                  Full description
                  <textarea value={editing.fullDescription.join("\n\n")} onChange={(event) => updateEditing({ fullDescription: toLines(event.target.value) })} />
                </label>

                <div className="two">
                  <label>
                    Experience type
                    <select value={editing.experienceType} onChange={(event) => updateEditing({ experienceType: event.target.value as Product["experienceType"] })}>
                      <option>Private Tour</option>
                      <option>Self-Guided</option>
                    </select>
                  </label>
                  <label>
                    Equipment
                    <input value={editing.equipment || ""} onChange={(event) => updateEditing({ equipment: event.target.value })} />
                  </label>
                </div>

                <div className="two">
                  <label>
                    Max people
                    <input type="number" value={editing.maxPeople || 1} onChange={(event) => updateEditing({ maxPeople: Number(event.target.value) })} />
                  </label>
                  <label>
                    Children free
                    <select value={String(editing.childrenFree)} onChange={(event) => updateEditing({ childrenFree: event.target.value === "true" })}>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </label>
                </div>

                <div className="two">
                  <label>
                    Hotel pickup / drop-off required
                    <select
                      value={String(Boolean(editing.requiresHotelPickupDropoff))}
                      onChange={(event) => updateEditing({ requiresHotelPickupDropoff: event.target.value === "true" })}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </label>
                  <div />
                </div>

                <div className="two">
                  <label>
                    Base price
                    <input
                      type="number"
                      value={editing.priceBase.amount}
                      onChange={(event) =>
                        updateEditing({
                          priceBase: {
                            ...editing.priceBase,
                            amount: Number(event.target.value),
                          },
                        })
                      }
                    />
                  </label>
                  <label>
                    Currency
                    <select
                      value={editing.priceBase.currency}
                      onChange={(event) =>
                        updateEditing({
                          priceBase: {
                            ...editing.priceBase,
                            currency: event.target.value as Product["priceBase"]["currency"],
                          },
                        })
                      }
                    >
                      <option value="USD">USD</option>
                    </select>
                  </label>
                </div>

                <div className="admin-array-block">
                  <div className="section-top compact">
                    <div>
                      <h3>Time slots</h3>
                    </div>
                    <button type="button" className="back-button" onClick={addTimeSlot}>+ Add time</button>
                  </div>
                  {(editing.timeSlots || []).map((time, index) => (
                    <div className="admin-array-block" key={`${time}-${index}`}>
                      <div className="array-row"><input value={time} onChange={(event) => updateTimeSlot(index, event.target.value)} /><button type="button" className="danger-button" onClick={() => removeTimeSlot(index)}>Delete</button></div>
                      <div className="two"><label>Cutoff value<input type="number" min="0" value={editing.timeSlotCutoffs?.[time]?.value ?? 0} disabled={editing.timeSlotCutoffs?.[time]?.unit === "none"} onChange={(event) => updateTimeSlotCutoff(time, "value", Number(event.target.value))} /></label><label>Cutoff unit<select value={editing.timeSlotCutoffs?.[time]?.unit ?? "none"} onChange={(event) => updateTimeSlotCutoff(time, "unit", event.target.value as TimeSlotCutoffUnit)}><option value="none">No Cutoff</option><option value="minutes">Minutes</option><option value="hours">Hours</option><option value="days">Days</option></select></label></div>
                    </div>
                  ))}
                </div>

                <div className="admin-array-block">
                  <div className="section-top compact">
                    <div>
                      <h3>Pricing tiers</h3>
                    </div>
                    <button type="button" className="back-button" onClick={addTier}>+ Add tier</button>
                  </div>

                  {(editing.pricingTiers || []).map((tier, index) => (
                    <div className="tier-row" key={`${tier.minPeople}-${tier.maxPeople ?? "open"}-${index}`}>
                      <input type="number" value={tier.minPeople} onChange={(event) => updateTier(index, "minPeople", Number(event.target.value))} />
                      <input
                        type="number"
                        value={tier.maxPeople ?? ""}
                        placeholder="Optional max"
                        onChange={(event) => updateTier(index, "maxPeople", event.target.value === "" ? null : Number(event.target.value))}
                      />
                      <input type="number" value={tier.pricePerPerson} onChange={(event) => updateTier(index, "pricePerPerson", Number(event.target.value))} />
                      <button type="button" className="danger-button" onClick={() => removeTier(index)}>Delete</button>
                    </div>
                  ))}
                </div>

                <div className="two">
                  <label>
                    Rating
                    <input type="number" step="0.1" value={editing.rating} onChange={(event) => updateEditing({ rating: Number(event.target.value) })} />
                  </label>
                  <label>
                    Review count
                    <input type="number" value={editing.reviewCount} onChange={(event) => updateEditing({ reviewCount: Number(event.target.value) })} />
                  </label>
                </div>

                <div className="two">
                  <label>
                    Rating source
                    <input value={editing.ratingSource} onChange={(event) => updateEditing({ ratingSource: event.target.value })} />
                  </label>
                  <div className="image-upload-panel">
                    <div className="upload-header-row">
                      <span>Main image</span>
                      {editing.mainImage && <button type="button" className="danger-button small-button" onClick={removeMainImage}>Remove</button>}
                    </div>

                    {editing.mainImage ? (
                      <div className="image-preview-wrap">
                        {editing.mainImage.startsWith("blob:") ? <img src={editing.mainImage} alt={editing.name || "Product image"} className="image-preview" width={1200} height={800} /> : <Image src={editing.mainImage} alt={editing.name || "Product image"} className="image-preview" width={1200} height={800} />}
                      </div>
                    ) : (
                      <div className="image-placeholder">No main image selected</div>
                    )}

                    <div className="upload-actions-row">
                      <label htmlFor="main-image-upload" className="back-button upload-action">Choose Image</label>
                      <input id="main-image-upload" type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.heic,.heif,image/*" onChange={handleMainImageChange} hidden />
                      {editing.mainImage && (
                        <label htmlFor="main-image-upload" className="back-button upload-action">Replace</label>
                      )}
                    </div>

                    {mainImageState.status !== "idle" && (
                      <p className={mainImageState.status === "error" ? "error-message compact" : "upload-status compact"}>
                        {mainImageState.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="image-upload-panel">
                  <div className="upload-header-row">
                    <span>Gallery images</span>
                    <label htmlFor="gallery-images-upload" className="back-button upload-action">Add Images</label>
                    <input id="gallery-images-upload" type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.heic,.heif,image/*" multiple onChange={handleGalleryImagesChange} hidden />
                  </div>

                  {editing.galleryImages.length > 0 ? (
                    <div className="gallery-grid">
                      {editing.galleryImages.map((src, index) => (
                        <div key={`${src}-${index}`} className="gallery-thumb-wrap">
                          {src.startsWith("blob:") ? <img src={src} alt={`Gallery ${index + 1}`} className="gallery-thumb" width={300} height={220} /> : <Image src={src} alt={`Gallery ${index + 1}`} className="gallery-thumb" width={300} height={220} />}
                          <button type="button" className="danger-button small-button remove-thumb" onClick={() => removeGalleryImage(index)}>Remove</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="image-placeholder">No gallery images selected</div>
                  )}

                  {galleryImageState.status !== "idle" && (
                    <p className={galleryImageState.status === "error" ? "error-message compact" : "upload-status compact"}>
                      {galleryImageState.message}
                    </p>
                  )}
                </div>

                <label>
                  Highlights
                  <textarea value={editing.highlights.join("\n")} onChange={(event) => updateEditing({ highlights: toLines(event.target.value) })} />
                </label>

                <label>
                  Included
                  <textarea value={editing.included.join("\n")} onChange={(event) => updateEditing({ included: toLines(event.target.value) })} />
                </label>

                <label>
                  Not included
                  <textarea value={editing.excluded.join("\n")} onChange={(event) => updateEditing({ excluded: toLines(event.target.value) })} />
                </label>

                <label>
                  Meeting point
                  <input value={editing.meetingPoint} onChange={(event) => updateEditing({ meetingPoint: event.target.value })} />
                </label>

                <label>
                  Cancellation policy
                  <textarea value={editing.cancellationPolicy} onChange={(event) => updateEditing({ cancellationPolicy: event.target.value })} />
                </label>

              </div>

              <div className="admin-actions-row">
                <button className="back-button" onClick={() => setEditing(null)}>Cancel</button>
                <button className="cta-button" onClick={save} disabled={savingProduct}>{savingProduct ? "Saving Product..." : "Save Product"}</button>
              </div>
            </section>
          )}

          <section className="admin-list glass-panel booking-panel-admin">
            <div className="section-top">
              <div>
                <h2>Bookings</h2>
                <p>{filteredBookings.length} records</p>
              </div>
            </div>

            <div className="admin-search-wrap">
              <input
                value={bookingSearch}
                onChange={(event) => setBookingSearch(event.target.value)}
                placeholder="Search bookings, customers or product"
              />
            </div>

            <div className="booking-controls">
              <label>
                Organize bookings
                <select value={bookingSort} onChange={(event) => setBookingSort(event.target.value as typeof bookingSort)}>
                  <option value="upcoming">Activity Date: upcoming first</option>
                  <option value="activity-oldest">Activity Date: oldest first</option>
                  <option value="activity-newest">Activity Date: newest first</option>
                  <option value="created-newest">Booking Date: newest first</option>
                  <option value="created-oldest">Booking Date: oldest first</option>
                </select>
              </label>
              <label>
                Booking status
                <select value={bookingStatusFilter} onChange={(event) => setBookingStatusFilter(event.target.value)}>
                  <option value="All">All booking statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Completed">Completed</option>
                </select>
              </label>
              <label>
                Payment status
                <select value={paymentStatusFilter} onChange={(event) => setPaymentStatusFilter(event.target.value)}>
                  <option value="All">All payment statuses</option>
                  <option value="Payment Pending">Payment Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Failed">Failed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </label>
            </div>

            {filteredBookings.length === 0 ? (
              <p className="empty-state">No bookings match this search.</p>
            ) : (
              <div className="booking-list">
                {filteredBookings.map((booking) => (
                  <button
                    type="button"
                    className={`booking-item${selectedBooking?.id === booking.id ? " active" : ""}`}
                    key={booking.id || booking.bookingReference || booking.date + booking.email}
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <div>
                      <strong>{booking.productName || "Booking"}</strong>
                      <span>
                        {booking.bookingReference} · {booking.firstName || "Guest"} {booking.lastName || ""}
                      </span>
                      <span>Activity Date: {formatBookingDate(booking.date)} · {booking.time}</span>
                      <span>Booking Date: {formatBookingDateTime(booking.createdAt)}</span>
                    </div>
                    <div>
                      <span className="booking-status">{booking.bookingStatus || booking.paymentStatus || "Pending"}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedBooking && (
              <div className="booking-detail-panel">
                <h3>Booking details</h3>
                <div className="booking-detail-grid">
                  <section><h4>Customer Information</h4><p><strong>Full name:</strong> {selectedBooking.firstName} {selectedBooking.lastName}</p><p><strong>Email:</strong> {selectedBooking.email || "Not provided"}</p><p><strong>Phone / WhatsApp:</strong> {selectedBooking.phone || "Not provided"}</p><p><strong>Nationality:</strong> {selectedBooking.country || "Not provided"}</p></section>
                  <section><h4>Booking Information</h4><p><strong>Booking reference:</strong> {selectedBooking.bookingReference || selectedBooking.id}</p><p><strong>Experience / product:</strong> {selectedBooking.productName || "Not provided"}</p><p><strong>Booking status:</strong> {selectedBooking.bookingStatus || "Pending"}</p></section>
                  <section><h4>Activity Schedule</h4><p><strong>Activity date:</strong> {formatBookingDate(selectedBooking.date)}</p><p><strong>Selected time slot:</strong> {selectedBooking.time || "Not provided"}</p><p><strong>Activity start time:</strong> {selectedBooking.time || "Not provided"}</p><p><strong>Booking date:</strong> {formatBookingDateTime(selectedBooking.createdAt)}</p><p><strong>Duration:</strong> {products.find((product) => product.slug === selectedBooking.productSlug)?.duration || "Not provided"}</p></section>
                  <section><h4>Guest Details</h4><p><strong>Adults:</strong> {selectedBooking.adults || 0}</p><p><strong>Children:</strong> {selectedBooking.children || 0}</p><p><strong>Total guests:</strong> {(selectedBooking.adults || 0) + (selectedBooking.children || 0)}</p><p><strong>Selected options / add-ons:</strong> {selectedBooking.notes || "Not provided"}</p></section>
                  <section><h4>Additional Requests / Notes</h4><p className="booking-notes">{selectedBooking.notes || "No additional requests provided."}</p></section>
                  <section><h4>Location Information</h4><p><strong>Meeting point:</strong> {content?.general.meetingPoint || "Not provided"}</p><p><strong>Pickup information:</strong> {selectedBooking.hotelName ? "Hotel pickup requested" : "No hotel pickup requested"}</p><p><strong>Hotel / accommodation:</strong> {selectedBooking.hotelName || "Not provided"}</p><p><strong>Pickup location:</strong> {selectedBooking.hotelAddress || "Not provided"}</p></section>
                  <section><h4>Payment Information</h4><p><strong>Total amount:</strong> {selectedBooking.currency || "USD"} {selectedBooking.totalAmount || 0}</p><p><strong>Amount paid:</strong> {selectedBooking.currency || "USD"} {selectedBooking.amountPaid || 0}</p><p><strong>Amount due:</strong> {selectedBooking.currency || "USD"} {selectedBooking.remainingBalance || 0}</p><p><strong>Customer currency:</strong> {selectedBooking.currency || "USD"}</p><p><strong>Payment method:</strong> {selectedBooking.paymentMethod || "Not provided"}</p><p><strong>Card brand:</strong> {selectedBooking.paymentBrand || "Not applicable"}</p><p><strong>Payment status:</strong> {selectedBooking.paymentStatus || "Pending"}</p><p><strong>Transaction ID:</strong> {selectedBooking.payherePaymentId || "Not provided"}</p></section>
                  <section><h4>System Information</h4><p><strong>Created:</strong> {formatBookingDateTime(selectedBooking.createdAt)}</p><p><strong>Last updated:</strong> {formatBookingDateTime(selectedBooking.updatedAt)}</p></section>
                </div>

                <div className="admin-status-controls">
                  <label>
                    Booking status
                    <select
                      value={selectedBooking.bookingStatus || "Pending"}
                      onChange={(event) => {
                        const nextValue = event.target.value as Booking["bookingStatus"];
                        updateBookingStatus(selectedBooking.id, selectedBooking.paymentStatus, nextValue);
                        setSelectedBooking({ ...selectedBooking, bookingStatus: nextValue });
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </label>

                  <label>
                    Payment status
                    <select
                      value={selectedBooking.paymentStatus || "Unpaid"}
                      onChange={(event) => {
                        const nextValue = event.target.value as Booking["paymentStatus"];
                        updateBookingStatus(selectedBooking.id, nextValue, selectedBooking.bookingStatus);
                        setSelectedBooking({ ...selectedBooking, paymentStatus: nextValue });
                      }}
                    >
                      <option value="Unpaid">Unpaid</option>
                      <option value="Pending">Pending</option>
                      <option value="Payment Pending">Payment Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </label>
                </div>
              </div>
            )}
          </section>
        </div>

        {activeSection === "reviews" && (
          <section className="admin-cms-section glass-panel">
            <div className="section-top">
              <div><h2>Featured Reviews</h2><p>Only reviews marked Featured appear on the public website.</p></div>
              <button className="cta-button" onClick={() => setEditingReview({ id: `review-${Date.now()}`, platform: "Google", authorName: "", rating: 5, text: "", isPlaceholder: false, featured: true, displayOrder: managedReviews.length })}>+ Add Review</button>
            </div>
            <div className="admin-review-list">
              {managedReviews.length === 0 && <p className="empty-state">No reviews yet. Add a review to build your featured section.</p>}
              {managedReviews.sort((a, b) => a.displayOrder - b.displayOrder).map((review) => (
                <div className="admin-product" key={review.id}>
                  <div><strong>{review.authorName || "Unnamed reviewer"}</strong><span>{review.platform} · {review.rating}/5 · {review.featured ? "Featured" : "Hidden"} · Order {review.displayOrder}</span></div>
                  <div className="admin-product-actions"><button className="back-button" onClick={() => setEditingReview(review)}>Edit</button><button className="danger-button" onClick={() => removeReview(review.id)}>Delete</button></div>
                </div>
              ))}
            </div>
            {editingReview && (
              <div className="admin-inline-editor editor-form">
                <div className="two"><label>Platform<select value={editingReview.platform} onChange={(event) => setEditingReview({ ...editingReview, platform: event.target.value as Review["platform"] })}><option>Google</option><option>GetYourGuide</option><option>Tripadvisor</option></select></label><label>Reviewer name<input value={editingReview.authorName} onChange={(event) => setEditingReview({ ...editingReview, authorName: event.target.value })} /></label></div>
                <div className="two"><label>Rating<input type="number" min="1" max="5" step="0.1" value={editingReview.rating} onChange={(event) => setEditingReview({ ...editingReview, rating: Number(event.target.value) })} /></label><label>Display order<input type="number" min="0" value={editingReview.displayOrder} onChange={(event) => setEditingReview({ ...editingReview, displayOrder: Number(event.target.value) })} /></label></div>
                <label>Review text<textarea value={editingReview.text || ""} onChange={(event) => setEditingReview({ ...editingReview, text: event.target.value })} /></label>
                <label className="checkbox-row"><input type="checkbox" checked={Boolean(editingReview.featured)} onChange={(event) => setEditingReview({ ...editingReview, featured: event.target.checked })} /> Featured review</label>
                <div className="admin-actions-row"><button className="back-button" onClick={() => setEditingReview(null)}>Cancel</button><button className="cta-button" onClick={saveReview}>Save Review</button></div>
              </div>
            )}
          </section>
        )}

        {activeSection === "ratings" && content && (
          <section className="admin-cms-section glass-panel">
            <div className="section-top"><div><h2>Reviews &amp; Online Ratings</h2><p>Manage platform ratings, review counts, public links and the homepage review section.</p></div><button className="cta-button" onClick={saveReviews}>Save Reviews</button></div>
            <div className="editor-form">
              <label>Review section heading<input value={content.reviews.heading} onChange={(event) => updateReviewSetting("heading", event.target.value)} /></label>
              <label>Review section subtitle<textarea value={content.reviews.subtitle} onChange={(event) => updateReviewSetting("subtitle", event.target.value)} /></label>
              <label>Total online reviews override<input type="number" min="0" placeholder="Leave blank to calculate automatically" value={content.reviews.totalReviewsOverride ?? ""} onChange={(event) => updateReviewSetting("totalReviewsOverride", event.target.value === "" ? null : Number(event.target.value))} /></label>
              <h3>Google</h3>
              <div className="image-upload-panel"><div className="upload-header-row"><span>Logo Image</span>{content.reviews.google.logoUrl && <button type="button" className="danger-button small-button" onClick={() => removeReviewLogo("google")}>Remove Logo</button>}</div>{content.reviews.google.logoUrl ? <img src={content.reviews.google.logoUrl} alt="Google logo preview" className="review-logo-preview" /> : <div className="image-placeholder">No logo uploaded</div>}<input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.svg,.heic,.heif,image/*" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; if (file) uploadReviewLogo("google", file); }} />{reviewLogoState.google === "uploading" && <p className="upload-status compact">Uploading logo...</p>}</div>
              <div className="two"><label>Rating<input type="number" min="0" max="5" step="0.1" value={content.reviews.google.rating} onChange={(event) => updatePlatformReview("google", "rating", Number(event.target.value))} /></label><label>Review count<input type="number" min="0" value={content.reviews.google.reviewCount} onChange={(event) => updatePlatformReview("google", "reviewCount", Number(event.target.value))} /></label></div>
              <div className="admin-array-block"><div className="section-top compact"><h3>Product / Review Links</h3><button type="button" className="back-button" onClick={() => addPlatformLink("google")}>+ Add Link</button></div>{content.reviews.google.links.map((link, index) => <div className="array-row" key={`google-link-${index}`}><input type="url" placeholder="https://..." value={link} onChange={(event) => updatePlatformLink("google", index, event.target.value)} /><button type="button" className="danger-button" onClick={() => removePlatformLink("google", index)}>Remove</button></div>)}</div>
              <h3>GetYourGuide</h3>
              <div className="image-upload-panel"><div className="upload-header-row"><span>Logo Image</span>{content.reviews.getyourguide.logoUrl && <button type="button" className="danger-button small-button" onClick={() => removeReviewLogo("getyourguide")}>Remove Logo</button>}</div>{content.reviews.getyourguide.logoUrl ? <img src={content.reviews.getyourguide.logoUrl} alt="GetYourGuide logo preview" className="review-logo-preview" /> : <div className="image-placeholder">No logo uploaded</div>}<input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.svg,.heic,.heif,image/*" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; if (file) uploadReviewLogo("getyourguide", file); }} />{reviewLogoState.getyourguide === "uploading" && <p className="upload-status compact">Uploading logo...</p>}</div>
              <div className="two"><label>Rating<input type="number" min="0" max="5" step="0.1" value={content.reviews.getyourguide.rating} onChange={(event) => updatePlatformReview("getyourguide", "rating", Number(event.target.value))} /></label><label>Review count<input type="number" min="0" value={content.reviews.getyourguide.reviewCount} onChange={(event) => updatePlatformReview("getyourguide", "reviewCount", Number(event.target.value))} /></label></div>
              <div className="admin-array-block"><div className="section-top compact"><h3>Product / Review Links</h3><button type="button" className="back-button" onClick={() => addPlatformLink("getyourguide")}>+ Add Link</button></div>{content.reviews.getyourguide.links.map((link, index) => <div className="array-row" key={`getyourguide-link-${index}`}><input type="url" placeholder="https://..." value={link} onChange={(event) => updatePlatformLink("getyourguide", index, event.target.value)} /><button type="button" className="danger-button" onClick={() => removePlatformLink("getyourguide", index)}>Remove</button></div>)}</div>
              <h3>Tripadvisor</h3>
              <div className="image-upload-panel"><div className="upload-header-row"><span>Logo Image</span>{content.reviews.tripadvisor.logoUrl && <button type="button" className="danger-button small-button" onClick={() => removeReviewLogo("tripadvisor")}>Remove Logo</button>}</div>{content.reviews.tripadvisor.logoUrl ? <img src={content.reviews.tripadvisor.logoUrl} alt="Tripadvisor logo preview" className="review-logo-preview" /> : <div className="image-placeholder">No logo uploaded</div>}<input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.svg,.heic,.heif,image/*" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; if (file) uploadReviewLogo("tripadvisor", file); }} />{reviewLogoState.tripadvisor === "uploading" && <p className="upload-status compact">Uploading logo...</p>}</div>
              <div className="two"><label>Rating<input type="number" min="0" max="5" step="0.1" value={content.reviews.tripadvisor.rating} onChange={(event) => updatePlatformReview("tripadvisor", "rating", Number(event.target.value))} /></label><label>Review count<input type="number" min="0" value={content.reviews.tripadvisor.reviewCount} onChange={(event) => updatePlatformReview("tripadvisor", "reviewCount", Number(event.target.value))} /></label></div>
              <div className="admin-array-block"><div className="section-top compact"><h3>Product / Review Links</h3><button type="button" className="back-button" onClick={() => addPlatformLink("tripadvisor")}>+ Add Link</button></div>{content.reviews.tripadvisor.links.map((link, index) => <div className="array-row" key={`tripadvisor-link-${index}`}><input type="url" placeholder="https://..." value={link} onChange={(event) => updatePlatformLink("tripadvisor", index, event.target.value)} /><button type="button" className="danger-button" onClick={() => removePlatformLink("tripadvisor", index)}>Remove</button></div>)}</div>
            </div>
          </section>
        )}

        {activeSection === "social" && content && (
          <section className="admin-cms-section glass-panel">
            <div className="section-top"><div><h2>Social Media Links</h2><p>Manage the compact social media row shown in the website footer.</p></div><div className="admin-actions"><button className="back-button" onClick={addSocialLink}>+ Add Social Link</button><button className="cta-button" onClick={saveSocialLinks}>Save Social Links</button></div></div>
            <div className="admin-review-list">
              {content.socialLinks.length === 0 && <p className="empty-state">No social media links configured yet.</p>}
              {content.socialLinks.map((social) => (
                <div className="admin-inline-editor editor-form" key={social.id}>
                  <div className="two"><label>Platform / name<select value={social.platform} onChange={(event) => updateSocialLink(social.id, { platform: event.target.value })}><option>Instagram</option><option>WhatsApp</option><option>Facebook</option><option>Tripadvisor</option><option>YouTube</option><option>TikTok</option><option>Other</option></select></label><label>Profile/page name<input value={social.name} onChange={(event) => updateSocialLink(social.id, { name: event.target.value })} /></label></div>
                  <label>Profile URL<input type="url" placeholder="https://..." value={social.url} onChange={(event) => updateSocialLink(social.id, { url: event.target.value })} /></label>
                  <div className="image-upload-panel"><div className="upload-header-row"><span>Profile image or platform icon</span>{social.imageUrl && <button type="button" className="danger-button small-button" onClick={() => removeSocialImage(social.id)}>Remove Image</button>}</div>{social.imageUrl ? <img src={social.imageUrl} alt={`${social.platform} preview`} className="review-logo-preview" /> : <div className="image-placeholder">No icon uploaded</div>}<input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.svg,.heic,.heif,image/*" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; if (file) uploadSocialImage(social.id, file); }} />{socialUploadState[social.id] === "uploading" && <p className="upload-status compact">Uploading icon...</p>}</div>
                  <div className="admin-actions-row"><button className="danger-button" onClick={() => removeSocialLink(social.id)}>Delete Link</button></div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === "content" && content && (
          <section className="admin-cms-section glass-panel">
            <div className="section-top"><div><h2>Website Content</h2><p>Edit the public copy and contact details without opening the source.</p></div><button className="cta-button" onClick={saveContent}>Save Website Content</button></div>
            <div className="editor-form">
              <h3>Home page</h3>
              <label>Hero title<input value={content.home.heroTitle} onChange={(event) => updateHomeContent("heroTitle", event.target.value)} /></label>
              <label>Hero subtitle / description<textarea value={content.home.heroSubtitle} onChange={(event) => updateHomeContent("heroSubtitle", event.target.value)} /></label>
              <div className="two"><label>Hero badge<input value={content.home.heroBadge} onChange={(event) => updateHomeContent("heroBadge", event.target.value)} /></label><label>Primary button<input value={content.home.primaryButtonText} onChange={(event) => updateHomeContent("primaryButtonText", event.target.value)} /></label></div>
              <label>Secondary button<input value={content.home.secondaryButtonText} onChange={(event) => updateHomeContent("secondaryButtonText", event.target.value)} /></label>
              <label>Hero image<input value={content.home.heroImage} onChange={(event) => updateHomeContent("heroImage", event.target.value)} /><input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.heic,.heif,image/*" onChange={(event) => event.target.files?.[0] && uploadContentImage("heroImage", event.target.files[0])} /></label>
              <div className="two"><label>About title<input value={content.home.aboutTitle} onChange={(event) => updateHomeContent("aboutTitle", event.target.value)} /></label><label>About image<input value={content.home.aboutImage} onChange={(event) => updateHomeContent("aboutImage", event.target.value)} /><input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.heic,.heif,image/*" onChange={(event) => event.target.files?.[0] && uploadContentImage("aboutImage", event.target.files[0])} /></label></div>
              <label>About description<textarea value={content.home.aboutDescription} onChange={(event) => updateHomeContent("aboutDescription", event.target.value)} /></label>
              <h3>About Us</h3>
              <label>About page title<input value={content.about.title} onChange={(event) => setContent({ ...content, about: { ...content.about, title: event.target.value } })} /></label>
              <label>About content sections<textarea value={content.about.sections.join("\n\n")} onChange={(event) => setContent({ ...content, about: { ...content.about, sections: toLines(event.target.value) } })} /></label>
              <h3>General settings</h3>
              <div className="two"><label>Phone<input value={content.general.contactPhone} onChange={(event) => updateGeneralContent("contactPhone", event.target.value)} /></label><label>WhatsApp number<input value={content.general.whatsappNumber} onChange={(event) => updateGeneralContent("whatsappNumber", event.target.value)} /></label></div>
              <div className="two"><label>Email<input value={content.general.email} onChange={(event) => updateGeneralContent("email", event.target.value)} /></label><label>Meeting point<input value={content.general.meetingPoint} onChange={(event) => updateGeneralContent("meetingPoint", event.target.value)} /></label></div>
              <label>Footer text<textarea value={content.general.footerText} onChange={(event) => updateGeneralContent("footerText", event.target.value)} /></label>
              <div className="two"><label>Instagram<input value={content.general.instagram} onChange={(event) => updateGeneralContent("instagram", event.target.value)} /></label><label>Facebook<input value={content.general.facebook} onChange={(event) => updateGeneralContent("facebook", event.target.value)} /></label></div>
              <label>Tripadvisor<input value={content.general.tripadvisor} onChange={(event) => updateGeneralContent("tripadvisor", event.target.value)} /></label>
              <h3>Find Us locations</h3>
              {(["ticketOffice", "boatPlace"] as const).map((locationKey) => { const location = content.locations[locationKey]; return <div className="admin-array-block" key={locationKey}><label>Location name<input value={location.name} onChange={(event) => updateLocation(locationKey, { name: event.target.value })} /></label><label>Short description<textarea value={location.description} onChange={(event) => updateLocation(locationKey, { description: event.target.value })} /></label><label>Location link / URL<input type="url" placeholder="https://..." value={location.url} onChange={(event) => updateLocation(locationKey, { url: event.target.value })} /></label><label>Link button text<input value={location.buttonText} onChange={(event) => updateLocation(locationKey, { buttonText: event.target.value })} /></label><label className="checkbox-row"><input type="checkbox" checked={location.enabled} onChange={(event) => updateLocation(locationKey, { enabled: event.target.checked })} /> Enabled</label><label>Optional image/icon<input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.svg,.heic,.heif,image/*" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; if (file) uploadLocationImage(locationKey, file); }} /></label>{location.imageUrl && <img src={location.imageUrl} alt="" className="review-logo-preview" />}</div>; })}
              <h3>Booking notifications</h3>
              <label>Business name<input value={content.bookingNotifications.businessName} onChange={(event) => setContent({ ...content, bookingNotifications: { ...content.bookingNotifications, businessName: event.target.value } })} /></label>
              <label>Owner/Admin Gmail address<input type="email" value={content.bookingNotifications.ownerEmail} onChange={(event) => setContent({ ...content, bookingNotifications: { ...content.bookingNotifications, ownerEmail: event.target.value } })} /></label>
              <label>Owner/Admin WhatsApp number<input value={content.bookingNotifications.ownerWhatsApp} onChange={(event) => setContent({ ...content, bookingNotifications: { ...content.bookingNotifications, ownerWhatsApp: event.target.value } })} /></label>
              <label>Business logo<input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.svg,.heic,.heif,image/*" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; if (file) uploadBusinessLogo(file); }} /></label>
              {content.bookingNotifications.businessLogoUrl && <img src={content.bookingNotifications.businessLogoUrl} alt="Business logo preview" className="review-logo-preview" />}
              <label>Booking instructions<textarea value={content.bookingNotifications.bookingInstructions} onChange={(event) => setContent({ ...content, bookingNotifications: { ...content.bookingNotifications, bookingInstructions: event.target.value } })} /></label>
            </div>
          </section>
        )}

        {activeSection === "gallery" && (
          <section className="admin-cms-section glass-panel">
            <div className="section-top"><div><h2>Gallery</h2><p>Upload, edit, remove and reorder public gallery photos.</p></div><div className="admin-actions"><label htmlFor="cms-gallery-upload" className="cta-button upload-action">+ Add Images</label><input id="cms-gallery-upload" type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.heic,.heif,image/*" multiple onChange={addGalleryFiles} hidden /><button className="cta-button" onClick={saveGallery}>Save Gallery</button></div></div>
            <div className="cms-gallery-grid">
              {gallery.map((image, index) => (
                <div className="cms-gallery-item" key={image.id}>{image.src.startsWith("blob:") ? <img /* eslint-disable-next-line @next/next/no-img-element */ src={image.src} alt={image.alt} width={360} height={260} className="gallery-thumb" /> : <Image src={image.src} alt={image.alt} width={360} height={260} className="gallery-thumb" />}<input value={image.alt} onChange={(event) => setGallery((items) => items.map((item) => item.id === image.id ? { ...item, alt: event.target.value } : item))} /><select value={image.category} onChange={(event) => setGallery((items) => items.map((item) => item.id === image.id ? { ...item, category: event.target.value as GalleryImage["category"] } : item))}>{galleryCategories.map((category) => <option key={category}>{category}</option>)}</select><div className="admin-product-actions"><button className="back-button" disabled={index === 0} onClick={() => setGallery((items) => items.map((item, itemIndex) => itemIndex === index - 1 ? items[index] : itemIndex === index ? items[index - 1] : item))}>Move left</button><button className="back-button" disabled={index === gallery.length - 1} onClick={() => setGallery((items) => items.map((item, itemIndex) => itemIndex === index + 1 ? items[index] : itemIndex === index ? items[index + 1] : item))}>Move right</button><button className="danger-button" onClick={() => setGallery((items) => items.filter((item) => item.id !== image.id))}>Remove</button></div></div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
