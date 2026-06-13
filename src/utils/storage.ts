import type { Work, Author, CurrentUser, CompletionRecord } from '../types';

const KEYS = {
  works: 'craft_works',
  authors: 'craft_authors',
  user: 'craft_current_user',
  completions: 'craft_completions',
};

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  } catch {
    return null;
  }
}

function write<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

/* Works */
export function getWorks(): Work[] {
  return read<Work[]>(KEYS.works) || [];
}

export function saveWorks(works: Work[]): void {
  write(KEYS.works, works);
}

export function getWorkById(id: string): Work | undefined {
  return getWorks().find((w) => w.id === id);
}

export function addWork(work: Work): void {
  const works = getWorks();
  works.unshift(work);
  saveWorks(works);
}

export function updateWork(work: Work): void {
  const works = getWorks();
  const idx = works.findIndex((w) => w.id === work.id);
  if (idx !== -1) {
    works[idx] = work;
    saveWorks(works);
  }
}

/* Authors */
export function getAuthors(): Author[] {
  return read<Author[]>(KEYS.authors) || [];
}

export function saveAuthors(authors: Author[]): void {
  write(KEYS.authors, authors);
}

export function getAuthorById(id: string): Author | undefined {
  return getAuthors().find((a) => a.id === id);
}

export function updateAuthor(author: Author): void {
  const authors = getAuthors();
  const idx = authors.findIndex((a) => a.id === author.id);
  if (idx !== -1) {
    authors[idx] = author;
    saveAuthors(authors);
  }
}

/* Current User */
export function getCurrentUser(): CurrentUser | null {
  return read<CurrentUser>(KEYS.user);
}

export function setCurrentUser(user: CurrentUser): void {
  write(KEYS.user, user);
}

export function clearCurrentUser(): void {
  localStorage.removeItem(KEYS.user);
}

/* Completion Records */
export function getCompletions(): CompletionRecord[] {
  return read<CompletionRecord[]>(KEYS.completions) || [];
}

export function saveCompletions(completions: CompletionRecord[]): void {
  write(KEYS.completions, completions);
}

export function getCompletionsByUser(userId: string): CompletionRecord[] {
  return getCompletions()
    .filter((c) => c.userId === userId)
    .sort((a, b) => b.completedAt - a.completedAt);
}

export function isWorkCompleted(workId: string, userId: string): boolean {
  return getCompletions().some((c) => c.workId === workId && c.userId === userId);
}

export function toggleCompletion(workId: string, userId: string): boolean {
  const completions = getCompletions();
  const idx = completions.findIndex((c) => c.workId === workId && c.userId === userId);
  if (idx !== -1) {
    completions.splice(idx, 1);
    saveCompletions(completions);
    return false;
  } else {
    completions.push({ workId, userId, completedAt: Date.now() });
    saveCompletions(completions);
    return true;
  }
}

export function getCompletedWorkIdsByUser(userId: string): string[] {
  return getCompletions()
    .filter((c) => c.userId === userId)
    .map((c) => c.workId);
}
