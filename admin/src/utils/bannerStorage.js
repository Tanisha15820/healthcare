// LocalStorage manager for Homepage Banners (Multi-Slide CRUD)

export const BANNER_SLIDES_KEY = "rhs_banner_slides_v2";
export const BANNER_STORAGE_KEY = "rhs_banner_data"; // Legacy support

export const DEFAULT_BANNER_SLIDES = [
  {
    id: "slide-1",
    image: "", // Empty string means use the built-in home.png
    smallHeading: "Trusted Healthcare Services",
    headingLine1: "Quality Equipment.",
    headingHighlight: "Better Healthcare.",
    singleLine: false,
    description:
      "Reinforce Healthcare Services delivers quality medical equipment and innovative solutions designed to support healthcare professionals across multiple specialties.",
    primaryBtnText: "Book an Appointment",
    primaryBtnLink: "/contact",
    secondaryBtnText: "Explore Products",
    secondaryBtnLink: "/machine",
    isActive: true,
  },
  {
    id: "slide-2",
    image: "", // Empty string means use the built-in home_bg1.png
    smallHeading: "Trusted Healthcare Services",
    headingLine1: "LithoPulse",
    headingHighlight: "35W",
    singleLine: true,
    description: "Compact laser system for precise clinical performance",
    primaryBtnText: "Book an Appointment",
    primaryBtnLink: "/contact",
    secondaryBtnText: "Explore Products",
    secondaryBtnLink: "/machine",
    isActive: true,
  },
];

// Fallback legacy object for compatibility
export const DEFAULT_BANNER_DATA = {
  ...DEFAULT_BANNER_SLIDES[0],
  mainHeading: DEFAULT_BANNER_SLIDES[0].headingLine1,
  bannerImage: "",
  lastUpdated: null,
};

/**
 * Retrieve all banner slides from localStorage
 * @returns {Array<typeof DEFAULT_BANNER_SLIDES[0]>}
 */
