export interface NutrientData {
  kcal: number;
  proteins: number;
  carbohydrates: number;
  lipids: number;
  fibers: number;
  calcium?: number;
  iron?: number;
  magnesium?: number;
  potassium?: number;
  sodium?: number;
  phosphorus?: number;
  zinc?: number;
  selenium?: number;
  iodine?: number;
  vitaminB1?: number;
  vitaminB2?: number;
  vitaminB3?: number;
  vitaminB6?: number;
  vitaminB9?: number;
  vitaminB12?: number;
  vitaminC?: number;
  vitaminD?: number;
  vitaminE?: number;
}

export interface Food {
  id: string;
  name: string;
  category?: string;
  nutritionalValues: NutrientData;
  per100g: boolean;
}

export interface ActivityLevel {
  id: string;
  name: string;
  pal: number;
  description: string;
}

export interface Objective {
  id: string;
  name: string;
  calorieDelta: number;
  description: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  gender: 'M' | 'F';
  age: number;
  height: number; // cm
  weight: number; // kg
  activityLevel: ActivityLevel;
  objective: Objective;
  customCalorieDelta?: number; // Calories personnalisées pour perte/prise
  weekMode: 'normal' | 'rest';
  createdAt: Date;
  avatar: string;
}

export interface NutrientTargets {
  calories: number;
  proteins: number; // g
  carbohydrates: number; // g
  lipids: number; // g
  fibers: number; // g
  micronutrients: {
    calcium: number;
    iron: number;
    magnesium: number;
    potassium: number;
    sodium: number;
    phosphorus: number;
    zinc: number;
    selenium: number;
    iodine: number;
    copper: number;
    vitaminA: number;
    vitaminB1: number;
    vitaminB2: number;
    vitaminB3: number;
    vitaminB6: number;
    vitaminB9: number;
    vitaminB12: number;
    vitaminC: number;
    vitaminD: number;
    vitaminE: number;
    vitaminK: number;
  };
}

export interface FoodEntry {
  id: string;
  foodId: string;
  foodName: string;
  quantity: number; // grams
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  nutritionalValues: NutrientData;
  date: Date;
  userId: string;
}

export interface MealPlan {
  id: string;
  userId?: string; // Optional pour les plans familiaux
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  foods: Array<{
    foodId: string;
    foodName: string;
    quantity: number;
    nutritionalValues: NutrientData;
  }>;
  isTemplate: boolean; // true pour les plans familiaux partagés
  isFamilyPlan?: boolean; // true si c'est un plan familial
}

export interface DailyIntake {
  date: Date;
  userId: string;
  totalNutrients: NutrientData;
  entries: FoodEntry[];
  targets: NutrientTargets;
}

export interface ShoppingItem {
  foodId: string;
  foodName: string;
  totalQuantity: number;
  unit: string;
  category?: string;
}