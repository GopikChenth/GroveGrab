import { useState } from 'react'

export default function TaskItem({ task, onRetry, onCancel, onDelete, onViewLogs }) {
  const [showTracks, setShowTracks] = useState(false)
  
  // Filter out "query:" entries from current_track display
  const getCurrentTrackDisplay = () => {
    if (!task.current_track) return null
    // Hide if it's just "query:" without actual track name
    if (task.current_track.toLowerCase() === 'query:' || task.current_track.toLowerCase().startsWith('query:') && task.current_track.length < 10) {
      return null
    }
    return task.current_track
  }

  // Helper: detect placeholder/query-only track titles
  const isQueryTitle = (title) => {
    if (!title) return true
    const t = ('' + title).trim().toLowerCase()
    // exact 'query:' or 'query' or very short placeholder
    if (t === 'query:' || t === 'query') return true
    // sometimes appears as 'query: ' or 'query:    '
    if (t.startsWith('query:') && t.replace(/query:\s*/i, '').trim().length === 0) return true
    return false
  }
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-500/30';
      case 'completed':
        return 'text-green-600 dark:text-green-300 bg-green-100 dark:bg-green-500/20 border border-green-300 dark:border-green-500/30';
      case 'failed':
        return 'text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/30';
      case 'cancelled':
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        );
      case 'completed':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path d="M15 9l-6 6M9 9l6 6" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString();
  };

  return (
    <div className="bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${getStatusColor(task.status)}`}>
              {getStatusIcon(task.status)}
              {task.status.toUpperCase()}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-md">
              {task.type === 'preload' ? '📋 Preload' : '💿 Download'}
            </span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 truncate font-medium" title={task.url}>
            {task.url}
          </p>
          {task.download_path && (
            <p className="text-xs text-gray-500 dark:text-gray-500 truncate mt-2 flex items-center gap-1" title={task.download_path}>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
              </svg>
              {task.download_path}
            </p>
          )}
        </div>

        <div className="flex gap-1.5 ml-4">
          {task.status === 'running' && (
            <button
              onClick={() => onCancel(task.id)}
              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-all hover:scale-110"
              title="Stop"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="7" y="7" width="10" height="10" strokeWidth="2" />
              </svg>
            </button>
          )}
          
          {task.status === 'failed' && (
            <button
              onClick={() => onRetry(task.id)}
              className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/20 rounded-lg transition-all hover:scale-110"
              title="Retry"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M1 4v6h6M23 20v-6h-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          <button
            onClick={() => onViewLogs(task.id)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all hover:scale-110"
            title="View Logs"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 2v6h6M16 13H8m8 4H8m8 4H8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {task.status !== 'running' && (
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-all hover:scale-110"
              title="Delete"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {task.status === 'running' && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
            <span className="font-semibold">Progress: {task.progress}%</span>
            <span className="font-semibold">
              {task.completed_tracks} / {task.total_tracks || '?'} tracks completed
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-purple-600 dark:bg-purple-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${task.progress}%` }}
            />
          </div>
          {getCurrentTrackDisplay() && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 truncate flex items-center gap-1">
              <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
              </svg>
              Currently downloading: {getCurrentTrackDisplay()}
            </p>
          )}

        </div>
      )}

      {/* Per-song list (all statuses) */}
      {Array.isArray(task.tracks) && task.tracks.length > 0 && (
        <div className="mt-3">
          <button
            className="text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
            onClick={() => setShowTracks(v => !v)}
          >
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700/60 rounded-md border border-gray-300 dark:border-gray-600/60">
              {showTracks ? 'Hide' : 'Show'} tracks ({task.tracks.length})
            </span>
            <svg className={`w-3.5 h-3.5 transition-transform ${showTracks ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {showTracks && (
            <div className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1">
                  {task.tracks.filter(t => !isQueryTitle(t.title)).map((t, idx) => {
                    const pct = typeof t.progress === 'number' ? t.progress : (t.status === 'completed' ? 100 : 0)
                    const barColor = t.status === 'failed' ? 'bg-red-500' : (t.status === 'completed' ? 'bg-green-500' : t.status === 'cancelled' ? 'bg-gray-500' : 'bg-purple-500')
                    const icon = t.status === 'failed' ? (
                      <svg className="w-3.5 h-3.5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <path d="M15 9l-6 6M9 9l6 6" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    ) : t.status === 'completed' ? (
                      <svg className="w-3.5 h-3.5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : t.status === 'cancelled' ? (
                      <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="7" y="7" width="10" height="10" strokeWidth="2" />
                      </svg>
                    ) : (
                      <svg className={`w-3.5 h-3.5 ${t.status === 'downloading' ? 'animate-spin text-purple-400' : 'text-gray-400'}`} viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    )
                return (
                  <div key={`${t.title}-${idx}`} className="bg-gray-100 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                    <div className="flex items-center gap-2 mb-1">
                      {icon}
                      <p className="text-xs text-gray-800 dark:text-gray-200 truncate" title={t.title}>{t.title}</p>
                      <span className="ml-auto text-[10px] text-gray-500 dark:text-gray-400">{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <div className={`${barColor} h-1.5 rounded-full transition-all duration-300`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
        <span className="flex items-center gap-1">
          <span className="text-green-600 dark:text-green-400">✓</span> Downloaded: {task.completed_tracks}
        </span>
        {task.failed_tracks > 0 && (
          <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
            <span>✗</span> Failed: {task.failed_tracks}
          </span>
        )}
        {task.total_tracks && (
          <span className="flex items-center gap-1">
            <span className="text-gray-500">⏳</span> Remaining: {task.total_tracks - task.completed_tracks - task.failed_tracks}
          </span>
        )}
        <span className="ml-auto text-gray-500">{formatTime(task.updated_at)}</span>
      </div>
    </div>
  );
}
