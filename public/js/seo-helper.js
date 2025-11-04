/**
 * SEO Helper Functions
 * Generates dynamic meta tags for pages
 */

// Base SEO configuration
const SEO_CONFIG = {
  siteName: 'CineVerse Analytics',
  siteUrl: 'https://cineverse.com', // Update with your actual domain
  defaultImage: 'https://cineverse.com/images/og-image.jpg', // Update with your actual OG image
  twitterHandle: '@CineVerse', // Update with your Twitter handle
  author: 'Mohammad Aakib Bhat'
};

/**
 * Set meta tags for a page
 * @param {Object} options - SEO options
 */
function setMetaTags(options) {
  const {
    title,
    description,
    keywords,
    image,
    url,
    type = 'website'
  } = options;

  // Basic meta tags
  setMetaTag('title', title);
  setMetaTag('description', description || '');
  setMetaTag('keywords', keywords || 'movies, box office, cinema, analytics, hollywood, bollywood, tollywood');
  
  // Open Graph tags
  setMetaTag('og:title', title, 'property');
  setMetaTag('og:description', description || '', 'property');
  setMetaTag('og:image', image || SEO_CONFIG.defaultImage, 'property');
  setMetaTag('og:url', url || window.location.href, 'property');
  setMetaTag('og:type', type, 'property');
  setMetaTag('og:site_name', SEO_CONFIG.siteName, 'property');
  
  // Twitter Card tags
  setMetaTag('twitter:card', 'summary_large_image');
  setMetaTag('twitter:title', title);
  setMetaTag('twitter:description', description || '');
  setMetaTag('twitter:image', image || SEO_CONFIG.defaultImage);
  setMetaTag('twitter:site', SEO_CONFIG.twitterHandle);
  
  // Update page title
  document.title = title;
}

/**
 * Set or update a meta tag
 * @param {string} name - Meta tag name or property
 * @param {string} content - Meta tag content
 * @param {string} attribute - Attribute type ('name' or 'property')
 */
function setMetaTag(name, content, attribute = 'name') {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
}

/**
 * Set structured data (JSON-LD) for movies
 * @param {Object} movie - Movie object
 */
function setMovieStructuredData(movie) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.title,
    "datePublished": movie.year ? `${movie.year}-01-01` : undefined,
    "director": {
      "@type": "Person",
      "name": movie.director || "Unknown"
    },
    "aggregateRating": movie.imdb_rating ? {
      "@type": "AggregateRating",
      "ratingValue": movie.imdb_rating,
      "bestRating": "10",
      "worstRating": "1"
    } : undefined,
    "description": movie.description,
    "image": movie.poster_url,
    "genre": Array.isArray(movie.genres) ? movie.genres : (movie.genres ? [movie.genres] : []),
    "duration": movie.runtime
  };

  // Remove undefined values
  Object.keys(structuredData).forEach(key => {
    if (structuredData[key] === undefined) {
      delete structuredData[key];
    }
  });

  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

/**
 * Set structured data for the website
 */
function setWebsiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SEO_CONFIG.siteName,
    "url": SEO_CONFIG.siteUrl,
    "description": "Global Cinema Analytics Platform - Box Office data for Hollywood, Bollywood, and Tollywood movies",
    "author": {
      "@type": "Person",
      "name": SEO_CONFIG.author
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SEO_CONFIG.siteUrl}/movies.html?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { setMetaTags, setMovieStructuredData, setWebsiteStructuredData };
}

