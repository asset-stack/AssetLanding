// Central site configuration — replaces all runtime Base44 calls.
// Everything the old site fetched from a backend at page load lives here as
// plain build-time config, so the marketing site never talks to a server.

// Where "Sign in" goes. Plain link — no auth SDK on the marketing site.
export const PLATFORM_URL = 'https://bunburycouncil.assetstack.site/';

// Contact form delivery.
// FORM_ENDPOINT: a form backend that accepts a JSON POST (e.g. Formspree:
// create a form at https://formspree.io and paste its URL here, like
// 'https://formspree.io/f/abcdwxyz'). While it is empty the form falls back
// to opening the visitor's mail client with every field included.
export const FORM_ENDPOINT = '';
export const CONTACT_EMAILS = ['david@assetstackai.com', 'josh@assetstackai.com'];

// Landing page section order. Previously fetched from the Base44
// `LandingLayout` entity at runtime; this is the exact active layout from
// production (captured 2026-07-22) with hidden sections omitted
// (sisterHero, sisterEcosystem, pricing were visible:false).
// To reorder/hide sections, edit this array and redeploy.
// Keys must match SECTION_REGISTRY in components/landing/sectionRegistry.jsx.
export const SECTION_ORDER = [
  'hero',
  'personaSwitcher',
  'industries',
  'mechanism',
  'productTour',
  'savingsProof',
  'sisterFeatures',
  'personaCards',
  'roiCalculator',
  'security',
  'firstWeek',
  'logoCloud',
  'whatsNew',
  'assetMind',
  'faq',
  'finalCTA',
  'contact',
];

// Webinars. Previously fetched from the Base44 `Webinar` entity at runtime.
// The WebinarSection hides itself when this list is empty — populate entries
// like the example to bring it back.
// Shape: { title, scheduled_date (ISO string), duration_minutes,
//          youtube_url, registration_url, description }
export const WEBINARS = [];
