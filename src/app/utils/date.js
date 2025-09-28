// utils/date.js
export function formatDate(isoString, options = {}) {
  if (!isoString) return "";

  const date = new Date(isoString);

  // Default: e.g. "Sep 27, 2025, 3:15 PM"
  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-US", { ...defaultOptions, ...options }).format(date);
}

// Example: relative time (e.g. "5 minutes ago")
export function formatRelative(isoString) {
  if (!isoString) return "";

  const date = new Date(isoString);
  const now = new Date();
  const diff = (now - date) / 1000; // in seconds

  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
