import { useState, useRef, useEffect, useCallback } from 'react';
import { planetsData, PlanetData } from './data/planets';

function lightenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `rgb(${r}, ${g}, ${b})`;
}

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, ((num >> 16) & 0xff) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `rgb(${r}, ${g}, ${b})`;
}

function formatOrbitalPeriod(days: number): string {
  if (days < 365) return `${days} días`;
  const years = (days / 365.25).toFixed(1);
  return `${years} años`;
}

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-white/5 rounded-lg p-2.5 border border-white/10">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-sm">{icon}</span>
        <span className="text-[10px] uppercase tracking-wider text-white/50">{label}</span>
      </div>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

// Generate fixed star positions
const stars = Array.from({ length: 300 }, (_, i) => ({
  x: ((i * 7919 + 42) % 100),
  y: ((i * 104729 + 42) % 100),
  size: 0.5 + ((i * 17) % 20) / 20,
  opacity: 0.2 + ((i * 31) % 80) / 100,
  twinkleDelay: (i * 0.3) % 5,
}));

function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);
  const [angles, setAngles] = useState<number[]>(() =>
    planetsData.map((_, i) => (i * Math.PI * 2) / planetsData.length)
  );
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const anglesRef = useRef<number[]>(planetsData.map((_, i) => (i * Math.PI * 2) / planetsData.length));
  const isPlayingRef = useRef(true);
  const speedRef = useRef(1);

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const animate = useCallback((timestamp: number) => {
    if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    if (isPlayingRef.current) {
      const newAngles = anglesRef.current.map((angle, i) => {
        return angle + (delta * 0.0008 * planetsData[i].speed * speedRef.current);
      });
      anglesRef.current = newAngles;
      setAngles([...newAngles]);
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  const handlePlanetClick = (planet: PlanetData) => {
    setSelectedPlanet(prev => prev?.id === planet.id ? null : planet);
  };

  return (
    <div className="w-full h-screen bg-[#000010] flex flex-col overflow-hidden select-none">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-[#0a0a2e] to-[#1a1a4e] border-b border-white/10 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌌</span>
          <h1 className="text-white font-bold text-lg md:text-xl tracking-wide">Sistema Solar Interactivo</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-xs text-white/50">Haz clic en un planeta para más información</span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 relative overflow-hidden min-h-0">
        {/* Stars background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {stars.map((star, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                animation: `twinkle ${3 + star.twinkleDelay}s ease-in-out infinite`,
                animationDelay: `${star.twinkleDelay}s`,
              }}
            />
          ))}
        </div>

        {/* Solar system centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative" style={{ width: '900px', height: '900px' }}>
            {/* Sun */}
            <div
              className="absolute rounded-full z-10"
              style={{
                width: '60px',
                height: '60px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle at 40% 40%, #fff7e0, #ffdd44 30%, #ff9900 70%, #ff6600)',
                boxShadow: '0 0 50px 20px rgba(255, 200, 50, 0.5), 0 0 100px 40px rgba(255, 150, 0, 0.25), 0 0 150px 60px rgba(255, 100, 0, 0.1)',
              }}
            >
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-yellow-300/70 font-medium whitespace-nowrap">
                Sol
              </span>
            </div>

            {/* Orbits and planets */}
            {planetsData.map((planet, index) => {
              const angle = angles[index];
              const isHovered = hoveredPlanet === planet.id;
              const isSelected = selectedPlanet?.id === planet.id;
              const orbitDiameter = planet.orbitRadius * 2;
              const planetX = Math.cos(angle) * planet.orbitRadius;
              const planetY = Math.sin(angle) * planet.orbitRadius;
              const planetDisplaySize = planet.size;

              return (
                <div key={planet.id}>
                  {/* Orbit ring */}
                  {showOrbits && (
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: `${orbitDiameter}px`,
                        height: `${orbitDiameter}px`,
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        border: `${isHovered || isSelected ? '1.5px' : '1px'} solid ${
                          isHovered || isSelected ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)'
                        }`,
                        transition: 'border-color 0.3s',
                      }}
                    />
                  )}

                  {/* Planet clickable area */}
                  <div
                    className="absolute z-20 cursor-pointer"
                    style={{
                      width: `${Math.max(planetDisplaySize + 20, 36)}px`,
                      height: `${Math.max(planetDisplaySize + 20, 36)}px`,
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${planetX}px), calc(-50% + ${planetY}px))`,
                    }}
                    onClick={() => handlePlanetClick(planet)}
                    onMouseEnter={() => setHoveredPlanet(planet.id)}
                    onMouseLeave={() => setHoveredPlanet(null)}
                  >
                    {/* Planet glow */}
                    {(isHovered || isSelected) && (
                      <div
                        className="absolute rounded-full pointer-events-none"
                        style={{
                          width: `${planetDisplaySize * 3}px`,
                          height: `${planetDisplaySize * 3}px`,
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          background: `radial-gradient(circle, ${planet.color}55 0%, transparent 70%)`,
                        }}
                      />
                    )}

                    {/* Planet body */}
                    <div
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        width: `${planetDisplaySize}px`,
                        height: `${planetDisplaySize}px`,
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -50%) scale(${isHovered || isSelected ? 1.3 : 1})`,
                        background: `radial-gradient(circle at 35% 35%, ${lightenColor(planet.color, 60)}, ${planet.color} 55%, ${darkenColor(planet.color, 60)})`,
                        boxShadow: `0 0 ${planetDisplaySize * 0.6}px ${planet.color}55, inset -2px -2px 4px rgba(0,0,0,0.3)`,
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                    />

                    {/* Saturn rings */}
                    {planet.id === 'saturn' && (
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          width: `${planetDisplaySize * 2.2}px`,
                          height: `${planetDisplaySize * 0.6}px`,
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%) rotate(-15deg)',
                          border: `2.5px solid ${planet.color}99`,
                          borderRadius: '50%',
                        }}
                      />
                    )}

                    {/* Label */}
                    {showLabels && (
                      <div
                        className="absolute text-center whitespace-nowrap pointer-events-none"
                        style={{
                          left: '50%',
                          bottom: '100%',
                          transform: 'translateX(-50%)',
                          marginBottom: '4px',
                          fontSize: '11px',
                          color: isHovered || isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                          fontWeight: isHovered || isSelected ? '600' : '400',
                          textShadow: '0 1px 3px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.5)',
                          transition: 'color 0.2s',
                        }}
                      >
                        {planet.nameEs}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Panel */}
        {selectedPlanet && (
          <div className="absolute top-4 right-4 w-[320px] bg-[#0a0a2e]/95 backdrop-blur-md border border-white/20 rounded-xl p-5 text-white shadow-2xl z-30 animate-fade-in">
            <button
              onClick={() => setSelectedPlanet(null)}
              className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white text-sm"
            >
              ✕
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-14 h-14 rounded-full shadow-lg shrink-0"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${lightenColor(selectedPlanet.color, 60)}, ${selectedPlanet.color}, ${darkenColor(selectedPlanet.color, 60)})`,
                  boxShadow: `0 0 20px ${selectedPlanet.color}44`,
                }}
              />
              <div>
                <h2 className="text-xl font-bold">{selectedPlanet.nameEs}</h2>
                <p className="text-sm text-white/50">{selectedPlanet.type}</p>
              </div>
            </div>
            <p className="text-sm text-white/75 mb-4 leading-relaxed">{selectedPlanet.description}</p>
            <div className="grid grid-cols-2 gap-2.5">
              <InfoCard icon="📏" label="Diámetro" value={`${selectedPlanet.realDiameter.toLocaleString()} km`} />
              <InfoCard icon="☀️" label="Dist. al Sol" value={`${selectedPlanet.distanceFromSun} M km`} />
              <InfoCard icon="🔄" label="Período orbital" value={formatOrbitalPeriod(selectedPlanet.orbitalPeriod)} />
              <InfoCard icon="🌙" label="Lunas" value={`${selectedPlanet.moons}`} />
            </div>
          </div>
        )}

        {/* Planet quick-select */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-20">
          {planetsData.map(planet => (
            <button
              key={planet.id}
              onClick={() => handlePlanetClick(planet)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all text-left ${
                selectedPlanet?.id === planet.id
                  ? 'bg-white/15 ring-1 ring-white/20'
                  : 'bg-black/30 hover:bg-white/10'
              }`}
              title={planet.nameEs}
            >
              <div
                className="rounded-full shrink-0"
                style={{
                  width: `${Math.max(10, planet.size * 0.5)}px`,
                  height: `${Math.max(10, planet.size * 0.5)}px`,
                  background: `radial-gradient(circle at 35% 35%, ${lightenColor(planet.color, 40)}, ${planet.color})`,
                  boxShadow: `0 0 4px ${planet.color}66`,
                }}
              />
              <span className={`text-xs ${selectedPlanet?.id === planet.id ? 'text-white font-medium' : 'text-white/60'}`}>
                {planet.nameEs}
              </span>
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[#0a0a2e]/90 backdrop-blur-md border border-white/15 rounded-full px-5 py-3 z-30 shadow-xl">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-lg"
            title={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? '⏸' : '▶️'}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-white/50 text-xs hidden sm:inline">Velocidad:</span>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-20 sm:w-28"
            />
            <span className="text-white text-xs font-mono w-10">{speed.toFixed(1)}x</span>
          </div>

          <div className="w-px h-6 bg-white/20" />

          <button
            onClick={() => setShowOrbits(!showOrbits)}
            className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
              showOrbits ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' : 'bg-white/5 text-white/50 border border-white/10'
            }`}
            title="Mostrar/ocultar órbitas"
          >
            Órbitas
          </button>

          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
              showLabels ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' : 'bg-white/5 text-white/50 border border-white/10'
            }`}
            title="Mostrar/ocultar nombres"
          >
            Nombres
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
