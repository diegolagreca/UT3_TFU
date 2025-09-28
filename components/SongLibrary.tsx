import React from 'react';
import { Song } from '../types.ts';
import { PlusIcon, PencilIcon, TrashIcon, PlayIcon } from './icons.tsx';

interface SongLibraryProps {
    songs: Song[];
    onShowAddModal: () => void;
    onShowEditModal: (song: Song) => void;
    onShowDeleteModal: (song: Song) => void;
    onShowAddToPlaylistModal: (song: Song) => void;
    onPlaySong: (song: Song) => void;
}

const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const SongLibrary: React.FC<SongLibraryProps> = ({
    songs,
    onShowAddModal,
    onShowEditModal,
    onShowDeleteModal,
    onShowAddToPlaylistModal,
    onPlaySong
}) => {
    return (
        <div className="bg-gray-800/50 p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-white">Song Library</h2>
                <button onClick={onShowAddModal} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                    <PlusIcon className="w-5 h-5" /> Add Song
                </button>
            </div>
            <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-2">
                {songs.length > 0 ? songs.map(s => (
                    <div key={s.id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center group">
                        <div className="flex items-center gap-3">
                            <button onClick={() => onPlaySong(s)} aria-label={`Play ${s.title}`} className="p-1 rounded-full hover:bg-gray-600">
                               <PlayIcon className="w-6 h-6 text-gray-200"/>
                            </button>
                            <div>
                                <p className="font-semibold text-gray-200">{s.title}</p>
                                <p className="text-sm text-gray-400">{s.artist} - {formatDuration(s.duration)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => onShowEditModal(s)} className="p-2 rounded-full hover:bg-gray-600 transition-colors" aria-label={`Edit ${s.title}`}><PencilIcon className="w-5 h-5 text-blue-400" /></button>
                            <button onClick={() => onShowDeleteModal(s)} className="p-2 rounded-full hover:bg-gray-600 transition-colors" aria-label={`Delete ${s.title}`}><TrashIcon className="w-5 h-5 text-red-400" /></button>
                            <button onClick={() => onShowAddToPlaylistModal(s)} className="p-2 rounded-full hover:bg-gray-600 transition-colors" aria-label={`Add ${s.title} to playlist`}>
                                <PlusIcon className="w-5 h-5 text-teal-400" />
                            </button>
                        </div>
                    </div>
                )) : <p className="text-gray-400">The song library is empty.</p>}
            </div>
        </div>
    );
};

export default SongLibrary;