import React from 'react';
import { Song } from '../types.ts';
import { PlayIcon, PauseIcon, StopIcon, ForwardIcon, BackwardIcon, MusicNoteIcon } from './icons.tsx';

interface PlayerProps {
    song: Song;
    isPlaying: boolean;
    progress: number; // in seconds
    onPlayPause: () => void;
    onStop: () => void;
    onNext: () => void;
    onPrevious: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
}

const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const Player: React.FC<PlayerProps> = ({
    song,
    isPlaying,
    progress,
    onPlayPause,
    onStop,
    onNext,
    onPrevious,
    hasNext,
    hasPrevious
}) => {
    const progressPercentage = (progress / song.duration) * 100;

    return (
        <div className="fixed bottom-0 left-0 right-0 h-24 bg-gray-800 border-t border-gray-700 z-20 flex items-center px-4 sm:px-6 lg:px-8 text-white">
            <div className="flex items-center gap-4 w-1/3">
                 <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                    <MusicNoteIcon className="w-8 h-8 text-teal-400" />
                 </div>
                 <div>
                     <p className="font-semibold">{song.title}</p>
                     <p className="text-sm text-gray-400">{song.artist}</p>
                 </div>
            </div>

            <div className="flex flex-col items-center justify-center w-1/3">
                <div className="flex items-center gap-4">
                    <button onClick={onPrevious} disabled={!hasPrevious} className="disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 hover:text-white transition-colors">
                        <BackwardIcon className="w-6 h-6" />
                    </button>
                    <button onClick={onPlayPause} className="w-12 h-12 flex items-center justify-center bg-teal-500 rounded-full text-white hover:bg-teal-600 transition-transform transform hover:scale-105">
                        {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8 pl-1" />}
                    </button>
                    <button onClick={onNext} disabled={!hasNext} className="disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 hover:text-white transition-colors">
                        <ForwardIcon className="w-6 h-6" />
                    </button>
                    <button onClick={onStop} className="ml-4 text-gray-400 hover:text-red-500 transition-colors">
                        <StopIcon className="w-6 h-6"/>
                    </button>
                </div>
                <div className="w-full max-w-xs flex items-center gap-2 mt-2 text-xs">
                    <span>{formatDuration(progress)}</span>
                    <div className="w-full bg-gray-600 rounded-full h-1.5">
                        <div className="bg-teal-400 h-1.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <span>{formatDuration(song.duration)}</span>
                </div>
            </div>

            <div className="w-1/3">
                {/* Future controls like volume can go here */}
            </div>
        </div>
    );
};

export default Player;