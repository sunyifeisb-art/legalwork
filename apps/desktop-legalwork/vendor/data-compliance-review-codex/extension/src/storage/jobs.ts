import { getJob, listJobs, putJob } from './db';
import type { ReviewJobRecord, ReviewProgress, ReviewSourceInput } from '../shared/types';

function createInitialProgress(): ReviewProgress {
  return {
    step: 0,
    totalSteps: 9,
    message: '准备开始',
    status: 'pending'
  };
}

export function createJobId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export async function createReviewJob(input: {
  id?: string;
  documentName: string;
  source: ReviewSourceInput;
  reviewType?: 'document' | 'code';
}): Promise<ReviewJobRecord> {
  const now = new Date().toISOString();
  const job: ReviewJobRecord = {
    id: input.id ?? createJobId(),
    documentName: input.documentName,
    source: input.source,
    reviewType: input.reviewType ?? 'document',
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    progress: createInitialProgress()
  };
  await putJob(job);
  return job;
}

export async function updateJobProgress(
  jobId: string,
  progress: ReviewProgress,
  status: ReviewJobRecord['status'] = 'running'
) {
  const job = await getJob(jobId);
  if (!job) return;
  await putJob({
    ...job,
    status,
    progress,
    updatedAt: new Date().toISOString()
  });
}

export async function completeJob(jobId: string, result: ReviewJobRecord['result']) {
  const job = await getJob(jobId);
  if (!job) return;
  await putJob({
    ...job,
    status: 'completed',
    progress: {
      step: 9,
      totalSteps: 9,
      message: '审查完成',
      status: 'completed'
    },
    result,
    updatedAt: new Date().toISOString()
  });
}

export async function failJob(jobId: string, error: string) {
  const job = await getJob(jobId);
  if (!job) return;
  await putJob({
    ...job,
    status: 'failed',
    error,
    progress: {
      ...job.progress,
      status: 'failed',
      message: error
    },
    updatedAt: new Date().toISOString()
  });
}

export { getJob, listJobs };
