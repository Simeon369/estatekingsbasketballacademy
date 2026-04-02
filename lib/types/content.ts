/** Row shape from Supabase `upcoming_events` (includes legacy `date`). */
export type AnnouncementEventRow = {
  id: number;
  title: string;
  description: string;
  sort_order: number;
  banner_url?: string | null;
  event_time?: string | null;
  location?: string | null;
  /** Legacy column; used as fallback label when `event_time` is empty. */
  date?: string | null;
};

export type GalleryItemRow = {
  id: number;
  image_url: string;
  description: string;
  sort_order: number;
};
