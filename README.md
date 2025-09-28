# Musicbox - Playlist Manager

Una app web moderna para manejar tu biblioteca de canciones y armar playlists a medida. El proyecto tiene un frontend en **React + TypeScript** y un backend con **Express.js**.

---

## Cómo correr el proyecto

Pasos para levantar tanto el backend como el frontend en tu máquina.

### Requisitos previos

- **Docker** instalado y corriendo.  
- **Node.js + npm** (para servir el frontend).

### Paso 1: levantar el servidor (backend)

Desde la raíz del proyecto, corré:

```bash
docker-compose up -d --build
```

La API queda disponible en `http://localhost:3001`.

### Paso 2: levantar la interfaz de usuario (frontend)

En la misma consola:

```bash
serve -l 3000
```

> Si no tenés `serve`, instalalo una vez:  
> `npm install -g serve`

### Paso 3: abrir la app

Andá a tu navegador y entrá a `http://localhost:3000`.

---

## Probar la API con cURL

Podés hablar directo con la API desde la terminal. Algunos ejemplos:

### Canciones (`/songs`)

**1. Listar todas las canciones**

```bash
curl http://localhost:3001/songs
```

**2. Crear una canción nueva**

```bash
curl -X POST   -H "Content-Type: application/json"   -d '{"title":"Blinding Lights","artist":"The Weeknd","duration":200}'   http://localhost:3001/songs
```

**3. Actualizar una canción**

```bash
curl -X PUT   -H "Content-Type: application/json"   -d '{"title":"Bohemian Rhapsody (Remastered)","artist":"Queen","duration":355}'   http://localhost:3001/songs/1
```

**4. Borrar una canción**

```bash
curl -X DELETE http://localhost:3001/songs/5
```

---

### Playlists (`/playlists`)

**1. Ver todas las playlists**

```bash
curl http://localhost:3001/playlists
```

**2. Crear una playlist vacía**

```bash
curl -X POST   -H "Content-Type: application/json"   -d '{"name":"Workout Mix"}'   http://localhost:3001/playlists
```

**3. Crear playlist con canciones de entrada**

```bash
curl -X POST   -H "Content-Type: application/json"   -d '{"name":"Road Trip Jams", "songIds": [2, 3]}'   http://localhost:3001/playlists
```

**4. Agregar canciones a una playlist existente**

```bash
curl -X POST   -H "Content-Type: application/json"   -d '{"songIds":[4]}'   http://localhost:3001/playlists/1/songs
```

**5. Borrar una playlist**

```bash
curl -X DELETE http://localhost:3001/playlists/2
```
