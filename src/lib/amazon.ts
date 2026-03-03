import { SITE } from "./config";

// Amazon product image from ASIN (uses Amazon's public image CDN)
export function amazonImage(asin: string): string {
  return `https://ws-eu.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=${asin}&Format=_SL250_&ID=AsinImage&MarketPlace=ES&ServiceVersion=20070822&WS=1&tag=${SITE.amazonTag}`;
}

// Fallback: direct Amazon image URL
export function amazonImageDirect(asin: string): string {
  return `https://m.media-amazon.com/images/I/${asin}._AC_SL300_.jpg`;
}

// Amazon affiliate link
export function amazonLink(asin: string): string {
  return `https://www.amazon.es/dp/${asin}?tag=${SITE.amazonTag}&linkCode=ogi&th=1`;
}
