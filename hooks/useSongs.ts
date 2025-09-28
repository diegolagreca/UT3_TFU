import { useState, useCallback } from 'react';
import { Song } from '../types.ts';
import * as songService from '../services/songService.ts';

export const useSongs = (initialSongs: Song[] = []) => {
    const [songs, setSongs] = useState<Song[]>(initialSongs);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSongs = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const songsData = await songService.getSongs();
            setSongs(songsData);
            return songsData;
        } catch (err: any) {
            setError(err.message || 'Failed to fetch songs.');
            // Let Dashboard handle fallback to mock data
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addSong = useCallback(async (title: string, artist: string, duration: number) => {
        const newSong = await songService.createSong({ title, artist, duration });
        setSongs(prev => [...prev, newSong]);
        return newSong;
    }, []);

    const editSong = useCallback(async (id: number, data: { title: string; artist: string; duration: number }) => {
        const updatedSong = await songService.updateSong(id, data);
        setSongs(prev => prev.map(s => s.id === id ? updatedSong : s));
        return updatedSong;
    }, []);

    const removeSong = useCallback(async (id: number) => {
        await songService.deleteSong(id);
        setSongs(prev => prev.filter(s => s.id !== id));
    }, []);

    return { songs, setSongs, isLoading, error, fetchSongs, addSong, editSong, removeSong };
};