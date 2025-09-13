import type { UserProfile, NutrientTargets, ActivityLevel } from '../types';

export const ACTIVITY_LEVELS: ActivityLevel[] = [
  {
    id: 'sedentary',
    name: 'Sédentaire',
    pal: 1.2,
    description: 'Aucune activité physique ou travail de bureau'
  },
  {
    id: 'light',
    name: 'Faiblement actif',
    pal: 1.375,
    description: '1-3 séances légères par semaine'
  },
  {
    id: 'moderate',
    name: 'Modérément actif',
    pal: 1.55,
    description: '3-5 séances modérées par semaine'
  },
  {
    id: 'active',
    name: 'Actif',
    pal: 1.725,
    description: '6-7 séances intenses par semaine'
  },
  {
    id: 'very_active',
    name: 'Très actif',
    pal: 1.9,
    description: 'Plus de 7 séances + travail physique'
  }
];

export const OBJECTIVES = [
  {
    id: 'loss',
    name: 'Perte de poids',
    calorieDelta: -300,
    description: 'Déficit de 300 kcal/jour'
  },
  {
    id: 'maintain',
    name: 'Maintien',
    calorieDelta: 0,
    description: 'Maintenir le poids actuel'
  },
  {
    id: 'performance',
    name: 'Performance',
    calorieDelta: 200,
    description: 'Surplus de 200 kcal/jour'
  }
];

// Calcul du métabolisme de repos (formule de Mifflin-St Jeor)
export function calculateRMR(profile: UserProfile): number {
  if (profile.gender === 'F') {
    return 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  } else {
    return 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  }
}

// Calcul de la dépense énergétique totale quotidienne
export function calculateTDEE(profile: UserProfile): number {
  const rmr = calculateRMR(profile);
  let pal = profile.activityLevel.pal;
  
  // Réduction du PAL en mode repos
  if (profile.weekMode === 'rest') {
    const currentIndex = ACTIVITY_LEVELS.findIndex(level => level.id === profile.activityLevel.id);
    if (currentIndex > 0) {
      pal = ACTIVITY_LEVELS[currentIndex - 1].pal;
    }
  }
  
  return rmr * pal;
}

// Calcul de l'objectif calorique
export function calculateCalorieTarget(profile: UserProfile): number {
  const tdee = calculateTDEE(profile);
  return tdee + profile.objective.calorieDelta;
}

// Calcul des besoins en macronutriments
export function calculateNutrientTargets(profile: UserProfile): NutrientTargets {
  const calories = calculateCalorieTarget(profile);
  
  // Macronutriments selon les recommandations Nouchka Simic
  const carbohydrates = Math.max(5 * profile.weight, 3 * profile.weight); // g/kg/j
  const proteins = 1.6 * profile.weight; // g/kg/j (moyenne)
  const lipids = 1.2 * profile.weight; // g/kg/j (moyenne)
  const fibers = 30; // g/j (idéal)
  
  // Micronutriments adaptés selon l'âge/sexe
  const micronutrients = calculateMicronutrientTargets(profile);
  
  return {
    calories,
    proteins,
    carbohydrates,
    lipids,
    fibers,
    micronutrients
  };
}

function calculateMicronutrientTargets(profile: UserProfile) {
  const isFemale = profile.gender === 'F';
  const isOver55 = profile.age > 55;
  
  return {
    calcium: (isFemale && isOver55) ? 1200 : 1000, // mg
    iron: isFemale ? 16 : 11, // mg
    magnesium: isFemale ? 360 : 420, // mg
    potassium: 3500, // mg
    sodium: 1500, // mg
    phosphorus: 550, // mg
    zinc: 11, // mg
    selenium: 70, // µg
    iodine: 150, // µg
    vitaminB1: 1.3, // mg
    vitaminB2: 1.65, // mg
    vitaminB3: 16.5, // mg
    vitaminB6: 1.85, // mg
    vitaminB9: 330, // µg
    vitaminB12: 4, // µg
    vitaminC: 110, // mg
    vitaminD: 7.5, // µg
    vitaminE: 12 // mg
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