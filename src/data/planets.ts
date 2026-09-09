export interface PlanetData {
  id: string;
  name: string;
  nameEs: string;
  color: string;
  size: number; // radius in pixels for display
  realDiameter: number; // km
  distanceFromSun: number; // million km
  orbitalPeriod: number; // Earth days
  orbitRadius: number; // pixels for display
  speed: number; // animation speed factor
  description: string;
  moons: number;
  type: string;
}

export const planetsData: PlanetData[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    nameEs: 'Mercurio',
    color: '#b5b5b5',
    size: 10,
    realDiameter: 4879,
    distanceFromSun: 57.9,
    orbitalPeriod: 88,
    orbitRadius: 70,
    speed: 4.15,
    description: 'El planeta más pequeño y cercano al Sol. No tiene atmósfera significativa y sus temperaturas varían extremadamente.',
    moons: 0,
    type: 'Planeta rocoso'
  },
  {
    id: 'venus',
    name: 'Venus',
    nameEs: 'Venus',
    color: '#e8cda0',
    size: 14,
    realDiameter: 12104,
    distanceFromSun: 108.2,
    orbitalPeriod: 225,
    orbitRadius: 105,
    speed: 1.62,
    description: 'Conocido como la estrella de la mañana. Tiene una atmósfera densa de CO2 que causa un efecto invernadero extremo.',
    moons: 0,
    type: 'Planeta rocoso'
  },
  {
    id: 'earth',
    name: 'Earth',
    nameEs: 'Tierra',
    color: '#4da6ff',
    size: 15,
    realDiameter: 12756,
    distanceFromSun: 149.6,
    orbitalPeriod: 365,
    orbitRadius: 145,
    speed: 1.0,
    description: 'Nuestro hogar. El único planeta conocido con vida. Tiene agua líquida en su superficie y una atmósfera protectora.',
    moons: 1,
    type: 'Planeta rocoso'
  },
  {
    id: 'mars',
    name: 'Mars',
    nameEs: 'Marte',
    color: '#e07040',
    size: 12,
    realDiameter: 6792,
    distanceFromSun: 227.9,
    orbitalPeriod: 687,
    orbitRadius: 185,
    speed: 0.53,
    description: 'El planeta rojo. Tiene el volcán más grande del sistema solar (Olympus Mons) y evidencias de agua pasada.',
    moons: 2,
    type: 'Planeta rocoso'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    nameEs: 'Júpiter',
    color: '#d4a574',
    size: 32,
    realDiameter: 142984,
    distanceFromSun: 778.6,
    orbitalPeriod: 4333,
    orbitRadius: 250,
    speed: 0.084,
    description: 'El planeta más grande. Es un gigante gaseoso con la Gran Mancha Roja, una tormenta que dura cientos de años.',
    moons: 95,
    type: 'Gigante gaseoso'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    nameEs: 'Saturno',
    color: '#f4d59c',
    size: 28,
    realDiameter: 120536,
    distanceFromSun: 1433.5,
    orbitalPeriod: 10759,
    orbitRadius: 320,
    speed: 0.034,
    description: 'Famoso por sus espectaculares anillos de hielo y roca. Es tan poco denso que flotaría en agua.',
    moons: 146,
    type: 'Gigante gaseoso'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    nameEs: 'Urano',
    color: '#7de8e8',
    size: 22,
    realDiameter: 51118,
    distanceFromSun: 2872.5,
    orbitalPeriod: 30687,
    orbitRadius: 385,
    speed: 0.012,
    description: 'Un gigante de hielo que rota de lado. Su eje está inclinado 98°, lo que lo hace único en el sistema solar.',
    moons: 28,
    type: 'Gigante de hielo'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    nameEs: 'Neptuno',
    color: '#4466ff',
    size: 20,
    realDiameter: 49528,
    distanceFromSun: 4495.1,
    orbitalPeriod: 60190,
    orbitRadius: 440,
    speed: 0.006,
    description: 'El planeta más lejano. Tiene los vientos más fuertes del sistema solar, alcanzando 2100 km/h.',
    moons: 16,
    type: 'Gigante de hielo'
  }
];
