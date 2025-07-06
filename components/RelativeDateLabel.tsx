"use client";

export function getRelativeTimeString(date: Date): string {
  // Get date strings to avoid timezone issues
  const today = new Date();
  const todayStr =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  // For other calculations, work with UTC dates
  const todayUTC = new Date(todayStr + "T00:00:00.000Z");

  const diff = date.getTime() - todayUTC.getTime();
  const diffDays = Math.floor(Math.abs(diff) / (1000 * 3600 * 24));

  if (diffDays > 7) {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${ordinalStringForNumber(day)} of ${month}, ${year}`;
  }

  if (diffDays === 0) {
    return "today";
  }

  return `Posted ${daysAgoString(diffDays)}`;
}

function ordinalStringForNumber(n: number): string {
  // written by co-pilot
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function daysAgoString(n: number): string {
  if (n === 1) {
    return "yesterday";
  } else {
    return `${n} days ago`;
  }
}

export default function RelativeDateLabel({ date }: { date: Date }) {
  const inputDate = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0,
      0,
      0,
      0,
    ),
  );

  const formatted = getRelativeTimeString(inputDate);
  const fullDate = inputDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="cursor-pointer" title={fullDate}>
      {formatted}
    </div>
  );
}
