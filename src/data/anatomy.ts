export interface AnatomyStructure {
  id: string;
  name: string;
  category: 'bones' | 'muscles' | 'tendons' | 'ligaments' | 'bursae' | 'other';
  categoryLabel: string;
  color: string;
  description: string;
  function: string;
  clinicalRelevance?: string;
  origin?: string;
  insertion?: string;
  innervation?: string;
  bloodSupply?: string;
}

export const anatomyData: AnatomyStructure[] = [
  // HUESOS
  {
    id: 'humerus',
    name: 'Húmero',
    category: 'bones',
    categoryLabel: 'Huesos',
    color: '#f5e6d3',
    description: 'Hueso largo del brazo que se articula con la escápula en la articulación glenohumeral. Su cabeza esférica encaja en la cavidad glenoidea.',
    function: 'Proporciona el marco óseo del brazo y permite los movimientos de rotación, flexión y extensión del hombro.',
    clinicalRelevance: 'Fracturas del húmero proximal son comunes en caídas, especialmente en personas con osteoporosis.',
    bloodSupply: 'Arteria circunfleja humeral anterior y posterior'
  },
  {
    id: 'scapula',
    name: 'Escápula (Omóplato)',
    category: 'bones',
    categoryLabel: 'Huesos',
    color: '#e8d5c0',
    description: 'Hueso plano triangular situado en la parte posterior del tórax. Contiene la cavidad glenoidea donde se articula el húmero.',
    function: 'Proporciona puntos de inserción para múltiples músculos y estabiliza el hombro durante el movimiento del brazo.',
    clinicalRelevance: 'La discinesia escapular (movimiento anormal) puede contribuir al síndrome de pinzamiento subacromial.',
    innervation: 'Varios nervios según el músculo que se inserte'
  },
  {
    id: 'clavicle',
    name: 'Clavícula',
    category: 'bones',
    categoryLabel: 'Huesos',
    color: '#f0dcc8',
    description: 'Hueso largo y delgado que conecta el esternón con el acromion de la escápula. Es el único hueso que conecta el brazo al tronco.',
    function: 'Transmite fuerzas desde el brazo al esqueleto axial y mantiene el hombro en posición lateral para máxima movilidad.',
    clinicalRelevance: 'Es uno de los huesos más frecuentemente fracturados, especialmente en su tercio medio.',
    bloodSupply: 'Arteria supraescapular y toracoacromial'
  },
  {
    id: 'acromion',
    name: 'Acromion',
    category: 'bones',
    categoryLabel: 'Huesos',
    color: '#eddcc8',
    description: 'Proyección ósea de la espina de la escápula que forma el punto más alto del hombro. Se articula con la clavícula.',
    function: 'Protege la articulación glenohumeral y sirve como punto de inserción para el músculo deltoides y ligamentos.',
    clinicalRelevance: 'Un acromion curvado o con gancho puede predisponer al síndrome de pinzamiento subacromial.',
  },
  {
    id: 'coracoid',
    name: 'Apófisis Coracoides',
    category: 'bones',
    categoryLabel: 'Huesos',
    color: '#e8d5c0',
    description: 'Proyección ósea en forma de gancho que se extiende desde el borde superior de la escápula hacia adelante.',
    function: 'Sirve como punto de anclaje para músculos (bíceps, coracobraquial) y ligamentos (coracoclavicular, coracoacromial).',
    clinicalRelevance: 'Puede fracturarse en traumatismos de alta energía. También es sitio de referencia quirúrgica.',
  },
  {
    id: 'glenoid',
    name: 'Cavidad Glenoidea',
    category: 'bones',
    categoryLabel: 'Huesos',
    color: '#f5e6d3',
    description: 'Superficie articular cóncava y poco profunda de la escápula que recibe la cabeza del húmero. Es relativamente plana comparada con otras articulaciones.',
    function: 'Forma la articulación glenohumeral permitiendo gran rango de movimiento a costa de estabilidad.',
    clinicalRelevance: 'Su poca profundidad contribuye a la inestabilidad y luxaciones del hombro.',
  },
  // MÚSCULOS
  {
    id: 'deltoid',
    name: 'Deltoides',
    category: 'muscles',
    categoryLabel: 'Músculos',
    color: '#d4544a',
    description: 'Músculo grande y triangular que cubre el hombro. Tiene tres porciones: anterior (clavicular), media (acromial) y posterior (espinal).',
    function: 'Abducción del brazo (porción media), flexión (anterior) y extensión (posterior) del hombro. Principal abductor desde 15° hasta 90°.',
    origin: 'Clavícula lateral, acromion y espina de la escápula',
    insertion: 'Tuberosidad deltoidea del húmero',
    innervation: 'Nervio axilar (C5-C6)',
    bloodSupply: 'Arteria toracoacromial y circunfleja humeral posterior'
  },
  {
    id: 'supraspinatus',
    name: 'Supraespinoso',
    category: 'muscles',
    categoryLabel: 'Músculos',
    color: '#c94040',
    description: 'Músculo del manguito rotador que se encuentra en la fosa supraespinosa de la escápula, por encima de la espina escapular.',
    function: 'Inicia la abducción del brazo (primeros 15°) y estabiliza la cabeza humeral contra la glenoides.',
    origin: 'Fosa supraespinosa de la escápula',
    insertion: 'Tuberosidad mayor del húmero',
    innervation: 'Nervio supraescapular (C5-C6)',
    clinicalRelevance: 'Es el tendón más frecuentemente lesionado del manguito rotador debido a su paso bajo el arco coracoacromial.',
    bloodSupply: 'Arteria supraescapular'
  },
  {
    id: 'infraspinatus',
    name: 'Infraespinoso',
    category: 'muscles',
    categoryLabel: 'Músculos',
    color: '#b83535',
    description: 'Músculo del manguito rotador ubicado en la fosa infraespinosa de la escápula, debajo de la espina escapular.',
    function: 'Rotación externa del hombro y estabilización de la articulación glenohumeral.',
    origin: 'Fosa infraespinosa de la escápula',
    insertion: 'Tuberosidad mayor del húmero (facet media)',
    innervation: 'Nervio supraescapular (C5-C6)',
    clinicalRelevance: 'Segundo tendón más frecuentemente afectado en desgarros del manguito rotador.',
    bloodSupply: 'Arteria supraescapular y circunfleja escapular'
  },
  {
    id: 'teres_minor',
    name: 'Redondo Menor',
    category: 'muscles',
    categoryLabel: 'Músculos',
    color: '#a82e2e',
    description: 'Músculo estrecho del manguito rotador ubicado en el borde lateral de la escápula, inferior al infraespinoso.',
    function: 'Rotación externa del hombro y aducción horizontal. Estabiliza la articulación glenohumeral.',
    origin: 'Borde lateral de la escápula',
    insertion: 'Tuberosidad mayor del húmero (facet inferior)',
    innervation: 'Nervio axilar (C5-C6)',
    bloodSupply: 'Arteria circunfleja escapular'
  },
  {
    id: 'subscapularis',
    name: 'Subescapular',
    category: 'muscles',
    categoryLabel: 'Músculos',
    color: '#9e2828',
    description: 'Músculo grande y triangular del manguito rotador que ocupa toda la fosa subescapular en la cara anterior de la escápula.',
    function: 'Rotación interna del hombro y estabilización anterior de la articulación glenohumeral.',
    origin: 'Fosa subescapular de la escápula',
    insertion: 'Tuberosidad menor del húmero',
    innervation: 'Nervios subescapulares superior e inferior (C5-C7)',
    clinicalRelevance: 'Es el más grande y fuerte del manguito rotador. Su tendón está separado de la escápula por la bursa subescapular.',
    bloodSupply: 'Arteria subescapular'
  },
  {
    id: 'trapezius',
    name: 'Trapecio',
    category: 'muscles',
    categoryLabel: 'Músculos',
    color: '#e06050',
    description: 'Músculo grande y superficial en forma de diamante que cubre la parte superior de la espalda y el cuello.',
    function: 'Elevación, retracción y depresión de la escápula. Estabiliza y controla el movimiento escapular durante actividades del brazo.',
    origin: 'Protuberancia occipital, ligamento nucal y procesos espinosos C7-T12',
    insertion: 'Clavícula lateral, acromion y espina de la escápula',
    innervation: 'Nervio accesorio (XI par craneal) y C3-C4',
    bloodSupply: 'Arteria transversa del cuello y arteria dorsal de la escápula'
  },
  {
    id: 'biceps',
    name: 'Bíceps Braquial',
    category: 'muscles',
    categoryLabel: 'Músculos',
    color: '#d45555',
    description: 'Músculo de dos cabezas en la parte anterior del brazo. Su tendón largo intraarticular cruza la articulación del hombro.',
    function: 'Flexión del codo, supinación del antebrazo y flexión del hombro. El tendón largo estabiliza la cabeza humeral.',
    origin: 'Cabeza corta: apófisis coracoides. Cabeza larga: tubérculo supraglenoideo',
    insertion: 'Tuberosidad del radio y aponeurosis bicipital',
    innervation: 'Nervio musculocutáneo (C5-C6)',
    clinicalRelevance: 'La tendinopatía del bíceps largo es causa frecuente de dolor anterior del hombro.',
    bloodSupply: 'Arteria braquial'
  },
  {
    id: 'pectoralis',
    name: 'Pectoral Mayor',
    category: 'muscles',
    categoryLabel: 'Músculos',
    color: '#cc4545',
    description: 'Músculo ancho y grueso del tórax que cubre la mayor parte de la pared torácica anterior.',
    function: 'Aducción, flexión y rotación interna del hombro. Importante en movimientos de empuje y lanzamiento.',
    origin: 'Clavícula medial, esternón y cartílagos costales 1-6',
    insertion: 'Labio lateral del surco intertubercular del húmero',
    innervation: 'Nervios pectorales medial y lateral (C5-T1)',
    bloodSupply: 'Arteria toracoacromial y ramas perforantes de la mamaria interna'
  },
  {
    id: 'latissimus',
    name: 'Dorsal Ancho',
    category: 'muscles',
    categoryLabel: 'Músculos',
    color: '#bf3838',
    description: 'Músculo grande y plano de la espalda que cubre la región lumbar y torácica inferior.',
    function: 'Extensión, aducción y rotación interna del hombro. Fundamental en movimientos de tracción y natación.',
    origin: 'Procesos espinosos T7-L5, cresta ilíaca y costillas 9-12',
    insertion: 'Suelo del surco intertubercular del húmero',
    innervation: 'Nervio toracodorsal (C6-C8)',
    bloodSupply: 'Arteria toracodorsal'
  },
  // TENDONES Y ESTRUCTURAS
  {
    id: 'biceps_tendon',
    name: 'Tendón Largo del Bíceps',
    category: 'tendons',
    categoryLabel: 'Tendones',
    color: '#f0f0f0',
    description: 'Tendón de la cabeza larga del bíceps que atraviesa intraarticularmente la articulación del hombro desde el tubérculo supraglenoideo.',
    function: 'Estabiliza la cabeza humeral durante movimientos del hombro y transmite la fuerza del bíceps.',
    clinicalRelevance: 'Frecuentemente afectado en tendinopatías, tenosinovitis y rupturas. Se evalúa con la maniobra de Speed y Yergason.',
    origin: 'Tubérculo supraglenoideo',
    insertion: 'Tuberosidad del radio'
  },
  {
    id: 'rotator_cuff',
    name: 'Manguito Rotador',
    category: 'tendons',
    categoryLabel: 'Tendones',
    color: '#e8e8e8',
    description: 'Conjunto de cuatro tendones (supraespinoso, infraespinoso, redondo menor y subescapular) que rodean la articulación glenohumeral formando un manguito.',
    function: 'Estabiliza dinámicamente la articulación glenohumeral, comprimiendo la cabeza humeral contra la glenoides durante todo el rango de movimiento.',
    clinicalRelevance: 'Las lesiones del manguito rotador son la causa más común de dolor y debilidad en el hombro en adultos mayores de 40 años.',
  },
  {
    id: 'labrum',
    name: 'Labrum Glenoideo',
    category: 'other',
    categoryLabel: 'Otras Estructuras',
    color: '#88aacc',
    description: 'Anillo de cartílago fibroso que rodea el borde de la cavidad glenoidea, aumentando su profundidad en un 50%.',
    function: 'Aumenta la estabilidad de la articulación glenohumeral al profundizar la cavidad glenoidea y sirve como punto de anclaje para ligamentos y el tendón del bíceps.',
    clinicalRelevance: 'Las lesiones SLAP (desgarro del labrum superior de anterior a posterior) son comunes en atletas que realizan lanzamientos.',
  },
  {
    id: 'subacromial_bursa',
    name: 'Bursa Subacromial',
    category: 'bursae',
    categoryLabel: 'Bursas',
    color: '#ffdd44',
    description: 'Saco lleno de líquido situado entre el arco coracoacromial y el manguito rotador. Es la bursa más grande del cuerpo.',
    function: 'Reduce la fricción entre el manguito rotador y el arco coracoacromial durante los movimientos del hombro, permitiendo el deslizamiento suave.',
    clinicalRelevance: 'La bursitis subacromial es una causa muy común de dolor en el hombro, frecuentemente asociada al síndrome de pinzamiento.',
  },
  {
    id: 'coracoacromial_ligament',
    name: 'Ligamento Coracoacromial',
    category: 'ligaments',
    categoryLabel: 'Ligamentos',
    color: '#77bb77',
    description: 'Ligamento ancho que conecta la apófisis coracoides con el acromion, formando el arco coracoacromial.',
    function: 'Forma parte del arco coracoacromial que protege las estructuras subyacentes (manguito rotador y bursa).',
    clinicalRelevance: 'El engrosamiento de este ligamento contribuye al síndrome de pinzamiento subacromial secundario.',
  },
  {
    id: 'coracoclavicular_ligament',
    name: 'Ligamento Coracoclavicular',
    category: 'ligaments',
    categoryLabel: 'Ligamentos',
    color: '#66aa66',
    description: 'Complejo ligamentario formado por los ligamentos trapezoide y conoide que conecta la coracoides con la clavícula.',
    function: 'Mantiene la estabilidad de la articulación acromioclavicular y suspende el peso del brazo de la clavícula a la escápula.',
    clinicalRelevance: 'Su lesión causa separación acromioclavicular (hombro separado), clasificada según el sistema de Rockwood.',
  },
  {
    id: 'glenohumeral_ligaments',
    name: 'Ligamentos Glenohumerales',
    category: 'ligaments',
    categoryLabel: 'Ligamentos',
    color: '#55aa55',
    description: 'Tres engrosamientos de la cápsula articular (superior, medio e inferior) que refuerzan la parte anterior de la articulación.',
    function: 'Proporcionan estabilidad estática anterior e inferior a la articulación glenohumeral, especialmente en posiciones de abducción y rotación externa.',
    clinicalRelevance: 'La lesión del ligamento glenohumeral inferior es la más asociada a luxaciones anteriores del hombro.',
  },
  {
    id: 'joint_capsule',
    name: 'Cápsula Articular',
    category: 'other',
    categoryLabel: 'Otras Estructuras',
    color: '#99bbdd',
    description: 'Manguito fibroso que rodea completamente la articulación glenohumeral, insertándose en el borde glenoideo y el cuello anatómico del húmero.',
    function: 'Contiene el líquido sinovial, proporciona estabilidad pasiva y sirve como punto de inserción para los ligamentos glenohumerales.',
    clinicalRelevance: 'La capsulitis adhesiva (hombro congelado) implica engrosamiento y contractura de la cápsula limitando severamente el movimiento.',
  }
];

export const categoryColors: Record<string, string> = {
  bones: '#f5e6d3',
  muscles: '#d4544a',
  tendons: '#e8e8e8',
  ligaments: '#66aa66',
  bursae: '#ffdd44',
  other: '#99bbdd'
};

export const categoryLabels: Record<string, string> = {
  bones: 'Huesos',
  muscles: 'Músculos',
  tendons: 'Tendones',
  ligaments: 'Ligamentos',
  bursae: 'Bursas',
  other: 'Otras Estructuras'
};
