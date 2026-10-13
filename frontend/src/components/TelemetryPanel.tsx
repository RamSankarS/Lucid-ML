import SliderControl from './SliderController';
import type { Telemetry } from '../types';

interface TelemetryPanelProps {
  telemetry: Telemetry;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, field: keyof Telemetry) => void;
}

export default function TelemetryPanel({ telemetry, onChange }: TelemetryPanelProps) {
  return (
    <div className="w-1/3 z-10 bg-black/40 backdrop-blur-[2px] border-2 border-green-500/30 rounded-none p-8 shadow-[0_0_15px_rgba(34,197,94,0.1)] relative h-fit">        
      <h2 className="text-lg font-bold tracking-[0.2em] text-green-400 mb-8 uppercase border-b border-green-500/30 pb-2 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]">
        &gt; ORBITAL_TELEMETRY.exe
      </h2>

      <div className="space-y-10">
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
  );
}