export function formatJstDateWithoutSeconds(date) {
  // ローカルタイムゾーンでフォーマットされた日時を取得
  const formattedDate = date.toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo", // タイムゾーンを指定
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "numeric",
  });
  return formattedDate.slice(0, -3).replace(/\//g, "-").replace(/, /, "T");
}

export function formatToReadableDateTime(isoDate) {
  const date = new Date(isoDate);
  const formattedDate = date.toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo", // UTC時刻を保持
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return formattedDate.replace(/-/g, "/").replace(/ /, " ");
}
