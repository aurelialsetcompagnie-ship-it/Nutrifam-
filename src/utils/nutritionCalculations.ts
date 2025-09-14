import type { UserProfile, NutrientTargets, ActivityLevel } from '../types';

export const ACTIVITY_LEVELS: ActivityLevel[] = [
  {
    id: 'sedentary',
    name: 'Sédentaire (< 1,40)',
    pal: 1.3,
    description: 'Bureau, déplacements minimes, peu ou pas de sport'
  },
  {
    id: 'light',
    name: 'Peu actif (1,40 - 1,69)',
    pal: 1.5,
    description: 'Marche quotidienne, pas de sport régulier'
  },
  {
    id: 'moderate',
    name: 'Actif (1,70 - 1,99)',
    pal: 1.7,
    description: 'Activité modérée à intense (3-5 séances/semaine)'
  },
  {
    id: 'active',
    name: 'Très actif (2,00 - 2,40)',
    pal: 2.0,
    description: 'Entraînements fréquents, travail physique exigeant'
  }
];

// Coefficients macronutriments selon le niveau d'activité physique (NAP)
const MACRO_COEFFICIENTS = {
  sedentary: {
    carbohydrates: 3,    // g/kg
    proteins: 1.2,       // g/kg
    lipids: 1.0          // g/kg
  },
  light: {
    carbohydrates: 4.5,  // moyenne de 4-5 g/kg
    proteins: 1.5,       // g/kg
    lipids: 1.05         // moyenne de 1.0-1.1 g/kg
  },
  moderate: {
    carbohydrates: 6,    // g/kg
    proteins: 1.8,       // g/kg
    lipids: 1.2          // g/kg
  },
  active: {
    carbohydrates: 7.5,  // moyenne de 7-8 g/kg
    proteins: 2.0,       // g/kg
    lipids: 1.3          // g/kg
  }
};

export const OBJECTIVES = [
  {
    id: 'loss',
    name: 'Perte de poids',
    calorieDelta: -300,
    description: 'Déficit calorique personnalisable'
  },
  {
    id: 'maintain',
    name: 'Maintien',
    calorieDelta: 0,
    description: 'Maintenir le poids actuel'
  },
  {
    id: 'gain',
    name: 'Prise de poids',
    calorieDelta: 200,
    description: 'Surplus calorique personnalisable'
  }
];

// Calcul du métabolisme de base (formule de Harris-Benedict)
export function calculateRMR(profile: UserProfile): number {
  if (profile.gender === 'F') {
    // Formule femme Harris-Benedict: 447,593 + (9,247 × poids) + (3,098 × taille) - (4,330 × âge)
    return 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
  } else {
    // Formule homme Harris-Benedict: 88,362 + (13,397 × poids) + (4,799 × taille) - (5,677 × âge)
    return 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
  }
}

// Calcul de la dépense énergétique totale quotidienne (DET = MB × NAP)
export function calculateTDEE(profile: UserProfile): number {
  const mb = calculateRMR(profile);
  let nap = profile.activityLevel.pal;
  
  // Réduction du NAP en mode repos
  if (profile.weekMode === 'rest') {
    const currentIndex = ACTIVITY_LEVELS.findIndex(level => level.id === profile.activityLevel.id);
    if (currentIndex > 0) {
      nap = ACTIVITY_LEVELS[currentIndex - 1].pal;
    }
  }
  
  return mb * nap;
}

// Calcul de l'objectif calorique
export function calculateCalorieTarget(profile: UserProfile): number {
  const tdee = calculateTDEE(profile);
  
  // Utiliser les calories personnalisées si définies
  if (profile.customCalorieDelta !== undefined) {
    if (profile.objective.id === 'loss') {
      return tdee - profile.customCalorieDelta;
    } else if (profile.objective.id === 'gain') {
      return tdee + profile.customCalorieDelta;
    }
  }
  
  return tdee + profile.objective.calorieDelta;
}

// Calcul des besoins en macronutriments
export function calculateNutrientTargets(profile: UserProfile): NutrientTargets {
  const weight = profile.weight;
  const activityId = profile.activityLevel.id as keyof typeof MACRO_COEFFICIENTS;
  const coeffs = MACRO_COEFFICIENTS[activityId];
  
  // Ajustements selon l'objectif
  let carbMultiplier = 1;
  let proteinMultiplier = 1;
  let lipidMultiplier = 1;
  
  if (profile.objective.id === 'loss') {
    carbMultiplier = 0.8;    // -20% glucides
    proteinMultiplier = 1.25; // +25% protéines
  } else if (profile.objective.id === 'gain') {
    carbMultiplier = 1.3;    // +30% glucides
  }
  
  // Calcul des macronutriments selon le tableau NAP fourni
  const carbohydrates = weight * coeffs.carbohydrates * carbMultiplier; // g/j
  const proteins = weight * coeffs.proteins * proteinMultiplier; // g/j
  const lipids = weight * coeffs.lipids * lipidMultiplier; // g/j
  
  // Calcul des calories selon Harris-Benedict + NAP
  const calories = calculateCalorieTarget(profile);
  
  const fibers = 30; // g/j (idéal)
  
  // Micronutriments adaptés selon l'âge/sexe
  const micronutrients = calculateMicronutrientTargets(profile, calories);
  
  return {
    calories,
    proteins,
    carbohydrates,
    lipids,
    fibers,
    micronutrients
  };
}

