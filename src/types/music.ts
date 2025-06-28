
export interface Playlist {
  id: string;
  name: string;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Song {
  id: string;
  name: string;
  artist: string;
  file_url: string;
  playlist_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CurrentSong extends Song {
  playlist?: Playlist;
}
