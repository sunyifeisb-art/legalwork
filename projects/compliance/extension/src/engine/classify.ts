import { documentTypesConfig } from '../shared/config';
import { containsAny } from './utils';

export interface ClassificationResult {
  type: string;
  name: string;
  score: number;
  matchedKeywords: string[];
  defaultReviewPaths: string[];
  candidates: Array<{
    type: string;
    name: string;
    score: number;
    matchedKeywords: string[];
    defaultReviewPaths: string[];
  }>;
}

export function classifyDocument(text: string): ClassificationResult {
  const lowered = text.toLowerCase();
  const candidates = documentTypesConfig.types
    .map((item) => {
      const keywordWeights = (item.keyword_weights ?? {}) as Record<string, number>;
      const matchedKeywords = item.keywords.filter((keyword) =>
        lowered.includes(keyword.toLowerCase())
      );
      const score = matchedKeywords.reduce(
        (sum, keyword) => sum + (keywordWeights[keyword] ?? 1),
        0
      );
      return {
        type: item.id,
        name: item.name,
        score,
        matchedKeywords,
        defaultReviewPaths: item.default_review_paths
      };
    })
    .sort((left, right) => right.score - left.score);

  const best = candidates[0];
  if (!best || best.score === 0) {
    return {
      type: documentTypesConfig.fallback_type,
      name: '未知',
      score: 0,
      matchedKeywords: [],
      defaultReviewPaths: documentTypesConfig.fallback_review_paths,
      candidates
    };
  }

  return {
    ...best,
    candidates
  };
}

export function matchesTerms(text: string, terms: string[]): string[] {
  return containsAny(text, terms);
}
