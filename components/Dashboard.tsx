import React, { useState, useEffect, useCallback } from 'react';
import { User, Playlist, Song } from '../types.ts';
import { LogoutIcon, MusicNoteIcon, SpinnerIcon, UserCircleIcon } from './icons.tsx';
import PlaylistManager from './PlaylistManager.tsx';
import SongLibrary from './SongLibrary.tsx';
import Player from './Player.tsx';
import { 
    CreatePlaylistModal, EditPlaylistModal, AddSongModal, EditSongModal, 
    AddToPlaylistModal, ProfileModal, ConfirmationModal 
} from './modals.tsx';
import { useSongs } from '../hooks/useSongs.ts';
import { usePlaylists } from '../hooks/usePlaylists.ts';
import { usePlayer } from '../hooks/usePlayer.ts';

// Mock Data for Test Mode
const mockSongs: Song[] = [
    { id: 1, title: 'Bohemian Rhapsody', artist: 'Queen', duration: 355 },
    { id: 2, title: 'Stairway to Heaven', artist: 'Led Zeppelin', duration: 482 },
    { id: 3, title: 'Hotel California', artist: 'Eagles', duration: 390 },
    { id: 4, title: 'Like a Rolling Stone', artist: 'Bob Dylan', duration: 373 },
    { id: 5, title: 'Smells Like Teen Spirit', artist: 'Nirvana', duration: 301 },
];
const mockPlaylists: Playlist[] = [
    { id: 1, name: 'Rock Classics', songs: [mockSongs[0], mockSongs[1], mockSongs[3]] },
    { id: 2, name: 'Chill Vibes', songs: [mockSongs[2]] },
    { id: 3, name: '90s Grunge', songs: [mockSongs[4]]},
];

interface DashboardProps {
  user: User;
  logout: () => void;
  onUserUpdate: (newUserData?: { name?: string; email?: string }) => void;
}

type ModalState = {
  createPlaylist?: boolean;
  addSong?: boolean;
  addToPlaylist?: Song;
  editPlaylist?: Playlist;
  deletePlaylist?: Playlist;
  editSong?: Song;
  deleteSong?: Song;
  profile?: boolean;
  confirmDeleteAccount?: boolean;
};

