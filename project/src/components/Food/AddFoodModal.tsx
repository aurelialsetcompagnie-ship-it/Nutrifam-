import React, { useState } from 'react';
import { Plus, X, Save } from 'lucide-react';
import { addCustomFood } from '../../utils/supabaseClient';
import type { NutrientData } from '../../types';

interface AddFoodModalProps {
  onClose: () => void;
  onFoodAdded: () => void;
  suggestedName?: string;
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
  'Autres'
];

export function AddFoodModal({ onClose, onFoodAdded, suggestedName }: AddFoodModalProps) {
  const [formData, setFormData] = useState({
    name: suggestedName || '',
    category: FOOD_CATEGORIES[0],
    // Macronutriments (obligatoires)
    kcal: 0,
    proteins: 0,
    carbohydrates: 0,
    lipids: 0,
    fibers: 0,
    // Minéraux (optionnels)
    calcium: 0,
    iron: 0,
    magnesium: 0,
    potassium: 0,
    sodium: 0,
    phosphorus: 0,
    zinc: 0,
    selenium: 0,
    iodine: 0,
    // Vitamines (optionnelles)
    vitaminB1: 0,
    vitaminB2: 0,
    vitaminB3: 0,
    vitaminB6: 0,
    vitaminB9: 0,
    vitaminB12: 0,
    vitaminC: 0,
    vitaminD: 0,
    vitaminE: 0
  });

  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

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
        alert('✅ Aliment ajouté avec succès à la base de données !');
        onFoodAdded();
      } else {
        alert('❌ Erreur lors de l\'ajout de l\'aliment. Vérifiez la console pour plus de détails.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur technique lors de l\'ajout de l\'aliment. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: number | string) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value : value
    }));
  };

  // Fonction pour gérer les valeurs décimales avec virgules
  const handleDecimalChange = (field: string, inputValue: string) => {
    // Remplacer les virgules par des points pour la conversion
    const normalizedValue = inputValue.replace(',', '.');
    const numericValue = parseFloat(normalizedValue) || 0;
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(0, numericValue)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-600" />
              Créer un nouvel aliment
            </h2>
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
              <h3 className="font-semibold text-gray-800 border-b pb-2">Informations générales</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'aliment *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
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
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {FOOD_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Macronutriments */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 border-b pb-2">
                Macronutriments (pour 100g)
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calories (kcal) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.kcal}
                    onChange={(e) => handleDecimalChange('kcal', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: 8,62 ou 8.62"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Protéines (g) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.proteins}
                    onChange={(e) => handleDecimalChange('proteins', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: 12,5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Glucides (g) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.carbohydrates}
                    onChange={(e) => handleDecimalChange('carbohydrates', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: 45,3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lipides (g) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.lipids}
                    onChange={(e) => handleDecimalChange('lipids', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: 2,8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fibres (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.fibers}
                    onChange={(e) => handleDecimalChange('fibers', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: 3,2"
                  />
                </div>
              </div>
            </div>

            {/* Micronutriments (optionnels) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 border-b pb-2 flex-1">
                  Micronutriments (optionnel)
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-sm text-blue-600 hover:text-blue-700 ml-4"
                >
                  {showAdvanced ? 'Masquer' : 'Afficher'}
                </button>
              </div>

              {showAdvanced && (
                <div className="space-y-4">
                  {/* Minéraux */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Minéraux</h4>
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
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Vitamines</h4>
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
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Ajout en cours...' : 'Ajouter l\'aliment'}
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