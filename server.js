const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// --- In-memory Database ---
let songs = [
    { id: 1, title: 'Bohemian Rhapsody', artist: 'Queen', duration: 355 },
    { id: 2, title: 'Stairway to Heaven', artist: 'Led Zeppelin', duration: 482 },
    { id: 3, title: 'Hotel California', artist: 'Eagles', duration: 390 },
    { id: 4, title: 'Like a Rolling Stone', artist: 'Bob Dylan', duration: 373 },
    { id: 5, title: 'Smells Like Teen Spirit', artist: 'Nirvana', duration: 301 },
];
let playlists = [
    { id: 1, name: 'Rock Classics', songs: [songs[0], songs[1], songs[3]] },
    { id: 2, name: 'Chill Vibes', songs: [songs[2]] },
    { id: 3, name: '90s Grunge', songs: [songs[4]]},
];
let nextSongId = 6;
let nextPlaylistId = 4;

// --- Middleware for logging ---
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// --- Song Routes ---
app.get('/songs', (req, res) => {
    res.json(songs);
});

app.post('/songs', (req, res) => {
    const { title, artist, duration } = req.body;
    if (!title || !artist || !duration) {
        return res.status(400).json({ error: 'Missing required fields: title, artist, duration' });
    }
    const newSong = { id: nextSongId++, title, artist, duration: Number(duration) };
    songs.push(newSong);
    res.status(201).json(newSong);
});

app.put('/songs/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { title, artist, duration } = req.body;
    const songIndex = songs.findIndex(s => s.id === id);

    if (songIndex === -1) {
        return res.status(404).json({ error: 'Song not found' });
    }
    if (!title || !artist || !duration) {
        return res.status(400).json({ error: 'Missing required fields: title, artist, duration' });
    }

    const updatedSong = { ...songs[songIndex], title, artist, duration: Number(duration) };
    songs[songIndex] = updatedSong;
    
    // Also update song details within playlists
    playlists = playlists.map(p => ({
        ...p,
        songs: p.songs.map(s => s.id === id ? updatedSong : s)
    }));

    res.json(updatedSong);
});

app.delete('/songs/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const initialLength = songs.length;
    songs = songs.filter(s => s.id !== id);

    if (songs.length === initialLength) {
        return res.status(404).json({ error: 'Song not found' });
    }

    // Also remove song from playlists
    playlists = playlists.map(p => ({
        ...p,
        songs: p.songs.filter(s => s.id !== id)
    }));

    res.status(204).send();
});

// --- Playlist Routes ---
app.get('/playlists', (req, res) => {
    res.json(playlists);
});

app.post('/playlists', (req, res) => {
    const { name, songIds = [] } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Missing required field: name' });
    }
    const playlistSongs = songs.filter(s => songIds.includes(s.id));
    const newPlaylist = { id: nextPlaylistId++, name, songs: playlistSongs };
    playlists.push(newPlaylist);
    res.status(201).json(newPlaylist);
});

app.put('/playlists/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name } = req.body;
    const playlistIndex = playlists.findIndex(p => p.id === id);

    if (playlistIndex === -1) {
        return res.status(404).json({ error: 'Playlist not found' });
    }
    if (!name) {
        return res.status(400).json({ error: 'Missing required field: name' });
    }

    playlists[playlistIndex].name = name;
    res.json(playlists[playlistIndex]);
});

app.delete('/playlists/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const initialLength = playlists.length;
    playlists = playlists.filter(p => p.id !== id);

    if (playlists.length === initialLength) {
        return res.status(404).json({ error: 'Playlist not found' });
    }
    res.status(204).send();
});

app.post('/playlists/:id/songs', (req, res) => {
    const playlistId = parseInt(req.params.id, 10);
    const { songIds } = req.body;
    const playlist = playlists.find(p => p.id === playlistId);

    if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
    }
    if (!Array.isArray(songIds)) {
        return res.status(400).json({ error: 'songIds must be an array' });
    }

    const songsToAdd = songs.filter(s => songIds.includes(s.id) && !playlist.songs.some(ps => ps.id === s.id));
    playlist.songs.push(...songsToAdd);
    
    res.json({ ok: true, added: songsToAdd.length });
});

// --- Auth Routes (Placeholders) ---
// In a real app, these would handle login, registration, and token verification.
// For this demo, the frontend has a hardcoded bypass for "test@test.com".
app.post('/auth/login', (req, res) => {
    res.status(501).json({ error: 'Not implemented' });
});
app.post('/auth/register', (req, res) => {
    res.status(501).json({ error: 'Not implemented' });
});
app.get('/auth/me', (req, res) => {
    res.status(501).json({ error: 'Not implemented' });
});


// --- Server Start ---
app.listen(port, () => {
    console.log(`API server running on http://localhost:${port}`);
});
