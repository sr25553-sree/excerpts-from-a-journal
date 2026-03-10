const STORAGE_KEY = "my_journal_entries";

export function saveEntryId(id: string): void {
  const ids = getEntryIds();
  if (!ids.includes(id)) {
    ids.unshift(id);
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // localStorage full or unavailable
  }
}

export function getEntryIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}
