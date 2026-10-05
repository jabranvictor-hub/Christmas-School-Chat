// Detect if text contains significant Arabic / Urdu characters
export function isUrduText(text: string): boolean {
  if (!text) return false;
  // Regex for Arabic, Urdu, Persian characters
  const urduRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/g;
  const matches = text.match(urduRegex);
  if (!matches) return false;
  // If at least 15% of alphabetical characters are Urdu or has 4+ Urdu chars
  return matches.length >= 3;
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    console.error('Failed to copy text:', e);
    return false;
  }
}
