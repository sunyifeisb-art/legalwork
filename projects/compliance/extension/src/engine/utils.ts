export function uniqueKeepOrder<T>(items: T[]): T[] {
  const seen = new Set<T>();
  const output: T[] = [];
  for (const item of items) {
    if (item === undefined || item === null) continue;
    if (seen.has(item)) continue;
    seen.add(item);
    output.push(item);
  }
  return output;
}

export function containsAny(text: string, words: string[]): string[] {
  return uniqueKeepOrder(words.filter((word) => word && text.includes(word)));
}

export function normalizeText(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\f/g, '\n')
    .replace(/[\t\u3000]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/ {2,}/g, ' ')
    .trim();
}

export function segmentText(text: string, maxChars = 500): string[] {
  const paragraphs = text
    .split('\n\n')
    .map((part) => part.trim())
    .filter(Boolean);
  const output: string[] = [];
  let buffer = '';
  for (const paragraph of paragraphs) {
    if (!buffer) {
      buffer = paragraph;
      continue;
    }
    if (buffer.length + paragraph.length + 2 <= maxChars) {
      buffer += `\n\n${paragraph}`;
    } else {
      output.push(buffer);
      buffer = paragraph;
    }
  }
  if (buffer) output.push(buffer);
  if (!output.length && text) output.push(text.slice(0, maxChars));
  return output;
}

export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[。！？；\n])/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function findRelevantSnippets(
  text: string,
  triggerTerms: string[],
  extraTerms: string[] = [],
  limit = 2
): string[] {
  const sentences = splitSentences(text);
  const scored = sentences
    .map((sentence) => ({
      sentence,
      score:
        containsAny(sentence, triggerTerms).length * 3 +
        containsAny(sentence, extraTerms).length
    }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score || left.sentence.length - right.sentence.length);

  const snippets: string[] = [];
  for (const item of scored) {
    let snippet = item.sentence.replace(/\n/g, ' ');
    if (snippet.length > 80) snippet = `${snippet.slice(0, 77)}...`;
    if (!snippets.includes(snippet)) snippets.push(snippet);
    if (snippets.length >= limit) break;
  }
  return snippets;
}

export function mergeText(left: string, right: string): string {
  const a = (left || '').trim();
  const b = (right || '').trim();
  if (!a) return b;
  if (!b || a === b || a.includes(b)) return a;
  return `${a}；${b}`;
}

export function mergeList<T>(left: T[] = [], right: T[] = []): T[] {
  const seen = new Set<string>();
  const output: T[] = [];
  for (const item of [...left, ...right]) {
    const key = typeof item === 'object' ? JSON.stringify(item) : String(item);
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(item);
  }
  return output;
}