function calculateMicronutrientTargets(profile: UserProfile, calories: number) {
  const isFemale = profile.gender === 'F';
  const isYoung = profile.age <= 24;
  
  return {
    // Minéraux selon les données fournies
    calcium: isYoung ? 1000 : 950, // mg - 1000mg 18-24 ans, 950mg >25 ans
    iron: isFemale ? 16 : 11, // mg - Plus élevé pour les femmes (pertes menstruelles)
    magnesium: isFemale ? 300 : 380, // mg - Différencié homme/femme
    potassium: 3500, // mg - Identique pour tous
    sodium: 1500, // mg - Identique pour tous (hors activité physique)
    phosphorus: 550, // mg - Identique pour tous
    zinc: isFemale ? 9 : 12, // mg - 7,5-11mg femmes, 9,4-14mg hommes (moyenne)
    selenium: 70, // µg - Identique pour tous
    iodine: 150, // µg - Identique pour tous
    
    // Oligo-éléments
    copper: isFemale ? 1.5 : 1.9, // µg - Différencié homme/femme
    
    // Vitamines selon les données fournies
    vitaminA: isFemale ? 650 : 750, // µg - Différencié homme/femme
    vitaminD: 15, // µg - Identique pour tous
    vitaminE: isFemale ? 9 : 10, // mg - Différencié homme/femme
    vitaminK: 79, // µg - Identique pour tous
    vitaminC: 110, // mg - Identique pour tous
    
    // Vitamines B (calculées selon l'énergie consommée)
    vitaminB1: Math.max(1.1, (calories / 4184) * 0.1), // 0,1mg/MJ d'énergie
    vitaminB2: 1.6, // mg - Identique pour tous
    vitaminB3: Math.max(11, (calories / 4184) * 1.6), // 1,6mg EN/MJ d'énergie
    vitaminB6: isFemale ? 1.6 : 1.7, // mg - Différencié homme/femme
    vitaminB9: 330, // µg - Identique pour tous
    vitaminB12: 4 // µg - Identique pour tous
  };
}

// Calcul du pourcentage d'atteinte d'un objectif
export function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min((current / target) * 100, 150); // Cap à 150% pour l'affichage
}

// Vérification des carences et excès
export interface NutritionAlert {
  type: 'deficiency' | 'excess' | 'good';
  nutrient: string;
  message: string;
  suggestions: string[];
}

export function analyzeNutrition(current: any, targets: NutrientTargets): NutritionAlert[] {
  const alerts: NutritionAlert[] = [];
  
  // Vérification des protéines
  if (current.proteins < targets.proteins * 0.8) {
    alerts.push({
      type: 'deficiency',
      nutrient: 'Protéines',
      message: 'Apports en protéines insuffisants',
      suggestions: ['Œufs', 'Poulet', 'Poisson', 'Légumineuses', 'Tofu']
    });
  }
  
  // Vérification du fer
  if (current.iron < targets.micronutrients.iron * 0.7) {
    alerts.push({
      type: 'deficiency',
      nutrient: 'Fer',
      message: 'Risque de carence en fer',
      suggestions: ['Viande rouge', 'Épinards', 'Lentilles', 'Quinoa']
    });
  }
  
  // Vérification du calcium
  if (current.calcium < targets.micronutrients.calcium * 0.7) {
    alerts.push({
      type: 'deficiency',
      nutrient: 'Calcium',
      message: 'Apports en calcium insuffisants',
      suggestions: ['Produits laitiers', 'Amandes', 'Brocolis', 'Sardines']
    });
  }
  
  return alerts;
}

// Recommandations dynamiques selon le profil
export interface DynamicRecommendation {
  title: string;
  message: string;
  foods: string[];
  benefits: string;
  priority: 'high' | 'medium' | 'low';
  category: 'energy' | 'recovery' | 'immunity' | 'bones' | 'performance';
}

