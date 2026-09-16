const SAVES = "hp-saves";
const SEEN = "hp-stories-seen";
const DONE = "hp-practices-done";

function read(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function write(key: string, ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(ids.slice(0, 80)));
}

export function getSaves() {
  return read(SAVES);
}

export function isSaved(id: string) {
  return getSaves().includes(id);
}

export function toggleSave(id: string) {
  const cur = getSaves();
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [id, ...cur];
  write(SAVES, next);
  return next;
}

export function getSeenStories() {
  return read(SEEN);
}

export function markStorySeen(id: string) {
  const cur = getSeenStories();
  if (cur.includes(id)) return cur;
  const next = [...cur, id];
  write(SEEN, next);
  return next;
}

export function getDonePractices() {
  return read(DONE);
}

export function markPracticeDone(id: string) {
  const cur = getDonePractices();
  const day = new Date().toISOString().slice(0, 10);
  const token = `${id}:${day}`;
  if (cur.includes(token)) return cur;
  const next = [token, ...cur];
  write(DONE, next);
  return next;
}

export function isPracticeDoneToday(id: string) {
  const day = new Date().toISOString().slice(0, 10);
  return getDonePractices().includes(`${id}:${day}`);
}
