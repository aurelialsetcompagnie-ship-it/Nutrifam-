import React, { useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { FoodSearch } from './FoodSearch';
import type { Food, FoodEntry as FoodEntryType } from '../../types';

interface FoodEntryProps {
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  entries: FoodEntryType[];
  onAddEntry: (food: Food, quantity: number) => void;
  onUpdateEntry: (entryId: string, quantity: number) => void;
  onDeleteEntry: (entryId: string) => void;
}

const MEAL_LABELS = {
  breakfast: 'Petit-déjeuner',
  lunch: 'Déjeuner',
  snack: 'Collation',
  dinner: 'Dîner'
};

const MEAL_ICONS = {
  breakfast: '🍳',
  lunch: '🍽️',
  snack: '🍎',
  dinner: '🌙'
};

export function FoodEntry({ mealType, entries, onAddEntry, onUpdateEntry, onDeleteEntry }: FoodEntryProps) {
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState(100);

  const handleFoodSelect = (food: Food) => {
    setSelectedFood(food);
  };

  const handleAddFood = () => {
    if (selectedFood) {
      onAddEntry(selectedFood, quantity);
      setSelectedFood(null);
      setQuantity(100);
      setShowAddFood(false);
    }
  };

  const calculateNutrients = (entry: FoodEntryType) => {
    const factor = entry.quantity / 100;
    return {
      kcal: entry.nutritionalValues.kcal * factor,
      proteins: entry.nutritionalValues.proteins * factor,
      carbs: entry.nutritionalValues.carbohydrates * factor,
      lipids: entry.nutritionalValues.lipids * factor
    };
  };

  const mealTotal = entries.reduce((total, entry) => {
    const nutrients = calculateNutrients(entry);
    return {
      kcal: total.kcal + nutrients.kcal,
      proteins: total.proteins + nutrients.proteins,
      carbs: total.carbs + nutrients.carbs,
      lipids: total.lipids + nutrients.lipids
    };
  }, { kcal: 0, proteins: 0, carbs: 0, lipids: 0 });

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{MEAL_ICONS[mealType]}</span>
            <h3 className="font-semibold text-gray-800">{MEAL_LABELS[mealType]}</h3>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-gray-800">{Math.round(mealTotal.kcal)} kcal</div>
            <div className="text-xs text-gray-600">
              P: {Math.round(mealTotal.proteins)}g • 
              G: {Math.round(mealTotal.carbs)}g • 
              L: {Math.round(mealTotal.lipids)}g
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {entries.length > 0 && (
          <div className="space-y-2 mb-4">
            {entries.map((entry) => {
              const nutrients = calculateNutrients(entry);
              return (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 text-sm">{entry.foodName}</div>
                    <div className="text-xs text-gray-600">
                      {Math.round(nutrients.kcal)} kcal • 
                      P: {Math.round(nutrients.proteins)}g • 
                      G: {Math.round(nutrients.carbs)}g • 
                      L: {Math.round(nutrients.lipids)}g
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <input
                      type="number"
                      value={entry.quantity}
                      onChange={(e) => onUpdateEntry(entry.id, parseFloat(e.target.value) || 0)}
                      className="w-16 p-1 text-xs border border-gray-300 rounded"
                      min="0"
                      step="0.1"
                    />
                    <span className="text-xs text-gray-600">g</span>
                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showAddFood ? (
          <div className="space-y-3">
            <FoodSearch 
              onFoodSelect={handleFoodSelect}
              placeholder={`Ajouter un aliment au ${MEAL_LABELS[mealType].toLowerCase()}`}
            />
            
            {selectedFood && (
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-800">{selectedFood.name}</div>
                  <div className="text-sm text-gray-600">
                    {Math.round(selectedFood.nutritionalValues.kcal)} kcal/100g
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Quantité:</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                      className="w-20 p-2 border border-gray-300 rounded"
                      min="0"
                      step="0.1"
                    />
                    <span className="text-sm text-gray-600">g</span>
                  </div>
                  
                  <div className="flex-1 text-right text-sm text-gray-600">
                    {Math.round((selectedFood.nutritionalValues.kcal * quantity) / 100)} kcal
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddFood}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Ajouter
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFood(null);
                        setShowAddFood(false);
                      }}
                      className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowAddFood(true)}
            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors text-gray-600 hover:text-green-600 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter un aliment
          </button>
        )}
      </div>
    </div>
  );
}