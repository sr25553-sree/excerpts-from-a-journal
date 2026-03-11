export const MOODS = [
  "grief",
  "joy",
  "longing",
  "anger",
  "tenderness",
  "confusion",
  "relief",
] as const;

export type Mood = (typeof MOODS)[number];

export const REACTION_TYPES = ["felt_this", "not_alone", "thank_you"] as const;

export type ReactionType = (typeof REACTION_TYPES)[number];

export interface Entry {
  id: string;
  content: string;
  mood: Mood | null;
  location: string | null;
  entry_date: string | null;
  created_at: string;
  is_approved: boolean;
}

export interface PaginatedResponse {
  entries: Entry[];
  nextCursor: string | null;
  hasMore: boolean;
}
