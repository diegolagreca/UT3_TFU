import { Song } from '../types.ts';
import { request } from './apiClient.ts';

// Songs
export const getSongs = (): Promise<Song[]> => request('/songs');
export const createSong = (data: { title: string; artist: string; duration: number; }): Promise<Song> => request('/songs', { method: 'POST', body: JSON.stringify(data) });
export const updateSong = (id: number, data: { title: string; artist: string; duration: number; }): Promise<Song> => request(`/songs/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteSong = (id: number): Promise<void> => request(`/songs/${id}`, { method: 'DELETE' });