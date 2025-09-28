import { Playlist } from '../types.ts';
import { request } from './apiClient.ts';

// Playlists
export const getPlaylists = (): Promise<Playlist[]> => request('/playlists');
export const createPlaylist = (data: { name: string; songIds?: number[] }): Promise<Playlist> => request('/playlists', { method: 'POST', body: JSON.stringify(data) });
export const addSongsToPlaylist = (playlistId: number, data: { songIds: number[] }): Promise<{ ok: boolean }> => request(`/playlists/${playlistId}/songs`, { method: 'POST', body: JSON.stringify(data) });
export const updatePlaylist = (id: number, data: { name: string }): Promise<Playlist> => request(`/playlists/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deletePlaylist = (id: number): Promise<void> => request(`/playlists/${id}`, { method: 'DELETE' });