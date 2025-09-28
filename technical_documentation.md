# Musicbox Frontend: Technical Documentation

## 1. Introduction

This document provides a technical overview of the Musicbox frontend application, a single-page application (SPA) built with React and TypeScript. It details the project's architecture, data flow, and state management strategy.

## 2. Project Architecture

The application follows a modern, component-based architecture with a clear separation of concerns, organized into several key directories:

- **`/components`**: Contains all React UI components. These components are responsible for rendering the UI and delegating user interactions to hooks.
- **`/hooks`**: Contains custom React hooks that encapsulate business logic, state management, and side effects. This is the "brain" of the application.
- **`/services`**: Contains modules responsible for communicating with the backend API. Each module groups related endpoints (e.g., `songService`, `playlistService`).
- **`/types`**: Contains shared TypeScript type definitions for data models like `User`, `Song`, and `Playlist`.

### Core Principles

- **Separation of Concerns**: UI (Components), Logic (Hooks), and API Communication (Services) are kept separate, making the codebase easier to understand, test, and maintain.
- **Single Responsibility Principle**: Each component, hook, and service has a single, well-defined purpose.
- **Modularity**: The service layer is broken down into domain-specific modules, preventing a single monolithic API file.

## 3. Data Flow

The data flow is unidirectional, which makes the application's state predictable and easier to debug.

1.  **Component Mounts**: The main `Dashboard` component mounts.
2.  **Hook Initialization**: The `useSongs` and `usePlaylists` hooks are initialized. Inside a `useEffect`, they call their respective `fetch` functions.
3.  **Service Layer**: The fetch functions in the hooks call the appropriate methods in the `songService` or `playlistService`.
4.  **API Client**: The services use the central `apiClient` to make the actual `fetch` request to the backend API. The `apiClient` handles adding the auth token and standardizing error handling.
5.  **State Update**: The API response data travels back up the chain. The service returns it to the hook, which then updates its internal state using `useState`.
6.  **UI Re-render**: The state update in the hook triggers a re-render of the component (`Dashboard`), which then passes the new data down to its children (`SongLibrary`, `PlaylistManager`) as props.

User interactions (e.g., clicking "Add Song") follow a similar path: Component -> Hook -> Service -> API -> Hook State Update -> Component Re-render.

## 4. State Management

The application's state is managed primarily using React's built-in hooks (`useState`, `useEffect`, `useCallback`). We have opted for a custom hook-based approach over a global state library (like Redux or Zustand) for simplicity and co-location of state with the logic that uses it.

- **`useSongs`**: Manages the state of the song library, including the list of songs, loading status, and any errors. It exposes functions to perform CRUD operations on songs.
- **`usePlaylists`**: Manages the state for all playlists. It also provides CRUD functions and handles the logic for adding songs to a playlist.
- **`usePlayer`**: Manages the state of the music player, including the currently playing song, playback status (`isPlaying`), and progress.

This approach keeps the `Dashboard` component clean and focused on orchestration, while the complex state logic is neatly encapsulated and reusable.

## 5. Authentication

Authentication is handled via JSON Web Tokens (JWT).

1.  **Login**: The user enters credentials in the `Auth` component. On submit, `authService.login` is called.
2.  **Token Storage**: If the login is successful, the returned JWT is stored in `localStorage`.
3.  **Authenticated Requests**: The central `apiClient` automatically retrieves the token from `localStorage` and adds it to the `Authorization` header for all subsequent requests.
4.  **Token Verification**: When the app loads, `App.tsx` checks for a token in `localStorage`. If found, it calls `authService.getMe` to verify the token and fetch user data. If the token is invalid or expired, it's cleared from storage, and the user is redirected to the login screen.
5.  **Logout**: The "Logout" button removes the token from `localStorage`, effectively logging the user out.

## 6. Mock Data Fallback

To ensure the application is usable even when the backend API server is not running, the `Dashboard` component implements a fallback mechanism. If the initial data fetch from the API fails, the component populates the state with a set of hardcoded mock songs and playlists, allowing for frontend development and demonstration without a backend dependency.