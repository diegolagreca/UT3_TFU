import React from 'react';
import { Playlist } from '../types.ts';
import { PlusIcon, PencilIcon, TrashIcon, PlayIcon } from './icons.tsx';

interface PlaylistManagerProps {
    playlists: Playlist[];
    onShowCreateModal: () => void;
    onShowEditModal: (playlist: Playlist) => void;
    onShowDeleteModal: (playlist: Playlist) => void;
    onPlayPlaylist: (playlist: Playlist) => void;
}

const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const PlaylistManager: React.FC<PlaylistManagerProps> = ({
    playlists,
    onShowCreateModal,
    onShowEditModal,
    onShowDeleteModal,
    onPlayPlaylist
}) => {
    return (
        <div className="bg-gray-800/50 p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-white">Your Playlists</h2>
                <button onClick={onShowCreateModal} className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                    <PlusIcon className="w-5 h-5" /> New Playlist
                </button>
            </div>
            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
                {playlists.length > 0 ? playlists.map(p => (
                    <div key={p.id} className="bg-gray-700 p-4 rounded-lg group">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => onPlayPlaylist(p)} 
                                    aria-label={`Play ${p.name}`} 
                                    className="p-1 rounded-full hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={p.songs.length === 0}
                                >
                                    <PlayIcon className="w-6 h-6 text-teal-300"/>
                                </button>
                                <h3 className="font-bold text-lg text-teal-300">{p.name}</h3>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => onShowEditModal(p)} aria-label={`Edit ${p.name}`} className="p-1 rounded-full hover:bg-gray-600"><PencilIcon className="w-5 h-5 text-blue-400" /></button>
                                <button onClick={() => onShowDeleteModal(p)} aria-label={`Delete ${p.name}`} className="p-1 rounded-full hover:bg-gray-600"><TrashIcon className="w-5 h-5 text-red-400" /></button>
                            </div>
                        </div>
                        {p.songs.length > 0 ? (
                            <ul className="space-y-2 mt-2 pl-10">
                                {p.songs.map(s => <li key={`${p.id}-${s.id}`} className="text-sm text-gray-300 flex justify-between"><span>{s.title} - <span className="text-gray-400">{s.artist}</span></span> <span>{formatDuration(s.duration)}</span></li>)}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-400 mt-2 pl-10">No songs in this playlist yet.</p>
                        )}
                    </div>
                )) : <p className="text-gray-400">You haven't created any playlists.</p>}
            </div>
        </div>
    );
};

export default PlaylistManager;