export const getAllBanners = () => {
  try {
    const raw = localStorage.getItem(BANNER_SLIDES_KEY);
    if (!raw) {
      // Check if there was a legacy single banner saved
      const legacyRaw = localStorage.getItem(BANNER_STORAGE_KEY);
      if (legacyRaw) {
        try {
          const parsedLegacy = JSON.parse(legacyRaw);
          const converted = [
            {
              ...DEFAULT_BANNER_SLIDES[0],
              smallHeading: parsedLegacy.smallHeading || DEFAULT_BANNER_SLIDES[0].smallHeading,
              headingLine1: parsedLegacy.mainHeading || parsedLegacy.headingLine1 || DEFAULT_BANNER_SLIDES[0].headingLine1,
              headingHighlight: parsedLegacy.headingHighlight || DEFAULT_BANNER_SLIDES[0].headingHighlight,
              description: parsedLegacy.description || DEFAULT_BANNER_SLIDES[0].description,
              primaryBtnText: parsedLegacy.primaryBtnText || DEFAULT_BANNER_SLIDES[0].primaryBtnText,
              primaryBtnLink: parsedLegacy.primaryBtnLink || DEFAULT_BANNER_SLIDES[0].primaryBtnLink,
              secondaryBtnText: parsedLegacy.secondaryBtnText || DEFAULT_BANNER_SLIDES[0].secondaryBtnText,
              secondaryBtnLink: parsedLegacy.secondaryBtnLink || DEFAULT_BANNER_SLIDES[0].secondaryBtnLink,
              image: parsedLegacy.bannerImage || "",
            },
            DEFAULT_BANNER_SLIDES[1],
          ];
          localStorage.setItem(BANNER_SLIDES_KEY, JSON.stringify(converted));
          return converted;
        } catch {
          // ignore error
        }
      }
      return DEFAULT_BANNER_SLIDES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_BANNER_SLIDES;
  } catch (error) {
    console.error("Failed to read banner slides from localStorage:", error);
    return DEFAULT_BANNER_SLIDES;
  }
};

/**
 * Save updated slides list to localStorage and dispatch update events
 * @param {Array} slides
 * @returns {boolean}
 */
export const saveAllBanners = (slides) => {
  try {
    localStorage.setItem(BANNER_SLIDES_KEY, JSON.stringify(slides));
    window.dispatchEvent(
      new CustomEvent("rhs_banner_updated", { detail: slides })
    );
    return true;
  } catch (error) {
    console.error("Failed to save banner slides to localStorage:", error);
    return false;
  }
};

/**
 * Add a new banner slide
 * @param {object} newSlide
 * @returns {Array} updated slides
 */
export const addBannerSlide = (newSlide) => {
  const current = getAllBanners();
  const slideToAdd = {
    id: `slide-${Date.now()}`,
    image: newSlide.image || "",
    smallHeading: newSlide.smallHeading || "Trusted Healthcare Services",
    headingLine1: newSlide.headingLine1 || "Advanced Medical Solutions",
    headingHighlight: newSlide.headingHighlight || "For Better Care",
    singleLine: Boolean(newSlide.singleLine),
    description:
      newSlide.description ||
      "Delivering world-class surgical and diagnostic equipment for healthcare professionals.",
    primaryBtnText: newSlide.primaryBtnText || "Book an Appointment",
    primaryBtnLink: newSlide.primaryBtnLink || "/contact",
    secondaryBtnText: newSlide.secondaryBtnText || "Explore Products",
    secondaryBtnLink: newSlide.secondaryBtnLink || "/machine",
    isActive: true,
  };
  const updated = [...current, slideToAdd];
  saveAllBanners(updated);
  return updated;
};

/**
 * Update an existing banner slide by ID
 * @param {string} id
 * @param {object} updatedFields
 * @returns {Array} updated slides
 */
export const updateBannerSlide = (id, updatedFields) => {
  const current = getAllBanners();
  const updated = current.map((slide) =>
    slide.id === id ? { ...slide, ...updatedFields } : slide
  );
  saveAllBanners(updated);
  return updated;
};

/**
 * Delete a banner slide by ID
 * @param {string} id
 * @returns {{success: boolean, message?: string, slides: Array}}
 */
export const deleteBannerSlide = (id) => {
  const current = getAllBanners();
  if (current.length <= 1) {
    return {
      success: false,
      message: "At least one banner slide must remain active on the homepage.",
      slides: current,
    };
  }
  const updated = current.filter((slide) => slide.id !== id);
  saveAllBanners(updated);
  return {
    success: true,
    slides: updated,
  };
};

/**
 * Reset all banners to factory defaults
 * @returns {Array}
 */
export const resetBanners = () => {
  try {
    localStorage.removeItem(BANNER_SLIDES_KEY);
    localStorage.removeItem(BANNER_STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent("rhs_banner_updated", { detail: DEFAULT_BANNER_SLIDES })
    );
    return DEFAULT_BANNER_SLIDES;
  } catch (error) {
    console.error("Failed to reset banner slides:", error);
    return DEFAULT_BANNER_SLIDES;
  }
};

// ================= Legacy functions for backward compatibility =================
export const getBannerData = () => {
  const slides = getAllBanners();
  const first = slides[0] || DEFAULT_BANNER_SLIDES[0];
  return {
    ...first,
    mainHeading: first.headingLine1,
    bannerImage: first.image,
  };
};

export const saveBannerData = (updatedData) => {
  const slides = getAllBanners();
  const first = slides[0] || DEFAULT_BANNER_SLIDES[0];
  const updatedFirst = {
    ...first,
    smallHeading: updatedData.smallHeading ?? first.smallHeading,
    headingLine1: updatedData.mainHeading ?? updatedData.headingLine1 ?? first.headingLine1,
    headingHighlight: updatedData.headingHighlight ?? first.headingHighlight,
    description: updatedData.description ?? first.description,
    primaryBtnText: updatedData.primaryBtnText ?? first.primaryBtnText,
    primaryBtnLink: updatedData.primaryBtnLink ?? first.primaryBtnLink,
    secondaryBtnText: updatedData.secondaryBtnText ?? first.secondaryBtnText,
    secondaryBtnLink: updatedData.secondaryBtnLink ?? first.secondaryBtnLink,
    image: updatedData.bannerImage !== undefined ? updatedData.bannerImage : first.image,
  };
  const updatedSlides = [updatedFirst, ...slides.slice(1)];
  return saveAllBanners(updatedSlides);
};

export const resetBannerData = () => {
  resetBanners();
  return DEFAULT_BANNER_DATA;
};
