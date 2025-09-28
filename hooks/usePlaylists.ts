import { useState, useCallback } from 'react';
import { Playlist, Song } from '../types.ts';
import * as playlistService from '../services/playlistService.ts';

export const usePlaylists = (initialPlaylists: Playlist[] = []) => {
    const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPlaylists = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const playlistsData = await playlistService.getPlaylists();
            setPlaylists(playlistsData);
            return playlistsData;
        } catch (err: any) {
            setError(err.message || 'Failed to fetch playlists.');
            // Let Dashboard handle fallback to mock data
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createNewPlaylist = useCallback(async (name: string) => {
        const newPlaylist = await playlistService.createPlaylist({ name });
        setPlaylists(prev => [...prev, newPlaylist]);
        return newPlaylist;
    }, []);

    const editPlaylist = useCallback(async (id: number, name: string) => {
        const updatedPlaylist = await playlistService.updatePlaylist(id, { name });
        setPlaylists(prev => prev.map(p => p.id === id ? updatedPlaylist : p));
        return updatedPlaylist;
    }, []);

    const removePlaylist = useCallback(async (id: number) => {
        await playlistService.deletePlaylist(id);
        setPlaylists(prev => prev.filter(p => p.id !== id));
    }, []);

    const addSongToPlaylist = useCallback(async (playlistId: number, songId: number) => {
        await playlistService.addSongsToPlaylist(playlistId, { songIds: [songId] });
        // Refetch to get the updated playlist with the full song object
        await fetchPlaylists();
    }, [fetchPlaylists]);

    // This function is needed when a song is updated, to reflect changes in playlists
    const syncSongUpdateInPlaylists = useCallback((updatedSong: Song) => {
         setPlaylists(prev => prev.map(p => ({
            ...p,
            songs: p.songs.map(s => s.id === updatedSong.id ? updatedSong : s)
        })));
    }, []);

    // This function is needed when a song is deleted
    const syncSongDeleteInPlaylists = useCallback((deletedSongId: number) => {
        setPlaylists(prev => prev.map(p => ({
            ...p,
            songs: p.songs.filter(song => song.id !== deletedSongId)
        })));
    }, []);

    return { 
        playlists, 
        setPlaylists,
        isLoading, 
        error, 
        fetchPlaylists, 
        createNewPlaylist, 
        editPlaylist, 
        removePlaylist, 
        addSongToPlaylist,
        syncSongUpdateInPlaylists,
        syncSongDeleteInPlaylists
    };
};