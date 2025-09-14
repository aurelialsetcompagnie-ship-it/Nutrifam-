import React, { useState } from 'react';
import { Calendar, Plus, Edit3, Trash2, Copy, ChevronLeft, ChevronRight, Target } from 'lucide-react';
import { FoodSearch } from '../Food/FoodSearch';
import type { UserProfile, MealPlan, Food } from '../../types';

interface WeeklyPlannerProps {
  profiles: UserProfile[];
  mealPlans: { [userId: string]: MealPlan[] };
  familyMealPlans: MealPlan[]; // Plans familiaux partagés
  onAddMealPlan: (userId: string, mealPlan: Omit<MealPlan, 'id'>) => void;
  onAddFamilyMealPlan: (mealPlan: Omit<MealPlan, 'id'>) => void;
  onUpdateMealPlan: (planId: string, foods: MealPlan['foods']) => void;
  onDeleteMealPlan: (planId: string) => void;
  onCopyMealPlan: (planId: string, targetDate: Date) => void;
  onCopyToPersonalPlanning?: (mealPlan: MealPlan) => void;
  showQuantities?: boolean;
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

const MEAL_COLORS = {
  breakfast: 'bg-yellow-100 border-yellow-300',
  lunch: 'bg-blue-100 border-blue-300',
  snack: 'bg-green-100 border-green-300',
  dinner: 'bg-purple-100 border-purple-300'
};

export function WeeklyPlanner({
  profiles,
  mealPlans,
  familyMealPlans,
  onAddMealPlan,
  onAddFamilyMealPlan,
  onUpdateMealPlan,
  onDeleteMealPlan,
  onCopyMealPlan,
  onCopyToPersonalPlanning,
  showQuantities = true
}: WeeklyPlannerProps) {
  const [currentWeek, setCurrentWeek] = useState(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    return monday;
  });
  
  const [editingMeal, setEditingMeal] = useState<{
    date: Date;
    mealType: keyof typeof MEAL_LABELS;
    existingPlan?: MealPlan;
  } | null>(null);

