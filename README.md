# SyncChat

A real-time 1:1 messaging app built with React, Express, MongoDB, and Socket.IO. SyncChat includes a modern chat UI, delivery and read receipts, typing indicators, media sharing, and chat management tools like pin, mute, archive, and block.

## Features

- **Authentication** — Email/password signup and login, JWT sessions (httpOnly cookies), optional Google OAuth
- **Real-time messaging** — Instant delivery via Socket.IO with typing indicators and online presence
- **Read receipts** — Single check (sent), double gray (delivered), double blue (read)
- **Rich messages** — Text, images, voice notes, replies, reactions, edits, and deletes
- **Link previews** — Automatic preview cards for shared URLs
- **Chat management** — Pin, mute, archive conversations; block and unblock users
- **Search** — Find messages across your chats
- **Profile** — Update display name, bio, and profile photo (Cloudinary)
- **Themes** — Light and dark mode with a slate + blue design system
- **Sounds** — Optional keystroke and notification sounds (toggle in settings)
- **Offline queue** — Messages queued locally and sent when back online
- **Admin panel** — User stats, moderation, and reports (`/admin`, admin users only)
- **Security** — Arcjet rate limiting and bot protection on auth routes

## Tech Stack

| Layer    | Technologies |
| -------- | ------------ |
| Client   | React 19, Vite, Zustand, Tailwind CSS, DaisyUI, Socket.IO Client |
| Server   | Node.js, Express, MongoDB (Mongoose), Socket.IO, JWT |
| Media    | Cloudinary |
| Security | Arcjet, bcrypt |

## Prerequisites

- **Node.js** 20 or later
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **Cloudinary** account (for profile photos and image messages)
- **Arcjet** key (recommended for production; optional in development)
- **Google OAuth** credentials (optional)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Nasir-code-786/sync-chat.git
cd sync-chat
```

### 2. Environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
| -------- | ----------- |
| `PORT` | Server port (default `3000`) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `CLIENT_URL` | Frontend origin (e.g. `http://localhost:5173`) |
| `CLOUDINARY_*` | Cloudinary cloud name, API key, and secret |
| `ARCJET_KEY` | Arcjet API key for rate limiting |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (optional) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret (optional) |

### 3. Install dependencies

From the project root:

```bash
npm run build
```

This installs dependencies for both `client` and `server`, and builds the client for production.

For development, install each package separately:

```bash
npm install --prefix server
npm install --prefix client
```

### 4. Run in development

Start the API server (with hot reload):

```bash
npm run dev --prefix server
```

In a second terminal, start the Vite dev server:

```bash
npm run dev --prefix client
```

Open [http://localhost:5173](http://localhost:5173). The client proxies API requests to `http://localhost:3000/api` in development.

### 5. Run in production

```bash
npm run build
npm start
```

The server serves the built client from `client/dist` when `NODE_ENV=production`.

## Project Structure

```
sync-chat/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # UI components
│       ├── pages/          # Route pages (login, chat, admin)
│       ├── store/          # Zustand stores (auth, chat, settings)
│       └── lib/            # Axios, Socket.IO, sounds, offline queue
├── server/
│   └── src/
│       ├── controllers/    # Route handlers
│       ├── middleware/     # Auth, admin, Arcjet
│       ├── models/         # Mongoose schemas
│       ├── routes/         # Express routers
│       └── lib/            # DB, Socket.IO, Cloudinary, helpers
├── .env.example
└── package.json
```

## API Overview

All REST endpoints are prefixed with `/api`.

| Route prefix | Purpose |
| ------------ | ------- |
| `/api/auth` | Signup, login, logout, profile, Google OAuth |
| `/api/messages` | Send/receive messages, search, reactions, read receipts |
| `/api/users` | Status, settings, block/unblock, pin/mute/archive, reports |
| `/api/admin` | Stats, user management, reports (admin only) |

### Socket.IO events

| Event | Direction | Description |
| ----- | --------- | ----------- |
| `newMessage` | Server → Client | New message received |
| `messageDelivered` | Both | Delivery confirmation |
| `messagesRead` | Server → Client | Partner read your messages |
| `userTyping` / `userStopTyping` | Server → Client | Typing indicators |
| `typingInList` | Server → Client | Typing shown in chat list |
| `getOnlineUsers` | Server → Client | Online user IDs |
| `messageUpdated` / `messageDeleted` | Server → Client | Edit and delete sync |
| `reactionUpdated` | Server → Client | Reaction changes |

## Admin Access

Admin routes are protected by the `isAdmin` flag on the User model. To grant admin access, set `isAdmin: true` on a user document in MongoDB:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { isAdmin: true } })
```

Then visit `/admin` while logged in as that user.

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run build` | Install deps and build client |
| `npm start` | Start production server |
| `npm run dev --prefix server` | Dev server with nodemon |
| `npm run dev --prefix client` | Vite dev server |
| `npm run lint --prefix client` | ESLint |

## License

ISC

## Links

- [Repository](https://github.com/AdilKhan-tech/sync-chat)
- [Issues](https://github.com/AdilKhan-tech/sync-chat/issues)
# sync_chat
