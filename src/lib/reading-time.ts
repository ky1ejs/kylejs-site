// A GFM footnote definition (`[^id]: text`) and its indented continuation lines
const FOOTNOTE_DEFINITION = /^\[\^[^\]]+\]:.*(?:\n+(?: {4}|\t).*)*/gm;

export default function calculateReadingTime(text: string) {
  const wordsPerMinute = 200;
  // References are skimmed, not read, so leave them out of the estimate
  const body = text.replace(FOOTNOTE_DEFINITION, "");
  const textLength = body.split(" ").length;
  const value = Math.ceil(textLength / wordsPerMinute);
  return `~${value} min read`;
}
