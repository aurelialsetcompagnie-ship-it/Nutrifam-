import React from 'react';
import { Zap, Dumbbell, Shield, Bone, Heart, Brain } from 'lucide-react';

// Rotation des recommandations alimentaires par jour
const FOOD_RECOMMENDATIONS_BY_DAY = [
  // Lundi - Focus Énergie
  {
    theme: "Énergie & Vitalité",
    categories: [
      {
        title: "Carburant Matinal",
        icon: <Zap className="w-6 h-6" />,
        color: "from-yellow-500 to-orange-500",
        foods: [
          {
            name: "Flocons d'avoine",
            emoji: "🥣",
            benefit: "Énergie progressive + fibres bêta-glucanes",
            forEveryone: "Régule le cholestérol et stabilise la glycémie"
          },
          {
            name: "Miel",
            emoji: "🍯",
            benefit: "Glucides rapides naturels + antioxydants",
            forEveryone: "Édulcorant naturel riche en enzymes"
          },
          {
            name: "Bananes",
            emoji: "🍌",
            benefit: "Potassium + glucides facilement digestibles",
            forEveryone: "Prévient les crampes et booste le moral"
          }
        ]
      },
      {
        title: "Hydratation Active",
        icon: <Heart className="w-6 h-6" />,
        color: "from-blue-500 to-cyan-500",
        foods: [
          {
            name: "Eau de coco",
            emoji: "🥥",
            benefit: "Électrolytes naturels pour la récupération",
            forEveryone: "Hydratation optimale sans sucres ajoutés"
          },
          {
            name: "Pastèque",
            emoji: "🍉",
            benefit: "92% d'eau + lycopène antioxydant",
            forEveryone: "Rafraîchissante et peu calorique"
          },
          {
            name: "Concombre",
            emoji: "🥒",
            benefit: "Hydratation + minéraux essentiels",
            forEveryone: "Détoxifiant naturel et rafraîchissant"
          }
        ]
      }
    ]
  },
  // Mardi - Focus Récupération
  {
    theme: "Récupération & Réparation",
    categories: [
      {
        title: "Protéines Complètes",
        icon: <Dumbbell className="w-6 h-6" />,
        color: "from-purple-500 to-pink-500",
        foods: [
          {
            name: "Saumon",
            emoji: "🐟",
            benefit: "Protéines + Oméga-3 anti-inflammatoires",
            forEveryone: "Excellent pour le cerveau et le cœur"
          },
          {
            name: "Quinoa",
            emoji: "🌾",
            benefit: "Protéines végétales complètes + magnésium",
            forEveryone: "Alternative sans gluten aux céréales"
          },
          {
            name: "Œufs bio",
            emoji: "🥚",
            benefit: "Tous les acides aminés essentiels",
            forEveryone: "Source de choline pour la mémoire"
          }
        ]
      },
      {
        title: "Anti-inflammatoires",
        icon: <Shield className="w-6 h-6" />,
        color: "from-green-500 to-teal-500",
        foods: [
          {
            name: "Curcuma",
            emoji: "🧡",
            benefit: "Curcumine puissamment anti-inflammatoire",
            forEveryone: "Protège les articulations et le foie"
          },
          {
            name: "Cerises",
            emoji: "🍒",
            benefit: "Anthocyanes + mélatonine naturelle",
            forEveryone: "Améliore le sommeil et réduit l'inflammation"
          },
          {
            name: "Épinards",
            emoji: "🥬",
            benefit: "Nitrates pour l'oxygénation musculaire",
            forEveryone: "Fer, folates et antioxydants"
          }
        ]
      }
    ]
  },
  // Mercredi - Focus Minéraux
  {
    theme: "Minéraux & Oligo-éléments",
    categories: [
      {
        title: "Calcium & Magnésium",
        icon: <Bone className="w-6 h-6" />,
        color: "from-indigo-500 to-purple-500",
        foods: [
          {
            name: "Amandes",
            emoji: "🥜",
            benefit: "Magnésium contre les crampes + vitamine E",
            forEveryone: "Bons gras et calcium pour tous"
          },
          {
            name: "Sardines",
            emoji: "🐟",
            benefit: "Calcium biodisponible + Oméga-3",
            forEveryone: "Petits poissons, grands bénéfices"
          },
          {
            name: "Graines de sésame",
            emoji: "🌰",
            benefit: "Calcium végétal + lignanes protecteurs",
            forEveryone: "Parfait en tahin ou sur les salades"
          }
        ]
      },
      {
        title: "Fer & Zinc",
        icon: <Shield className="w-6 h-6" />,
        color: "from-red-500 to-orange-500",
        foods: [
          {
            name: "Lentilles",
            emoji: "🫘",
            benefit: "Fer végétal + protéines + fibres",
            forEveryone: "Économique et nutritif pour tous"
          },
          {
            name: "Graines de citrouille",
            emoji: "🎃",
            benefit: "Zinc pour l'immunité + magnésium",
            forEveryone: "Collation saine et croquante"
          },
          {
            name: "Bœuf maigre",
            emoji: "🥩",
            benefit: "Fer hémique facilement absorbé",
            forEveryone: "Protéines de qualité et vitamine B12"
          }
        ]
      }
    ]
  },
  // Jeudi - Focus Antioxydants
  {
    theme: "Antioxydants & Protection",
    categories: [
      {
        title: "Baies & Fruits Rouges",
        icon: <Heart className="w-6 h-6" />,
        color: "from-pink-500 to-red-500",
        foods: [
          {
            name: "Myrtilles",
            emoji: "🫐",
            benefit: "Anthocyanes pour la récupération musculaire",
            forEveryone: "Protège la mémoire et la vue"
          },
          {
            name: "Framboises",
            emoji: "🍇",
            benefit: "Vitamine C + fibres + faible index glycémique",
            forEveryone: "Antioxydants puissants et peu sucrées"
          },
          {
            name: "Grenade",
            emoji: "🍎",
            benefit: "Polyphénols anti-inflammatoires",
            forEveryone: "Protège le système cardiovasculaire"
          }
        ]
      },
      {
        title: "Légumes Colorés",
        icon: <Shield className="w-6 h-6" />,
        color: "from-green-500 to-blue-500",
        foods: [
          {
            name: "Brocolis",
            emoji: "🥦",
            benefit: "Sulforaphane détoxifiant + vitamine K",
            forEveryone: "Prévention cancer et santé osseuse"
          },
          {
            name: "Poivrons rouges",
            emoji: "🌶️",
            benefit: "Plus de vitamine C que les oranges",
            forEveryone: "Boost immunitaire et collagène"
          },
          {
            name: "Betterave",
            emoji: "🍠",
            benefit: "Nitrates pour l'endurance + bétalaïnes",
            forEveryone: "Soutient la fonction hépatique"
          }
        ]
      }
    ]
  },
  // Vendredi - Focus Oméga-3
  {
    theme: "Oméga-3 & Bons Gras",
    categories: [
      {
        title: "Poissons Gras",
        icon: <Brain className="w-6 h-6" />,
        color: "from-blue-500 to-indigo-500",
        foods: [
          {
            name: "Maquereau",
            emoji: "🐟",
            benefit: "EPA/DHA pour la récupération",
            forEveryone: "Cerveau et cœur en pleine forme"
          },
          {
            name: "Anchois",
            emoji: "🐠",
            benefit: "Oméga-3 concentrés + faible mercure",
            forEveryone: "Petits poissons, grands bénéfices"
          },
          {
            name: "Thon albacore",
            emoji: "🍣",
            benefit: "Protéines maigres + DHA",
            forEveryone: "Pratique et riche en sélénium"
          }
        ]
      },
      {
        title: "Sources Végétales",
        icon: <Heart className="w-6 h-6" />,
        color: "from-green-500 to-emerald-500",
        foods: [
          {
            name: "Graines de lin",
            emoji: "🌰",
            benefit: "ALA (précurseur Oméga-3) + lignanes",
            forEveryone: "À moudre pour une meilleure absorption"
          },
          {
            name: "Noix",
            emoji: "🥜",
            benefit: "Oméga-3 végétaux + vitamine E",
            forEveryone: "Collation cerveau et anti-âge"
          },
          {
            name: "Avocat",
            emoji: "🥑",
            benefit: "Gras mono-insaturés + potassium",
            forEveryone: "Satiété et absorption des vitamines"
          }
        ]
      }
    ]
  },
  // Samedi - Focus Digestif
  {
    theme: "Santé Digestive & Fibres",
    categories: [
      {
        title: "Probiotiques Naturels",
        icon: <Heart className="w-6 h-6" />,
        color: "from-yellow-500 to-green-500",
        foods: [
          {
            name: "Kéfir",
            emoji: "🥛",
            benefit: "Probiotiques vivants + protéines",
            forEveryone: "Microbiote intestinal équilibré"
          },
          {
            name: "Choucroute",
            emoji: "🥬",
            benefit: "Lactobacilles + vitamine C + fibres",
            forEveryone: "Digestion optimale et immunité"
          },
          {
            name: "Miso",
            emoji: "🍜",
            benefit: "Enzymes digestives + probiotiques",
            forEveryone: "Umami naturel et santé intestinale"
          }
        ]
      },
      {
        title: "Fibres Prébiotiques",
        icon: <Shield className="w-6 h-6" />,
        color: "from-orange-500 to-red-500",
        foods: [
          {
            name: "Artichaut",
            emoji: "🌿",
            benefit: "Inuline pour nourrir les bonnes bactéries",
            forEveryone: "Détox hépatique et transit"
          },
          {
            name: "Pommes",
            emoji: "🍎",
            benefit: "Pectine + fibres solubles",
            forEveryone: "Régule le cholestérol et la glycémie"
          },
          {
            name: "Haricots noirs",
            emoji: "🫘",
            benefit: "Fibres + protéines + anthocyanes",
            forEveryone: "Satiété durable et antioxydants"
          }
        ]
      }
    ]
  },
  // Dimanche - Focus Détox
  {
    theme: "Détox & Régénération",
    categories: [
      {
        title: "Détoxifiants Naturels",
        icon: <Shield className="w-6 h-6" />,
        color: "from-green-500 to-teal-500",
        foods: [
          {
            name: "Citron",
            emoji: "🍋",
            benefit: "Vitamine C + limonène détoxifiant",
            forEveryone: "Stimule la digestion et l'hydratation"
          },
          {
            name: "Gingembre",
            emoji: "🫚",
            benefit: "Gingérol anti-inflammatoire + digestif",
            forEveryone: "Anti-nausée et boost immunitaire"
          },
          {
            name: "Thé vert",
            emoji: "🍵",
            benefit: "EGCG antioxydant + théanine relaxante",
            forEveryone: "Métabolisme et concentration"
          }
        ]
      },
      {
        title: "Légumes Verts",
        icon: <Heart className="w-6 h-6" />,
        color: "from-emerald-500 to-green-500",
        foods: [
          {
            name: "Roquette",
            emoji: "🥬",
            benefit: "Nitrates + glucosinolates détox",
            forEveryone: "Saveur piquante et vitamines K"
          },
          {
            name: "Persil",
            emoji: "🌿",
            benefit: "Chlorophylle + vitamine C concentrée",
            forEveryone: "Haleine fraîche et détox naturelle"
          },
          {
            name: "Céleri",
            emoji: "🥬",
            benefit: "Apigénine + potassium diurétique",
            forEveryone: "Hydratation et élimination des toxines"
          }
        ]
      }
    ]
  }
];

