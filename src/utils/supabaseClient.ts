import { createClient } from '@supabase/supabase-js';
import type { Food, NutrientData } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY doivent être définis dans .env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour rechercher des aliments
export async function searchFoods(query: string): Promise<Food[]> {
  try {
    const { data, error } = await supabase
      .from('LISTE ALIMENTS')
      .select('*')
      .ilike('FOOD_LABEL', `%${query}%`)
      .limit(20);

    if (error) {
      console.error('Erreur lors de la recherche:', error);
      return [];
    }

    // Transformation des données Supabase vers notre format
    return (data || []).map(item => ({
      id: item.alim_code || item.ID,
      name: item.FOOD_LABEL || 'Aliment inconnu',
      category: item.alim_grp_nom_fr,
      nutritionalValues: {
        kcal: parseFloat(item.nrj_kcal) || 0,
        proteins: parseFloat(item.proteines_g) || 0,
        carbohydrates: parseFloat(item.glucides_g) || 0,
        lipids: parseFloat(item.lipides_g) || 0,
        fibers: parseFloat(item.fibres_g) || 0,
        calcium: parseFloat(item.calcium_mg) || 0,
        iron: parseFloat(item.fer_mg) || 0,
        magnesium: parseFloat(item.magnesium_mg) || 0,
        potassium: parseFloat(item.potassium_mg) || 0,
        sodium: parseFloat(item.sodium_mg) || 0,
        phosphorus: parseFloat(item.phosphore_mg) || 0,
        zinc: parseFloat(item.zinc_mg) || 0,
        selenium: parseFloat(item.selenium_mcg) || 0,
        iodine: parseFloat(item.iode_mcg) || 0,
        vitaminB1: parseFloat(item.vitamine_b1_mg) || 0,
        vitaminB2: parseFloat(item.vitamine_b2_mg) || 0,
        vitaminB3: parseFloat(item.vitamine_b3_mg) || 0,
        vitaminB6: parseFloat(item.vitamine_b6_mg) || 0,
        vitaminB9: parseFloat(item.vitamine_b9_mcg) || 0,
        vitaminB12: parseFloat(item.vitamine_b12_mcg) || 0,
        vitaminC: parseFloat(item.vitamine_c_mg) || 0,
        vitaminD: parseFloat(item.vitamine_d_mcg) || 0,
        vitaminE: parseFloat(item.vitamine_e_mg) || 0
      },
      per100g: true
    }));
  } catch (error) {
    console.error('Erreur de connexion à Supabase:', error);
    return [];
  }
}

// Fonction pour obtenir un aliment par ID
export async function getFoodById(id: string): Promise<Food | null> {
  try {
    const { data, error } = await supabase
      .from('LISTE ALIMENTS')
      .select('*')
      .eq('alim_code', id)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.alim_code || data.ID,
      name: data.FOOD_LABEL || 'Aliment inconnu',
      category: data.alim_grp_nom_fr,
      nutritionalValues: {
        kcal: parseFloat(data.nrj_kcal) || 0,
        proteins: parseFloat(data.proteines_g) || 0,
        carbohydrates: parseFloat(data.glucides_g) || 0,
        lipids: parseFloat(data.lipides_g) || 0,
        fibers: parseFloat(data.fibres_g) || 0,
        calcium: parseFloat(data.calcium_mg) || 0,
        iron: parseFloat(data.fer_mg) || 0,
        magnesium: parseFloat(data.magnesium_mg) || 0,
        potassium: parseFloat(data.potassium_mg) || 0,
        sodium: parseFloat(data.sodium_mg) || 0,
        phosphorus: parseFloat(data.phosphore_mg) || 0,
        zinc: parseFloat(data.zinc_mg) || 0,
        selenium: parseFloat(data.selenium_mcg) || 0,
        iodine: parseFloat(data.iode_mcg) || 0,
        vitaminB1: parseFloat(data.vitamine_b1_mg) || 0,
        vitaminB2: parseFloat(data.vitamine_b2_mg) || 0,
        vitaminB3: parseFloat(data.vitamine_b3_mg) || 0,
        vitaminB6: parseFloat(data.vitamine_b6_mg) || 0,
        vitaminB9: parseFloat(data.vitamine_b9_mcg) || 0,
        vitaminB12: parseFloat(data.vitamine_b12_mcg) || 0,
        vitaminC: parseFloat(data.vitamine_c_mg) || 0,
        vitaminD: parseFloat(data.vitamine_d_mcg) || 0,
        vitaminE: parseFloat(data.vitamine_e_mg) || 0
      },
      per100g: true
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'aliment:', error);
    return null;
  }
}

// Fonction pour obtenir des suggestions d'aliments sportifs
export function getSportsNutritionSuggestions(deficiency: string): string[] {
  const suggestions: { [key: string]: string[] } = {
    proteins: ['Blanc de poulet', 'Saumon', 'Œufs', 'Tofu', 'Lentilles', 'Quinoa'],
    iron: ['Viande rouge maigre', 'Épinards', 'Lentilles', 'Quinoa', 'Graines de citrouille'],
    calcium: ['Yaourt grec', 'Fromage blanc', 'Amandes', 'Brocolis', 'Sardines'],
    magnesium: ['Amandes', 'Épinards', 'Avocat', 'Banane', 'Chocolat noir'],
    potassium: ['Banane', 'Patate douce', 'Épinards', 'Avocat', 'Saumon'],
    vitaminC: ['Orange', 'Kiwi', 'Poivron rouge', 'Brocolis', 'Fraises']
  };
  
  return suggestions[deficiency] || [];
}

