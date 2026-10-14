import { useState, useEffect, useRef } from 'react';
import SliderControl from './SliderController';
import type { Telemetry } from '../types';

interface TelemetryPanelProps {
  telemetry: Telemetry;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, field: keyof Telemetry) => void;
  onExplain: () => void;
  explanationText: string;
  isExplaining: boolean;
}

const DIAGNOSTIC_PHASES = [
  "[ UPLINK_ESTABLISHED... ]",
  "[ RECALIBRATING_SENSORS... ]",
  "[ QUERYING_NEURAL_NET... ]",
  "[ BYPASSING_PROXY_NODE... ]"
];

export default function TelemetryPanel({ telemetry, onChange, onExplain, explanationText, isExplaining }: TelemetryPanelProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeExplanation, setActiveExplanation] = useState("");
  
  const typingIntervalRef = useRef<number | null>(null);
  const prevTelemetry = useRef(telemetry);

  // 1. Sync state with API lifecycle
  useEffect(() => {
    let interval: number;
    if (isExplaining) {
      // Clear everything immediately when fetching starts
      setDisplayedText(""); 
      setActiveExplanation("");
      setIsDeleting(false);
      setPhaseIndex(0);
      interval = window.setInterval(() => {
        setPhaseIndex((prev) => (prev + 1) % DIAGNOSTIC_PHASES.length);
      }, 800);
    } else if (explanationText) {
      // Lock in the new text to be typed
      setActiveExplanation(explanationText);
    }
    return () => clearInterval(interval);
  }, [isExplaining, explanationText]);

  // 2. Detect slider adjustments to trigger the backspace effect
  useEffect(() => {
    if (prevTelemetry.current !== telemetry) {
      prevTelemetry.current = telemetry;
      // If text is on screen and we aren't currently fetching or already deleting
      if (displayedText.length > 0 && !isExplaining && !isDeleting) {
        setActiveExplanation(""); // Mark current explanation as stale
        setIsDeleting(true);      // Engage backspace sequence
      }
    }
  }, [telemetry, displayedText, isExplaining, isDeleting]);

  // 3. The Typewriter / Backspace Engine
  useEffect(() => {
    // Clear any existing typing loops to prevent overlapping animations
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    if (isDeleting) {
      // Reverse mode: Delete 1 character every 10ms
      typingIntervalRef.current = window.setInterval(() => {
        setDisplayedText((prev) => {
          if (prev.length <= 1) {
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
            setIsDeleting(false);
            return ""; // Fully erased
          }
          return prev.slice(0, -1);
        });
      }, 10);
    } 
    else if (activeExplanation && !isExplaining) {
      // Forward mode: Type 1 character every 20ms
      let currentIndex = 0;
      setDisplayedText(""); 
      
      typingIntervalRef.current = window.setInterval(() => {
        if (currentIndex < activeExplanation.length) {
          const char = activeExplanation.charAt(currentIndex);
          setDisplayedText((prev) => prev + char);
          currentIndex++;
        } else {
          if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        }
      }, 20);
    }

    // Cleanup interval if the component unmounts
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, [isDeleting, activeExplanation, isExplaining]);

  return (
    <div className="w-1/3 z-10 bg-black/40 backdrop-blur-[2px] border-2 border-green-500/30 rounded-none p-5 shadow-[0_0_15px_rgba(34,197,94,0.1)] relative flex flex-col justify-between h-fit">        
      <div>
        <h2 className="text-base font-bold tracking-[0.2em] text-green-400 mb-4 uppercase border-b border-green-500/30 pb-2 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]">
          &gt; ORBITAL_TELEMETRY.exe
        </h2>

        <div className="space-y-4">
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

      <div className="mt-4 pt-4 border-t border-green-500/30">
        <button
          onClick={onExplain}
          disabled={isExplaining}
          className="w-full py-2 bg-green-950/60 border border-green-500 text-green-400 text-sm font-bold uppercase tracking-[0.2em] hover:bg-green-500 hover:text-black transition-all duration-200 shadow-[0_0_10px_rgba(34,197,94,0.2)] disabled:opacity-50 cursor-pointer"
        >
          {isExplaining ? DIAGNOSTIC_PHASES[phaseIndex] : '> DECODE_ANOMALY'}
        </button>

        {/* Panel dynamically collapses once deleting is completely finished */}
        {(displayedText || isExplaining || activeExplanation || isDeleting) ? (
          <div className="mt-3 p-3 bg-black/80 border border-green-500/40 text-xs text-green-300 leading-relaxed font-mono shadow-[inset_0_0_10px_rgba(34,197,94,0.1)] min-h-[96px]">
            <span className="text-green-600 block mb-1 uppercase tracking-wider">&gt;&gt; AI_DIAGNOSTIC_LOG:</span>
            
            {isExplaining ? (
               <span className="animate-pulse text-green-500 font-bold">_</span>
            ) : (
               <>
                 {displayedText}
                 <span className="animate-pulse text-green-500 font-bold ml-1">_</span>
               </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}