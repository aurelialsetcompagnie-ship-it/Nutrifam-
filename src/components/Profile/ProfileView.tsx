import React, { useState } from 'react';
import { Plus, Edit3, Trash2, User, Target, Activity, Calendar, Zap, Dumbbell, Shield, Award, TrendingUp, Heart, Sparkles } from 'lucide-react';
import { ProfileForm } from './ProfileForm';
import { FoodEntry } from '../Food/FoodEntry';
import { MacroCard } from '../Nutrition/MacroCard';
import { NutrientGauge } from '../Nutrition/NutrientGauge';
import { NutrientDetailModal } from '../Nutrition/NutrientDetailModal';
import type { UserProfile, FoodEntry as FoodEntryType, Food, DailyIntake } from '../../types';
import { calculateNutrientTargets } from '../../utils/nutritionCalculations';

interface ProfileViewProps {
  profiles: UserProfile[];
  selectedProfile: UserProfile | null;
  onSelectProfile: (profile: UserProfile) => void;
  onCreateProfile: (profile: Omit<UserProfile, 'id' | 'createdAt'>) => void;
  onUpdateProfile: (id: string, profile: Omit<UserProfile, 'id' | 'createdAt'>) => void;
  onDeleteProfile: (id: string) => void;
  foodEntries: { [userId: string]: FoodEntryType[] };
  dailyIntakes: { [userId: string]: DailyIntake };
  onAddFoodEntry: (userId: string, food: Food, quantity: number, mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner') => void;
  onUpdateFoodEntry: (entryId: string, quantity: number) => void;
  onDeleteFoodEntry: (entryId: string) => void;
}

export function ProfileView({
  profiles,
  selectedProfile,
  onSelectProfile,
  onCreateProfile,
  onUpdateProfile,
  onDeleteProfile,
  foodEntries,
  dailyIntakes,
  onAddFoodEntry,
  onUpdateFoodEntry,
  onDeleteFoodEntry
}: ProfileViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
  const [selectedNutrient, setSelectedNutrient] = useState<{
    name: string;
    key: keyof import('../../types').NutrientData;
    current: number;
    target: number;
    unit: string;
    color: string;
    icon: React.ReactNode;
  } | null>(null);

  const handleCreateProfile = (profile: Omit<UserProfile, 'id' | 'createdAt'>) => {
    onCreateProfile(profile);
    setShowForm(false);
  };

  const handleUpdateProfile = (profile: Omit<UserProfile, 'id' | 'createdAt'>) => {
    if (editingProfile) {
      onUpdateProfile(editingProfile.id, profile);
      setEditingProfile(null);
    }
  };

  // Si aucun profil, afficher la création
  if (profiles.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucun profil créé</h3>
          <p className="text-gray-600 mb-4">Commencez par créer votre premier profil nutritionnel</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Créer mon profil
          </button>
        </div>

        {showForm && (
          <ProfileForm
            onSave={handleCreateProfile}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    );
  }

  const currentProfile = selectedProfile || profiles[0];
  const userEntries = foodEntries[currentProfile.id] || [];
  const dailyIntake = dailyIntakes[currentProfile.id];
  const targets = calculateNutrientTargets(currentProfile);

  const today = new Date().toISOString().split('T')[0];
  const todayEntries = userEntries.filter(entry => 
    new Date(entry.date).toISOString().split('T')[0] === today
  );

  const entriesByMeal = {
    breakfast: todayEntries.filter(entry => entry.mealType === 'breakfast'),
    lunch: todayEntries.filter(entry => entry.mealType === 'lunch'),
    snack: todayEntries.filter(entry => entry.mealType === 'snack'),
    dinner: todayEntries.filter(entry => entry.mealType === 'dinner')
  };

  const handleNutrientClick = (
    name: string,
    key: keyof import('../../types').NutrientData,
    current: number,
    target: number,
    unit: string,
    color: string,
    icon: React.ReactNode
  ) => {
    setSelectedNutrient({ name, key, current, target, unit, color, icon });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 space-y-8">
      {/* Sélecteur de profil */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Profil Nutritionnel
              </h2>
              <p className="text-sm text-gray-600">Sélectionnez votre profil</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Nouveau profil
          </button>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {profiles.map(profile => (
            <button
              key={profile.id}
              onClick={() => onSelectProfile(profile)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
                currentProfile.id === profile.id
                  ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg'
                  : 'border-gray-200 hover:border-green-300 bg-white/50'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${profile.avatar}`}>
                {profile.firstName.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-800">{profile.firstName}</div>
                <div className="text-xs text-gray-600">{profile.age} ans</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Informations du profil sélectionné */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-xl ${currentProfile.avatar}`}>
              {currentProfile.firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {currentProfile.firstName}
              </h3>
              <p className="text-gray-600 text-lg">{currentProfile.gender === 'M' ? 'Homme' : 'Femme'}, {currentProfile.age} ans</p>
              <div className="flex items-center gap-2 mt-1">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-yellow-600 font-medium">Profil actif</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setEditingProfile(currentProfile)}
              className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-600 rounded-xl hover:from-blue-200 hover:to-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Edit3 className="w-5 h-5" />
            </button>
            
            {profiles.length > 1 && (
              <button
                onClick={() => {
                  if (window.confirm(`Êtes-vous sûr de vouloir supprimer le profil de ${currentProfile.firstName} ?`)) {
                    onDeleteProfile(currentProfile.id);
                  }
                }}
                className="p-3 bg-gradient-to-r from-red-100 to-red-200 text-red-600 rounded-xl hover:from-red-200 hover:to-red-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <span>{currentProfile.height}cm • {currentProfile.weight}kg</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="w-4 h-4 text-green-600" />
            </div>
            <span>{currentProfile.activityLevel.name}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-4 h-4 text-purple-600" />
            </div>
            <span>{currentProfile.objective.name}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-4 h-4 text-orange-600" />
            </div>
            <span>Mode {currentProfile.weekMode === 'normal' ? 'normal' : 'repos'}</span>
          </div>
        </div>
      </div>

      {/* Jauges macronutriments */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-xl border border-orange-100 p-8 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Macronutriments du jour
              </h3>
              <p className="text-sm text-gray-600">Énergie et macros essentiels</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">En cours</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <MacroCard
            label="Calories"
            current={dailyIntake?.totalNutrients.kcal || 0}
            target={targets.calories}
            unit="kcal"
            color="bg-gradient-to-r from-red-500 to-pink-500"
            icon={<Zap className="w-4 h-4" />}
            onClick={() => handleNutrientClick(
              'Calories',
              'kcal',
              dailyIntake?.totalNutrients.kcal || 0,
              targets.calories,
              'kcal',
              'text-red-600',
              <Zap className="w-5 h-5" />
            )}
          />
          <MacroCard
            label="Protéines"
            current={dailyIntake?.totalNutrients.proteins || 0}
            target={targets.proteins}
            unit="g"
            color="bg-gradient-to-r from-blue-500 to-indigo-500"
            icon={<Dumbbell className="w-4 h-4" />}
            onClick={() => handleNutrientClick(
              'Protéines',
              'proteins',
              dailyIntake?.totalNutrients.proteins || 0,
              targets.proteins,
              'g',
              'text-blue-600',
              <Dumbbell className="w-5 h-5" />
            )}
          />
          <MacroCard
            label="Glucides"
            current={dailyIntake?.totalNutrients.carbohydrates || 0}
            target={targets.carbohydrates}
            unit="g"
            color="bg-gradient-to-r from-green-500 to-emerald-500"
            icon={<Zap className="w-4 h-4" />}
            onClick={() => handleNutrientClick(
              'Glucides',
              'carbohydrates',
              dailyIntake?.totalNutrients.carbohydrates || 0,
              targets.carbohydrates,
              'g',
              'text-green-600',
              <Zap className="w-5 h-5" />
            )}
          />
          <MacroCard
            label="Lipides"
            current={dailyIntake?.totalNutrients.lipids || 0}
            target={targets.lipids}
            unit="g"
            color="bg-gradient-to-r from-yellow-500 to-orange-500"
            icon={<Shield className="w-4 h-4" />}
            onClick={() => handleNutrientClick(
              'Lipides',
              'lipids',
              dailyIntake?.totalNutrients.lipids || 0,
              targets.lipids,
              'g',
              'text-yellow-600',
              <Shield className="w-5 h-5" />
            )}
          />
        </div>
      </div>

      {/* Jauges micronutriments */}
      {/* Minéraux */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl border border-blue-100 p-8 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Minéraux Essentiels
              </h3>
              <p className="text-sm text-gray-600">Oligo-éléments et minéraux</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Suivi actif</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-6">
          <NutrientGauge
            label="Calcium"
            current={dailyIntake?.totalNutrients.calcium || 0}
            target={targets.micronutrients.calcium}
            unit="mg"
            color="text-blue-600"
            size="small"
            onClick={() => handleNutrientClick(
              'Calcium',
              'calcium',
              dailyIntake?.totalNutrients.calcium || 0,
              targets.micronutrients.calcium,
              'mg',
              'text-blue-600',
              <Shield className="w-5 h-5" />
            )}
          />
          <NutrientGauge
            label="Fer"
            current={dailyIntake?.totalNutrients.iron || 0}
            target={targets.micronutrients.iron}
            unit="mg"
            color="text-red-600"
            size="small"
            onClick={() => handleNutrientClick(
              'Fer',
              'iron',
              dailyIntake?.totalNutrients.iron || 0,
              targets.micronutrients.iron,
              'mg',
              'text-red-600',
              <Shield className="w-5 h-5" />
            )}
          />
          <NutrientGauge
            label="Magnésium"
            current={dailyIntake?.totalNutrients.magnesium || 0}
            target={targets.micronutrients.magnesium}
            unit="mg"
            color="text-green-600"
            size="small"
            onClick={() => handleNutrientClick(
              'Magnésium',
              'magnesium',
              dailyIntake?.totalNutrients.magnesium || 0,
              targets.micronutrients.magnesium,
              'mg',
              'text-green-600',
              <Shield className="w-5 h-5" />
            )}
          />
          <NutrientGauge
            label="Potassium"
            current={dailyIntake?.totalNutrients.potassium || 0}
            target={targets.micronutrients.potassium}
            unit="mg"
            color="text-purple-600"
            size="small"
            onClick={() => handleNutrientClick(
              'Potassium',
              'potassium',
              dailyIntake?.totalNutrients.potassium || 0,
              targets.micronutrients.potassium,
              'mg',
              'text-purple-600',
              <Shield className="w-5 h-5" />
            )}
          />
          <NutrientGauge
            label="Sodium"
            current={dailyIntake?.totalNutrients.sodium || 0}
            target={targets.micronutrients.sodium}
            unit="mg"
            color="text-orange-600"
            size="small"
            onClick={() => handleNutrientClick(
              'Sodium',
              'sodium',
              dailyIntake?.totalNutrients.sodium || 0,
              targets.micronutrients.sodium,
              'mg',
              'text-orange-600',
              <Shield className="w-5 h-5" />
            )}
          />
          <NutrientGauge
            label="Phosphore"
            current={dailyIntake?.totalNutrients.phosphorus || 0}
            target={targets.micronutrients.phosphorus}
            unit="mg"
            color="text-indigo-600"
            size="small"
            onClick={() => handleNutrientClick(
              'Phosphore',
              'phosphorus',
              dailyIntake?.totalNutrients.phosphorus || 0,
              targets.micronutrients.phosphorus,
              'mg',
              'text-indigo-600',
              <Shield className="w-5 h-5" />
            )}
          />
          <NutrientGauge
            label="Zinc"
            current={dailyIntake?.totalNutrients.zinc || 0}
            target={targets.micronutrients.zinc}
            unit="mg"
            color="text-teal-600"
            size="small"
            onClick={() => handleNutrientClick(
              'Zinc',
              'zinc',
              dailyIntake?.totalNutrients.zinc || 0,
              targets.micronutrients.zinc,
              'mg',
              'text-teal-600',
              <Shield className="w-5 h-5" />
            )}
          />
          <NutrientGauge
            label="Sélénium"
            current={dailyIntake?.totalNutrients.selenium || 0}
            target={targets.micronutrients.selenium}
            unit="µg"
            color="text-pink-600"
            size="small"
            onClick={() => handleNutrientClick(
              'Sélénium',
              'selenium',
              dailyIntake?.totalNutrients.selenium || 0,
              targets.micronutrients.selenium,
              'µg',
              'text-pink-600',
              <Shield className="w-5 h-5" />
            )}
          />
          <NutrientGauge
            label="Iode"
            current={dailyIntake?.totalNutrients.iodine || 0}
            target={targets.micronutrients.iodine}
            unit="µg"
            color="text-cyan-600"
            size="small"
            onClick={() => handleNutrientClick(
              'Iode',
              'iodine',
              dailyIntake?.totalNutrients.iodine || 0,
              targets.micronutrients.iodine,
              'µg',
              'text-cyan-600',
              <Shield className="w-5 h-5" />
            )}
          />
        </div>
      </div>

      {/* Fibres */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-xl border border-amber-100 p-8 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                Fibres Alimentaires
              </h3>
              <p className="text-sm text-gray-600">Santé digestive et satiété</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full">
            <Shield className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-600">Digestion</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NutrientGauge
            label="Fibres"
            current={dailyIntake?.totalNutrients.fibers || 0}
            target={targets.fibers}
            unit="g"
            color="text-amber-600"
            size="medium"
            onClick={() => handleNutrientClick(
              'Fibres',
              'fibers',
              dailyIntake?.totalNutrients.fibers || 0,
              targets.fibers,
              'g',
              'text-amber-600',
              <Shield className="w-5 h-5" />
            )}
          />
        </div>
      </div>
      {/* Vitamines Liposolubles + C */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl border border-green-100 p-8 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Vitamines Liposolubles & Antioxydantes
              </h3>
              <p className="text-sm text-gray-600">Vitamines A, C, D, E, K</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full">
            <Heart className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">Protection</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <NutrientGauge
            label="Vit A"
            current={dailyIntake?.totalNutrients.vitaminA || 0}
            target={targets.micronutrients.vitaminA}
            unit="µg"
            color="text-orange-600"
            size="small"
            onClick={() => handleNutrientClick(
              'Vitamine A',
              'vitaminA',
              dailyIntake?.totalNutrients.vitaminA || 0,
              targets.micronutrients.vitaminA,
              'µg',
              'text-orange-600',
              <Heart className="w-5 h-5" />
            )}
          />
          <NutrientGauge
            label="Vit C"
            current={dailyIntake?.totalNutrients.vitaminC || 0}
            target={targets.micronutrients.vitaminC}
            unit="mg"
            color="text-teal-600"
            size="small"
            onClick={() => handleNutrientClick(
              'Vitamine C',
              'vitaminC',
              dailyIntake?.totalNutrients.vitaminC || 0,
              targets.micronutrients.vitaminC,
              'mg',
              'text-teal-600',
              <Heart className="w-5 h-5" />
            )}
          />
          <NutrientGauge
            label="Vit D"
            current={dailyIntake?.totalNutrients.vitaminD || 0}
            target={targets.micronutrients.vitaminD}
            unit="µg"
            color="text-blue-600"
            size="small"
            onClick={() => handleNutrientClick(
              'Vitamine D',
              'vitaminD',
              dailyIntake?.totalNutrients.vitaminD || 0,
              targets.micronutrients.vitaminD,
              'µg',
              'text-blue-600',
              <Heart className="w-5 h-5" />
            )}
          />
          <NutrientGauge
            label="Vit E"
            current={dailyIntake?.totalNutrients.vitaminE || 0}
            target={targets.micronutrients.vitaminE}
            unit="mg"
            color="text-green-600"
            size="small"
            onClick={() => handleNutrientClick(
              'Vitamine E',
              'vitaminE',
              dailyIntake?.totalNutrients.vitaminE || 0,
              targets.micronutrients.vitaminE,
              'mg',
              'text-green-600',
              <Heart className="w-5 h-5" />
            )}
          />
          <NutrientGauge
            label="Vit K"
            current={dailyIntake?.totalNutrients.vitaminK || 0}
            target={targets.micronutrients.vitaminK}
            unit="µg"
            color="text-purple-600"
            size="small"
            onClick={() => handleNutrientClick(
              'Vitamine K',
              'vitaminK',
              dailyIntake?.totalNutrients.vitaminK || 0,
              targets.micronutrients.vitaminK,
              'µg',
              'text-purple-600',
              <Heart className="w-5 h-5" />
            )}
          />
        </div>
      </div>

      {/* Vitamines B */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-xl border border-yellow-100 p-8 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Complexe Vitamine B
              </h3>
              <p className="text-sm text-gray-600">Métabolisme énergétique et nerveux</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full">
            <Zap className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-600">Énergie</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <NutrientGauge
            label="Vit B1"
            current={dailyIntake?.totalNutrients.vitaminB1 || 0}
            target={targets.micronutrients.vitaminB1}
            unit="mg"
            color="text-yellow-600"
            size="small"
            onClick={() => handleNutrientClick(
              'Vitamine B1',
              'vitaminB1',
              dailyIntake?.totalNutrients.vitaminB1 || 0,
              targets.micronutrients.vitaminB1,
              'mg',
              'text-yellow-600',
              <Zap className="w-5 h-5" />
            )}
          />
          <NutrientGauge
            label="Vit B2"
            current={dailyIntake?.totalNutrients.vitaminB2 || 0}
            target={targets.micronutrients.vitaminB2}
            unit="mg"
            color="text-orange-600"
            size="small"
            onClick={() => handleNutrientClick(
              'Vitamine B2',
              'vitaminB2',
              dailyIntake?.totalNutrients.vitaminB2 || 0,
              targets.micronutrients.vitaminB2,
              'mg',
              'text-orange-600',
              <Zap className="w-5 h-5" />
            )}
          />
          <NutrientGauge
            label="Vit B3"
            current={dailyIntake?.totalNutrients.vitaminB3 || 0}
            target={targets.micronutrients.vitaminB3}
            unit="mg"
            color="text-red-600"
            size="small"
            onClick={() => handleNutrientClick(
              'Vitamine B3',
              'vitaminB3',
              dailyIntake?.totalNutrients.vitaminB3 || 0,
              targets.micronutrients.vitaminB3,
              'mg',
              'text-red-600',
              <Zap className="w-5 h-5" />
            )}
          />
          <NutrientGauge
            label="Vit B6"
            current={dailyIntake?.totalNutrients.vitaminB6 || 0}
            target={targets.micronutrients.vitaminB6}
            unit="mg"
            color="text-purple-600"
            size="small"
            onClick={() => handleNutrientClick(
              'Vitamine B6',
              'vitaminB6',
              dailyIntake?.totalNutrients.vitaminB6 || 0,
              targets.micronutrients.vitaminB6,
              'mg',
              'text-purple-600',
              <Zap className="w-5 h-5" />
            )}
          />
          <NutrientGauge
            label="Vit B9"
            current={dailyIntake?.totalNutrients.vitaminB9 || 0}
            target={targets.micronutrients.vitaminB9}
            unit="µg"
            color="text-pink-600"
            size="small"
            onClick={() => handleNutrientClick(
              'Vitamine B9',
              'vitaminB9',
              dailyIntake?.totalNutrients.vitaminB9 || 0,
              targets.micronutrients.vitaminB9,
              'µg',
              'text-pink-600',
              <Zap className="w-5 h-5" />
            )}
          />
          <NutrientGauge
            label="Vit B12"
            current={dailyIntake?.totalNutrients.vitaminB12 || 0}
            target={targets.micronutrients.vitaminB12}
            unit="µg"
            color="text-indigo-600"
            size="small"
            onClick={() => handleNutrientClick(
              'Vitamine B12',
              'vitaminB12',
              dailyIntake?.totalNutrients.vitaminB12 || 0,
              targets.micronutrients.vitaminB12,
              'µg',
              'text-indigo-600',
              <Zap className="w-5 h-5" />
            )}
          />
        </div>
      </div>

      {/* Journal alimentaire du jour */}
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-xl border border-indigo-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Journal Alimentaire
                </h3>
                <p className="text-sm text-gray-600">
                  {new Date().toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-600">Aujourd'hui</span>
            </div>
          </div>
        </div>
        
        {(['breakfast', 'lunch', 'snack', 'dinner'] as const).map(mealType => (
          <FoodEntry
            key={mealType}
            mealType={mealType}
            entries={entriesByMeal[mealType]}
            onAddEntry={(food, quantity) => onAddFoodEntry(currentProfile.id, food, quantity, mealType)}
            onUpdateEntry={onUpdateFoodEntry}
            onDeleteEntry={onDeleteFoodEntry}
          />
        ))}
      </div>

      {/* Résumé quotidien */}
      <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 rounded-2xl text-white p-8 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Résumé Nutritionnel</h3>
            <p className="text-white/80">Bilan complet de votre journée</p>
          </div>
        </div>
        
        {todayEntries.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-1">{Math.round(dailyIntake?.totalNutrients.kcal || 0)}</div>
              <div className="text-white/90 text-sm font-medium">Calories</div>
              <div className="text-xs text-white/70">Objectif: {Math.round(targets.calories)}</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-1">{Math.round(dailyIntake?.totalNutrients.proteins || 0)}g</div>
              <div className="text-white/90 text-sm font-medium">Protéines</div>
              <div className="text-xs text-white/70">Objectif: {Math.round(targets.proteins)}g</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-1">{Math.round(dailyIntake?.totalNutrients.carbohydrates || 0)}g</div>
              <div className="text-white/90 text-sm font-medium">Glucides</div>
              <div className="text-xs text-white/70">Objectif: {Math.round(targets.carbohydrates)}g</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-1">{Math.round(dailyIntake?.totalNutrients.lipids || 0)}g</div>
              <div className="text-white/90 text-sm font-medium">Lipides</div>
              <div className="text-xs text-white/70">Objectif: {Math.round(targets.lipids)}g</div>
            </div>
          </div>
        ) : (
          <div className="text-center bg-white/10 rounded-xl p-8 backdrop-blur-sm">
            <div className="text-4xl mb-4">🍽️</div>
            <div className="text-white/90 text-lg font-medium">Aucun aliment enregistré</div>
            <div className="text-white/70 text-sm">Commencez à ajouter vos repas ci-dessus</div>
          </div>
        )}
      </div>

      {/* Formulaires */}
      {showForm && (
        <ProfileForm
          onSave={handleCreateProfile}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingProfile && (
        <ProfileForm
          profile={editingProfile}
          onSave={handleUpdateProfile}
          onCancel={() => setEditingProfile(null)}
        />
      )}

      {/* Modal de détail nutritionnel */}
      {selectedNutrient && (
        <NutrientDetailModal
          nutrient={selectedNutrient}
          todayEntries={todayEntries}
          onClose={() => setSelectedNutrient(null)}
        />
      )}
    </div>
  );
}