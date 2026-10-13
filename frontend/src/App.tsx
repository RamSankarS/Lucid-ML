import { useState, useEffect } from 'react';


interface Telemetry {
  absolute_magnitude: number;
  est_diameter_max: number;
  relative_velocity: number;
  miss_distance: number;
}

interface PredictionResult {
  prediction: {
    hazard_probability: number;
    status: string;
  };
  explanation: {
    base_value: number;
    attributions: Array<{ feature: string; value: number }>;
  };
}


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
        const response = await fetch('http://127.0.0.1:8000/api/v1/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Telemetry) => {
    setTelemetry({ ...telemetry, [field]: parseFloat(e.target.value) });
  };


  const maxShap = result ? Math.max(...result.explanation.attributions.map(a => Math.abs(a.value))) : 1;
  const hazardProb = result?.prediction.hazard_probability || 0;
  const isHazard = hazardProb > 0.5;

  return (
    <div className="relative min-h-screen bg-black text-green-500 p-8 font-mono flex gap-8 tracking-widest overflow-hidden selection:bg-green-900 selection:text-green-100">
      
      {/* Stars going up animation, parallax */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-80" style={{
        backgroundImage: 'radial-gradient(1px 1px at 25px 5px, white, transparent), radial-gradient(1px 1px at 50px 25px, white, transparent), radial-gradient(1.5px 1.5px at 125px 20px, #a3e635, transparent), radial-gradient(1.5px 1.5px at 50px 75px, white, transparent), radial-gradient(2px 2px at 15px 125px, white, transparent), radial-gradient(2.5px 2.5px at 110px 80px, #4ade80, transparent)',
        backgroundSize: '150px 150px',
        animation: 'starsUpFast 10s linear infinite'
      }}></div>
      
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40" style={{
        backgroundImage: 'radial-gradient(1px 1px at 80px 40px, white, transparent), radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.9), transparent), radial-gradient(1px 1px at 250px 180px, white, transparent), radial-gradient(2px 2px at 300px 250px, #4ade80, transparent)',
        backgroundSize: '350px 350px',
        animation: 'starsUpSlow 25s linear infinite'
      }}></div>

      <style>{`
        @keyframes starsUpFast {
          from { background-position: 0 0; }
          to { background-position: 0 -150px; }
        }
        @keyframes starsUpSlow {
          from { background-position: 0 0; }
          to { background-position: 0 -350px; }
        }
      `}</style>
     {/* 90s vibe*/}
      <div className="absolute inset-0 z-50 pointer-events-none opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }}></div>
      <div className="absolute inset-0 z-40 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.7)]"></div>
      <div className="w-1/3 z-10 bg-black/40 backdrop-blur-[2px] border-2 border-green-500/30 rounded-none p-8 shadow-[0_0_15px_rgba(34,197,94,0.1)] relative h-fit">        <h2 className="text-lg font-bold tracking-[0.2em] text-green-400 mb-8 uppercase border-b border-green-500/30 pb-2 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]">
          &gt; ORBITAL_TELEMETRY.exe
        </h2>

        <div className="space-y-10">
          <SliderControl 
            label="Absolute Magnitude" value={telemetry.absolute_magnitude} 
            min={10} max={30} step={0.1} field="absolute_magnitude" 
            onChange={handleSliderChange} suffix=" H" 
          />
          <SliderControl 
            label="Max Diameter" value={telemetry.est_diameter_max} 
            min={0} max={10} step={0.1} field="est_diameter_max" 
            onChange={handleSliderChange} suffix=" km" 
          />
          <SliderControl 
            label="Relative Velocity" value={telemetry.relative_velocity} 
            min={0} max={150000} step={1000} field="relative_velocity" 
            onChange={handleSliderChange} suffix=" km/h" 
          />
          <SliderControl 
            label="Miss Distance" value={telemetry.miss_distance} 
            min={0} max={75000000} step={100000} field="miss_distance" 
            onChange={handleSliderChange} suffix=" km" 
          />
        </div>
      </div>

      <div className="w-2/3 z-10 flex flex-col gap-6">
        
