import React, { useState, useEffect } from 'react';
import { Search, Plus, ChefHat } from 'lucide-react';
import { searchFoods } from '../../utils/supabaseClient';
import { AddFoodModal } from './AddFoodModal';
import type { Food } from '../../types';

interface FoodSearchProps {
  onFoodSelect: (food: Food) => void;
  placeholder?: string;
}

export function FoodSearch({ onFoodSelect, placeholder = "Rechercher un aliment..." }: FoodSearchProps) {
  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const results = await searchFoods(query);
          setFoods(results);
          setShowResults(true);
        } catch (error) {
          console.error('Erreur de recherche:', error);
          setFoods([]);
        } finally {
          setLoading(false);
        }
      } else {
        setFoods([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleFoodSelect = (food: Food) => {
    onFoodSelect(food);
    setQuery('');
    setShowResults(false);
  };

  const handleRefreshSearch = async () => {
    if (query.length >= 2) {
      setLoading(true);
      try {
        const results = await searchFoods(query);
        setFoods(results);
      } catch (error) {
        console.error('Erreur de recherche:', error);
        setFoods([]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-600">
                Recherche en cours...
              </div>
            ) : foods.length > 0 ? (
              <>
                {foods.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => handleFoodSelect(food)}
                    className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-800">{food.name}</div>
                        {food.category && (
                          <div className="text-xs text-gray-600">{food.category}</div>
                        )}
                      </div>
                      <div className="text-right text-xs text-gray-600">
                        <div>{Math.round(food.nutritionalValues.kcal)} kcal</div>
                        <div>pour 100g</div>
                      </div>
                    </div>
                  </button>
                ))}
              </>
            ) : (
              <div className="p-4 text-center text-gray-600">
                <div className="mb-3 text-lg">🔍 Aucun aliment trouvé pour "{query}"</div>
                <div className="mb-4 text-sm text-gray-500">
                  Cet aliment n'existe pas encore dans notre base de données
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <ChefHat className="w-4 h-4" />
                  ✨ Créer "{query}" dans la base
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de création d'aliment */}
      {showAddModal && (
        <AddFoodModal
          suggestedName={query}
          onClose={() => setShowAddModal(false)}
          onFoodAdded={() => {
            setShowAddModal(false);
            handleRefreshSearch();
          }}
        />
      )}
    </>
  );
}