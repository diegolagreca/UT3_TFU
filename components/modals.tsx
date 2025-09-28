import React, { useState, useEffect } from 'react';
import Modal from './Modal.tsx';
import { SpinnerIcon } from './icons.tsx';
import { Playlist, Song, User } from '../types.ts';


export const CreatePlaylistModal: React.FC<{isOpen: boolean; onClose: () => void; onCreate: (name: string) => void; isLoading: boolean;}> = ({isOpen, onClose, onCreate, isLoading}) => {
    const [name, setName] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(name.trim()) onCreate(name.trim());
        setName('');
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Playlist">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Playlist Name" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" required autoFocus/>
                <button type="submit" disabled={isLoading} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center justify-center disabled:bg-gray-500">
                    {isLoading && <SpinnerIcon className="w-5 h-5 mr-2" />}
                    {isLoading ? 'Creating...' : 'Create'}
                </button>
            </form>
        </Modal>
    );
};

export const EditPlaylistModal: React.FC<{isOpen: boolean; onClose: () => void; onUpdate: (id: number, name: string) => void; playlist: Playlist | undefined; isLoading: boolean;}> = ({isOpen, onClose, onUpdate, playlist, isLoading}) => {
    const [name, setName] = useState('');
    useEffect(() => {
        if(playlist) setName(playlist.name);
    }, [playlist]);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(name.trim() && playlist) onUpdate(playlist.id, name.trim());
    };
    if(!playlist) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Edit "${playlist.name}"`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Playlist Name" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" required autoFocus/>
                <button type="submit" disabled={isLoading} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center justify-center disabled:bg-gray-500">
                    {isLoading && <SpinnerIcon className="w-5 h-5 mr-2" />}
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </Modal>
    );
};

export const AddSongModal: React.FC<{isOpen: boolean; onClose: () => void; onAdd: (title: string, artist: string, duration: number) => void; isLoading: boolean;}> = ({isOpen, onClose, onAdd, isLoading}) => {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [duration, setDuration] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(title.trim() && artist.trim() && duration) onAdd(title.trim(), artist.trim(), Number(duration));
        setTitle(''); setArtist(''); setDuration('');
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Song to Library">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Song Title" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input type="text" value={artist} onChange={e => setArtist(e.target.value)} placeholder="Artist" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration (seconds)" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <button type="submit" disabled={isLoading} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center justify-center disabled:bg-gray-500">
                    {isLoading && <SpinnerIcon className="w-5 h-5 mr-2" />}
                    {isLoading ? 'Adding...' : 'Add Song'}
                </button>
            </form>
        </Modal>
    );
};

export const EditSongModal: React.FC<{isOpen: boolean; onClose: () => void; onUpdate: (id: number, data: {title: string, artist: string, duration: number}) => void; song: Song | undefined; isLoading: boolean;}> = ({isOpen, onClose, onUpdate, song, isLoading}) => {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [duration, setDuration] = useState('');
    useEffect(() => {
        if(song) {
            setTitle(song.title);
            setArtist(song.artist);
            setDuration(String(song.duration));
        }
    }, [song]);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(title.trim() && artist.trim() && duration && song) onUpdate(song.id, {title: title.trim(), artist: artist.trim(), duration: Number(duration)});
    };
    if(!song) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Edit "${song.title}"`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Song Title" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required autoFocus/>
                <input type="text" value={artist} onChange={e => setArtist(e.target.value)} placeholder="Artist" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration (seconds)" className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <button type="submit" disabled={isLoading} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center justify-center disabled:bg-gray-500">
                    {isLoading && <SpinnerIcon className="w-5 h-5 mr-2" />}
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </Modal>
    );
};

export const AddToPlaylistModal: React.FC<{isOpen: boolean; onClose: () => void; onAdd: (playlistId: number) => void; playlists: Playlist[]; song: Song | undefined}> = ({isOpen, onClose, onAdd, playlists, song}) => {
    if(!song) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Add "${song.title}" to..."`}>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {playlists.length > 0 ? playlists.map(p => (
                  <button key={p.id} onClick={() => onAdd(p.id)} className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200">
                      {p.name}
                  </button>
              )) : <p className="text-gray-400">No playlists available. Create one first!</p>}
            </div>
        </Modal>
    );
};

export const ProfileModal: React.FC<{isOpen: boolean; onClose: () => void; onUpdate: (data: {name: string, email: string}) => void; user: User, onDeleteRequest: () => void; isLoading: boolean;}> = ({isOpen, onClose, onUpdate, user, onDeleteRequest, isLoading}) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    useEffect(() => {
        setName(user.name);
        setEmail(user.email);
    }, [user]);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate({name, email});
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="My Profile">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="profile-name">Name</label>
                    <input id="profile-name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="profile-email">Email</label>
                    <input id="profile-email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center justify-center disabled:bg-gray-500">
                    {isLoading && <SpinnerIcon className="w-5 h-5 mr-2" />}
                    {isLoading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
            <div className="mt-6 pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
                <button onClick={onDeleteRequest} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">Delete My Account</button>
            </div>
        </Modal>
    );
}

export const ConfirmationModal: React.FC<{isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; isLoading: boolean;}> = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <p className="text-gray-300 mb-6">{message}</p>
            <div className="flex justify-end gap-4">
                <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition duration-300">Cancel</button>
                <button onClick={onConfirm} disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center justify-center disabled:bg-red-800">
                    {isLoading && <SpinnerIcon className="w-5 h-5 mr-2" />}
                    {isLoading ? 'Deleting...' : 'Confirm'}
                </button>
            </div>
        </Modal>
    );
}