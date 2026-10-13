import SliderControl from './SliderController';
import type { Telemetry } from '../types';

interface TelemetryPanelProps {
  telemetry: Telemetry;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, field: keyof Telemetry) => void;
  onExplain: () => void;
  explanationText: string;
  isExplaining: boolean;
}

export default function TelemetryPanel({ telemetry, onChange, onExplain, explanationText, isExplaining }: TelemetryPanelProps) {
  return (
    <div className="w-1/3 z-10 bg-black/40 backdrop-blur-[2px] border-2 border-green-500/30 rounded-none p-8 shadow-[0_0_15px_rgba(34,197,94,0.1)] relative flex flex-col justify-between h-fit">        
      <div>
        <h2 className="text-lg font-bold tracking-[0.2em] text-green-400 mb-8 uppercase border-b border-green-500/30 pb-2 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]">
          &gt; ORBITAL_TELEMETRY.exe
        </h2>

        <div className="space-y-8">
          <SliderControl 
            label="Absolute Magnitude" value={telemetry.absolute_magnitude} 
            min={10} max={30} step={0.1} field="absolute_magnitude" 
            onChange={onChange} suffix=" H" 
          />
          <SliderControl 
            label="Max Diameter" value={telemetry.est_diameter_max} 
            min={0} max={10} step={0.1} field="est_diameter_max" 
            onChange={onChange} suffix=" km" 
          />
          <SliderControl 
            label="Relative Velocity" value={telemetry.relative_velocity} 
            min={0} max={150000} step={1000} field="relative_velocity" 
            onChange={onChange} suffix=" km/h" 
          />
          <SliderControl 
            label="Miss Distance" value={telemetry.miss_distance} 
            min={0} max={75000000} step={100000} field="miss_distance" 
            onChange={onChange} suffix=" km" 
          />
        </div>
      </div>

      {/* Retro LLM Explain Action Section (Filling the bottom blank space) */}
      <div className="mt-8 pt-6 border-t border-green-500/30">
        <button
          onClick={onExplain}
          disabled={isExplaining}
          className="w-full py-3 bg-green-950/60 border border-green-500 text-green-400 font-bold uppercase tracking-[0.2em] hover:bg-green-500 hover:text-black transition-all duration-200 shadow-[0_0_10px_rgba(34,197,94,0.2)] disabled:opacity-50 cursor-pointer"
        >
          {isExplaining ? '[ DECODING_ANOMALY... ]' : '> DECODE_ANOMALY'}
        </button>

        {explanationText && (
          <div className="mt-4 p-4 bg-black/80 border border-green-500/40 text-xs text-green-300 leading-relaxed font-mono shadow-[inset_0_0_10px_rgba(34,197,94,0.1)]">
            <span className="text-green-600 block mb-1 uppercase tracking-wider">&gt;&gt; AI_DIAGNOSTIC_LOG:</span>
            {explanationText}
          </div>
        )}
      </div>
    </div>
  );
}