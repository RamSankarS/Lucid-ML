export default function SpaceBackground() {
  return (
    <>
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
      
      {/* 90s vibe CRT Overlay */}
      <div className="absolute inset-0 z-50 pointer-events-none opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }}></div>
      <div className="absolute inset-0 z-40 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.7)]"></div>
    </>
  );
}