import { useMemo } from 'react';

interface AsciiProfilerProps {
  diameter: number;
  velocity: number;
}

export default function AsciiProfiler({ diameter, velocity }: AsciiProfilerProps) {
  const asciiArt = useMemo(() => {
    // Normalize velocity (0 to 150000) to a tail length (3 to 20 characters)
    const speedRatio = Math.min(Math.max(velocity / 150000, 0), 1);
    const len = Math.floor(speedRatio * 17) + 3; 
    
    // Character intensity changes based on speed
    const c = speedRatio > 0.7 ? '=' : speedRatio > 0.4 ? '-' : '~';
    
    // Generate staggered tail lengths to simulate a kinetic wake/coma
    const t0 = c.repeat(len);
    const t1 = c.repeat(Math.max(len - 2, 0));
    const t2 = c.repeat(Math.max(len - 4, 0));

    // Scale the ASCII rendering based on the 0-10km diameter slider
    if (diameter < 2.5) {
      return `\n\n\n       ${t0} ¤\n\n\n`;
    } else if (diameter < 5.0) {
      return `\n\n    ${t1} .-. \n   ${t0} (   )\n${t1} \`-' \n\n`;
    } else if (diameter < 7.5) {
      return `\n    ${t2}  .--. \n   ${t1} /    \\ \n  ${t0} (      )\n   ${t1} \\    / \n    ${t2}  \`--' \n`;
    } else {
      return `\n    ${t2}    .------. \n   ${t1}   /        \\ \n${t0}  /          \\ \n ${c.repeat(len+2)} \vert{}            \vert{}\n${t0}  \\          / \n   ${t1}   \\        / \n${t2}    \`------' \n`;
    }
  }, [diameter, velocity]);

  // Determine hazard classification text based on size
  const classLabel = diameter > 7.5 ? 'LEVIATHAN' : diameter > 4.0 ? 'BEHEMOTH' : 'STANDARD';

  return (
    <div className="w-full bg-black/40 backdrop-blur-[2px] border-2 border-green-500/30 rounded-none p-5 shadow-[0_0_15px_rgba(34,197,94,0.1)] flex flex-col relative h-full min-h-[220px]">
      <h2 className="text-base font-bold tracking-[0.2em] text-green-400 mb-2 uppercase border-b border-green-500/30 pb-2 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)] flex justify-between">
        <span>&gt; TARGET_PROFILE.sys</span>
        <span className="text-green-600/50">OPTICAL_RNDR</span>
      </h2>
      
      <div className="flex-grow flex items-center justify-center overflow-hidden">
        <pre className="text-green-500 font-mono text-xs md:text-sm leading-tight tracking-widest whitespace-pre drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">
          {asciiArt}
        </pre>
      </div>

      <div className="mt-auto border-t border-green-500/30 pt-2 flex justify-between text-[10px] text-green-600 font-mono uppercase tracking-widest">
        <span>Class: {classLabel}</span>
        {/* Convert km/h to approximate orbital knots for technical flavor */}
        <span>Knt: {Math.floor(velocity / 1.852)}</span>
      </div>
    </div>
  );
}