export const SITE_CONFIG = {
  domain: "https://www.reinforcehealth.com", // Replace with your actual production domain
  siteName: "Reinforce Healthcare Services",
  defaultTitle: "Reinforce Healthcare Services | Medical Equipment & Machine Rental for Hospitals & Doctors",
  titleTemplate: "%s | Reinforce Healthcare Services",
  defaultDescription: "Reinforce Healthcare Services provides top-quality medical equipment, urology devices, and advanced healthcare machinery on rent for hospitals, clinics, and doctors.",
  defaultKeywords: [
    "medical equipment rental",
    "hospital machine rental",
    "doctor medical device rental",
    "urology machine rental",
    "healthcare equipment leasing",
    "Reinforce Healthcare Services",
    "medical machines for rent",
    "surgical equipment rental",
  ].join(", "),
  defaultOgImage: "/favicon.svg",
  contactPhone: "", // Add contact phone if available
  contactEmail: "", // Add contact email if available
};

export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["MedicalBusiness", "EquipmentRentalAgency"],
  "name": SITE_CONFIG.siteName,
  "url": SITE_CONFIG.domain,
  "logo": `${SITE_CONFIG.domain}/favicon.svg`,
  "description": SITE_CONFIG.defaultDescription,
  "priceRange": "$$",
  "knowsAbout": [
    "Medical Equipment Rental",
    "Urology Equipment",
    "Hospital Machinery Leasing",
    "Healthcare Services for Doctors and Hospitals"
  ],
  "medicalSpecialty": "Hospital Services",
  "areaServed": "India",
  "targetAudience": {
    "@type": "Audience",
    "audienceType": "Hospitals, Clinics, Doctors, Medical Professionals"
  }
};
