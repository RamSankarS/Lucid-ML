import { useState, useEffect } from 'react';

// TypeScript JSON matching our FastAPI response schema
interface HealthStatus {
  status: string;
  system: string;
  version: string;
}

export default function App() {
  // State management for API response, loading state, and errors
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Define an async function inside useEffect to handle the HTTP fetch
    const fetchHealthStatus = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/health');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: HealthStatus = await response.json();
        setHealth(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to connect to backend server');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHealthStatus();
  }, []); // Empty dependency array means this runs ONCE when the component mounts

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
          Lucid-ML Control Panel
        </h1>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-850 rounded-lg border border-slate-800">
            <span className="text-sm font-medium text-slate-400">Backend Connection</span>
            
            {loading && (
              <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
                Connecting...
              </span>
            )}

            {error && (
              <span className="text-xs px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded">
                Disconnected
              </span>
            )}

            {health && (
              <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {health.status.toUpperCase()}
              </span>
            )}
          </div>

          {health && (
            <div className="text-xs font-mono text-slate-400 bg-slate-950 p-3 rounded border border-slate-800 space-y-1">
              <p><span className="text-slate-500">System:</span> {health.system}</p>
              <p><span className="text-slate-500">Version:</span> {health.version}</p>
            </div>
          )}

          {error && (
            <div className="text-xs text-red-400 bg-red-950/30 p-3 rounded border border-red-900/50">
              {error} - Make sure Uvicorn is running on port 8000.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}