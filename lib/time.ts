const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;

export function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  if (diff < MINUTE) return "just now";
  if (diff < HOUR) {
    const mins = Math.floor(diff / MINUTE);
    return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  }
  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  if (diff < 2 * DAY) return "yesterday";
  if (diff < WEEK) {
    const days = Math.floor(diff / DAY);
    return `${days} days ago`;
  }
  if (diff < 2 * WEEK) return "last week";
  if (diff < MONTH) {
    const weeks = Math.floor(diff / WEEK);
    return weeks === 1 ? "last week" : `${weeks} weeks ago`;
  }
  if (diff < 6 * MONTH) {
    const months = Math.floor(diff / MONTH);
    return months === 1 ? "last month" : `${months} months ago`;
  }

  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}
