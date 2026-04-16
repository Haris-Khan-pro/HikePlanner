// frontend-hike/services/sentimentService.ts
// Utility to display sentiment badges and colors on trail cards

export type SentimentLabel = "POSITIVE" | "NEGATIVE" | "NEUTRAL";

export interface SentimentBadge {
  label: string;
  color: string;
  bgColor: string;
  emoji: string;
}

/**
 * Returns display properties for a sentiment label.
 * Used on TrailCard and TrailDetails to show social media sentiment.
 */
export function getSentimentBadge(label: SentimentLabel): SentimentBadge {
  switch (label) {
    case "POSITIVE":
      return {
        label: "Trending 🔥",
        color: "#16a34a",
        bgColor: "#dcfce7",
        emoji: "🔥",
      };
    case "NEGATIVE":
      return {
        label: "Mixed Reviews",
        color: "#dc2626",
        bgColor: "#fee2e2",
        emoji: "⚠️",
      };
    case "NEUTRAL":
    default:
      return {
        label: "Steady",
        color: "#d97706",
        bgColor: "#fef9c3",
        emoji: "📊",
      };
  }
}

/**
 * Converts a recommendation_stars value to a display string.
 * e.g. 4.3 -> "★★★★☆"
 */
export function starsToDisplay(stars: number): string {
  const full = Math.floor(stars);
  const half = stars - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}

/**
 * Returns a color for a recommendation label string.
 */
export function getRecommendationColor(label: string): string {
  switch (label) {
    case "Highly Recommended":
      return "#16a34a";
    case "Recommended":
      return "#2563eb";
    case "Mixed Reviews":
      return "#d97706";
    case "Not Recommended":
      return "#dc2626";
    default:
      return "#6b7280";
  }
}