  // Générer les 7 jours de la semaine
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeek);
    date.setDate(currentWeek.getDate() + i);
    return date;
  });

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'prev' ? -7 : 7));
    setCurrentWeek(newWeek);
  };

  const getMealPlan = (date: Date, mealType: keyof typeof MEAL_LABELS) => {
    const dateStr = date.toISOString().split('T')[0];
    return familyMealPlans.find(plan => 
      new Date(plan.date).toISOString().split('T')[0] === dateStr && 
      plan.mealType === mealType &&
      plan.isFamilyPlan
    );
  };

  const handleEditMeal = (date: Date, mealType: keyof typeof MEAL_LABELS) => {
    const existingPlan = getMealPlan(date, mealType);
    setEditingMeal({ date, mealType, existingPlan });
  };

  const calculateMealNutrients = (foods: MealPlan['foods']) => {
    return foods.reduce((total, food) => {
      const factor = food.quantity / 100;
      return {
        kcal: total.kcal + (food.nutritionalValues.kcal * factor),
        proteins: total.proteins + (food.nutritionalValues.proteins * factor),
        carbs: total.carbs + (food.nutritionalValues.carbohydrates * factor),
        lipids: total.lipids + (food.nutritionalValues.lipids * factor)
      };
    }, { kcal: 0, proteins: 0, carbs: 0, lipids: 0 });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    return {
      dayName: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
      dayNumber: date.getDate(),
      isToday
    };
  };

  return (
    <div className="space-y-6">
      {/* Navigation semaine */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <Calendar className="w-5 h-5" />
              Planning Familial - Semaine du {currentWeek.toLocaleDateString('fr-FR')}
            </div>
            <div className="text-sm text-gray-600">
              Menu partagé pour toute la famille
            </div>
          </div>
          
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grille planning hebdomadaire */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-8 gap-0">
          {/* En-tête avec les jours */}
          <div className="bg-gray-50 p-3 font-semibold text-gray-700 border-b border-r border-gray-200">
            Repas
          </div>
          {weekDays.map((date, index) => {
            const { dayName, dayNumber, isToday } = formatDate(date);
            return (
              <div
                key={index}
                className={`p-3 text-center border-b border-gray-200 ${
                  index < 6 ? 'border-r' : ''
                } ${isToday ? 'bg-green-50 text-green-700 font-semibold' : 'bg-gray-50'}`}
              >
                <div className="text-sm font-medium">{dayName}</div>
                <div className="text-lg">{dayNumber}</div>
              </div>
            );
          })}

          {/* Lignes des repas */}
          {(['breakfast', 'lunch', 'snack', 'dinner'] as const).map((mealType) => (
            <React.Fragment key={mealType}>
              {/* Label du repas */}
              <div className={`p-3 font-medium text-gray-700 border-b border-r border-gray-200 ${MEAL_COLORS[mealType]} flex items-center gap-2`}>
                <span className="text-lg">{MEAL_ICONS[mealType]}</span>
                <span className="text-sm">{MEAL_LABELS[mealType]}</span>
              </div>
              
              {/* Cellules pour chaque jour */}
              {weekDays.map((date, dayIndex) => {
                const mealPlan = getMealPlan(date, mealType);
                const nutrients = mealPlan ? calculateMealNutrients(mealPlan.foods) : null;
                
                return (
                  <div
                    key={`${mealType}-${dayIndex}`}
                    className={`p-3 border-b border-gray-200 ${
                      dayIndex < 6 ? 'border-r' : ''
                    } min-h-[120px] hover:bg-gray-50 transition-colors`}
                  >
                    {mealPlan ? (
                      <div className="space-y-1">
                        {mealPlan.foods.slice(0, 3).map((food, foodIndex) => (
                          <div key={foodIndex} className="text-sm text-gray-700 truncate font-medium">
                            • {food.foodName}
                          </div>
                        ))}
                        {mealPlan.foods.length > 3 && (
                          <div className="text-xs text-gray-500 italic">
                            +{mealPlan.foods.length - 3} autre{mealPlan.foods.length > 4 ? 's' : ''}
                          </div>
                        )}
                        
                        <div className="flex gap-1 mt-2">
                          {onCopyToPersonalPlanning && (
                            <button
                              onClick={() => onCopyToPersonalPlanning(mealPlan)}
                              className="p-1 hover:bg-green-100 rounded text-green-600 transition-colors"
                              title="Copier vers planning personnel"
                            >
                              <Target className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={() => handleEditMeal(date, mealType)}
                            className="p-1 hover:bg-blue-100 rounded text-blue-600 transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onDeleteMealPlan(mealPlan.id)}
                            className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              const tomorrow = new Date(date);
                              tomorrow.setDate(date.getDate() + 1);
                              onCopyMealPlan(mealPlan.id, tomorrow);
                            }}
                            className="p-1 hover:bg-green-100 rounded text-green-600 transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditMeal(date, mealType)}
                        className="w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-xs mt-1">Ajouter</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Modal d'édition de repas */}
      {editingMeal && (
        <MealEditModal
          date={editingMeal.date}
          mealType={editingMeal.mealType}
          existingPlan={editingMeal.existingPlan}
          onSave={(foods) => {
            if (editingMeal.existingPlan) {
              onUpdateMealPlan(editingMeal.existingPlan.id, foods);
            } else {
              onAddFamilyMealPlan({
                date: editingMeal.date,
                mealType: editingMeal.mealType,
                foods,
                isTemplate: true,
                isFamilyPlan: true
              });
            }
            setEditingMeal(null);
          }}
          onCancel={() => setEditingMeal(null)}
        />
      )}
    </div>
  );
}

interface MealEditModalProps {
  date: Date;
  mealType: keyof typeof MEAL_LABELS;
  existingPlan?: MealPlan;
  onSave: (foods: MealPlan['foods']) => void;
  onCancel: () => void;
}

function MealEditModal({ date, mealType, existingPlan, onSave, onCancel }: MealEditModalProps) {
  const [foods, setFoods] = useState<MealPlan['foods']>(existingPlan?.foods || []);
  const [showFoodSearch, setShowFoodSearch] = useState(false);

  const handleAddFood = (food: Food) => {
    const newFood = {
      foodId: food.id,
      foodName: food.name,
      quantity: 100,
      nutritionalValues: food.nutritionalValues
    };
    setFoods(prev => [...prev, newFood]);
    setShowFoodSearch(false);
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    setFoods(prev => prev.map((food, i) => 
      i === index ? { ...food, quantity } : food
    ));
  };

  const handleRemoveFood = (index: number) => {
    setFoods(prev => prev.filter((_, i) => i !== index));
  };

  const totalNutrients = foods.reduce((total, food) => {
    const factor = food.quantity / 100;
    return {
      kcal: total.kcal + (food.nutritionalValues.kcal * factor),
      proteins: total.proteins + (food.nutritionalValues.proteins * factor),
      carbs: total.carbs + (food.nutritionalValues.carbohydrates * factor),
      lipids: total.lipids + (food.nutritionalValues.lipids * factor)
    };
  }, { kcal: 0, proteins: 0, carbs: 0, lipids: 0 });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">{MEAL_ICONS[mealType]}</span>
                {MEAL_LABELS[mealType]} - Menu Familial
              </h2>
              <p className="text-gray-600">
                {date.toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })} • Partagé par toute la famille
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Liste des aliments */}
          <div className="space-y-3 mb-6">
            {foods.map((food, index) => {
              const nutrients = {
                kcal: (food.nutritionalValues.kcal * food.quantity) / 100,
                proteins: (food.nutritionalValues.proteins * food.quantity) / 100,
                carbs: (food.nutritionalValues.carbohydrates * food.quantity) / 100,
                lipids: (food.nutritionalValues.lipids * food.quantity) / 100
              };

              return (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-800">{food.foodName}</div>
                    <button
                      onClick={() => handleRemoveFood(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    {Math.round(food.nutritionalValues.kcal)} kcal/100g • 
                    P: {Math.round(food.nutritionalValues.proteins)}g • 
                    G: {Math.round(food.nutritionalValues.carbohydrates)}g • 
                    L: {Math.round(food.nutritionalValues.lipids)}g
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recherche d'aliments */}
          {showFoodSearch ? (
            <div className="mb-6">
              <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700 text-sm">
                  <span className="text-lg">💡</span>
                  <span className="font-medium">Astuce :</span>
                  Si l'aliment n\'existe pas, vous pourrez le créer directement !
                </div>
              </div>
              <FoodSearch
                onFoodSelect={handleAddFood}
                placeholder="Rechercher un aliment à ajouter..."
              />
              <button
                onClick={() => setShowFoodSearch(false)}
                className="mt-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowFoodSearch(true)}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors text-gray-600 hover:text-green-600 flex items-center justify-center gap-2 mb-6"
            >
              <Plus className="w-4 h-4" />
              Ajouter un aliment
            </button>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => onSave(foods)}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Enregistrer
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}