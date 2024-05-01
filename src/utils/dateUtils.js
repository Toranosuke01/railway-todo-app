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

export function formatDateTimeWithoutSeconds(dateTimeStr) {
  const date = new Date(dateTimeStr);
  return date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM" 形式に変換
}
