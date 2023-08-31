"use client";

export function getRelativeTimeString(date: Date): string {
  const today = new Date();
  const diff = Math.abs(date.getTime() - today.getTime());
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24));

  if (diffDays > 7) {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${ordinalStringForNumber(day)} of ${month}, ${year}`;
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
  const formatted = getRelativeTimeString(date);
  return <p>{formatted}</p>;
}
