import React, { useState, useEffect } from 'react';
import { Search, Edit3, Trash2, X, Save, Plus } from 'lucide-react';
import { searchFoods, addCustomFood, supabase } from '../../utils/supabaseClient';
import type { Food, NutrientData } from '../../types';

interface FoodManagementModalProps {
  onClose: () => void;
}

const FOOD_CATEGORIES = [
  'Viandes et volailles',
  'Poissons et fruits de mer',
  'Œufs et produits laitiers',
  'Légumes',
  'Fruits',
  'Céréales et féculents',
  'Légumineuses',
  'Noix et graines',
  'Huiles et matières grasses',
  'Boissons',
  'Produits sucrés',
  'Plats préparés',
  'Compléments alimentaires',
  'Personnalisé',
  'Autres'
];

export function FoodManagementModal({ onClose }: FoodManagementModalProps) {
  const [foods, setFoods] = useState<Food[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Charger tous les aliments au démarrage
  useEffect(() => {
    loadAllFoods();
  }, []);

  // Filtrer les aliments selon la recherche
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFoods(foods);
    } else {
      const filtered = foods.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (food.category && food.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredFoods(filtered);
    }
  }, [searchQuery, foods]);

  const loadAllFoods = async () => {
    setLoading(true);
    try {
      // Charger tous les aliments personnalisés d'abord
      const results = await searchFoods('a'); // Recherche large pour avoir plus de résultats
      setFoods(results);
    } catch (error) {
      console.error('Erreur lors du chargement des aliments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim().length < 1) return;
    
    setLoading(true);
    try {
      const results = await searchFoods(searchQuery);
      setFoods(results);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditFood = (food: Food) => {
    // Vérifier si c'est un aliment personnalisé (ID numérique long)
    const isCustomFood = food.id.toString().length > 10;
    if (isCustomFood) {
      setEditingFood(food);
    } else {
      alert('Seuls les aliments personnalisés peuvent être modifiés');
    }
  };

  const handleSaveFood = async (updatedFood: Food) => {
    // Recharger la liste des aliments après modification
    await loadAllFoods();
    setEditingFood(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* En-tête */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Gestion des Aliments</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Barre de recherche et actions */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Rechercher un aliment..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Rechercher
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Créer
            </button>
          </div>
        </div>

        {/* Liste des aliments */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-600">Chargement des aliments...</div>
            </div>
          ) : filteredFoods.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucun aliment trouvé</h3>
              <p className="text-gray-600">Essayez une autre recherche ou créez un nouvel aliment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFoods.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  onEdit={() => handleEditFood(food)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Formulaires modaux */}
        {editingFood && (
          <FoodEditModal
            food={editingFood}
            onSave={handleSaveFood}
            onCancel={() => setEditingFood(null)}
          />
        )}

        {showCreateForm && (
          <FoodCreateModal
            onClose={() => setShowCreateForm(false)}
            onFoodCreated={() => {
              setShowCreateForm(false);
              loadAllFoods();
            }}
          />
        )}
      </div>
    </div>
  );
}

interface FoodCardProps {
  food: Food;
  onEdit: () => void;
}

function FoodCard({ food, onEdit }: FoodCardProps) {
  const isCustomFood = food.id.toString().length > 10; // Les aliments personnalisés ont des IDs timestamp

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1">{food.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">{food.category}</span>
            {isCustomFood && (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                Personnalisé
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onEdit}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Edit3 className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Calories:</span>
          <span className="font-medium">{Math.round(food.nutritionalValues.kcal)} kcal</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Protéines:</span>
          <span className="font-medium">{Math.round(food.nutritionalValues.proteins * 10) / 10}g</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Glucides:</span>
          <span className="font-medium">{Math.round(food.nutritionalValues.carbohydrates * 10) / 10}g</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Lipides:</span>
          <span className="font-medium">{Math.round(food.nutritionalValues.lipids * 10) / 10}g</span>
        </div>
      </div>
    </div>
  );
}

interface FoodEditModalProps {
  food: Food;
  onSave: (food: Food) => void;
  onCancel: () => void;
}

function FoodEditModal({ food, onSave, onCancel }: FoodEditModalProps) {
  const [formData, setFormData] = useState({
    name: food.name,
    category: food.category || 'Personnalisé',
    // Macronutriments
    kcal: food.nutritionalValues.kcal || 0,
    proteins: food.nutritionalValues.proteins || 0,
    carbohydrates: food.nutritionalValues.carbohydrates || 0,
    lipids: food.nutritionalValues.lipids || 0,
    fibers: food.nutritionalValues.fibers || 0,
    // Minéraux
    calcium: food.nutritionalValues.calcium || 0,
    iron: food.nutritionalValues.iron || 0,
    magnesium: food.nutritionalValues.magnesium || 0,
    potassium: food.nutritionalValues.potassium || 0,
    sodium: food.nutritionalValues.sodium || 0,
    phosphorus: food.nutritionalValues.phosphorus || 0,
    zinc: food.nutritionalValues.zinc || 0,
    selenium: food.nutritionalValues.selenium || 0,
    iodine: food.nutritionalValues.iodine || 0,
    // Vitamines
    vitaminB1: food.nutritionalValues.vitaminB1 || 0,
    vitaminB2: food.nutritionalValues.vitaminB2 || 0,
    vitaminB3: food.nutritionalValues.vitaminB3 || 0,
    vitaminB6: food.nutritionalValues.vitaminB6 || 0,
    vitaminB9: food.nutritionalValues.vitaminB9 || 0,
    vitaminB12: food.nutritionalValues.vitaminB12 || 0,
    vitaminC: food.nutritionalValues.vitaminC || 0,
    vitaminD: food.nutritionalValues.vitaminD || 0,
    vitaminE: food.nutritionalValues.vitaminE || 0
  });

  const [loading, setLoading] = useState(false);

  const handleDecimalChange = (field: string, inputValue: string) => {
    const normalizedValue = inputValue.replace(',', '.');
    const numericValue = parseFloat(normalizedValue) || 0;
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(0, numericValue)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mettre à jour l'aliment dans Supabase
      const { error } = await supabase
        .from('LISTE ALIMENTS')
        .update({
          FOOD_LABEL: formData.name,
          alim_grp_nom_fr: formData.category,
          nrj_kcal: formData.kcal,
          proteines_g: formData.proteins,
          glucides_g: formData.carbohydrates,
          lipides_g: formData.lipids,
          fibres_g: formData.fibers,
          calcium_mg: formData.calcium,
          fer_mg: formData.iron,
          magnesium_mg: formData.magnesium,
          potassium_mg: formData.potassium,
          sodium_mg: formData.sodium,
          phosphore_mg: formData.phosphorus,
          zinc_mg: formData.zinc,
          selenium_mcg: formData.selenium,
          iode_mcg: formData.iodine,
          vitamine_b1_mg: formData.vitaminB1,
          vitamine_b2_mg: formData.vitaminB2,
          vitamine_b3_mg: formData.vitaminB3,
          vitamine_b6_mg: formData.vitaminB6,
          vitamine_b9_mcg: formData.vitaminB9,
          vitamine_b12_mcg: formData.vitaminB12,
          vitamine_c_mg: formData.vitaminC,
          vitamine_d_mcg: formData.vitaminD,
          vitamine_e_mg: formData.vitaminE
        })
        .eq('alim_code', food.id);

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        alert('❌ Erreur lors de la sauvegarde');
      } else {
        alert('✅ Aliment modifié avec succès !');
        // Créer l'objet food mis à jour
        const updatedFood: Food = {
          ...food,
          name: formData.name,
          category: formData.category,
          nutritionalValues: {
            kcal: formData.kcal,
            proteins: formData.proteins,
            carbohydrates: formData.carbohydrates,
            lipids: formData.lipids,
            fibers: formData.fibers,
            calcium: formData.calcium,
            iron: formData.iron,
            magnesium: formData.magnesium,
            potassium: formData.potassium,
            sodium: formData.sodium,
            phosphorus: formData.phosphorus,
            zinc: formData.zinc,
            selenium: formData.selenium,
            iodine: formData.iodine,
            vitaminB1: formData.vitaminB1,
            vitaminB2: formData.vitaminB2,
            vitaminB3: formData.vitaminB3,
            vitaminB6: formData.vitaminB6,
            vitaminB9: formData.vitaminB9,
            vitaminB12: formData.vitaminB12,
            vitaminC: formData.vitaminC,
            vitaminD: formData.vitaminD,
            vitaminE: formData.vitaminE
          }
        };
        onSave(updatedFood);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur technique lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-60">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Modifier "{food.name}"</h3>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de base */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">Informations générales</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'aliment
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {FOOD_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Macronutriments */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">
                Macronutriments (pour 100g)
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { key: 'kcal', label: 'Calories (kcal)' },
                  { key: 'proteins', label: 'Protéines (g)' },
                  { key: 'carbohydrates', label: 'Glucides (g)' },
                  { key: 'lipids', label: 'Lipides (g)' },
                  { key: 'fibers', label: 'Fibres (g)' }
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData[key as keyof typeof formData] as number}
                      onChange={(e) => handleDecimalChange(key, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: 8,62"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Minéraux */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">Minéraux</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { key: 'calcium', label: 'Calcium (mg)' },
                  { key: 'iron', label: 'Fer (mg)' },
                  { key: 'magnesium', label: 'Magnésium (mg)' },
                  { key: 'potassium', label: 'Potassium (mg)' },
                  { key: 'sodium', label: 'Sodium (mg)' },
                  { key: 'phosphorus', label: 'Phosphore (mg)' },
                  { key: 'zinc', label: 'Zinc (mg)' },
                  { key: 'selenium', label: 'Sélénium (µg)' },
                  { key: 'iodine', label: 'Iode (µg)' }
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs text-gray-600 mb-1">{label}</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData[key as keyof typeof formData] as number}
                      onChange={(e) => handleDecimalChange(key, e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: 1,25"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Vitamines */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">Vitamines</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { key: 'vitaminB1', label: 'Vitamine B1 (mg)' },
                  { key: 'vitaminB2', label: 'Vitamine B2 (mg)' },
                  { key: 'vitaminB3', label: 'Vitamine B3 (mg)' },
                  { key: 'vitaminB6', label: 'Vitamine B6 (mg)' },
                  { key: 'vitaminB9', label: 'Vitamine B9 (µg)' },
                  { key: 'vitaminB12', label: 'Vitamine B12 (µg)' },
                  { key: 'vitaminC', label: 'Vitamine C (mg)' },
                  { key: 'vitaminD', label: 'Vitamine D (µg)' },
                  { key: 'vitaminE', label: 'Vitamine E (mg)' }
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs text-gray-600 mb-1">{label}</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData[key as keyof typeof formData] as number}
                      onChange={(e) => handleDecimalChange(key, e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: 0,85"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

interface FoodCreateModalProps {
  onClose: () => void;
  onFoodCreated: () => void;
  suggestedName?: string;
}

function FoodCreateModal({ onClose, onFoodCreated, suggestedName }: FoodCreateModalProps) {
  const [formData, setFormData] = useState({
    name: suggestedName || '',
    category: FOOD_CATEGORIES[0],
    // Macronutriments (obligatoires)
    kcal: 0,
    proteins: 0,
    carbohydrates: 0,
    lipids: 0,
    fibers: 0,
    // Minéraux
    calcium: 0,
    iron: 0,
    magnesium: 0,
    potassium: 0,
    sodium: 0,
    phosphorus: 0,
    zinc: 0,
    selenium: 0,
    iodine: 0,
    // Vitamines B
    vitaminB1: 0,
    vitaminB2: 0,
    vitaminB3: 0,
    vitaminB6: 0,
    vitaminB9: 0,
    vitaminB12: 0,
    // Autres vitamines
    vitaminA: 0,
    vitaminC: 0,
    vitaminD: 0,
    vitaminE: 0,
    vitaminK: 0,
    // Acides gras
    saturatedFats: 0,
    monounsaturatedFats: 0,
    polyunsaturatedFats: 0,
    omega3: 0,
    omega6: 0,
    // Autres
    cholesterol: 0,
    sugar: 0,
    starch: 0,
    alcohol: 0
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Le nom de l\'aliment est obligatoire');
      return;
    }

    setLoading(true);
    
    try {
      const nutritionalValues: NutrientData = {
        kcal: formData.kcal,
        proteins: formData.proteins,
        carbohydrates: formData.carbohydrates,
        lipids: formData.lipids,
        fibers: formData.fibers,
        calcium: formData.calcium,
        iron: formData.iron,
        magnesium: formData.magnesium,
        potassium: formData.potassium,
        sodium: formData.sodium,
        phosphorus: formData.phosphorus,
        zinc: formData.zinc,
        selenium: formData.selenium,
        iodine: formData.iodine,
        vitaminB1: formData.vitaminB1,
        vitaminB2: formData.vitaminB2,
        vitaminB3: formData.vitaminB3,
        vitaminB6: formData.vitaminB6,
        vitaminB9: formData.vitaminB9,
        vitaminB12: formData.vitaminB12,
        vitaminC: formData.vitaminC,
        vitaminD: formData.vitaminD,
        vitaminE: formData.vitaminE
      };

      const success = await addCustomFood({
        name: formData.name.trim(),
        category: formData.category,
        nutritionalValues
      });

      if (success) {
        alert('✅ Aliment créé avec succès !');
        onFoodCreated();
      } else {
        alert('❌ Erreur lors de la création de l\'aliment.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur technique lors de la création de l\'aliment.');
    } finally {
      setLoading(false);
    }
  };

  const handleDecimalChange = (field: string, inputValue: string) => {
    const normalizedValue = inputValue.replace(',', '.');
    const numericValue = parseFloat(normalizedValue) || 0;
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(0, numericValue)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-60">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Créer un nouvel aliment</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de base */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">Informations générales</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'aliment *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Quinoa bio cuit"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {FOOD_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Macronutriments */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">
                Macronutriments (pour 100g)
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: 'kcal', label: 'Calories (kcal)', required: true },
                  { key: 'proteins', label: 'Protéines (g)', required: true },
                  { key: 'carbohydrates', label: 'Glucides (g)', required: true },
                  { key: 'lipids', label: 'Lipides (g)', required: true },
                  { key: 'fibers', label: 'Fibres (g)' },
                  { key: 'sugar', label: 'Sucres (g)' },
                  { key: 'starch', label: 'Amidon (g)' },
                  { key: 'alcohol', label: 'Alcool (g)' }
                ].map(({ key, label, required }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label} {required && '*'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData[key as keyof typeof formData] as number}
                      onChange={(e) => handleDecimalChange(key, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: 8,62"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Minéraux */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">Minéraux</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: 'calcium', label: 'Calcium (mg)' },
                  { key: 'iron', label: 'Fer (mg)' },
                  { key: 'magnesium', label: 'Magnésium (mg)' },
                  { key: 'potassium', label: 'Potassium (mg)' },
                  { key: 'sodium', label: 'Sodium (mg)' },
                  { key: 'phosphorus', label: 'Phosphore (mg)' },
                  { key: 'zinc', label: 'Zinc (mg)' },
                  { key: 'selenium', label: 'Sélénium (µg)' },
                  { key: 'iodine', label: 'Iode (µg)' },
                  { key: 'cholesterol', label: 'Cholestérol (mg)' }
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs text-gray-600 mb-1">{label}</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData[key as keyof typeof formData] as number}
                      onChange={(e) => handleDecimalChange(key, e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: 1,25"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Vitamines */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">Vitamines</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: 'vitaminA', label: 'Vitamine A (µg)' },
                  { key: 'vitaminB1', label: 'Vitamine B1 (mg)' },
                  { key: 'vitaminB2', label: 'Vitamine B2 (mg)' },
                  { key: 'vitaminB3', label: 'Vitamine B3 (mg)' },
                  { key: 'vitaminB6', label: 'Vitamine B6 (mg)' },
                  { key: 'vitaminB9', label: 'Vitamine B9 (µg)' },
                  { key: 'vitaminB12', label: 'Vitamine B12 (µg)' },
                  { key: 'vitaminC', label: 'Vitamine C (mg)' },
                  { key: 'vitaminD', label: 'Vitamine D (µg)' },
                  { key: 'vitaminE', label: 'Vitamine E (mg)' },
                  { key: 'vitaminK', label: 'Vitamine K (µg)' }
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs text-gray-600 mb-1">{label}</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData[key as keyof typeof formData] as number}
                      onChange={(e) => handleDecimalChange(key, e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: 0,85"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Acides gras */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">Acides gras</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { key: 'saturatedFats', label: 'Acides gras saturés (g)' },
                  { key: 'monounsaturatedFats', label: 'Acides gras mono-insaturés (g)' },
                  { key: 'polyunsaturatedFats', label: 'Acides gras poly-insaturés (g)' },
                  { key: 'omega3', label: 'Oméga-3 (g)' },
                  { key: 'omega6', label: 'Oméga-6 (g)' }
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs text-gray-600 mb-1">{label}</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData[key as keyof typeof formData] as number}
                      onChange={(e) => handleDecimalChange(key, e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: 0,25"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Création en cours...' : 'Créer l\'aliment'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}