function getDayOfWeek() {
  return new Date().getDay(); // 0 = Dimanche, 1 = Lundi, etc.
}

function getTodaysRecommendations() {
  const dayIndex = getDayOfWeek();
  return FOOD_RECOMMENDATIONS_BY_DAY[dayIndex];
}

export function SportsNutritionSuggestions() {
  const todaysRecommendations = getTodaysRecommendations();
  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const today = dayNames[getDayOfWeek()];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Aliments du {today} - {todaysRecommendations.theme}
        </h2>
        <p className="text-gray-600">
          Sélection quotidienne d'aliments bénéfiques pour toute la famille
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {todaysRecommendations.categories.map((category, categoryIndex) => (
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
          <h3 className="text-lg font-semibold">Conseils du {today}</h3>
        </div>
        
        {getDaySpecificTips(getDayOfWeek())}
      </div>
    </div>
  );
}

function getDaySpecificTips(dayIndex: number) {
  const tips = [
    // Dimanche - Détox
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🌿</span>
          <h4 className="font-medium">Détox Douce</h4>
        </div>
        <p className="text-sm text-white/90">
          Commencez la semaine avec des aliments purifiants et beaucoup d'eau.
        </p>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🧘</span>
          <h4 className="font-medium">Préparation</h4>
        </div>
        <p className="text-sm text-white/90">
          Préparez vos repas de la semaine avec des légumes verts.
        </p>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">💚</span>
          <h4 className="font-medium">Vert Power</h4>
        </div>
        <p className="text-sm text-white/90">
          Misez sur les légumes verts riches en chlorophylle.
        </p>
      </div>
    </div>,
    // Lundi - Énergie
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">⚡</span>
          <h4 className="font-medium">Boost Matinal</h4>
        </div>
        <p className="text-sm text-white/90">
          Commencez fort avec des glucides complexes et des protéines.
        </p>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">💧</span>
          <h4 className="font-medium">Hydratation++</h4>
        </div>
        <p className="text-sm text-white/90">
          2-3L d'eau + électrolytes naturels pour une énergie optimale.
        </p>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🎯</span>
          <h4 className="font-medium">Régularité</h4>
        </div>
        <p className="text-sm text-white/90">
          Mangez toutes les 3-4h pour maintenir l'énergie stable.
        </p>
      </div>
    </div>,
    // Mardi - Récupération
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">💪</span>
          <h4 className="font-medium">Post-Effort</h4>
        </div>
        <p className="text-sm text-white/90">
          Protéines + glucides dans les 30min après l'entraînement.
        </p>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">😴</span>
          <h4 className="font-medium">Sommeil</h4>
        </div>
        <p className="text-sm text-white/90">
          Les cerises et le magnésium favorisent un sommeil réparateur.
        </p>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🔥</span>
          <h4 className="font-medium">Anti-inflammatoire</h4>
        </div>
        <p className="text-sm text-white/90">
          Curcuma, gingembre et oméga-3 réduisent l'inflammation.
        </p>
      </div>
    </div>,
    // Mercredi - Minéraux
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🦴</span>
          <h4 className="font-medium">Solidité</h4>
        </div>
        <p className="text-sm text-white/90">
          Calcium + vitamine D + magnésium = os et dents solides.
        </p>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">⚡</span>
          <h4 className="font-medium">Crampes</h4>
        </div>
        <p className="text-sm text-white/90">
          Magnésium et potassium préviennent les crampes musculaires.
        </p>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🩸</span>
          <h4 className="font-medium">Fer</h4>
        </div>
        <p className="text-sm text-white/90">
          Associez fer + vitamine C pour une meilleure absorption.
        </p>
      </div>
    </div>,
    // Jeudi - Antioxydants
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🌈</span>
          <h4 className="font-medium">Couleurs</h4>
        </div>
        <p className="text-sm text-white/90">
          Plus c'est coloré, plus c'est riche en antioxydants protecteurs.
        </p>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🧠</span>
          <h4 className="font-medium">Cerveau</h4>
        </div>
        <p className="text-sm text-white/90">
          Les baies protègent la mémoire et améliorent la concentration.
        </p>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🛡️</span>
          <h4 className="font-medium">Protection</h4>
        </div>
        <p className="text-sm text-white/90">
          Les antioxydants luttent contre le stress oxydatif du sport.
        </p>
      </div>
    </div>,
    // Vendredi - Oméga-3
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🐟</span>
          <h4 className="font-medium">Poissons Gras</h4>
        </div>
        <p className="text-sm text-white/90">
          2-3 portions par semaine pour les oméga-3 EPA et DHA.
        </p>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">❤️</span>
          <h4 className="font-medium">Cœur</h4>
        </div>
        <p className="text-sm text-white/90">
          Les oméga-3 protègent le système cardiovasculaire.
        </p>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🌱</span>
          <h4 className="font-medium">Végétal</h4>
        </div>
        <p className="text-sm text-white/90">
          Noix, graines de lin moulues pour les oméga-3 végétaux.
        </p>
      </div>
    </div>,
    // Samedi - Digestif
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🦠</span>
          <h4 className="font-medium">Microbiote</h4>
        </div>
        <p className="text-sm text-white/90">
          Probiotiques + prébiotiques = intestin en bonne santé.
        </p>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🌾</span>
          <h4 className="font-medium">Fibres</h4>
        </div>
        <p className="text-sm text-white/90">
          25-30g de fibres par jour pour un transit optimal.
        </p>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🥗</span>
          <h4 className="font-medium">Fermentés</h4>
        </div>
        <p className="text-sm text-white/90">
          Kéfir, choucroute, miso nourrissent les bonnes bactéries.
        </p>
      </div>
    </div>
  ];

  return tips[dayIndex];
}