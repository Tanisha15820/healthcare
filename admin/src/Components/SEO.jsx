import { useEffect } from "react";
import { SITE_CONFIG } from "../config/seo";

/**
 * SEO component for dynamic head metadata & structured data management.
 * Compatible with React 19 head hoisting and client-side page transitions.
 */
export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = "website",
  jsonLd,
  noIndex = false,
}) {
  const fullTitle = title
    ? `${title} | ${SITE_CONFIG.siteName}`
    : SITE_CONFIG.defaultTitle;
  const metaDescription = description || SITE_CONFIG.defaultDescription;
  const metaKeywords = keywords || SITE_CONFIG.defaultKeywords;
  const canonicalUrl = canonical
    ? `${SITE_CONFIG.domain}${canonical}`
    : SITE_CONFIG.domain;
  const imageUrl = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : `${SITE_CONFIG.domain}${ogImage}`
    : `${SITE_CONFIG.domain}${SITE_CONFIG.defaultOgImage}`;

  // Fallback update document title directly for all browser routing engines
  useEffect(() => {
    document.title = fullTitle;
  }, [fullTitle]);

  return (
    <>
      {/* Title */}
      <title>{fullTitle}</title>

      {/* Basic Meta Tags */}
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large"} />

      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags for Social Media */}
      <meta property="og:site_name" content={SITE_CONFIG.siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageUrl} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(Array.isArray(jsonLd) ? jsonLd : jsonLd),
          }}
        />
      )}
    </>
  );
}