export function getDynamicRecommendations(profile: UserProfile, currentIntake?: any): DynamicRecommendation[] {
  const recommendations: DynamicRecommendation[] = [];
  const isFemale = profile.gender === 'F';
  const isActive = profile.activityLevel.pal >= 1.7;
  const isYoung = profile.age <= 30;

  // Recommandations spécifiques aux femmes
  if (isFemale) {
    recommendations.push({
      title: "Fer - Prévention de l'anémie",
      message: "Les femmes ont des besoins en fer plus élevés (16mg/j) en raison des pertes menstruelles",
      foods: ["Foie", "Viandes rouges", "Épinards", "Lentilles", "Quinoa", "Graines de citrouille"],
      benefits: "Transport de l'oxygène, prévention de la fatigue et des vertiges",
      priority: 'high',
      category: 'immunity'
    });

    recommendations.push({
      title: "Calcium - Santé osseuse féminine",
      message: "Prévention de l'ostéoporose, particulièrement importante chez les femmes",
      foods: ["Produits laitiers", "Amandes", "Brocolis", "Sardines", "Eaux riches en calcium"],
      benefits: "Solidité osseuse, contraction musculaire, prévention des fractures",
      priority: 'high',
      category: 'bones'
    });
  }

  // Recommandations pour les sportifs
  if (isActive) {
    recommendations.push({
      title: "Magnésium - Performance sportive",
      message: `Besoins augmentés pour les sportifs : ${isFemale ? '300' : '380'}mg/j`,
      foods: ["Chocolat noir", "Amandes", "Céréales complètes", "Mollusques", "Eau minérale"],
      benefits: "Prévention des crampes, fonction musculaire optimale, récupération",
      priority: 'high',
      category: 'performance'
    });

    recommendations.push({
      title: "Potassium - Équilibre hydrique",
      message: "Essentiel pour éviter les crampes et maintenir l'équilibre électrolytique",
      foods: ["Bananes", "Chocolat", "Légumes", "Produits laitiers", "Patates douces"],
      benefits: "Prévention des crampes, fonction cardiaque, récupération musculaire",
      priority: 'medium',
      category: 'performance'
    });

    recommendations.push({
      title: "Zinc - Récupération et immunité",
      message: `Crucial pour la réparation tissulaire : ${isFemale ? '9' : '12'}mg/j`,
      foods: ["Viande", "Fromage", "Légumineuses", "Fruits de mer", "Graines"],
      benefits: "Cicatrisation, immunité, récupération après l'effort",
      priority: 'medium',
      category: 'recovery'
    });
  }

  // Recommandations antioxydantes
  recommendations.push({
    title: "Vitamine C - Antioxydant puissant",
    message: "110mg/j pour lutter contre le stress oxydatif",
    foods: ["Cassis", "Agrumes", "Persil", "Poivron rouge", "Kiwi"],
    benefits: "Immunité, absorption du fer, synthèse du collagène",
    priority: 'medium',
    category: 'immunity'
  });

  recommendations.push({
    title: "Sélénium - Protection cellulaire",
    message: "70µg/j pour une protection antioxydante optimale",
    foods: ["Noix du Brésil", "Poissons", "Fruits de mer", "Œufs", "Viande"],
    benefits: "Protection contre le stress oxydatif, fonction thyroïdienne",
    priority: 'medium',
    category: 'immunity'
  });

  // Recommandations selon l'âge
  if (isYoung) {
    recommendations.push({
      title: "Calcium - Construction osseuse",
      message: "1000mg/j jusqu'à 24 ans pour optimiser le pic de masse osseuse",
      foods: ["Produits laitiers", "Légumes verts", "Amandes", "Sardines"],
      benefits: "Construction du squelette, prévention future de l'ostéoporose",
      priority: 'high',
      category: 'bones'
    });
  }

  // Recommandations énergétiques
  if (profile.objective.id === 'performance') {
    recommendations.push({
      title: "Vitamines B - Métabolisme énergétique",
      message: "Essentielles pour convertir les aliments en énergie",
      foods: ["Céréales complètes", "Viandes", "Œufs", "Légumineuses", "Levure de bière"],
      benefits: "Production d'énergie, fonction nerveuse, performance",
      priority: 'high',
      category: 'energy'
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

// Messages éducatifs rotatifs
export const EDUCATIONAL_TIPS = [
  {
    title: "💡 Le saviez-vous ?",
    message: "La vitamine C améliore l'absorption du fer non-hémique. Associez vos légumineuses avec des agrumes !",
    category: "absorption"
  },
  {
    title: "🦴 Astuce Calcium",
    message: "Les épinards contiennent du calcium, mais aussi des oxalates qui limitent son absorption. Variez vos sources !",
    category: "minerals"
  },
  {
    title: "💪 Performance",
    message: "Le magnésium prévient les crampes. Chocolat noir et amandes sont vos alliés !",
    category: "sports"
  },
  {
    title: "🧠 Mémoire",
    message: "Les oméga-3 du poisson gras protègent votre cerveau et améliorent la concentration.",
    category: "brain"
  },
  {
    title: "⚡ Énergie",
    message: "Les vitamines B transforment vos aliments en énergie. Privilégiez les céréales complètes !",
    category: "energy"
  },
  {
    title: "🛡️ Immunité",
    message: "Le zinc renforce vos défenses. Une poignée de graines de citrouille par jour suffit !",
    category: "immunity"
  },
  {
    title: "🩸 Fer",
    message: "Le fer des viandes (hémique) est mieux absorbé que celui des végétaux (non-hémique).",
    category: "absorption"
  },
  {
    title: "☀️ Vitamine D",
    message: "15 minutes de soleil par jour aident à synthétiser la vitamine D. Pensez à vous protéger !",
    category: "vitamins"
  }
];

export function getRandomEducationalTip(): typeof EDUCATIONAL_TIPS[0] {
  return EDUCATIONAL_TIPS[Math.floor(Math.random() * EDUCATIONAL_TIPS.length)];
}