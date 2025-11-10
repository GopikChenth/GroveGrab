import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar.jsx'
import DownloadCard from './components/DownloadCard.jsx'
import TaskItem from './components/TaskItem.jsx'
import ConfigModal from './components/ConfigModal.jsx'
import LogsModal from './components/LogsModal.jsx'
import useTheme from './hooks/useTheme.js'
import apiService from './services/api.js'

function App() {
  const { theme, toggle } = useTheme()
  
  // State
  const [config, setConfig] = useState(null)
  const [tasks, setTasks] = useState([])
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [showLogsModal, setShowLogsModal] = useState(false)
  const [showSongListModal, setShowSongListModal] = useState(false)
  const [selectedTaskLogs, setSelectedTaskLogs] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load config and tasks on mount
  useEffect(() => {
    loadConfig()
    loadTasks()
    
    // Poll tasks every 2 seconds
    const interval = setInterval(loadTasks, 2000)
    return () => clearInterval(interval)
  }, [])

  const loadConfig = async () => {
    try {
      const data = await apiService.getConfig()
      setConfig(data)
      setError(null) // Clear any previous errors
      setLoading(false)
    } catch (err) {
      console.error('Config load error:', err)
      setError('Failed to load configuration. Make sure the backend server is running.')
      setLoading(false)
    }
  }

  const loadTasks = async () => {
    try {
      const data = await apiService.getTasks()
      setTasks(data)
      // If we successfully loaded tasks and had an error, clear it
      if (error && !loading) {
        setError(null)
      }
    } catch (err) {
      // Silently fail for polling errors to avoid spam
      console.error('Failed to load tasks:', err)
    }
  }

  const handleSaveConfig = async (newConfig) => {
    await apiService.updateConfig(newConfig)
    await loadConfig()
  }

  const handleStartDownload = async (url, downloadPath) => {
    const result = await apiService.startDownload(url, downloadPath)
    console.log('Download started:', result)
    // Immediately refresh tasks
    setTimeout(loadTasks, 500)
  }

  const handleRetry = async (taskId) => {
    await apiService.retryTask(taskId)
    await loadTasks()
  }

  const handleCancel = async (taskId) => {
    // Optimistic update: flip status immediately for snappy UI
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'cancelled' } : t))
    try {
      await apiService.cancelTask(taskId)
    } catch (_) {
      // Re-sync on failure
    }
    await loadTasks()
  }

  const handleDelete = async (taskId) => {
    await apiService.deleteTask(taskId)
    await loadTasks()
  }

  const handleViewLogs = async (taskId) => {
    try {
      const data = await apiService.getTaskLogs(taskId)
      setSelectedTaskLogs({ taskId, logs: data.logs })
      setShowLogsModal(true)
    } catch (err) {
      alert('Failed to load logs: ' + err.message)
    }
  }

  // Extract songs from all tasks
  const extractSongList = () => {
    const downloadedSongs = []
    const failedSongs = []
    const downloadingSongs = []
    const pendingSongs = []

    tasks.forEach(task => {
      // Track total tracks for pending calculation
      const totalTracks = task.total_tracks || 0
      const completedCount = task.completed_tracks || 0
      const failedCount = task.failed_tracks || 0

      if (task.logs && task.logs.length > 0) {
        task.logs.forEach(log => {
          // Parse downloaded songs (pattern: "Downloaded "SongName": URL")
          const downloadMatch = log.match(/Downloaded "([^"]+)"/)
          if (downloadMatch) {
            const songName = downloadMatch[1]
            if (!downloadedSongs.find(s => s.name === songName)) {
              downloadedSongs.push({
                name: songName,
                status: 'completed',
                taskId: task.id,
                url: task.url
              })
            }
          }

          // Parse failed songs (pattern: contains "Error" or "Failed")
          const errorMatch = log.match(/Error|Failed|AudioProviderError/)
          if (errorMatch) {
            // Try to extract song name from error context
            const songMatch = log.match(/["']([^"']+)["']/)
            if (songMatch) {
              const songName = songMatch[1]
              if (!failedSongs.find(s => s.name === songName) && 
                  !downloadedSongs.find(s => s.name === songName)) {
                failedSongs.push({
                  name: songName,
                  status: 'failed',
                  taskId: task.id,
                  url: task.url
                })
              }
            }
          }
        })
      }

      // Parse currently downloading
      if (task.status === 'running' && task.current_track) {
        if (!downloadingSongs.find(s => s.name === task.current_track)) {
          downloadingSongs.push({
            name: task.current_track,
            status: 'downloading',
            taskId: task.id,
            url: task.url
          })
        }
      }

      // Calculate pending songs (not yet downloaded, failed, or downloading)
      if (totalTracks > 0) {
        const pendingCount = totalTracks - completedCount - failedCount - (task.current_track ? 1 : 0)
        if (pendingCount > 0 && task.status === 'running') {
          pendingSongs.push({
            taskId: task.id,
            url: task.url,
            count: pendingCount
          })
        }
      }
    })

    return { downloadedSongs, failedSongs, downloadingSongs, pendingSongs }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 bg-purple-600 rounded-full animate-ping opacity-75"></div>
              <div className="relative w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                </svg>
              </div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Loading GroveGrab</h3>
          <p className="text-gray-600 dark:text-gray-400">Preparing your download station...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-2xl p-8 backdrop-blur-sm">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <path d="M12 8v4m0 4h.01" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">Connection Error</h2>
          <p className="text-gray-700 dark:text-gray-300 text-center mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null)
              setLoading(true)
              loadConfig()
            }}
            className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar theme={theme} onToggleTheme={toggle} onOpenConfig={() => setShowConfigModal(true)} />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Header Section */}
        <div className="mb-8 sm:mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-3 bg-gradient-to-r from-teal-500 via-purple-600 to-orange-500 bg-clip-text text-transparent">
            GroveGrab
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            Download Spotify songs and playlists with your own API credentials
          </p>
        </div>

        {/* Configuration Warning */}
        {!config?.has_credentials && (
          <div className="mb-8 max-w-3xl mx-auto">
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-500/20 rounded-xl">
                  <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 mb-2">
                    Setup Required
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Configure your Spotify API credentials to unlock downloading capabilities.
                  </p>
                  <button
                    onClick={() => setShowConfigModal(true)}
                    className="px-6 py-2.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-all shadow-lg"
                  >
                    Open Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Download Card */}
        <div className="mb-10 max-w-3xl mx-auto">
          <DownloadCard
            onStartDownload={handleStartDownload}
            hasCredentials={config?.has_credentials}
          />
        </div>

        {/* Tasks Section */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">Download Queue</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Track your downloads in real-time</p>
            </div>
            {tasks.length > 0 && (
              <button
                onClick={() => setShowSongListModal(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                View All Songs
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">{tasks.length}</span>
              </button>
            )}
          </div>

          {tasks.length === 0 ? (
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-12 sm:p-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-purple-100 dark:bg-purple-600/20 rounded-full flex items-center justify-center">
                  <svg className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No Active Downloads
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Paste a Spotify URL above to start downloading your favorite music
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onRetry={handleRetry}
                  onCancel={handleCancel}
                  onDelete={handleDelete}
                  onViewLogs={handleViewLogs}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <ConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onSave={handleSaveConfig}
        currentConfig={config}
      />

      <LogsModal
        isOpen={showLogsModal}
        onClose={() => {
          setShowLogsModal(false)
          setSelectedTaskLogs(null)
        }}
        logs={selectedTaskLogs?.logs}
        taskId={selectedTaskLogs?.taskId}
      />

      {/* Song List Modal */}
      {showSongListModal && (() => {
        const { downloadedSongs, failedSongs, downloadingSongs, pendingSongs } = extractSongList()
        const totalPending = pendingSongs.reduce((sum, p) => sum + p.count, 0)
        const totalSongs = downloadedSongs.length + failedSongs.length + downloadingSongs.length + totalPending

        return (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 max-w-3xl w-full max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="px-6 py-6 border-b border-gray-700 bg-purple-600/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                      <svg className="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      All Songs
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm">
                      <span className="text-gray-300 font-semibold">{totalSongs} total</span>
                      <span className="text-green-400 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        {downloadedSongs.length} downloaded
                      </span>
                      {downloadingSongs.length > 0 && (
                        <span className="text-purple-400 flex items-center gap-1">
                          <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                          {downloadingSongs.length} downloading
                        </span>
                      )}
                      {totalPending > 0 && (
                        <span className="text-blue-400 flex items-center gap-1">
                          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                          {totalPending} pending
                        </span>
                      )}
                      {failedSongs.length > 0 && (
                        <span className="text-red-400 flex items-center gap-1">
                          <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                          {failedSongs.length} failed
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSongListModal(false)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <svg className="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {totalSongs === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 bg-purple-600/20 rounded-full flex items-center justify-center">
                      <svg className="h-10 w-10 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-lg font-medium">No songs found yet</p>
                    <p className="text-gray-500 text-sm mt-2">Start a download to see songs appear here</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Downloaded Songs */}
                    {downloadedSongs.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <div className="p-2 bg-green-500/20 rounded-lg">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          Downloaded
                          <span className="ml-auto text-sm bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                            {downloadedSongs.length}
                          </span>
                        </h3>
                        <div className="space-y-2">
                          {downloadedSongs.map((song, idx) => (
                            <div key={idx} className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 hover:border-green-500/50 transition-all">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg flex-shrink-0">
                                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                    <path d="M8 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-white truncate">{song.name}</p>
                                  <p className="text-xs text-gray-400 truncate mt-1">{song.url}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Downloading Songs */}
                    {downloadingSongs.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <div className="p-2 bg-purple-500/20 rounded-lg">
                            <svg className="animate-spin h-5 w-5 text-purple-400" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </div>
                          Downloading
                          <span className="ml-auto text-sm bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full animate-pulse">
                            {downloadingSongs.length}
                          </span>
                        </h3>
                        <div className="space-y-2">
                          {downloadingSongs.map((song, idx) => (
                            <div key={idx} className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 hover:border-purple-500/50 transition-all">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg flex-shrink-0">
                                  <svg className="animate-spin h-5 w-5 text-purple-400" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-white truncate">{song.name}</p>
                                  <p className="text-xs text-gray-400 truncate mt-1">{song.url}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pending Songs */}
                    {totalPending > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          Pending
                          <span className="ml-auto text-sm bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">
                            {totalPending}
                          </span>
                        </h3>
                        <div className="space-y-2">
                          {pendingSongs.map((item, idx) => (
                            <div key={idx} className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-white">{item.count} tracks waiting to download</p>
                                  <p className="text-xs text-gray-400 truncate mt-1">{item.url}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Failed Songs */}
                    {failedSongs.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <div className="p-2 bg-red-500/20 rounded-lg">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <circle cx="12" cy="12" r="10" strokeWidth="2" />
                              <path d="M15 9l-6 6M9 9l6 6" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </div>
                          Failed
                          <span className="ml-auto text-sm bg-red-500/20 text-red-400 px-3 py-1 rounded-full">
                            {failedSongs.length}
                          </span>
                        </h3>
                        <div className="space-y-2">
                          {failedSongs.map((song, idx) => (
                            <div key={idx} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 hover:border-red-500/50 transition-all">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-red-500/20 rounded-lg flex-shrink-0">
                                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                    <path d="M12 8v4m0 4h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-white truncate">{song.name}</p>
                                  <p className="text-xs text-gray-400 truncate mt-1">{song.url}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-700 bg-gray-800/50">
                <button
                  onClick={() => setShowSongListModal(false)}
                  className="w-full px-6 py-3 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

export default App
