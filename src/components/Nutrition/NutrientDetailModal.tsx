import React from 'react';
import { X, TrendingUp, Target, Lightbulb, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import type { FoodEntry, NutrientData } from '../../types';

interface NutrientDetailModalProps {
  nutrient: {
    name: string;
    key: keyof NutrientData;
    current: number;
    target: number;
    unit: string;
    color: string;
    icon: React.ReactNode;
  };
  todayEntries: FoodEntry[];
  onClose: () => void;
}

interface FoodContribution {
  foodName: string;
  quantity: number;
  contribution: number;
  percentage: number;
}

const NUTRIENT_SUGGESTIONS: { [key: string]: string[] } = {
  kcal: ['Avoine', 'Banane', 'Patate douce', 'Quinoa', 'Amandes'],
  proteins: ['Œufs', 'Saumon', 'Poulet', 'Tofu', 'Lentilles', 'Yaourt grec'],
  carbohydrates: ['Avoine', 'Quinoa', 'Patate douce', 'Banane', 'Riz complet'],
  lipids: ['Avocat', 'Amandes', 'Huile d\'olive', 'Saumon', 'Noix'],
  fibers: ['Brocolis', 'Pomme', 'Lentilles', 'Avoine', 'Épinards'],
  calcium: ['Yaourt grec', 'Fromage', 'Amandes', 'Brocolis', 'Sardines'],
  iron: ['Épinards', 'Viande rouge', 'Lentilles', 'Quinoa', 'Graines de citrouille'],
  magnesium: ['Amandes', 'Épinards', 'Avocat', 'Chocolat noir', 'Banane'],
  potassium: ['Banane', 'Patate douce', 'Épinards', 'Avocat', 'Saumon'],
  sodium: ['Sel', 'Fromage', 'Pain', 'Charcuterie', 'Olives'],
  phosphorus: ['Saumon', 'Yaourt grec', 'Amandes', 'Fromage', 'Œufs'],
  zinc: ['Viande rouge', 'Graines de citrouille', 'Huîtres', 'Quinoa', 'Amandes'],
  selenium: ['Noix du Brésil', 'Thon', 'Œufs', 'Champignons', 'Graines de tournesol'],
  iodine: ['Poissons de mer', 'Algues', 'Sel iodé', 'Produits laitiers', 'Œufs'],
  vitaminB1: ['Porc', 'Graines de tournesol', 'Légumineuses', 'Céréales complètes'],
  vitaminB2: ['Produits laitiers', 'Œufs', 'Épinards', 'Amandes', 'Champignons'],
  vitaminB3: ['Thon', 'Poulet', 'Champignons', 'Arachides', 'Avocat'],
  vitaminB6: ['Saumon', 'Banane', 'Poulet', 'Patate douce', 'Épinards'],
  vitaminB9: ['Épinards', 'Asperges', 'Lentilles', 'Avocat', 'Brocolis'],
  vitaminB12: ['Saumon', 'Viande rouge', 'Œufs', 'Produits laitiers', 'Nutritional yeast'],
  vitaminC: ['Orange', 'Kiwi', 'Poivron rouge', 'Brocolis', 'Fraises'],
  vitaminD: ['Saumon', 'Sardines', 'Œufs', 'Champignons', 'Exposition solaire'],
  vitaminE: ['Amandes', 'Graines de tournesol', 'Avocat', 'Épinards', 'Huile d\'olive']
};

const NUTRIENT_BENEFITS: { [key: string]: string } = {
  kcal: 'Énergie pour toutes les fonctions corporelles et l\'activité physique',
  proteins: 'Construction et réparation des muscles, enzymes et hormones',
  carbohydrates: 'Carburant principal du cerveau et des muscles',
  lipids: 'Absorption des vitamines, production d\'hormones, santé cellulaire',
  fibers: 'Santé digestive, régulation glycémique, satiété',
  calcium: 'Santé osseuse et dentaire, contraction musculaire',
  iron: 'Transport de l\'oxygène, prévention de l\'anémie',
  magnesium: 'Fonction musculaire, santé osseuse, métabolisme énergétique',
  potassium: 'Équilibre hydrique, fonction cardiaque, prévention des crampes',
  sodium: 'Équilibre hydrique, transmission nerveuse (attention aux excès)',
  phosphorus: 'Santé osseuse, stockage d\'énergie, fonction cellulaire',
  zinc: 'Système immunitaire, cicatrisation, métabolisme',
  selenium: 'Antioxydant puissant, fonction thyroïdienne',
  iodine: 'Fonction thyroïdienne, métabolisme',
  vitaminB1: 'Métabolisme énergétique, fonction nerveuse',
  vitaminB2: 'Métabolisme énergétique, santé de la peau',
  vitaminB3: 'Métabolisme énergétique, santé cardiovasculaire',
  vitaminB6: 'Métabolisme des protéines, fonction immunitaire',
  vitaminB9: 'Formation des globules rouges, développement cellulaire',
  vitaminB12: 'Formation des globules rouges, fonction nerveuse',
  vitaminC: 'Antioxydant, absorption du fer, système immunitaire',
  vitaminD: 'Absorption du calcium, santé osseuse, immunité',
  vitaminE: 'Antioxydant, protection cellulaire'
};

export function NutrientDetailModal({ nutrient, todayEntries, onClose }: NutrientDetailModalProps) {
  // Calculer les contributions de chaque aliment
  const foodContributions: FoodContribution[] = todayEntries
    .map(entry => {
      const factor = entry.quantity / 100;
      const contribution = (entry.nutritionalValues[nutrient.key] || 0) * factor;
      
      return {
        foodName: entry.foodName,
        quantity: entry.quantity,
        contribution,
        percentage: nutrient.current > 0 ? (contribution / nutrient.current) * 100 : 0
      };
    })
    .filter(item => item.contribution > 0)
    .sort((a, b) => b.contribution - a.contribution);

  const percentage = nutrient.target > 0 ? (nutrient.current / nutrient.target) * 100 : 0;
  const isDeficient = percentage < 80;
  const isExcessive = percentage > 120;
  const isOptimal = percentage >= 80 && percentage <= 120;
  
  const remaining = Math.max(0, nutrient.target - nutrient.current);
  const excess = Math.max(0, nutrient.current - nutrient.target);

  const suggestions = NUTRIENT_SUGGESTIONS[nutrient.key] || [];
  const benefit = NUTRIENT_BENEFITS[nutrient.key] || '';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          {/* En-tête */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${nutrient.color.replace('text-', 'bg-').replace('-600', '-100')} shadow-lg`}>
                <div className={`${nutrient.color} text-2xl`}>
                  {nutrient.icon}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{nutrient.name}</h2>
                <p className="text-gray-600">Détail nutritionnel du jour</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Statut actuel */}
          <div className={`p-6 rounded-2xl mb-6 ${
            isOptimal ? 'bg-green-50 border-2 border-green-200' :
            isDeficient ? 'bg-orange-50 border-2 border-orange-200' :
            'bg-red-50 border-2 border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {isOptimal && <CheckCircle className="w-6 h-6 text-green-600" />}
                {isDeficient && <AlertTriangle className="w-6 h-6 text-orange-600" />}
                {isExcessive && <AlertTriangle className="w-6 h-6 text-red-600" />}
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {Math.round(nutrient.current * 10) / 10} / {Math.round(nutrient.target * 10) / 10} {nutrient.unit}
                  </div>
                  <div className={`text-sm font-medium ${
                    isOptimal ? 'text-green-700' :
                    isDeficient ? 'text-orange-700' :
                    'text-red-700'
                  }`}>
                    {Math.round(percentage)}% de l'objectif
                  </div>
                </div>
              </div>
              <div className="text-right">
                {isOptimal && (
                  <div className="text-green-700 font-semibold">✅ Objectif atteint !</div>
                )}
                {isDeficient && (
                  <div className="text-orange-700 font-semibold">
                    📊 Manque {Math.round(remaining * 10) / 10} {nutrient.unit}
                  </div>
                )}
                {isExcessive && (
                  <div className="text-red-700 font-semibold">
                    ⚠️ Excès de {Math.round(excess * 10) / 10} {nutrient.unit}
                  </div>
                )}
              </div>
            </div>

            {/* Barre de progression */}
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-4 rounded-full transition-all duration-700 ${
                  isOptimal ? 'bg-gradient-to-r from-green-500 to-green-600' :
                  isDeficient ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                  'bg-gradient-to-r from-red-500 to-red-600'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Bénéfices */}
          {benefit && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-1">Pourquoi c'est important ?</h3>
                  <p className="text-blue-700 text-sm">{benefit}</p>
                </div>
              </div>
            </div>
          )}

          {/* Sources alimentaires du jour */}
          {foodContributions.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">Vos sources aujourd'hui</h3>
              </div>
              
              <div className="space-y-3">
                {foodContributions.map((food, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{food.foodName}</div>
                        <div className="text-sm text-gray-600">{Math.round(food.quantity)}g consommés</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-800">
                          {Math.round(food.contribution * 10) / 10} {nutrient.unit}
                        </div>
                        <div className="text-sm text-gray-600">
                          {Math.round(food.percentage)}% du total
                        </div>
                      </div>
                    </div>
                    
                    {/* Barre de contribution */}
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${nutrient.color.replace('text-', 'bg-').replace('-600', '-500')}`}
                        style={{ width: `${Math.min(food.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions d'amélioration */}
          {(isDeficient || foodContributions.length === 0) && suggestions.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  {isDeficient ? 'Aliments recommandés pour combler le déficit' : 'Aliments riches en ' + nutrient.name.toLowerCase()}
                </h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {suggestions.slice(0, 6).map((food, index) => (
                  <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center hover:bg-yellow-100 transition-colors">
                    <div className="font-medium text-yellow-800">{food}</div>
                  </div>
                ))}
              </div>
              
              {isDeficient && (
                <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <Target className="w-4 h-4" />
                    <span className="font-medium">
                      Conseil : Ajoutez {Math.round(remaining * 10) / 10} {nutrient.unit} pour atteindre votre objectif
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Conseils pour les excès */}
          {isExcessive && (
            <div className="mb-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-2 text-red-800 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">Attention à l'excès</span>
                </div>
                <p className="text-red-700 text-sm">
                  Vous avez dépassé l'objectif de {Math.round(excess * 10) / 10} {nutrient.unit}. 
                  {nutrient.key === 'sodium' && ' Réduisez le sel et les aliments transformés.'}
                  {nutrient.key === 'kcal' && ' Surveillez les portions pour maintenir votre objectif.'}
                </p>
              </div>
            </div>
          )}

          {/* Bouton fermer */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}