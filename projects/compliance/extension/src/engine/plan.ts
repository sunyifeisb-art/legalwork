import { reviewCheckpointsConfig, reviewPathsConfig } from '../shared/config';
import type { ClassificationResult } from './classify';

export interface PlannedPath {
  id: string;
  name: string;
  goal: string;
  focus: string[];
}

export interface PlannedReview {
  documentType: string;
  documentName: string;
  selectedPaths: PlannedPath[];
  tasks: Array<{
    task_id: string;
    path_id: string;
    path_name: string;
    goal: string;
    focus: string[];
    checkpoints: string[];
    status: 'pending';
  }>;
}

export function planReview(classification: ClassificationResult): PlannedReview {
  const pathMap = new Map(reviewPathsConfig.paths.map((path) => [path.id, path]));
  const checkpointMap = reviewCheckpointsConfig.paths as Record<
    string,
    { title: string; checkpoints: string[] }
  >;
  const selectedPaths = classification.defaultReviewPaths
    .map((pathId) => pathMap.get(pathId))
    .filter(Boolean) as PlannedPath[];

  const tasks = selectedPaths.map((path, index) => ({
    task_id: `task_${String(index + 1).padStart(2, '0')}`,
    path_id: path.id,
    path_name: path.name,
    goal: path.goal,
    focus: path.focus,
    checkpoints: checkpointMap[path.id]?.checkpoints ?? [],
    status: 'pending' as const
  }));

  return {
    documentType: classification.type,
    documentName: classification.name,
    selectedPaths,
    tasks
  };
}
