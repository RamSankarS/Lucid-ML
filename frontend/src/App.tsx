import { useState, useEffect } from "react";
import type { Telemetry, PredictionResult } from "./types";
import SpaceBackground from "./components/SpaceBackground";
import TelemetryPanel from "./components/TelemetryPanel";
import XaiDashboard from "./components/XaiDashboard";

export default function App() {
  const [telemetry, setTelemetry] = useState<Telemetry>({
    absolute_magnitude: 22.0,
    est_diameter_max: 0.5,
    relative_velocity: 50000,
    miss_distance: 25000000,
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
        const response = await fetch(`${API_URL}/api/v1/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(telemetry),
        });
        if (response.ok) {
          const data = await response.json();
          setResult(data);
        }
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [telemetry]);

  const handleSliderChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Telemetry,
  ) => {
    setTelemetry({ ...telemetry, [field]: parseFloat(e.target.value) });
  };

  return (
    <div className="relative min-h-screen bg-black text-green-500 p-8 font-mono flex gap-8 tracking-widest overflow-hidden selection:bg-green-900 selection:text-green-100">
      <SpaceBackground />
      <TelemetryPanel telemetry={telemetry} onChange={handleSliderChange} />
      <XaiDashboard result={result} loading={loading} />
    </div>
  );
}
