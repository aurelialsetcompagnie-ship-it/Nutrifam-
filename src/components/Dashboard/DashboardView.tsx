import React from 'react';
import { Plus, Settings, Lightbulb, RefreshCw } from 'lucide-react';
import { WeeklyPlanner } from '../Planning/WeeklyPlanner';
import { SportsNutritionSuggestions } from './SportsNutritionSuggestions';
import { DynamicRecommendations } from './DynamicRecommendations';
import { AddFoodModal } from '../Food/AddFoodModal';
import { FoodManagementModal } from '../Food/FoodManagementModal';
import type { UserProfile, DailyIntake, NutrientTargets, MealPlan } from '../../types';
import { getDynamicRecommendations, getRandomEducationalTip } from '../../utils/nutritionCalculations';

interface DashboardViewProps {
  profiles: UserProfile[];
  selectedProfile: UserProfile | null;
  dailyIntakes: { [userId: string]: DailyIntake };
  mealPlans: { [userId: string]: MealPlan[] };
  familyMealPlans: MealPlan[];
  onAddMealPlan: (userId: string, mealPlan: Omit<MealPlan, 'id'>) => void;
  onAddFamilyMealPlan: (mealPlan: Omit<MealPlan, 'id'>) => void;
  onUpdateMealPlan: (planId: string, foods: MealPlan['foods']) => void;
  onDeleteMealPlan: (planId: string) => void;
  onCopyMealPlan: (planId: string, targetDate: Date) => void;
  onCopyToPersonalPlanning: (mealPlan: MealPlan) => void;
}

export function DashboardView({ 
  profiles, 
  selectedProfile, 
  dailyIntakes,
  mealPlans,
  familyMealPlans,
  onAddMealPlan,
  onAddFamilyMealPlan,
  onUpdateMealPlan,
  onDeleteMealPlan,
  onCopyMealPlan,
  onCopyToPersonalPlanning
}: DashboardViewProps) {
  const [showAddFoodModal, setShowAddFoodModal] = React.useState(false);
  const [showFoodManagement, setShowFoodManagement] = React.useState(false);
  const [educationalTip, setEducationalTip] = React.useState(getRandomEducationalTip());

  const refreshTip = () => {
    setEducationalTip(getRandomEducationalTip());
  };

  return (
    <div className="p-6 space-y-8">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tableau de Bord Familial</h1>
          <p className="text-gray-600">Planning partagé et conseils nutritionnels pour toute la famille</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFoodManagement(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Settings className="w-5 h-5" />
            Gérer les aliments
          </button>
          <button
            onClick={() => setShowAddFoodModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Créer un aliment
          </button>
        </div>
      </div>

      {/* Conseil éducatif du jour */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">{educationalTip.title}</h3>
              <p className="text-white/90">{educationalTip.message}</p>
            </div>
          </div>
          <button
            onClick={refreshTip}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
            title="Nouveau conseil"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Recommandations dynamiques */}
      {selectedProfile && (
        <DynamicRecommendations 
          profile={selectedProfile}
          dailyIntake={dailyIntakes[selectedProfile.id]}
        />
      )}

      {/* Planning hebdomadaire */}
      <div>
        <WeeklyPlanner
          profiles={profiles}
          mealPlans={mealPlans}
          familyMealPlans={familyMealPlans}
          onAddMealPlan={onAddMealPlan}
          onAddFamilyMealPlan={onAddFamilyMealPlan}
          onUpdateMealPlan={onUpdateMealPlan}
          onDeleteMealPlan={onDeleteMealPlan}
          onCopyMealPlan={onCopyMealPlan}
          onCopyToPersonalPlanning={onCopyToPersonalPlanning}
          showQuantities={false}
        />
      </div>

      {/* Suggestions nutritionnelles sportives */}
      <SportsNutritionSuggestions />

      {/* Modal de création d'aliment */}
      {showAddFoodModal && (
        <AddFoodModal
          onClose={() => setShowAddFoodModal(false)}
          onFoodAdded={() => {
            setShowAddFoodModal(false);
            // Optionnel: afficher un message de succès
          }}
        />
      )}

      {/* Modal de gestion des aliments */}
      {showFoodManagement && (
        <FoodManagementModal
          onClose={() => setShowFoodManagement(false)}
        />
      )}
    </div>
  );
}