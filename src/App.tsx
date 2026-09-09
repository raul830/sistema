import { useState, useRef, useEffect, useCallback } from 'react';
import { planetsData, PlanetData } from './data/planets';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const timeRef = useRef(0);
  const lastTimeRef = useRef(0);
  const [showLabels, setShowLabels] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);

  const getPlanetPosition = useCallback((planet: PlanetData, time: number) => {
    const angle = (time * planet.speed * 0.001);
    const centerX = 0;
    const centerY = 0;
    const x = centerX + Math.cos(angle) * planet.orbitRadius;
    const y = centerY + Math.sin(angle) * planet.orbitRadius;
    return { x, y };
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) / 820;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background - space
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width / 2);
    gradient.addColorStop(0, '#0a0a2e');
    gradient.addColorStop(0.5, '#050520');
    gradient.addColorStop(1, '#000010');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Stars
    const starSeed = 42;
    for (let i = 0; i < 200; i++) {
      const sx = ((starSeed * (i + 1) * 7919) % width);
      const sy = ((starSeed * (i + 1) * 104729) % height);
      const brightness = 0.3 + ((i * 31) % 70) / 100;
      const size = 0.5 + ((i * 17) % 20) / 20;
      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      ctx.fill();
    }

    // Draw orbits
    if (showOrbits) {
      planetsData.forEach(planet => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, planet.orbitRadius * scale, 0, Math.PI * 2);
        ctx.strokeStyle = hoveredPlanet === planet.id 
          ? 'rgba(255, 255, 255, 0.3)' 
          : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = hoveredPlanet === planet.id ? 1.5 : 0.5;
        ctx.stroke();
      });
    }

    // Draw Sun
    const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30 * scale);
    sunGradient.addColorStop(0, '#fff7e0');
    sunGradient.addColorStop(0.3, '#ffdd44');
    sunGradient.addColorStop(0.7, '#ff9900');
    sunGradient.addColorStop(1, '#ff660044');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30 * scale, 0, Math.PI * 2);
    ctx.fillStyle = sunGradient;
    ctx.fill();

    // Sun glow
    const glowGradient = ctx.createRadialGradient(centerX, centerY, 20 * scale, centerX, centerY, 60 * scale);
    glowGradient.addColorStop(0, 'rgba(255, 200, 50, 0.3)');
    glowGradient.addColorStop(1, 'rgba(255, 200, 50, 0)');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60 * scale, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();

    // Draw planets
    planetsData.forEach(planet => {
      const pos = getPlanetPosition(planet, timeRef.current);
      const px = centerX + pos.x * scale;
      const py = centerY + pos.y * scale;
      const planetSize = planet.size * scale * 0.5;
      const isHovered = hoveredPlanet === planet.id;
      const isSelected = selectedPlanet?.id === planet.id;

      // Planet glow when hovered/selected
      if (isHovered || isSelected) {
        const glowSize = planetSize * 3;
        const pGlow = ctx.createRadialGradient(px, py, planetSize, px, py, glowSize);
        pGlow.addColorStop(0, planet.color + '66');
        pGlow.addColorStop(1, planet.color + '00');
        ctx.beginPath();
        ctx.arc(px, py, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = pGlow;
        ctx.fill();
      }

      // Planet body
      const pGradient = ctx.createRadialGradient(
        px - planetSize * 0.3, py - planetSize * 0.3, 0,
        px, py, planetSize
      );
      pGradient.addColorStop(0, lightenColor(planet.color, 40));
      pGradient.addColorStop(0.7, planet.color);
      pGradient.addColorStop(1, darkenColor(planet.color, 40));
      
      ctx.beginPath();
      ctx.arc(px, py, planetSize * (isHovered || isSelected ? 1.2 : 1), 0, Math.PI * 2);
      ctx.fillStyle = pGradient;
      ctx.fill();

      // Saturn rings
      if (planet.id === 'saturn') {
        ctx.beginPath();
        ctx.ellipse(px, py, planetSize * 2, planetSize * 0.5, 0.3, 0, Math.PI * 2);
        ctx.strokeStyle = '#f4d59c88';
        ctx.lineWidth = 2 * scale;
        ctx.stroke();
      }

      // Labels
      if (showLabels) {
        ctx.font = `${11 * scale}px sans-serif`;
        ctx.fillStyle = isHovered || isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'center';
        ctx.fillText(planet.nameEs, px, py - planetSize - 6 * scale);
      }
    });
  }, [getPlanetPosition, hoveredPlanet, selectedPlanet, showLabels, showOrbits]);

  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (isPlaying) {
      if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      timeRef.current += delta * speed;
      lastTimeRef.current = timestamp;
    } else {
      lastTimeRef.current = timestamp;
    }

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    draw(ctx, rect.width, rect.height);
    animationRef.current = requestAnimationFrame(animate);
  }, [draw, isPlaying, speed]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const scale = Math.min(rect.width, rect.height) / 820;

    let clicked: PlanetData | null = null;
    for (const planet of planetsData) {
      const pos = getPlanetPosition(planet, timeRef.current);
      const px = centerX + pos.x * scale;
      const py = centerY + pos.y * scale;
      const planetSize = planet.size * scale * 0.5;
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist <= planetSize * 1.5 + 10) {
        clicked = planet;
        break;
      }
    }
    setSelectedPlanet(clicked);
  };

  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const scale = Math.min(rect.width, rect.height) / 820;

    let found: string | null = null;
    for (const planet of planetsData) {
      const pos = getPlanetPosition(planet, timeRef.current);
      const px = centerX + pos.x * scale;
      const py = centerY + pos.y * scale;
      const planetSize = planet.size * scale * 0.5;
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist <= planetSize * 1.5 + 10) {
        found = planet.id;
        break;
      }
    }
    setHoveredPlanet(found);
    canvas.style.cursor = found ? 'pointer' : 'default';
  };

  return (
    <div className="w-full h-screen bg-[#000010] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#0a0a2e] to-[#1a1a4e] border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌌</span>
          <h1 className="text-white font-bold text-lg md:text-xl">Sistema Solar Interactivo</h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/60">
          <span className="hidden md:inline">Haz clic en un planeta para más información</span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Canvas */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMove}
          />
        </div>

        {/* Info Panel */}
        {selectedPlanet && (
          <div className="absolute top-4 right-4 w-80 bg-[#0a0a2e]/95 backdrop-blur-md border border-white/20 rounded-xl p-5 text-white shadow-2xl z-20 animate-fade-in">
            <button 
              onClick={() => setSelectedPlanet(null)}
              className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
            >
              ✕
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-12 h-12 rounded-full shadow-lg"
                style={{ 
                  background: `radial-gradient(circle at 30% 30%, ${lightenColor(selectedPlanet.color, 40)}, ${selectedPlanet.color}, ${darkenColor(selectedPlanet.color, 40)})`
                }}
              />
              <div>
                <h2 className="text-xl font-bold">{selectedPlanet.nameEs}</h2>
                <p className="text-sm text-white/60">{selectedPlanet.type}</p>
              </div>
            </div>
            <p className="text-sm text-white/80 mb-4 leading-relaxed">{selectedPlanet.description}</p>
            <div className="grid grid-cols-2 gap-3">
              <InfoCard icon="📏" label="Diámetro" value={`${selectedPlanet.realDiameter.toLocaleString()} km`} />
              <InfoCard icon="☀️" label="Dist. al Sol" value={`${selectedPlanet.distanceFromSun} M km`} />
              <InfoCard icon="🔄" label="Período orbital" value={formatOrbitalPeriod(selectedPlanet.orbitalPeriod)} />
              <InfoCard icon="🌙" label="Lunas" value={`${selectedPlanet.moons}`} />
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[#0a0a2e]/90 backdrop-blur-md border border-white/15 rounded-full px-5 py-3 z-20">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            title={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-xs">Velocidad:</span>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-24 accent-blue-400"
            />
            <span className="text-white text-xs font-mono w-10">{speed.toFixed(1)}x</span>
          </div>

          <div className="w-px h-6 bg-white/20" />

          <button
            onClick={() => setShowOrbits(!showOrbits)}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${showOrbits ? 'bg-blue-500/30 text-blue-300' : 'bg-white/10 text-white/60'}`}
          >
            Órbitas
          </button>
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${showLabels ? 'bg-blue-500/30 text-blue-300' : 'bg-white/10 text-white/60'}`}
          >
            Nombres
          </button>
        </div>

        {/* Planet list sidebar - mobile */}
        <div className="md:hidden absolute top-4 left-4 flex flex-col gap-1 z-10">
          {planetsData.map(planet => (
            <button
              key={planet.id}
              onClick={() => setSelectedPlanet(planet)}
              className={`flex items-center gap-2 px-2 py-1 rounded-lg text-xs transition-all ${
                selectedPlanet?.id === planet.id 
                  ? 'bg-white/20 text-white' 
                  : 'bg-black/40 text-white/70 hover:bg-white/10'
              }`}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: planet.color }} />
              {planet.nameEs}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-white/5 rounded-lg p-2.5">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-sm">{icon}</span>
        <span className="text-[10px] text-white/50 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function formatOrbitalPeriod(days: number): string {
  if (days < 365) return `${days} días`;
  const years = (days / 365.25).toFixed(1);
  return `${years} años`;
}

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + percent);
  const g = Math.min(255, ((num >> 8) & 0x00FF) + percent);
  const b = Math.min(255, (num & 0x0000FF) + percent);
  return `rgb(${r}, ${g}, ${b})`;
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - percent);
  const g = Math.max(0, ((num >> 8) & 0x00FF) - percent);
  const b = Math.max(0, (num & 0x0000FF) - percent);
  return `rgb(${r}, ${g}, ${b})`;
}

export default App;
