import TypewriterText from './TypewriterText';
import type { PredictionResult } from '../types';
interface XaiDashboardProps {
  result: PredictionResult | null;
  loading: boolean;
}

export default function XaiDashboard({ result, loading }: XaiDashboardProps) {
  // Move UI-specific math here so the parent doesn't need to process it
  const maxShap = result ? Math.max(...result.explanation.attributions.map(a => Math.abs(a.value))) : 1;
  const hazardProb = result?.prediction.hazard_probability || 0;
  const isHazard = hazardProb > 0.5;

  return (
    <div className="w-2/3 z-10 flex flex-col gap-6">
      
      {/* Top Data Card: Radar & Threat Level */}
      <div className="bg-black/40 backdrop-blur-[2px] border-2 border-green-500/30 rounded-none p-8 shadow-[0_0_15px_rgba(34,197,94,0.1)] flex items-center gap-8 relative">
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

      {/* Bottom Data Card: SHAP Attribution Bars */}
      <div className="bg-black/40 backdrop-blur-[2px] border-2 border-green-500/30 rounded-none p-8 shadow-[0_0_15px_rgba(34,197,94,0.1)] flex-1 relative">          
        <h3 className="text-lg font-bold tracking-[0.2em] text-green-400 mb-8 uppercase border-b border-green-500/30 pb-2 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]">
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
  );
}