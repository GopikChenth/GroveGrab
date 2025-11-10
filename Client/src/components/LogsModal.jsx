export default function LogsModal({ isOpen, onClose, logs, taskId }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-700 bg-purple-600/10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Task Logs
            </h2>
            <p className="mt-2 text-sm text-gray-400 font-mono">
              Task ID: <span className="text-purple-400">{taskId}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {logs && logs.length > 0 ? (
            <div className="bg-gray-900 rounded-xl p-5 font-mono text-sm border border-gray-700 shadow-inner">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`py-1.5 leading-relaxed ${
                    log.includes('❌') || log.includes('Error') || log.includes('Failed')
                      ? 'text-red-400'
                      : log.includes('✅') || log.includes('Completed') || log.includes('Downloaded')
                      ? 'text-green-400'
                      : log.includes('⚠️') || log.includes('Warning')
                      ? 'text-yellow-400'
                      : log.includes('Starting') || log.includes('Downloading')
                      ? 'text-blue-400'
                      : 'text-gray-300'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
                <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-400 text-lg">No logs available</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-700 bg-gray-800/50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
