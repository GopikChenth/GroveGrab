# 🎨 GroveGrab Client (Frontend)

React + Vite frontend for GroveGrab Spotify Downloader.

## 🚀 Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## 📦 Desktop App

### Development Mode
```bash
# Run as Electron app (requires backend running separately)
npm run electron:dev
```

### Build Desktop App
```bash
# Install Electron dependencies (first time only)
npm install --save-dev electron electron-builder concurrently wait-on

# Build the desktop app
npm run electron:build
```

This will create a Windows installer in `dist-electron/` directory.

## 🔧 Configuration

Edit `.env` to change the API URL:

```env
VITE_API_URL=http://localhost:5000
```

## 🎨 Styling

This project uses:
- **Tailwind CSS v4** for styling
- **CSS variables** for theming
- **Dark mode** support

## 📱 Components

- `ConfigModal.jsx` - Settings modal for Spotify credentials
- `DownloadCard.jsx` - Main download input form
- `TaskItem.jsx` - Individual task display with progress
- `LogsModal.jsx` - View detailed logs for downloads
- `Navbar.jsx` - Navigation bar with theme toggle

## 🔌 API Service

The `services/api.js` file handles all communication with the Flask backend:

- Configuration management
- URL validation
- Download initiation
- Task status polling
- Log retrieval

## 🎯 Features

- ✅ Real-time download progress
- ✅ Task management (cancel, retry, delete)
- ✅ Detailed logging
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Configuration modal
- ✅ Task polling

## 🏗️ Build Output

- `dist/` - Web build output
- `dist-electron/` - Desktop app installer

## 📝 Notes

- The frontend polls the backend every 2 seconds for task updates
- Configuration is stored on the backend
- Logs are fetched on-demand when viewing


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