<div className="bg-black/40 backdrop-blur-[2px] border-2 border-green-500/30 rounded-none p-8 shadow-[0_0_15px_rgba(34,197,94,0.1)] flex items-center gap-8 relative">           {/* Retro Radar Animation Box */}
           <div className="relative w-40 h-40 bg-black rounded-full border border-green-500/50 flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
              <div className="absolute w-1/2 h-[2px] bg-green-500/80 origin-right right-1/2 animate-[spin_3s_linear_infinite]" style={{ boxShadow: '0 -10px 20px rgba(34,197,94,0.6)' }}></div>
              <div className="absolute w-28 h-28 rounded-full border border-green-500/30 border-dashed"></div>
              <div className="absolute w-16 h-16 rounded-full border border-green-500/30 border-dashed"></div>
              <div className="absolute w-full h-[1px] bg-green-500/20"></div>
              <div className="absolute h-full w-[1px] bg-green-500/20"></div>
              <div className="absolute w-3 h-3 bg-green-400 rounded-sm shadow-[0_0_10px_rgba(34,197,94,1)]"></div>
              <div 
                className={`absolute w-3 h-3 rounded-sm transition-all duration-1000 ease-out z-10 ${
                  isHazard ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)] animate-ping' : 'bg-green-300 shadow-[0_0_10px_rgba(134,239,172,0.8)]'
                }`}
                style={{
                  transform: `translate(${Math.max(12, 60 - (hazardProb * 60))}px, -${Math.max(12, 60 - (hazardProb * 60))}px)`
                }}
              />
           </div>

           <div className="flex-1">
             <div className="flex items-center justify-between mb-2 border-b border-green-500/30 pb-2">
                <h3 className="text-xs tracking-[0.3em] text-green-600 uppercase">SYS.ASSESSMENT</h3>
                {loading && <span className="text-xs text-green-400 animate-pulse bg-green-950 px-2 py-1">CALCULATING...</span>}
             </div>
             {result && (
                <div className="mt-4">
                  <div className={`text-6xl font-bold tracking-widest mb-2 h-16 flex items-center ${isHazard ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]'}`}>
                    <TypewriterText text={result.prediction.status.toUpperCase()} />
                    <span className="animate-pulse ml-2 opacity-80 text-green-500 font-light">_</span>
                  </div>
                  <div className="text-green-500 text-xs bg-green-950/30 inline-block px-3 py-1 border border-green-500/30 mt-2">
                    PROBABILITY_OF_IMPACT: <span className="text-green-300 font-bold">{(result.prediction.hazard_probability * 100).toFixed(2)}%</span>
                  </div>
                </div>
             )}
           </div>
        </div>

<div className="bg-black/40 backdrop-blur-[2px] border-2 border-green-500/30 rounded-none p-8 shadow-[0_0_15px_rgba(34,197,94,0.1)] flex-1 relative">          <h3 className="text-lg font-bold tracking-[0.2em] text-green-400 mb-8 uppercase border-b border-green-500/30 pb-2 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]">
            &gt; XAI_ATTRIBUTIONS.log
          </h3>
          
          {result && (
            <div className="space-y-6 relative z-10 mt-4">
              <div className="flex text-[10px] uppercase tracking-[0.2em] text-green-700 mb-2">
                <div className="w-1/3 text-right pr-6">VARIABLE</div>
                <div className="w-2/3 flex justify-between px-2">
                  <span>&lt;-- SAFE</span>
                  <span>HAZARD --&gt;</span>
                </div>
                <div className="w-16"></div>
              </div>

              {result.explanation.attributions.map((attr) => (
                <div key={attr.feature} className="flex items-center text-xs group">
                  <div className="w-1/3 text-right pr-6 text-green-600 group-hover:text-green-400 transition-colors uppercase">
                    {attr.feature}
                  </div>
                  
                  <div className="w-2/3 flex items-center relative h-4 bg-green-950/30 border border-green-500/20 overflow-hidden">
                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-green-500/50 z-10 border-l border-dashed border-green-400"></div>
                    
                    {attr.value < 0 ? (
                      <div 
                        className="absolute right-1/2 h-full bg-green-500/80 transition-all duration-0" 
                        style={{ width: `${(Math.abs(attr.value) / maxShap) * 50}%` }}
                      ></div>
                    ) : (
                      <div 
                        className="absolute left-1/2 h-full bg-red-500/80 transition-all duration-0" 
                        style={{ width: `${(Math.abs(attr.value) / maxShap) * 50}%` }}
                      ></div>
                    )}
                  </div>
                  
                  <div className="w-16 text-right text-green-500/80 text-xs">
                    {attr.value > 0 ? '+' : ''}{attr.value.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function SliderControl({ label, value, min, max, step, field, onChange, suffix }: any) {
  return (
    <div className="group">
      <label className="flex justify-between text-xs tracking-[0.2em] text-green-600 mb-3 group-hover:text-green-400 uppercase">
        {label} 
        <span className="text-green-400 bg-black px-2 py-1 border border-green-500/30">
          [{value.toLocaleString()}{suffix}]
        </span>
      </label>
      <input 
        type="range" min={min} max={max} step={step} 
        value={value}
        onChange={(e) => onChange(e, field)}
        className="w-full h-2 bg-green-950/50 border border-green-500/30 rounded-none appearance-none cursor-pointer accent-green-500"
      />
    </div>
  );
}

function TypewriterText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (text !== display && !isDeleting && !text.startsWith(display)) {
      setIsDeleting(true);
    }
  }, [text, display, isDeleting]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    if (isDeleting) {
      if (display.length > 0) {
        timer = setTimeout(() => setDisplay(prev => prev.slice(0, -1)), 40);
      } else {
        setIsDeleting(false);
      }
    } else if (display.length < text.length) {
      timer = setTimeout(() => setDisplay(text.slice(0, display.length + 1)), 80);
    }
    
    return () => clearTimeout(timer);
  }, [display, isDeleting, text]);

  return <>{display}</>;
}