const Dashboard: React.FC<DashboardProps> = ({ user, logout, onUserUpdate }) => {
  const [modalState, setModalState] = useState<ModalState>({});
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  const { songs, setSongs, fetchSongs, addSong, editSong, removeSong } = useSongs();
  const { playlists, setPlaylists, fetchPlaylists, createNewPlaylist, editPlaylist, removePlaylist, addSongToPlaylist, syncSongUpdateInPlaylists, syncSongDeleteInPlaylists } = usePlaylists();
  const { currentlyPlaying, isPlaying, playbackProgress, handlePlaySong, handlePlayPlaylist, handlePlayPause, handleStop, handleNextSong, handlePreviousSong, hasNext, hasPrevious } = usePlayer();

  const fetchData = useCallback(async () => {
    setIsDataLoading(true);
    try {
      await Promise.all([fetchPlaylists(), fetchSongs()]);
    } catch (err: any) {
      console.warn("API fetch failed, falling back to mock data. Please ensure the backend server is running for live data.", err);
      // Fallback to mock data if API fails
      setPlaylists(mockPlaylists);
      setSongs(mockSongs);
    } finally {
      setIsDataLoading(false);
    }
  }, [fetchPlaylists, fetchSongs, setPlaylists, setSongs]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const closeModal = () => setModalState({});

  // Generic handler for API calls to reduce boilerplate
  const handleApiCall = async (action: () => Promise<any>, actionKey: string) => {
    setLoadingAction(actionKey);
    try {
      await action();
      closeModal();
    } catch (e: any) {
      alert(`Action failed: ${e.message || 'Unknown error'}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCreatePlaylist = (name: string) => handleApiCall(() => createNewPlaylist(name), 'create-playlist');
  const handleUpdatePlaylist = (id: number, name: string) => handleApiCall(() => editPlaylist(id, name), `edit-playlist-${id}`);
  const handleDeletePlaylist = (id: number) => handleApiCall(() => removePlaylist(id), `delete-playlist-${id}`);
  
  const handleAddSong = (title: string, artist: string, duration: number) => handleApiCall(() => addSong(title, artist, duration), 'add-song');
  
  const handleUpdateSong = async (id: number, data: { title: string; artist: string; duration: number }) => {
    await handleApiCall(async () => {
      const updatedSong = await editSong(id, data);
      syncSongUpdateInPlaylists(updatedSong); // Sync playlist state
    }, `edit-song-${id}`);
  };
  
  const handleDeleteSong = async (id: number) => {
    await handleApiCall(async () => {
      await removeSong(id);
      syncSongDeleteInPlaylists(id); // Sync playlist state
      if (currentlyPlaying?.id === id) handleStop();
    }, `delete-song-${id}`);
  };

  const handleAddSongToPlaylist = (playlistId: number) => {
    const songToAdd = modalState.addToPlaylist;
    if (!songToAdd) return;
    handleApiCall(() => addSongToPlaylist(playlistId, songToAdd.id), 'add-to-playlist');
  };

  const handleUpdateUser = (data: { name: string, email: string }) => {
    setLoadingAction('update-user');
    onUserUpdate(data);
    setLoadingAction(null);
    closeModal();
  };
  
  const handleDeleteUser = () => {
    setLoadingAction('delete-user');
    closeModal();
    logout();
    setLoadingAction(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 relative pb-24">
      <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 p-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center gap-3">
            <MusicNoteIcon className="w-8 h-8 text-teal-400"/>
            <h1 className="text-2xl font-bold text-white">Musicbox</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-300 hidden sm:inline">Welcome, {user.name}</span>
          <button onClick={() => setModalState({ profile: true })} className="p-2 rounded-full hover:bg-gray-700 transition-colors" aria-label="Open Profile">
            <UserCircleIcon className="w-6 h-6 text-gray-400" />
          </button>
          <button onClick={logout} className="p-2 rounded-full hover:bg-gray-700 transition-colors" aria-label="Logout">
            <LogoutIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8">
        {isDataLoading ? (
          <div className="flex justify-center items-center h-64">
            <SpinnerIcon className="w-12 h-12 text-teal-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PlaylistManager 
                playlists={playlists}
                onShowCreateModal={() => setModalState({ createPlaylist: true })}
                onShowEditModal={(p) => setModalState({ editPlaylist: p })}
                onShowDeleteModal={(p) => setModalState({ deletePlaylist: p })}
                onPlayPlaylist={handlePlayPlaylist}
            />
            <SongLibrary 
                songs={songs}
                onShowAddModal={() => setModalState({ addSong: true })}
                onShowEditModal={(s) => setModalState({ editSong: s })}
                onShowDeleteModal={(s) => setModalState({ deleteSong: s })}
                onShowAddToPlaylistModal={(s) => setModalState({ addToPlaylist: s })}
                onPlaySong={handlePlaySong}
            />
          </div>
        )}
      </main>
      
      {/* Modals */}
      <CreatePlaylistModal isOpen={!!modalState.createPlaylist} onClose={closeModal} onCreate={handleCreatePlaylist} isLoading={loadingAction === 'create-playlist'} />
      <EditPlaylistModal isOpen={!!modalState.editPlaylist} onClose={closeModal} onUpdate={handleUpdatePlaylist} playlist={modalState.editPlaylist} isLoading={loadingAction === `edit-playlist-${modalState.editPlaylist?.id}`}/>
      <ConfirmationModal isOpen={!!modalState.deletePlaylist} onClose={closeModal} onConfirm={() => modalState.deletePlaylist && handleDeletePlaylist(modalState.deletePlaylist.id)} title="Delete Playlist" message={`Are you sure you want to delete "${modalState.deletePlaylist?.name}"? This action cannot be undone.`} isLoading={loadingAction === `delete-playlist-${modalState.deletePlaylist?.id}`}/>

      <AddSongModal isOpen={!!modalState.addSong} onClose={closeModal} onAdd={handleAddSong} isLoading={loadingAction === 'add-song'} />
      <EditSongModal isOpen={!!modalState.editSong} onClose={closeModal} onUpdate={handleUpdateSong} song={modalState.editSong} isLoading={loadingAction === `edit-song-${modalState.editSong?.id}`}/>
      <ConfirmationModal isOpen={!!modalState.deleteSong} onClose={closeModal} onConfirm={() => modalState.deleteSong && handleDeleteSong(modalState.deleteSong.id)} title="Delete Song" message={`Are you sure you want to delete "${modalState.deleteSong?.title}" from your library?`} isLoading={loadingAction === `delete-song-${modalState.deleteSong?.id}`}/>
      
      <AddToPlaylistModal isOpen={!!modalState.addToPlaylist} onClose={closeModal} onAdd={handleAddSongToPlaylist} playlists={playlists} song={modalState.addToPlaylist}/>

      <ProfileModal isOpen={!!modalState.profile} onClose={closeModal} onUpdate={handleUpdateUser} user={user} onDeleteRequest={() => setModalState({ profile: true, confirmDeleteAccount: true })} isLoading={loadingAction === 'update-user'}/>
      <ConfirmationModal isOpen={!!modalState.confirmDeleteAccount} onClose={() => setModalState({ profile: true })} onConfirm={handleDeleteUser} title="Delete Account" message="Are you sure you want to permanently delete your account and all your data? This action cannot be undone." isLoading={loadingAction === 'delete-user'}/>

      {/* Player */}
      {currentlyPlaying && (
        <Player
          song={currentlyPlaying}
          isPlaying={isPlaying}
          progress={playbackProgress}
          onPlayPause={handlePlayPause}
          onStop={handleStop}
          onNext={handleNextSong}
          onPrevious={handlePreviousSong}
          hasNext={!!hasNext}
          hasPrevious={!!hasPrevious}
        />
      )}
    </div>
  );
};

export default Dashboard;