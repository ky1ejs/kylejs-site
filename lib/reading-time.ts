export default function calculateReadingTime(text: string) {
  const wordsPerMinute = 200; // Average case.
  const textLength = text.split(" ").length; // Split by words
  const value = Math.ceil(textLength / wordsPerMinute);
  return `~${value} min read`;
}
