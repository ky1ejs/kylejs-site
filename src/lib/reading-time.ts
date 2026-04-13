export default function calculateReadingTime(text: string) {
  const wordsPerMinute = 200;
  const textLength = text.split(" ").length;
  const value = Math.ceil(textLength / wordsPerMinute);
  return `~${value} min read`;
}
