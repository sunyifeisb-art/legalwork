import { openDB } from 'idb';

import type { ReviewJobRecord } from '../shared/types';

const DB_NAME = 'data-compliance-review-extension';
const DB_VERSION = 1;
const JOB_STORE = 'jobs';

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(JOB_STORE)) {
      const store = db.createObjectStore(JOB_STORE, { keyPath: 'id' });
      store.createIndex('updatedAt', 'updatedAt');
      store.createIndex('status', 'status');
    }
  }
});

export async function putJob(job: ReviewJobRecord) {
  const db = await dbPromise;
  await db.put(JOB_STORE, job);
}

export async function getJob(jobId: string): Promise<ReviewJobRecord | undefined> {
  const db = await dbPromise;
  return db.get(JOB_STORE, jobId);
}

export async function listJobs(limit = 10): Promise<ReviewJobRecord[]> {
  const db = await dbPromise;
  const jobs = await db.getAll(JOB_STORE);
  return jobs
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .slice(0, limit);
}
