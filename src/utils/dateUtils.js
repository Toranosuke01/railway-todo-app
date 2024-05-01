export function convertJstDate(date) {
  const japanTime = date.toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  return japanTime.replace(/\//g, "-").replace(/ /, "T");
}
