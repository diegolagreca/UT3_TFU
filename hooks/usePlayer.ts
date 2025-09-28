import { useState, useEffect, useCallback } from 'react';
import { Song, Playlist } from '../types.ts';

export const usePlayer = () => {
    const [currentlyPlaying, setCurrentlyPlaying] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackProgress, setPlaybackProgress] = useState(0);
    const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
    const [currentSongIndex, setCurrentSongIndex] = useState(-1);

    const handlePlaySong = (song: Song, playlist?: Playlist) => {
        setCurrentlyPlaying(song);
        setIsPlaying(true);
        setPlaybackProgress(0);
        if (playlist) {
            setCurrentPlaylist(playlist);
            const songIndex = playlist.songs.findIndex(s => s.id === song.id);
            setCurrentSongIndex(songIndex);
        } else {
            setCurrentPlaylist(null);
            setCurrentSongIndex(-1);
        }
    };

    const handlePlayPlaylist = (playlist: Playlist) => {
        if (playlist.songs.length > 0) {
            handlePlaySong(playlist.songs[0], playlist);
        }
    };

    const handlePlayPause = () => {
        if (currentlyPlaying) setIsPlaying(prev => !prev);
    };

    const handleStop = () => {
        setIsPlaying(false);
        setCurrentlyPlaying(null);
        setPlaybackProgress(0);
        setCurrentPlaylist(null);
        setCurrentSongIndex(-1);
    };

    const handleNextSong = useCallback(() => {
        if (currentPlaylist && currentSongIndex < currentPlaylist.songs.length - 1) {
            const nextIndex = currentSongIndex + 1;
            handlePlaySong(currentPlaylist.songs[nextIndex], currentPlaylist);
        } else {
            handleStop();
        }
    }, [currentPlaylist, currentSongIndex]);

    const handlePreviousSong = () => {
        if (currentPlaylist && currentSongIndex > 0) {
            const prevIndex = currentSongIndex - 1;
            handlePlaySong(currentPlaylist.songs[prevIndex], currentPlaylist);
        }
    };

    useEffect(() => {
        let interval: number | undefined;
        if (isPlaying && currentlyPlaying) {
            interval = window.setInterval(() => {
                setPlaybackProgress(prev => {
                    if (prev + 1 >= currentlyPlaying.duration) {
                        handleNextSong();
                        return 0;
                    }
                    return prev + 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying, currentlyPlaying, handleNextSong]);

    const hasPrevious = currentPlaylist && currentSongIndex > 0;
    const hasNext = currentPlaylist && currentSongIndex < currentPlaylist.songs.length - 1;

    return {
        currentlyPlaying,
        isPlaying,
        playbackProgress,
        handlePlaySong,
        handlePlayPlaylist,
        handlePlayPause,
        handleStop,
        handleNextSong,
        handlePreviousSong,
        hasPrevious,
        hasNext,
    };
};