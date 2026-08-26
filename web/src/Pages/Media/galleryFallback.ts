// Static gallery data used whenever the gallery API is unreachable or returns
// nothing. The API (api.featherlitesignature.futeservices.in) has been down, and
// an empty gallery page reads as a broken site - these are the same Cloudflare
// renders the rest of the app already ships, so the page always has content.

const CF = "https://imagedelivery.net/P8tnuaA1tzTsMrrU-cVoNg/assets/featherlite";

export interface GalleryImage {
  url: string;
  title: string;
}

export interface GalleryCategory {
  category: string;
  images: GalleryImage[];
}

export const FALLBACK_GALLERY: GalleryCategory[] = [
  {
    category: "exterior",
    images: [
      { url: `${CF}/home/signature-sunset/web2560`, title: "Signature at Sunset" },
      { url: `${CF}/home/home-page-light/web2560`, title: "Daylight Facade" },
      { url: `${CF}/home/home-page-dark/web2560`, title: "Evening Facade" },
      { url: `${CF}/availabilitypage/building/web2560`, title: "Tower Elevation" },
      { url: `${CF}/floorplan/floorplan-building/web2560`, title: "Building Massing" },
      { url: `${CF}/floorplan/masterplan-2-jpg/web2560`, title: "Masterplan" },
      { url: `${CF}/floorplan/terrace-plan-2-jpg/web2560`, title: "Terrace Plan" },
    ],
  },
  {
    category: "interior",
    images: [
      { url: `${CF}/amenities/popup/double-height-reception/web2560`, title: "Double Height Reception" },
      { url: `${CF}/amenities/popup/cafeteria-250226/web2560`, title: "Cafeteria" },
      { url: `${CF}/amenities/popup/restaurant/web2560`, title: "Restaurant" },
      { url: `${CF}/amenities/popup/rooftop-lunch-cafe/web2560`, title: "Rooftop Lunch Cafe" },
      { url: `${CF}/amenities/popup/outdoor-seating-zone/web2560`, title: "Outdoor Seating Zone" },
      { url: `${CF}/amenities/popup/multipurpose-court/web2560`, title: "Multipurpose Court" },
      { url: `${CF}/amenities/popup/table-tennis/web2560`, title: "Table Tennis" },
      { url: `${CF}/amenities/popup/creche/web2560`, title: "Creche" },
      { url: `${CF}/amenities/popup/copy-of-kids-play/web2560`, title: "Kids Play Area" },
      { url: `${CF}/amenities/popup/serving-kiosk/web2560`, title: "Serving Kiosk" },
      { url: `${CF}/amenities/popup/ev-charge/web2560`, title: "EV Charging" },
    ],
  },
];

// Slides are rendered full-bleed, so a card/thumbnail variant looks soft. Ask
// Cloudflare Images for the large variant instead; non-Cloudflare URLs pass
// through untouched.
const SMALL_VARIANTS = new Set(["card", "thumbnail", "public", "web"]);

function upgradeVariant(url: string): string {
  if (!url.includes("imagedelivery.net")) return url;
  const slash = url.lastIndexOf("/");
  if (slash === -1) return url;
  const variant = url.slice(slash + 1);
  return SMALL_VARIANTS.has(variant) ? `${url.slice(0, slash)}/web2560` : url;
}

/**
 * The gallery API has shipped more than one response shape over time (grouped
 * by category, or a flat list of images carrying their own `category`). Accept
 * both, and drop anything without a usable image URL.
 */
export function normalizeGallery(raw: unknown): GalleryCategory[] {
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as { data?: unknown })?.data)
      ? ((raw as { data: unknown[] }).data)
      : [];

  const grouped = new Map<string, GalleryImage[]>();

  for (const entry of list as any[]) {
    if (!entry || typeof entry !== "object") continue;
    const category = String(entry.category ?? "").toLowerCase().trim();
    if (!category) continue;

    const items: any[] = Array.isArray(entry.images) ? entry.images : [entry];
    for (const item of items) {
      const url = item?.url || item?.image || item?.src;
      if (!url) continue;
      const bucket = grouped.get(category) ?? [];
      bucket.push({ url: upgradeVariant(String(url)), title: String(item?.title ?? "") });
      grouped.set(category, bucket);
    }
  }

  return [...grouped.entries()]
    .filter(([, images]) => images.length > 0)
    .map(([category, images]) => ({ category, images }));
}