// Fonction pour ajouter un nouvel aliment personnalisé
export async function addCustomFood(foodData: {
  name: string;
  category?: string;
  nutritionalValues: NutrientData;
}): Promise<boolean> {
  try {
    // Générer un ID numérique unique pour l'aliment (bigint compatible)
    const customId = Date.now();
    
    const { error } = await supabase
      .from('LISTE ALIMENTS')
      .insert([{
        ID: customId,
        alim_code: customId,
        FOOD_LABEL: foodData.name,
        alim_grp_nom_fr: foodData.category || 'Personnalisé',
        nrj_kcal: parseFloat(foodData.nutritionalValues.kcal) || null,
        proteines_g: parseFloat(foodData.nutritionalValues.proteins) || null,
        glucides_g: parseFloat(foodData.nutritionalValues.carbohydrates) || null,
        lipides_g: parseFloat(foodData.nutritionalValues.lipids) || null,
        fibres_g: parseFloat(foodData.nutritionalValues.fibers) || null,
        calcium_mg: parseFloat(foodData.nutritionalValues.calcium) || null,
        fer_mg: parseFloat(foodData.nutritionalValues.iron) || null,
        magnesium_mg: parseFloat(foodData.nutritionalValues.magnesium) || null,
        potassium_mg: parseFloat(foodData.nutritionalValues.potassium) || null,
        sodium_mg: parseFloat(foodData.nutritionalValues.sodium) || null,
        phosphore_mg: parseFloat(foodData.nutritionalValues.phosphorus) || null,
        zinc_mg: parseFloat(foodData.nutritionalValues.zinc) || null,
        selenium_mcg: parseFloat(foodData.nutritionalValues.selenium) || null,
        iode_mcg: parseFloat(foodData.nutritionalValues.iodine) || null,
        vitamine_b1_mg: parseFloat(foodData.nutritionalValues.vitaminB1) || null,
        vitamine_b2_mg: parseFloat(foodData.nutritionalValues.vitaminB2) || null,
        vitamine_b3_mg: parseFloat(foodData.nutritionalValues.vitaminB3) || null,
        vitamine_b6_mg: parseFloat(foodData.nutritionalValues.vitaminB6) || null,
        vitamine_b9_mcg: parseFloat(foodData.nutritionalValues.vitaminB9) || null,
        vitamine_b12_mcg: parseFloat(foodData.nutritionalValues.vitaminB12) || null,
        vitamine_c_mg: parseFloat(foodData.nutritionalValues.vitaminC) || null,
        vitamine_d_mcg: parseFloat(foodData.nutritionalValues.vitaminD) || null,
        vitamine_e_mg: parseFloat(foodData.nutritionalValues.vitaminE) || null
      }]);

    if (error) {
      console.error('Erreur lors de l\'ajout de l\'aliment:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'aliment:', error);
    return false;
  }
}

// Fonction pour rechercher par catégorie
export async function searchFoodsByCategory(category: string): Promise<Food[]> {
  try {
    const { data, error } = await supabase
      .from('LISTE ALIMENTS')
      .select('*')
      .ilike('alim_grp_nom_fr', `%${category}%`)
      .limit(50);

    if (error) {
      console.error('Erreur lors de la recherche par catégorie:', error);
      return [];
    }

    return (data || []).map(item => ({
      id: item.alim_code || item.ID,
      name: item.FOOD_LABEL || 'Aliment inconnu',
      category: item.alim_grp_nom_fr,
      nutritionalValues: {
        kcal: parseFloat(item.nrj_kcal) || 0,
        proteins: parseFloat(item.proteines_g) || 0,
        carbohydrates: parseFloat(item.glucides_g) || 0,
        lipids: parseFloat(item.lipides_g) || 0,
        fibers: parseFloat(item.fibres_g) || 0,
        calcium: parseFloat(item.calcium_mg) || 0,
        iron: parseFloat(item.fer_mg) || 0,
        magnesium: parseFloat(item.magnesium_mg) || 0,
        potassium: parseFloat(item.potassium_mg) || 0,
        sodium: parseFloat(item.sodium_mg) || 0,
        phosphorus: parseFloat(item.phosphore_mg) || 0,
        zinc: parseFloat(item.zinc_mg) || 0,
        selenium: parseFloat(item.selenium_mcg) || 0,
        iodine: parseFloat(item.iode_mcg) || 0,
        vitaminB1: parseFloat(item.vitamine_b1_mg) || 0,
        vitaminB2: parseFloat(item.vitamine_b2_mg) || 0,
        vitaminB3: parseFloat(item.vitamine_b3_mg) || 0,
        vitaminB6: parseFloat(item.vitamine_b6_mg) || 0,
        vitaminB9: parseFloat(item.vitamine_b9_mcg) || 0,
        vitaminB12: parseFloat(item.vitamine_b12_mcg) || 0,
        vitaminC: parseFloat(item.vitamine_c_mg) || 0,
        vitaminD: parseFloat(item.vitamine_d_mcg) || 0,
        vitaminE: parseFloat(item.vitamine_e_mg) || 0
      },
      per100g: true
    }));
  } catch (error) {
    console.error('Erreur de connexion à Supabase:', error);
    return [];
  }
}