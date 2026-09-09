import { useState, useMemo } from 'react';
import { anatomyData, AnatomyStructure, categoryLabels } from './data/anatomy';

type ViewType = 'anterior' | 'posterior' | 'lateral';
type CategoryType = 'bones' | 'muscles' | 'tendons' | 'ligaments' | 'bursae' | 'other';

function App() {
  const [selectedStructure, setSelectedStructure] = useState<AnatomyStructure | null>(null);
  const [hoveredStructure, setHoveredStructure] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('anterior');
  const [visibleLayers, setVisibleLayers] = useState<Set<CategoryType>>(
    new Set(['bones', 'muscles', 'tendons', 'ligaments', 'bursae', 'other'])
  );
  const [showLabels, setShowLabels] = useState(true);

  const toggleLayer = (category: CategoryType) => {
    setVisibleLayers(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const filteredStructures = useMemo(() => {
    return anatomyData.filter(s => visibleLayers.has(s.category));
  }, [visibleLayers]);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'bones': return '🦴';
      case 'muscles': return '💪';
      case 'tendons': return '🔗';
      case 'ligaments': return '🩹';
      case 'bursae': return '💧';
      case 'other': return '🔬';
      default: return '📋';
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-slate-900/80 backdrop-blur-md border-b border-white/10 z-30">
        <div className="flex items-center gap-3">
          <span className="text-2xl md:text-3xl">🦴</span>
          <div>
            <h1 className="text-white font-bold text-base md:text-xl tracking-tight">Anatomía del Hombro</h1>
            <p className="text-white/40 text-[10px] md:text-xs hidden sm:block">Vista anatómica interactiva completa</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View selector */}
          <div className="flex bg-white/5 rounded-lg border border-white/10 overflow-hidden">
            <button
              onClick={() => setActiveView('anterior')}
              className={`px-3 py-1.5 text-xs font-medium transition-all ${
                activeView === 'anterior' ? 'bg-blue-500/30 text-blue-300 border-r border-white/10' : 'text-white/60 hover:text-white border-r border-white/10'
              }`}
            >
              Anterior
            </button>
            <button
              onClick={() => setActiveView('posterior')}
              className={`px-3 py-1.5 text-xs font-medium transition-all ${
                activeView === 'posterior' ? 'bg-blue-500/30 text-blue-300 border-r border-white/10' : 'text-white/60 hover:text-white border-r border-white/10'
              }`}
            >
              Posterior
            </button>
            <button
              onClick={() => setActiveView('lateral')}
              className={`px-3 py-1.5 text-xs font-medium transition-all ${
                activeView === 'lateral' ? 'bg-blue-500/30 text-blue-300' : 'text-white/60 hover:text-white'
              }`}
            >
              Lateral
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left sidebar - Layer controls */}
        <aside className="w-full lg:w-56 xl:w-64 bg-slate-900/60 backdrop-blur-sm border-b lg:border-b-0 lg:border-r border-white/10 p-3 overflow-y-auto z-20">
          <h3 className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
            <span>📋</span> Capas Anatómicas
          </h3>
          <div className="space-y-1.5">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => toggleLayer(key as CategoryType)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  visibleLayers.has(key as CategoryType)
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'bg-white/[0.02] text-white/40 border border-white/5 hover:bg-white/5'
                }`}
              >
                <span>{getCategoryIcon(key)}</span>
                <span className="flex-1 text-left">{label}</span>
                <div className={`w-3 h-3 rounded-full border-2 transition-all ${
                  visibleLayers.has(key as CategoryType) ? 'border-blue-400 bg-blue-400' : 'border-white/30'
                }`} />
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                showLabels
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'bg-white/[0.02] text-white/40 border border-white/5 hover:bg-white/5'
              }`}
            >
              <span>🏷️</span>
              <span>Etiquetas</span>
              <div className={`w-3 h-3 rounded-full border-2 transition-all ml-auto ${
                showLabels ? 'border-blue-400 bg-blue-400' : 'border-white/30'
              }`} />
            </button>
          </div>

          {/* Structure list */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <h3 className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>📑</span> Estructuras
            </h3>
            <div className="space-y-0.5 max-h-[300px] overflow-y-auto pr-1">
              {filteredStructures.map(structure => (
                <button
                  key={structure.id}
                  onClick={() => setSelectedStructure(structure)}
                  onMouseEnter={() => setHoveredStructure(structure.id)}
                  onMouseLeave={() => setHoveredStructure(null)}
                  className={`w-full text-left px-2 py-1.5 rounded text-[11px] transition-all ${
                    selectedStructure?.id === structure.id
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : hoveredStructure === structure.id
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: structure.color }} />
                  {structure.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main anatomy view */}
        <main className="flex-1 relative flex items-center justify-center overflow-hidden p-4">
          <div className="relative w-full h-full max-w-[700px] max-h-[700px] flex items-center justify-center">
            <AnatomySVG
              view={activeView}
              selectedId={selectedStructure?.id || null}
              hoveredId={hoveredStructure}
              visibleLayers={visibleLayers}
              showLabels={showLabels}
              onSelect={setSelectedStructure}
              onHover={setHoveredStructure}
            />
          </div>

          {/* Quick info tooltip on hover */}
          {hoveredStructure && !selectedStructure && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800/95 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 text-white text-sm z-30 shadow-xl">
              {anatomyData.find(s => s.id === hoveredStructure)?.name}
              <span className="text-white/50 ml-2 text-xs">
                — {categoryLabels[anatomyData.find(s => s.id === hoveredStructure)?.category || '']}
              </span>
            </div>
          )}
        </main>

        {/* Right panel - Detail info */}
        {selectedStructure && (
          <aside className="w-full lg:w-80 xl:w-96 bg-slate-900/80 backdrop-blur-md border-t lg:border-t-0 lg:border-l border-white/10 p-4 overflow-y-auto z-20 animate-slide-in">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full shadow-lg border-2 border-white/20"
                  style={{ backgroundColor: selectedStructure.color }}
                />
                <div>
                  <h2 className="text-white font-bold text-lg">{selectedStructure.name}</h2>
                  <span className="text-xs text-white/50 flex items-center gap-1">
                    {getCategoryIcon(selectedStructure.category)} {categoryLabels[selectedStructure.category]}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedStructure(null)}
                className="text-white/40 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <InfoSection title="Descripción" icon="📝">
                <p className="text-white/80 text-sm leading-relaxed">{selectedStructure.description}</p>
              </InfoSection>

              <InfoSection title="Función" icon="⚡">
                <p className="text-white/80 text-sm leading-relaxed">{selectedStructure.function}</p>
              </InfoSection>

              {selectedStructure.origin && (
                <InfoSection title="Origen" icon="📍">
                  <p className="text-white/80 text-sm">{selectedStructure.origin}</p>
                </InfoSection>
              )}

              {selectedStructure.insertion && (
                <InfoSection title="Inserción" icon="📌">
                  <p className="text-white/80 text-sm">{selectedStructure.insertion}</p>
                </InfoSection>
              )}

              {selectedStructure.innervation && (
                <InfoSection title="Inervación" icon="🧠">
                  <p className="text-white/80 text-sm">{selectedStructure.innervation}</p>
                </InfoSection>
              )}

              {selectedStructure.bloodSupply && (
                <InfoSection title="Irrigación" icon="🩸">
                  <p className="text-white/80 text-sm">{selectedStructure.bloodSupply}</p>
                </InfoSection>
              )}

              {selectedStructure.clinicalRelevance && (
                <InfoSection title="Relevancia Clínica" icon="⚕️">
                  <p className="text-amber-200/90 text-sm leading-relaxed">{selectedStructure.clinicalRelevance}</p>
                </InfoSection>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function InfoSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
      <h4 className="text-white/90 text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
        <span>{icon}</span> {title}
      </h4>
      {children}
    </div>
  );
}

interface AnatomySVGProps {
  view: ViewType;
  selectedId: string | null;
  hoveredId: string | null;
  visibleLayers: Set<CategoryType>;
  showLabels: boolean;
  onSelect: (structure: AnatomyStructure) => void;
  onHover: (id: string | null) => void;
}

function AnatomySVG({ view, selectedId, hoveredId, visibleLayers, showLabels, onSelect, onHover }: AnatomySVGProps) {
  const isVisible = (id: string) => {
    const structure = anatomyData.find(s => s.id === id);
    return structure ? visibleLayers.has(structure.category) : false;
  };

  const getOpacity = (id: string) => {
    if (!isVisible(id)) return 0;
    if (selectedId && selectedId !== id) return 0.4;
    if (hoveredId && hoveredId !== id && hoveredId !== selectedId) return 0.6;
    return 1;
  };

  const getStrokeWidth = (id: string) => {
    if (id === selectedId) return 3;
    if (id === hoveredId) return 2;
    return 1;
  };

  const handleClick = (id: string) => {
    const structure = anatomyData.find(s => s.id === id);
    if (structure) onSelect(structure);
  };

  if (view === 'anterior') return <AnteriorView {...{ isVisible, getOpacity, getStrokeWidth, showLabels, handleClick, onHover, selectedId, hoveredId }} />;
  if (view === 'posterior') return <PosteriorView {...{ isVisible, getOpacity, getStrokeWidth, showLabels, handleClick, onHover, selectedId, hoveredId }} />;
  return <LateralView {...{ isVisible, getOpacity, getStrokeWidth, showLabels, handleClick, onHover, selectedId, hoveredId }} />;
}

interface SVGViewProps {
  isVisible: (id: string) => boolean;
  getOpacity: (id: string) => number;
  getStrokeWidth: (id: string) => number;
  showLabels: boolean;
  handleClick: (id: string) => void;
  onHover: (id: string | null) => void;
  selectedId: string | null;
  hoveredId: string | null;
}

function AnteriorView({ isVisible, getOpacity, getStrokeWidth, showLabels, handleClick, onHover, selectedId, hoveredId }: SVGViewProps) {
  return (
    <svg viewBox="0 0 500 600" className="w-full h-full" style={{ maxHeight: '100%' }}>
      <defs>
        <radialGradient id="skinGradient" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f5d5c0" />
          <stop offset="100%" stopColor="#d4a88c" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Body silhouette */}
      <path
        d="M 180 50 Q 200 30 250 30 Q 300 30 320 50 L 340 80 Q 360 100 370 140 L 380 200 Q 385 250 380 300 L 370 400 Q 365 450 360 500 L 350 560 L 340 600 L 160 600 L 150 560 Q 145 500 140 450 L 135 400 Q 130 350 130 300 L 130 250 Q 130 200 140 160 L 155 100 Q 165 70 180 50"
        fill="url(#skinGradient)"
        opacity="0.15"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />

      {/* TORSO outline */}
      <path
        d="M 200 80 Q 230 60 260 65 Q 290 60 310 80 L 330 120 Q 340 160 340 200 L 340 350 Q 340 400 330 450 L 320 520 L 180 520 L 170 450 Q 160 400 160 350 L 160 200 Q 160 160 170 120 Z"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />

      {/* ARM outline */}
      <path
        d="M 310 100 Q 340 110 360 140 Q 380 180 390 230 L 400 320 Q 405 380 400 440 L 395 500 L 390 560 L 370 560 L 365 500 Q 360 440 358 380 L 355 320 Q 350 260 340 210 Q 330 170 310 140 Z"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
      />

      {/* CLAVICLE */}
      {isVisible('clavicle') && (
        <g
          onClick={() => handleClick('clavicle')}
          onMouseEnter={() => onHover('clavicle')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('clavicle')}
        >
          <path
            d="M 175 110 Q 220 95 270 100 Q 320 105 350 115"
            fill="none"
            stroke={selectedId === 'clavicle' ? '#fff' : '#f0dcc8'}
            strokeWidth={getStrokeWidth('clavicle') + 6}
            strokeLinecap="round"
          />
          <path
            d="M 175 110 Q 220 95 270 100 Q 320 105 350 115"
            fill="none"
            stroke={selectedId === 'clavicle' ? '#fff' : '#f0dcc8'}
            strokeWidth={getStrokeWidth('clavicle')}
            strokeLinecap="round"
            filter={selectedId === 'clavicle' ? 'url(#glow)' : undefined}
          />
        </g>
      )}

      {/* SCAPULA (anterior view - limited visibility) */}
      {isVisible('scapula') && (
        <g
          onClick={() => handleClick('scapula')}
          onMouseEnter={() => onHover('scapula')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('scapula')}
        >
          <path
            d="M 190 130 L 220 120 L 240 140 L 250 200 L 240 280 L 220 300 L 200 280 L 190 200 Z"
            fill={selectedId === 'scapula' ? '#f5e6d3' : '#e8d5c0'}
            stroke={selectedId === 'scapula' ? '#fff' : 'rgba(255,255,255,0.3)'}
            strokeWidth={getStrokeWidth('scapula')}
            opacity="0.6"
            filter={selectedId === 'scapula' ? 'url(#glow)' : undefined}
          />
        </g>
      )}

      {/* CORACOID PROCESS */}
      {isVisible('coracoid') && (
        <g
          onClick={() => handleClick('coracoid')}
          onMouseEnter={() => onHover('coracoid')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('coracoid')}
        >
          <path
            d="M 270 120 L 285 115 Q 295 118 290 128 L 275 135 Z"
            fill={selectedId === 'coracoid' ? '#f5e6d3' : '#e8d5c0'}
            stroke={selectedId === 'coracoid' ? '#fff' : 'rgba(255,255,255,0.4)'}
            strokeWidth={getStrokeWidth('coracoid')}
            filter={selectedId === 'coracoid' ? 'url(#glow)' : undefined}
          />
        </g>
      )}

      {/* ACROMION */}
      {isVisible('acromion') && (
        <g
          onClick={() => handleClick('acromion')}
          onMouseEnter={() => onHover('acromion')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('acromion')}
        >
          <path
            d="M 290 108 Q 320 100 340 108 Q 350 115 345 122 Q 330 128 310 125 Q 295 120 290 108"
            fill={selectedId === 'acromion' ? '#f5e6d3' : '#eddcc8'}
            stroke={selectedId === 'acromion' ? '#fff' : 'rgba(255,255,255,0.4)'}
            strokeWidth={getStrokeWidth('acromion')}
            filter={selectedId === 'acromion' ? 'url(#glow)' : undefined}
          />
        </g>
      )}

      {/* GLENOID CAVITY */}
      {isVisible('glenoid') && (
        <g
          onClick={() => handleClick('glenoid')}
          onMouseEnter={() => onHover('glenoid')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('glenoid')}
        >
          <ellipse
            cx="310" cy="150"
            rx="18" ry="25"
            fill={selectedId === 'glenoid' ? '#f5e6d3' : '#f0dcc8'}
            stroke={selectedId === 'glenoid' ? '#fff' : 'rgba(255,255,255,0.3)'}
            strokeWidth={getStrokeWidth('glenoid')}
            filter={selectedId === 'glenoid' ? 'url(#glow)' : undefined}
          />
        </g>
      )}

      {/* HUMERUS */}
      {isVisible('humerus') && (
        <g
          onClick={() => handleClick('humerus')}
          onMouseEnter={() => onHover('humerus')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('humerus')}
        >
          {/* Head of humerus */}
          <circle
            cx="320" cy="148"
            r="22"
            fill={selectedId === 'humerus' ? '#fff5e6' : '#f5e6d3'}
            stroke={selectedId === 'humerus' ? '#fff' : 'rgba(255,255,255,0.3)'}
            strokeWidth={getStrokeWidth('humerus')}
            filter={selectedId === 'humerus' ? 'url(#glow)' : undefined}
          />
          {/* Shaft */}
          <path
            d="M 310 168 Q 315 200 320 260 Q 325 320 330 380 Q 333 420 335 460"
            fill="none"
            stroke={selectedId === 'humerus' ? '#fff5e6' : '#f5e6d3'}
            strokeWidth={getStrokeWidth('humerus') + 14}
            strokeLinecap="round"
          />
          <path
            d="M 310 168 Q 315 200 320 260 Q 325 320 330 380 Q 333 420 335 460"
            fill="none"
            stroke={selectedId === 'humerus' ? '#fff' : 'rgba(255,255,255,0.2)'}
            strokeWidth={getStrokeWidth('humerus')}
            strokeLinecap="round"
          />
          {/* Greater tuberosity */}
          <ellipse
            cx="340" cy="155"
            rx="8" ry="12"
            fill={selectedId === 'humerus' ? '#fff5e6' : '#f5e6d3'}
            stroke={selectedId === 'humerus' ? '#fff' : 'rgba(255,255,255,0.2)'}
            strokeWidth={getStrokeWidth('humerus')}
          />
        </g>
      )}

      {/* SUBSCAPULARIS */}
      {isVisible('subscapularis') && (
        <g
          onClick={() => handleClick('subscapularis')}
          onMouseEnter={() => onHover('subscapularis')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('subscapularis')}
        >
          <path
            d="M 210 160 Q 240 155 270 155 Q 290 158 305 165 Q 310 170 305 175 Q 280 178 250 175 Q 225 172 210 168 Z"
            fill={selectedId === 'subscapularis' ? '#ff4444' : '#9e2828'}
            stroke={selectedId === 'subscapularis' ? '#fff' : 'rgba(255,255,255,0.2)'}
            strokeWidth={getStrokeWidth('subscapularis')}
            filter={selectedId === 'subscapularis' ? 'url(#glow)' : undefined}
          />
        </g>
      )}

      {/* SUPRASPINATUS */}
      {isVisible('supraspinatus') && (
        <g
          onClick={() => handleClick('supraspinatus')}
          onMouseEnter={() => onHover('supraspinatus')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('supraspinatus')}
        >
          <path
            d="M 230 115 Q 260 108 290 110 Q 310 112 330 118 Q 340 125 335 132 Q 315 135 290 130 Q 260 125 235 125 Z"
            fill={selectedId === 'supraspinatus' ? '#ff5555' : '#c94040'}
            stroke={selectedId === 'supraspinatus' ? '#fff' : 'rgba(255,255,255,0.2)'}
            strokeWidth={getStrokeWidth('supraspinatus')}
            filter={selectedId === 'supraspinatus' ? 'url(#glow)' : undefined}
          />
        </g>
      )}

      {/* DELTOID */}
      {isVisible('deltoid') && (
        <g
          onClick={() => handleClick('deltoid')}
          onMouseEnter={() => onHover('deltoid')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('deltoid')}
        >
          <path
            d="M 290 105 Q 330 95 355 110 Q 375 130 385 170 Q 390 210 385 250 Q 375 260 360 255 Q 345 240 340 210 Q 335 180 330 160 Q 325 145 315 135 Q 305 125 290 120 Z"
            fill={selectedId === 'deltoid' ? '#ff6655' : '#d4544a'}
            stroke={selectedId === 'deltoid' ? '#fff' : 'rgba(255,255,255,0.15)'}
            strokeWidth={getStrokeWidth('deltoid')}
            opacity="0.7"
            filter={selectedId === 'deltoid' ? 'url(#glow)' : undefined}
          />
        </g>
      )}

      {/* PECTORALIS MAJOR */}
      {isVisible('pectoralis') && (
        <g
          onClick={() => handleClick('pectoralis')}
          onMouseEnter={() => onHover('pectoralis')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('pectoralis')}
        >
          <path
            d="M 195 130 Q 230 125 260 130 Q 290 140 310 160 Q 320 175 315 190 Q 300 200 280 195 Q 250 185 225 170 Q 205 155 195 140 Z"
            fill={selectedId === 'pectoralis' ? '#ff5555' : '#cc4545'}
            stroke={selectedId === 'pectoralis' ? '#fff' : 'rgba(255,255,255,0.15)'}
            strokeWidth={getStrokeWidth('pectoralis')}
            opacity="0.65"
            filter={selectedId === 'pectoralis' ? 'url(#glow)' : undefined}
          />
        </g>
      )}

      {/* BICEPS */}
      {isVisible('biceps') && (
        <g
          onClick={() => handleClick('biceps')}
          onMouseEnter={() => onHover('biceps')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('biceps')}
        >
          <path
            d="M 310 170 Q 325 175 335 195 Q 345 230 348 270 Q 350 310 348 350 Q 345 370 335 365 Q 325 350 322 310 Q 320 270 318 230 Q 315 200 310 180 Z"
            fill={selectedId === 'biceps' ? '#ff6666' : '#d45555'}
            stroke={selectedId === 'biceps' ? '#fff' : 'rgba(255,255,255,0.15)'}
            strokeWidth={getStrokeWidth('biceps')}
            opacity="0.7"
            filter={selectedId === 'biceps' ? 'url(#glow)' : undefined}
          />
        </g>
      )}

      {/* BICEPS TENDON (long head) */}
      {isVisible('biceps_tendon') && (
        <g
          onClick={() => handleClick('biceps_tendon')}
          onMouseEnter={() => onHover('biceps_tendon')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('biceps_tendon')}
        >
          <path
            d="M 310 135 Q 312 145 314 160 Q 316 170 315 180"
            fill="none"
            stroke={selectedId === 'biceps_tendon' ? '#fff' : '#f0f0f0'}
            strokeWidth={getStrokeWidth('biceps_tendon') + 3}
            strokeLinecap="round"
            filter={selectedId === 'biceps_tendon' ? 'url(#glow)' : undefined}
          />
        </g>
      )}

      {/* ROTATOR CUFF (tendon group representation) */}
      {isVisible('rotator_cuff') && (
        <g
          onClick={() => handleClick('rotator_cuff')}
          onMouseEnter={() => onHover('rotator_cuff')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('rotator_cuff')}
        >
          <path
            d="M 300 135 Q 315 130 330 138 Q 340 145 338 155 Q 330 162 315 160 Q 305 155 300 145 Z"
            fill={selectedId === 'rotator_cuff' ? '#fff' : '#e8e8e8'}
            stroke={selectedId === 'rotator_cuff' ? '#fff' : 'rgba(255,255,255,0.4)'}
            strokeWidth={getStrokeWidth('rotator_cuff')}
            opacity="0.8"
            filter={selectedId === 'rotator_cuff' ? 'url(#glow)' : undefined}
          />
        </g>
      )}

      {/* LABRUM */}
      {isVisible('labrum') && (
        <g
          onClick={() => handleClick('labrum')}
          onMouseEnter={() => onHover('labrum')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('labrum')}
        >
          <ellipse
            cx="310" cy="150"
            rx="22" ry="29"
            fill="none"
            stroke={selectedId === 'labrum' ? '#aaccff' : '#88aacc'}
            strokeWidth={getStrokeWidth('labrum') + 2}
            strokeDasharray="4 2"
            filter={selectedId === 'labrum' ? 'url(#glow)' : undefined}
          />
        </g>
      )}

      {/* SUBACROMIAL BURSA */}
      {isVisible('subacromial_bursa') && (
        <g
          onClick={() => handleClick('subacromial_bursa')}
          onMouseEnter={() => onHover('subacromial_bursa')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('subacromial_bursa')}
        >
          <ellipse
            cx="330" cy="128"
            rx="15" ry="6"
            fill={selectedId === 'subacromial_bursa' ? '#ffee66' : '#ffdd44'}
            stroke={selectedId === 'subacromial_bursa' ? '#fff' : 'rgba(255,255,255,0.3)'}
            strokeWidth={getStrokeWidth('subacromial_bursa')}
            opacity="0.7"
            filter={selectedId === 'subacromial_bursa' ? 'url(#glow)' : undefined}
          />
        </g>
      )}

      {/* CORACOACROMIAL LIGAMENT */}
      {isVisible('coracoacromial_ligament') && (
        <g
          onClick={() => handleClick('coracoacromial_ligament')}
          onMouseEnter={() => onHover('coracoacromial_ligament')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('coracoacromial_ligament')}
        >
          <path
            d="M 285 118 Q 305 108 330 112"
            fill="none"
            stroke={selectedId === 'coracoacromial_ligament' ? '#99dd99' : '#77bb77'}
            strokeWidth={getStrokeWidth('coracoacromial_ligament') + 2}
            strokeLinecap="round"
            filter={selectedId === 'coracoacromial_ligament' ? 'url(#glow)' : undefined}
          />
        </g>
      )}

      {/* CORACOCLAVICULAR LIGAMENT */}
      {isVisible('coracoclavicular_ligament') && (
        <g
          onClick={() => handleClick('coracoclavicular_ligament')}
          onMouseEnter={() => onHover('coracoclavicular_ligament')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('coracoclavicular_ligament')}
        >
          <path
            d="M 280 118 Q 275 108 270 100"
            fill="none"
            stroke={selectedId === 'coracoclavicular_ligament' ? '#88cc88' : '#66aa66'}
            strokeWidth={getStrokeWidth('coracoclavicular_ligament') + 2}
            strokeLinecap="round"
            filter={selectedId === 'coracoclavicular_ligament' ? 'url(#glow)' : undefined}
          />
        </g>
      )}

      {/* GLENOHUMERAL LIGAMENTS */}
      {isVisible('glenohumeral_ligaments') && (
        <g
          onClick={() => handleClick('glenohumeral_ligaments')}
          onMouseEnter={() => onHover('glenohumeral_ligaments')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('glenohumeral_ligaments')}
        >
          <path
            d="M 295 140 Q 300 155 305 170"
            fill="none"
            stroke={selectedId === 'glenohumeral_ligaments' ? '#77cc77' : '#55aa55'}
            strokeWidth={getStrokeWidth('glenohumeral_ligaments') + 2}
            strokeLinecap="round"
            filter={selectedId === 'glenohumeral_ligaments' ? 'url(#glow)' : undefined}
          />
          <path
            d="M 298 145 Q 308 158 312 172"
            fill="none"
            stroke={selectedId === 'glenohumeral_ligaments' ? '#77cc77' : '#55aa55'}
            strokeWidth={getStrokeWidth('glenohumeral_ligaments') + 1.5}
            strokeLinecap="round"
            filter={selectedId === 'glenohumeral_ligaments' ? 'url(#glow)' : undefined}
          />
        </g>
      )}

      {/* JOINT CAPSULE */}
      {isVisible('joint_capsule') && (
        <g
          onClick={() => handleClick('joint_capsule')}
          onMouseEnter={() => onHover('joint_capsule')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('joint_capsule')}
        >
          <ellipse
            cx="315" cy="155"
            rx="30" ry="35"
            fill="none"
            stroke={selectedId === 'joint_capsule' ? '#bbddff' : '#99bbdd'}
            strokeWidth={getStrokeWidth('joint_capsule') + 1}
            strokeDasharray="6 3"
            opacity="0.6"
            filter={selectedId === 'joint_capsule' ? 'url(#glow)' : undefined}
          />
        </g>
      )}

      {/* LABELS */}
      {showLabels && (
        <g className="pointer-events-none">
          <Label x={260} y={95} text="Clavícula" targetX={270} targetY={100} visible={isVisible('clavicle')} />
          <Label x={170} y={210} text="Escápula" targetX={210} targetY={200} visible={isVisible('scapula')} />
          <Label x={370} y={112} text="Acromion" targetX={340} targetY={115} visible={isVisible('acromion')} />
          <Label x={255} y={115} text="Coracoides" targetX={280} targetY={120} visible={isVisible('coracoid')} />
          <Label x={370} y={155} text="Húmero" targetX={335} targetY={155} visible={isVisible('humerus')} />
          <Label x={370} y={190} text="Deltoides" targetX={360} targetY={190} visible={isVisible('deltoid')} />
          <Label x={220} y={170} text="Pectoral Mayor" targetX={250} targetY={160} visible={isVisible('pectoralis')} />
          <Label x={370} y={280} text="Bíceps" targetX={340} targetY={270} visible={isVisible('biceps')} />
          <Label x={250} y={140} text="Supraespinoso" targetX={280} targetY={120} visible={isVisible('supraspinatus')} />
          <Label x={180} y={165} text="Subescapular" targetX={220} targetY={165} visible={isVisible('subscapularis')} />
          <Label x={370} y={135} text="B. Subacromial" targetX={340} targetY={128} visible={isVisible('subacromial_bursa')} />
          <Label x={200} y={140} text="L. Coracoacromial" targetX={300} targetY={113} visible={isVisible('coracoacromial_ligament')} />
          <Label x={370} y={350} text="Cápsula Articular" targetX={340} targetY={180} visible={isVisible('joint_capsule')} />
        </g>
      )}
    </svg>
  );
}

function PosteriorView({ isVisible, getOpacity, getStrokeWidth, showLabels, handleClick, onHover, selectedId }: SVGViewProps) {
  return (
    <svg viewBox="0 0 500 600" className="w-full h-full" style={{ maxHeight: '100%' }}>
      <defs>
        <radialGradient id="skinGradient2" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f5d5c0" />
          <stop offset="100%" stopColor="#d4a88c" />
        </radialGradient>
        <filter id="glow2">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Body silhouette posterior */}
      <path
        d="M 180 50 Q 200 30 250 30 Q 300 30 320 50 L 340 80 Q 360 100 370 140 L 380 200 Q 385 250 380 300 L 370 400 Q 365 450 360 500 L 350 560 L 340 600 L 160 600 L 150 560 Q 145 500 140 450 L 135 400 Q 130 350 130 300 L 130 250 Q 130 200 140 160 L 155 100 Q 165 70 180 50"
        fill="url(#skinGradient2)"
        opacity="0.12"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />

      {/* SPINE indication */}
      <path
        d="M 250 60 L 250 520"
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="2"
        strokeDasharray="8 4"
      />

      {/* SCAPULA posterior - prominent */}
      {isVisible('scapula') && (
        <g
          onClick={() => handleClick('scapula')}
          onMouseEnter={() => onHover('scapula')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('scapula')}
        >
          <path
            d="M 180 120 L 280 110 Q 295 115 300 130 L 300 180 Q 295 230 280 270 L 260 290 L 230 300 L 200 290 L 185 250 Q 175 200 175 160 Z"
            fill={selectedId === 'scapula' ? '#f5e6d3' : '#e8d5c0'}
            stroke={selectedId === 'scapula' ? '#fff' : 'rgba(255,255,255,0.3)'}
            strokeWidth={getStrokeWidth('scapula')}
            filter={selectedId === 'scapula' ? 'url(#glow2)' : undefined}
          />
          {/* Scapular spine */}
          <path
            d="M 185 155 Q 220 140 260 135 Q 280 133 295 138"
            fill="none"
            stroke={selectedId === 'scapula' ? '#fff' : 'rgba(255,255,255,0.4)'}
            strokeWidth={getStrokeWidth('scapula') + 3}
            strokeLinecap="round"
          />
        </g>
      )}

      {/* CLAVICLE posterior */}
      {isVisible('clavicle') && (
        <g
          onClick={() => handleClick('clavicle')}
          onMouseEnter={() => onHover('clavicle')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('clavicle')}
        >
          <path
            d="M 170 110 Q 220 100 270 102 Q 320 105 350 115"
            fill="none"
            stroke={selectedId === 'clavicle' ? '#fff' : '#f0dcc8'}
            strokeWidth={getStrokeWidth('clavicle') + 5}
            strokeLinecap="round"
          />
        </g>
      )}

      {/* ACROMION */}
      {isVisible('acromion') && (
        <g
          onClick={() => handleClick('acromion')}
          onMouseEnter={() => onHover('acromion')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('acromion')}
        >
          <path
            d="M 290 108 Q 320 100 340 108 Q 350 115 345 122 Q 330 128 310 125 Q 295 120 290 108"
            fill={selectedId === 'acromion' ? '#f5e6d3' : '#eddcc8'}
            stroke={selectedId === 'acromion' ? '#fff' : 'rgba(255,255,255,0.4)'}
            strokeWidth={getStrokeWidth('acromion')}
            filter={selectedId === 'acromion' ? 'url(#glow2)' : undefined}
          />
        </g>
      )}

      {/* HUMERUS */}
      {isVisible('humerus') && (
        <g
          onClick={() => handleClick('humerus')}
          onMouseEnter={() => onHover('humerus')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('humerus')}
        >
          <circle
            cx="325" cy="148"
            r="22"
            fill={selectedId === 'humerus' ? '#fff5e6' : '#f5e6d3'}
            stroke={selectedId === 'humerus' ? '#fff' : 'rgba(255,255,255,0.3)'}
            strokeWidth={getStrokeWidth('humerus')}
            filter={selectedId === 'humerus' ? 'url(#glow2)' : undefined}
          />
          <path
            d="M 320 168 Q 325 200 330 260 Q 335 320 340 380 Q 343 420 345 460"
            fill="none"
            stroke={selectedId === 'humerus' ? '#fff5e6' : '#f5e6d3'}
            strokeWidth={getStrokeWidth('humerus') + 14}
            strokeLinecap="round"
          />
        </g>
      )}

      {/* CORACOID */}
      {isVisible('coracoid') && (
        <g
          onClick={() => handleClick('coracoid')}
          onMouseEnter={() => onHover('coracoid')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('coracoid')}
        >
          <path
            d="M 275 118 L 290 115 Q 298 120 293 128 L 280 132 Z"
            fill={selectedId === 'coracoid' ? '#f5e6d3' : '#e8d5c0'}
            stroke={selectedId === 'coracoid' ? '#fff' : 'rgba(255,255,255,0.4)'}
            strokeWidth={getStrokeWidth('coracoid')}
          />
        </g>
      )}

      {/* TRAPEZIUS */}
      {isVisible('trapezius') && (
        <g
          onClick={() => handleClick('trapezius')}
          onMouseEnter={() => onHover('trapezius')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('trapezius')}
        >
          <path
            d="M 200 70 Q 230 60 250 65 Q 270 60 300 70 L 340 100 Q 350 110 345 120 L 300 115 Q 270 110 250 112 Q 230 110 200 115 L 160 120 Q 155 110 165 100 Z"
            fill={selectedId === 'trapezius' ? '#ff7766' : '#e06050'}
            stroke={selectedId === 'trapezius' ? '#fff' : 'rgba(255,255,255,0.15)'}
            strokeWidth={getStrokeWidth('trapezius')}
            opacity="0.6"
            filter={selectedId === 'trapezius' ? 'url(#glow2)' : undefined}
          />
          {/* Lower fibers */}
          <path
            d="M 180 130 Q 200 160 220 200 Q 240 240 250 280 L 250 280 Q 260 240 280 200 Q 300 160 320 130"
            fill={selectedId === 'trapezius' ? '#ff7766' : '#e06050'}
            stroke={selectedId === 'trapezius' ? '#fff' : 'rgba(255,255,255,0.1)'}
            strokeWidth={getStrokeWidth('trapezius')}
            opacity="0.4"
          />
        </g>
      )}

      {/* INFRASPINATUS */}
      {isVisible('infraspinatus') && (
        <g
          onClick={() => handleClick('infraspinatus')}
          onMouseEnter={() => onHover('infraspinatus')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('infraspinatus')}
        >
          <path
            d="M 200 165 Q 230 158 260 160 Q 285 162 300 168 Q 310 175 305 185 Q 285 192 260 190 Q 230 188 205 182 Q 195 175 200 165 Z"
            fill={selectedId === 'infraspinatus' ? '#ff4444' : '#b83535'}
            stroke={selectedId === 'infraspinatus' ? '#fff' : 'rgba(255,255,255,0.2)'}
            strokeWidth={getStrokeWidth('infraspinatus')}
            filter={selectedId === 'infraspinatus' ? 'url(#glow2)' : undefined}
          />
        </g>
      )}

      {/* TERES MINOR */}
      {isVisible('teres_minor') && (
        <g
          onClick={() => handleClick('teres_minor')}
          onMouseEnter={() => onHover('teres_minor')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('teres_minor')}
        >
          <path
            d="M 210 195 Q 240 190 270 192 Q 290 195 300 200 Q 305 208 298 212 Q 275 215 250 213 Q 225 210 210 205 Z"
            fill={selectedId === 'teres_minor' ? '#ff3333' : '#a82e2e'}
            stroke={selectedId === 'teres_minor' ? '#fff' : 'rgba(255,255,255,0.2)'}
            strokeWidth={getStrokeWidth('teres_minor')}
            filter={selectedId === 'teres_minor' ? 'url(#glow2)' : undefined}
          />
        </g>
      )}

      {/* DELTOID posterior */}
      {isVisible('deltoid') && (
        <g
          onClick={() => handleClick('deltoid')}
          onMouseEnter={() => onHover('deltoid')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('deltoid')}
        >
          <path
            d="M 300 110 Q 330 100 355 115 Q 370 135 380 170 Q 385 210 380 250 Q 370 260 355 255 Q 340 240 335 210 Q 330 180 325 160 Q 318 140 305 125 Z"
            fill={selectedId === 'deltoid' ? '#ff6655' : '#d4544a'}
            stroke={selectedId === 'deltoid' ? '#fff' : 'rgba(255,255,255,0.15)'}
            strokeWidth={getStrokeWidth('deltoid')}
            opacity="0.65"
            filter={selectedId === 'deltoid' ? 'url(#glow2)' : undefined}
          />
        </g>
      )}

      {/* SUPRASPINATUS posterior view */}
      {isVisible('supraspinatus') && (
        <g
          onClick={() => handleClick('supraspinatus')}
          onMouseEnter={() => onHover('supraspinatus')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('supraspinatus')}
        >
          <path
            d="M 210 138 Q 240 132 270 133 Q 290 135 305 140 Q 312 145 308 150 Q 290 153 265 150 Q 240 148 215 148 Z"
            fill={selectedId === 'supraspinatus' ? '#ff5555' : '#c94040'}
            stroke={selectedId === 'supraspinatus' ? '#fff' : 'rgba(255,255,255,0.2)'}
            strokeWidth={getStrokeWidth('supraspinatus')}
            filter={selectedId === 'supraspinatus' ? 'url(#glow2)' : undefined}
          />
        </g>
      )}

      {/* LATISSIMUS DORSI */}
      {isVisible('latissimus') && (
        <g
          onClick={() => handleClick('latissimus')}
          onMouseEnter={() => onHover('latissimus')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('latissimus')}
        >
          <path
            d="M 200 250 Q 220 230 250 225 Q 280 230 310 250 Q 330 270 340 300 Q 345 330 340 360 Q 335 370 325 365 Q 310 340 290 310 Q 270 285 250 275 Q 230 270 210 280 Q 200 270 200 250 Z"
            fill={selectedId === 'latissimus' ? '#ff4444' : '#bf3838'}
            stroke={selectedId === 'latissimus' ? '#fff' : 'rgba(255,255,255,0.15)'}
            strokeWidth={getStrokeWidth('latissimus')}
            opacity="0.55"
            filter={selectedId === 'latissimus' ? 'url(#glow2)' : undefined}
          />
        </g>
      )}

      {/* ROTATOR CUFF tendons */}
      {isVisible('rotator_cuff') && (
        <g
          onClick={() => handleClick('rotator_cuff')}
          onMouseEnter={() => onHover('rotator_cuff')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('rotator_cuff')}
        >
          <path
            d="M 300 140 Q 315 135 328 142 Q 335 150 332 158 Q 322 165 310 162 Q 302 155 300 148 Z"
            fill={selectedId === 'rotator_cuff' ? '#fff' : '#e8e8e8'}
            stroke={selectedId === 'rotator_cuff' ? '#fff' : 'rgba(255,255,255,0.4)'}
            strokeWidth={getStrokeWidth('rotator_cuff')}
            opacity="0.8"
            filter={selectedId === 'rotator_cuff' ? 'url(#glow2)' : undefined}
          />
        </g>
      )}

      {/* LABELS */}
      {showLabels && (
        <g className="pointer-events-none">
          <Label x={120} y={100} text="Clavícula" targetX={220} targetY={105} visible={isVisible('clavicle')} />
          <Label x={120} y={200} text="Escápula" targetX={200} targetY={200} visible={isVisible('scapula')} />
          <Label x={380} y={108} text="Acromion" targetX={340} targetY={115} visible={isVisible('acromion')} />
          <Label x={380} y={155} text="Húmero" targetX={340} targetY={155} visible={isVisible('humerus')} />
          <Label x={120} y={80} text="Trapecio" targetX={200} targetY={90} visible={isVisible('trapezius')} />
          <Label x={120} y={175} text="Infraespinoso" targetX={210} targetY={175} visible={isVisible('infraspinatus')} />
          <Label x={120} y={210} text="Redondo Menor" targetX={215} targetY={203} visible={isVisible('teres_minor')} />
          <Label x={380} y={190} text="Deltoides (post.)" targetX={360} targetY={190} visible={isVisible('deltoid')} />
          <Label x={120} y={145} text="Supraespinoso" targetX={220} targetY={140} visible={isVisible('supraspinatus')} />
          <Label x={120} y={290} text="Dorsal Ancho" targetX={220} targetY={270} visible={isVisible('latissimus')} />
        </g>
      )}
    </svg>
  );
}

function LateralView({ isVisible, getOpacity, getStrokeWidth, showLabels, handleClick, onHover, selectedId }: SVGViewProps) {
  return (
    <svg viewBox="0 0 500 600" className="w-full h-full" style={{ maxHeight: '100%' }}>
      <defs>
        <radialGradient id="skinGradient3" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f5d5c0" />
          <stop offset="100%" stopColor="#d4a88c" />
        </radialGradient>
        <filter id="glow3">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Body silhouette lateral */}
      <path
        d="M 200 50 Q 230 35 260 40 Q 290 45 300 60 L 310 90 Q 320 120 325 160 L 330 220 Q 335 280 330 340 L 325 400 Q 320 450 315 500 L 310 560 L 300 600 L 180 600 L 175 560 Q 170 500 168 450 L 165 400 Q 160 340 160 280 L 160 220 Q 162 160 170 120 L 180 80 Q 190 60 200 50"
        fill="url(#skinGradient3)"
        opacity="0.12"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />

      {/* SCAPULA lateral */}
      {isVisible('scapula') && (
        <g
          onClick={() => handleClick('scapula')}
          onMouseEnter={() => onHover('scapula')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('scapula')}
        >
          <path
            d="M 200 120 L 250 115 Q 265 120 270 140 L 270 200 Q 265 250 255 280 L 240 295 L 220 290 L 205 260 Q 195 220 195 170 Z"
            fill={selectedId === 'scapula' ? '#f5e6d3' : '#e8d5c0'}
            stroke={selectedId === 'scapula' ? '#fff' : 'rgba(255,255,255,0.3)'}
            strokeWidth={getStrokeWidth('scapula')}
            filter={selectedId === 'scapula' ? 'url(#glow3)' : undefined}
          />
        </g>
      )}

      {/* CLAVICLE lateral */}
      {isVisible('clavicle') && (
        <g
          onClick={() => handleClick('clavicle')}
          onMouseEnter={() => onHover('clavicle')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('clavicle')}
        >
          <path
            d="M 195 108 Q 230 100 265 105 Q 290 110 305 118"
            fill="none"
            stroke={selectedId === 'clavicle' ? '#fff' : '#f0dcc8'}
            strokeWidth={getStrokeWidth('clavicle') + 5}
            strokeLinecap="round"
          />
        </g>
      )}

      {/* ACROMION lateral */}
      {isVisible('acromion') && (
        <g
          onClick={() => handleClick('acromion')}
          onMouseEnter={() => onHover('acromion')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('acromion')}
        >
          <path
            d="M 265 105 Q 290 100 305 108 Q 312 115 308 122 Q 295 126 280 122 Q 268 118 265 105"
            fill={selectedId === 'acromion' ? '#f5e6d3' : '#eddcc8'}
            stroke={selectedId === 'acromion' ? '#fff' : 'rgba(255,255,255,0.4)'}
            strokeWidth={getStrokeWidth('acromion')}
            filter={selectedId === 'acromion' ? 'url(#glow3)' : undefined}
          />
        </g>
      )}

      {/* CORACOID lateral */}
      {isVisible('coracoid') && (
        <g
          onClick={() => handleClick('coracoid')}
          onMouseEnter={() => onHover('coracoid')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('coracoid')}
        >
          <path
            d="M 260 118 L 275 115 Q 282 120 278 128 L 265 130 Z"
            fill={selectedId === 'coracoid' ? '#f5e6d3' : '#e8d5c0'}
            stroke={selectedId === 'coracoid' ? '#fff' : 'rgba(255,255,255,0.4)'}
            strokeWidth={getStrokeWidth('coracoid')}
          />
        </g>
      )}

      {/* HUMERUS lateral */}
      {isVisible('humerus') && (
        <g
          onClick={() => handleClick('humerus')}
          onMouseEnter={() => onHover('humerus')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('humerus')}
        >
          <circle
            cx="290" cy="148"
            r="22"
            fill={selectedId === 'humerus' ? '#fff5e6' : '#f5e6d3'}
            stroke={selectedId === 'humerus' ? '#fff' : 'rgba(255,255,255,0.3)'}
            strokeWidth={getStrokeWidth('humerus')}
            filter={selectedId === 'humerus' ? 'url(#glow3)' : undefined}
          />
          <path
            d="M 285 168 Q 288 200 290 260 Q 292 320 294 380 Q 295 420 296 460"
            fill="none"
            stroke={selectedId === 'humerus' ? '#fff5e6' : '#f5e6d3'}
            strokeWidth={getStrokeWidth('humerus') + 14}
            strokeLinecap="round"
          />
        </g>
      )}

      {/* DELTOID lateral */}
      {isVisible('deltoid') && (
        <g
          onClick={() => handleClick('deltoid')}
          onMouseEnter={() => onHover('deltoid')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('deltoid')}
        >
          <path
            d="M 260 105 Q 290 95 315 108 Q 330 125 340 160 Q 345 200 340 240 Q 330 255 315 250 Q 305 235 300 200 Q 295 170 288 150 Q 280 130 265 118 Z"
            fill={selectedId === 'deltoid' ? '#ff6655' : '#d4544a'}
            stroke={selectedId === 'deltoid' ? '#fff' : 'rgba(255,255,255,0.15)'}
            strokeWidth={getStrokeWidth('deltoid')}
            opacity="0.65"
            filter={selectedId === 'deltoid' ? 'url(#glow3)' : undefined}
          />
        </g>
      )}

      {/* SUPRASPINATUS lateral */}
      {isVisible('supraspinatus') && (
        <g
          onClick={() => handleClick('supraspinatus')}
          onMouseEnter={() => onHover('supraspinatus')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('supraspinatus')}
        >
          <path
            d="M 215 128 Q 240 122 265 125 Q 280 128 290 135 Q 295 142 290 148 Q 275 150 255 147 Q 235 144 218 140 Z"
            fill={selectedId === 'supraspinatus' ? '#ff5555' : '#c94040'}
            stroke={selectedId === 'supraspinatus' ? '#fff' : 'rgba(255,255,255,0.2)'}
            strokeWidth={getStrokeWidth('supraspinatus')}
            filter={selectedId === 'supraspinatus' ? 'url(#glow3)' : undefined}
          />
        </g>
      )}

      {/* INFRASPINATUS lateral */}
      {isVisible('infraspinatus') && (
        <g
          onClick={() => handleClick('infraspinatus')}
          onMouseEnter={() => onHover('infraspinatus')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('infraspinatus')}
        >
          <path
            d="M 210 160 Q 235 155 260 158 Q 278 162 288 168 Q 292 175 288 182 Q 270 186 250 184 Q 230 180 212 175 Z"
            fill={selectedId === 'infraspinatus' ? '#ff4444' : '#b83535'}
            stroke={selectedId === 'infraspinatus' ? '#fff' : 'rgba(255,255,255,0.2)'}
            strokeWidth={getStrokeWidth('infraspinatus')}
            filter={selectedId === 'infraspinatus' ? 'url(#glow3)' : undefined}
          />
        </g>
      )}

      {/* SUBACROMIAL BURSA lateral */}
      {isVisible('subacromial_bursa') && (
        <g
          onClick={() => handleClick('subacromial_bursa')}
          onMouseEnter={() => onHover('subacromial_bursa')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('subacromial_bursa')}
        >
          <ellipse
            cx="290" cy="130"
            rx="14" ry="5"
            fill={selectedId === 'subacromial_bursa' ? '#ffee66' : '#ffdd44'}
            stroke={selectedId === 'subacromial_bursa' ? '#fff' : 'rgba(255,255,255,0.3)'}
            strokeWidth={getStrokeWidth('subacromial_bursa')}
            opacity="0.7"
            filter={selectedId === 'subacromial_bursa' ? 'url(#glow3)' : undefined}
          />
        </g>
      )}

      {/* CORACOACROMIAL LIGAMENT lateral */}
      {isVisible('coracoacromial_ligament') && (
        <g
          onClick={() => handleClick('coracoacromial_ligament')}
          onMouseEnter={() => onHover('coracoacromial_ligament')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('coracoacromial_ligament')}
        >
          <path
            d="M 270 120 Q 282 110 295 112"
            fill="none"
            stroke={selectedId === 'coracoacromial_ligament' ? '#99dd99' : '#77bb77'}
            strokeWidth={getStrokeWidth('coracoacromial_ligament') + 2}
            strokeLinecap="round"
            filter={selectedId === 'coracoacromial_ligament' ? 'url(#glow3)' : undefined}
          />
        </g>
      )}

      {/* BICEPS lateral */}
      {isVisible('biceps') && (
        <g
          onClick={() => handleClick('biceps')}
          onMouseEnter={() => onHover('biceps')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('biceps')}
        >
          <path
            d="M 275 165 Q 285 175 290 200 Q 295 240 296 280 Q 297 310 295 340 Q 290 350 282 345 Q 278 320 276 280 Q 274 240 272 200 Q 270 180 275 165 Z"
            fill={selectedId === 'biceps' ? '#ff6666' : '#d45555'}
            stroke={selectedId === 'biceps' ? '#fff' : 'rgba(255,255,255,0.15)'}
            strokeWidth={getStrokeWidth('biceps')}
            opacity="0.7"
            filter={selectedId === 'biceps' ? 'url(#glow3)' : undefined}
          />
        </g>
      )}

      {/* ROTATOR CUFF lateral */}
      {isVisible('rotator_cuff') && (
        <g
          onClick={() => handleClick('rotator_cuff')}
          onMouseEnter={() => onHover('rotator_cuff')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('rotator_cuff')}
        >
          <path
            d="M 275 138 Q 288 133 298 140 Q 303 148 300 155 Q 292 160 282 157 Q 275 150 275 143 Z"
            fill={selectedId === 'rotator_cuff' ? '#fff' : '#e8e8e8'}
            stroke={selectedId === 'rotator_cuff' ? '#fff' : 'rgba(255,255,255,0.4)'}
            strokeWidth={getStrokeWidth('rotator_cuff')}
            opacity="0.8"
            filter={selectedId === 'rotator_cuff' ? 'url(#glow3)' : undefined}
          />
        </g>
      )}

      {/* JOINT CAPSULE lateral */}
      {isVisible('joint_capsule') && (
        <g
          onClick={() => handleClick('joint_capsule')}
          onMouseEnter={() => onHover('joint_capsule')}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          opacity={getOpacity('joint_capsule')}
        >
          <ellipse
            cx="288" cy="152"
            rx="28" ry="32"
            fill="none"
            stroke={selectedId === 'joint_capsule' ? '#bbddff' : '#99bbdd'}
            strokeWidth={getStrokeWidth('joint_capsule') + 1}
            strokeDasharray="6 3"
            opacity="0.6"
            filter={selectedId === 'joint_capsule' ? 'url(#glow3)' : undefined}
          />
        </g>
      )}

      {/* LABELS */}
      {showLabels && (
        <g className="pointer-events-none">
          <Label x={120} y={105} text="Clavícula" targetX={230} targetY={105} visible={isVisible('clavicle')} />
          <Label x={120} y={200} text="Escápula" targetX={210} targetY={200} visible={isVisible('scapula')} />
          <Label x={350} y={108} text="Acromion" targetX={305} targetY={112} visible={isVisible('acromion')} />
          <Label x={350} y={155} text="Húmero" targetX={305} targetY={155} visible={isVisible('humerus')} />
          <Label x={350} y={180} text="Deltoides" targetX={320} targetY={180} visible={isVisible('deltoid')} />
          <Label x={120} y={140} text="Supraespinoso" targetX={230} targetY={135} visible={isVisible('supraspinatus')} />
          <Label x={120} y={175} text="Infraespinoso" targetX={220} targetY={170} visible={isVisible('infraspinatus')} />
          <Label x={350} y={130} text="B. Subacromial" targetX={300} targetY={130} visible={isVisible('subacromial_bursa')} />
          <Label x={350} y={270} text="Bíceps" targetX={290} targetY={270} visible={isVisible('biceps')} />
          <Label x={120} y={120} text="L. Coracoacromial" targetX={280} targetY={115} visible={isVisible('coracoacromial_ligament')} />
          <Label x={350} y={350} text="Cápsula Articular" targetX={310} targetY={175} visible={isVisible('joint_capsule')} />
        </g>
      )}
    </svg>
  );
}

function Label({ x, y, text, targetX, targetY, visible }: { x: number; y: number; text: string; targetX: number; targetY: number; visible: boolean }) {
  if (!visible) return null;
  return (
    <g>
      <line
        x1={x} y1={y} x2={targetX} y2={targetY}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="0.5"
        strokeDasharray="3 2"
      />
      <circle cx={targetX} cy={targetY} r="2" fill="rgba(255,255,255,0.4)" />
      <text
        x={x}
        y={y}
        fill="rgba(255,255,255,0.8)"
        fontSize="9"
        fontFamily="sans-serif"
        textAnchor={x < 250 ? 'start' : 'end'}
        dominantBaseline="middle"
      >
        {text}
      </text>
    </g>
  );
}

export default App;
