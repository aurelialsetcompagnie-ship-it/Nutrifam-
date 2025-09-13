import React from 'react';
import { Zap, Dumbbell, Shield, Bone, Heart, Brain } from 'lucide-react';

export function SportsNutritionSuggestions() {
  const categories = [
    {
      title: "Récupération Musculaire",
      icon: <Dumbbell className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      foods: [
        {
          name: "Œufs",
          emoji: "🥚",
          benefit: "Protéines complètes avec tous les acides aminés essentiels",
          forEveryone: "Excellents pour la croissance et la réparation cellulaire"
        },
        {
          name: "Saumon",
          emoji: "🐟",
          benefit: "Protéines + Oméga-3 anti-inflammatoires",
          forEveryone: "Bon pour le cœur et le cerveau de toute la famille"
        },
        {
          name: "Quinoa",
          emoji: "🌾",
          benefit: "Protéines végétales complètes + glucides",
          forEveryone: "Alternative saine aux céréales raffinées"
        }
      ]
    },
    {
      title: "Énergie & Performance",
      icon: <Zap className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      foods: [
        {
          name: "Bananes",
          emoji: "🍌",
          benefit: "Glucides rapides + potassium contre les crampes",
          forEveryone: "Énergie naturelle pour tous, idéal au petit-déjeuner"
        },
        {
          name: "Patates douces",
          emoji: "🍠",
          benefit: "Glucides complexes à libération lente",
          forEveryone: "Satiété durable et vitamines pour toute la famille"
        },
        {
          name: "Avoine",
          emoji: "🥣",
          benefit: "Énergie progressive + fibres solubles",
          forEveryone: "Régule le cholestérol et la glycémie"
        }
      ]
    },
    {
      title: "Minéraux Essentiels",
      icon: <Bone className="w-6 h-6" />,
      color: "from-green-500 to-teal-500",
      foods: [
        {
          name: "Épinards",
          emoji: "🥬",
          benefit: "Fer + magnésium pour l'oxygénation musculaire",
          forEveryone: "Prévient l'anémie et renforce les os"
        },
        {
          name: "Amandes",
          emoji: "🥜",
          benefit: "Magnésium contre les crampes + vitamine E",
          forEveryone: "Bon gras et calcium pour os et cerveau"
        },
        {
          name: "Yaourt grec",
          emoji: "🥛",
          benefit: "Calcium + protéines + probiotiques",
          forEveryone: "Santé digestive et osseuse pour tous"
        }
      ]
    },
    {
      title: "Antioxydants & Récupération",
      icon: <Shield className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      foods: [
        {
          name: "Myrtilles",
          emoji: "🫐",
          benefit: "Antioxydants puissants contre l'inflammation",
          forEveryone: "Protège le cerveau et améliore la mémoire"
        },
        {
          name: "Cerises",
          emoji: "🍒",
          benefit: "Anti-inflammatoires naturels + mélatonine",
          forEveryone: "Améliore le sommeil de toute la famille"
        },
        {
          name: "Chocolat noir",
          emoji: "🍫",
          benefit: "Flavonoïdes + magnésium pour la performance",
          forEveryone: "Bon pour le moral et la circulation sanguine"
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Aliments Recommandés pour Tous
        </h2>
        <p className="text-gray-600">
          Conseils nutritionnels adaptés aux sportifs mais bénéfiques pour toute la famille
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className={`bg-gradient-to-r ${category.color} text-white p-4`}>
              <div className="flex items-center gap-3">
                {category.icon}
                <h3 className="text-lg font-semibold">{category.title}</h3>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {category.foods.map((food, foodIndex) => (
                <div key={foodIndex} className="border-l-4 border-gray-200 pl-4 hover:border-green-400 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{food.emoji}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">{food.name}</h4>
                      <div className="space-y-2">
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <div className="text-xs font-medium text-blue-700 mb-1">
                            💪 Pour les sportifs :
                          </div>
                          <div className="text-sm text-blue-800">{food.benefit}</div>
                        </div>
                        <div className="bg-green-50 p-2 rounded-lg">
                          <div className="text-xs font-medium text-green-700 mb-1">
                            👨‍👩‍👧‍👦 Pour toute la famille :
                          </div>
                          <div className="text-sm text-green-800">{food.forEveryone}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Conseils généraux */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Conseils Généraux</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">💧</span>
              <h4 className="font-medium">Hydratation</h4>
            </div>
            <p className="text-sm text-white/90">
              2-3L d'eau par jour, plus pendant l'effort. Essentiel pour tous.
            </p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⏰</span>
              <h4 className="font-medium">Timing</h4>
            </div>
            <p className="text-sm text-white/90">
              Mangez 2-3h avant l'effort, récupérez dans les 30min après.
            </p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🌈</span>
              <h4 className="font-medium">Variété</h4>
            </div>
            <p className="text-sm text-white/90">
              Variez les couleurs dans l'assiette pour tous les nutriments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}