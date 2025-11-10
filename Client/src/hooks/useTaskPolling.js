import { useState, useEffect } from 'react';

/**
 * Hook for polling task status
 */
export default function useTaskPolling(apiService, taskId, interval = 2000) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!taskId) {
      setLoading(false);
      return;
    }

    let intervalId;
    let isMounted = true;

    const fetchTask = async () => {
      try {
        const data = await apiService.getTask(taskId);
        if (isMounted) {
          setTask(data);
          setError(null);
          setLoading(false);

          // Stop polling if task is done
          if (data.status === 'completed' || data.status === 'failed' || data.status === 'cancelled') {
            clearInterval(intervalId);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    // Initial fetch
    fetchTask();

    // Start polling
    intervalId = setInterval(fetchTask, interval);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [taskId, interval, apiService]);

  return { task, loading, error };
}
