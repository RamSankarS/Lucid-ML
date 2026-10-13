export default function SliderControl({ label, value, min, max, step, field, onChange, suffix }: any) {
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