
export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Song {
  id: number;
  title: string;
  artist: string;
  duration: number; // in seconds
}

export interface Playlist {
  id: number;
  name: string;
  songs: Song[];
}
