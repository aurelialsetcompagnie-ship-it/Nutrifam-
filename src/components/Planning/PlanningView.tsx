import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { FoodEntry } from '../Food/FoodEntry';
import type { UserProfile, FoodEntry as FoodEntryType, Food } from '../../types';

interface PlanningViewProps {
  profiles: UserProfile[];
  selectedProfile: UserProfile | null;
  foodEntries: { [userId: string]: FoodEntryType[] };
  onAddFoodEntry: (userId: string, food: Food, quantity: number, mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner') => void;
  onUpdateFoodEntry: (entryId: string, quantity: number) => void;
  onDeleteFoodEntry: (entryId: string) => void;
}

export function PlanningView({
  profiles,
  selectedProfile,
  foodEntries,
  onAddFoodEntry,
  onUpdateFoodEntry,
  onDeleteFoodEntry
}: PlanningViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date().toISOString().split('T')[0];
  const displayDate = currentDate.toISOString().split('T')[0];

  if (!selectedProfile) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-600 mb-4">Sélectionnez un profil pour voir le planning</div>
      </div>
    );
  }

  const userEntries = foodEntries[selectedProfile.id] || [];
  const todayEntries = userEntries.filter(entry => 
    new Date(entry.date).toISOString().split('T')[0] === displayDate
  );

  const entriesByMeal = {
    breakfast: todayEntries.filter(entry => entry.mealType === 'breakfast'),
    lunch: todayEntries.filter(entry => entry.mealType === 'lunch'),
    snack: todayEntries.filter(entry => entry.mealType === 'snack'),
    dinner: todayEntries.filter(entry => entry.mealType === 'dinner')
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'prev' ? -1 : 1));
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  const isToday = displayDate === today;
  const isPast = currentDate < new Date(today);

  return (
    <div className="p-6">
      {/* Navigation de date */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <Calendar className="w-5 h-5" />
              {formatDate(currentDate)}
            </div>
            {isToday && (
              <div className="text-sm text-green-600 font-medium">Aujourd'hui</div>
            )}
            {isPast && (
              <div className="text-sm text-gray-500">Jour passé</div>
            )}
          </div>
          
          <button
            onClick={() => navigateDate('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Profil sélectionné */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white ${selectedProfile.avatar}`}>
            {selectedProfile.firstName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{selectedProfile.firstName}</h2>
            <p className="text-gray-600">Suivi nutritionnel personnel</p>
          </div>
          <div className="ml-auto bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Personnel
          </div>
        </div>
      </div>

      {/* Repas du jour */}
      <div className="space-y-6">
        {(['breakfast', 'lunch', 'snack', 'dinner'] as const).map(mealType => (
          <FoodEntry
            key={mealType}
            mealType={mealType}
            entries={entriesByMeal[mealType]}
            onAddEntry={(food, quantity) => onAddFoodEntry(selectedProfile.id, food, quantity, mealType)}
            onUpdateEntry={onUpdateFoodEntry}
            onDeleteEntry={onDeleteFoodEntry}
          />
        ))}
      </div>

      {/* Résumé quotidien */}
      <div className="mt-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl text-white p-6">
        <h3 className="text-lg font-semibold mb-4">Résumé du jour</h3>
        
        {todayEntries.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(() => {
              const dayTotal = todayEntries.reduce((total, entry) => {
                const factor = entry.quantity / 100;
                return {
                  kcal: total.kcal + (entry.nutritionalValues.kcal * factor),
                  proteins: total.proteins + (entry.nutritionalValues.proteins * factor),
                  carbs: total.carbs + (entry.nutritionalValues.carbohydrates * factor),
                  lipids: total.lipids + (entry.nutritionalValues.lipids * factor)
                };
              }, { kcal: 0, proteins: 0, carbs: 0, lipids: 0 });

              return (
                <>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{Math.round(dayTotal.kcal)}</div>
                    <div className="text-white/80 text-sm">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{Math.round(dayTotal.proteins)}g</div>
                    <div className="text-white/80 text-sm">Protéines</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{Math.round(dayTotal.carbs)}g</div>
                    <div className="text-white/80 text-sm">Glucides</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{Math.round(dayTotal.lipids)}g</div>
                    <div className="text-white/80 text-sm">Lipides</div>
                  </div>
                </>
              );
            })()}
          </div>
        ) : (
          <div className="text-center text-white/80">
            Aucun aliment enregistré pour cette journée
          </div>
        )}
      </div>
    </div>
  );
}