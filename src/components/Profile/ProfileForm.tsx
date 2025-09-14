import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import type { UserProfile } from '../../types';
import { ACTIVITY_LEVELS, OBJECTIVES } from '../../utils/nutritionCalculations';

interface ProfileFormProps {
  profile?: UserProfile;
  onSave: (profile: Omit<UserProfile, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const AVATAR_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
];

export function ProfileForm({ profile, onSave, onCancel }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    gender: profile?.gender || 'M' as 'M' | 'F',
    age: profile?.age || 25,
    height: profile?.height || 170,
    weight: profile?.weight || 70,
    activityLevelId: profile?.activityLevel.id || 'moderate',
    objectiveId: profile?.objective.id || 'maintain',
    customCalorieDelta: profile?.customCalorieDelta || (profile?.objective.id === 'loss' ? 300 : profile?.objective.id === 'gain' ? 200 : 0),
    weekMode: profile?.weekMode || 'normal' as 'normal' | 'rest',
    avatar: profile?.avatar || AVATAR_COLORS[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const activityLevel = ACTIVITY_LEVELS.find(level => level.id === formData.activityLevelId)!;
    const objective = OBJECTIVES.find(obj => obj.id === formData.objectiveId)!;

    onSave({
      firstName: formData.firstName,
      gender: formData.gender,
      age: formData.age,
      height: formData.height,
      weight: formData.weight,
      activityLevel,
      objective,
      customCalorieDelta: formData.customCalorieDelta,
      weekMode: formData.weekMode,
      avatar: formData.avatar
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {profile ? 'Modifier le profil' : 'Nouveau profil'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Prénom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'M', label: 'Homme' },
                  { value: 'F', label: 'Femme' }
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, gender: option.value as 'M' | 'F' }))}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.gender === option.value
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Âge */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Âge (années)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 25 }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Taille et Poids */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taille (cm)
                </label>
                <input
                  type="number"
                  min="100"
                  max="250"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: parseInt(e.target.value) || 170 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Poids (kg)
                </label>
                <input
                  type="number"
                  min="30"
                  max="200"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 70 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Niveau d'activité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau d'activité
              </label>
              <div className="space-y-2">
                {ACTIVITY_LEVELS.map(level => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, activityLevelId: level.id }))}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                      formData.activityLevelId === level.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-800">{level.name}</div>
                    <div className="text-xs text-gray-500 mt-1">NAP: {level.pal}</div>
                    <div className="text-sm text-gray-600">{level.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Objectif */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objectif
              </label>
              <div className="space-y-2">
                {OBJECTIVES.map(objective => (
                  <button
                    key={objective.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, objectiveId: objective.id }))}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                      formData.objectiveId === objective.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-800">{objective.name}</div>
                    <div className="text-sm text-gray-600">{objective.description}</div>
                  </button>
                ))}
              </div>
              
              {/* Champ calories personnalisées pour perte/prise */}
              {(formData.objectiveId === 'loss' || formData.objectiveId === 'gain') && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    {formData.objectiveId === 'loss' 
                      ? '🔻 Déficit calorique (calories en moins par jour)' 
                      : '🔺 Surplus calorique (calories en plus par jour)'
                    }
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="50"
                      max={formData.objectiveId === 'loss' ? '800' : '500'}
                      step="50"
                      value={formData.customCalorieDelta}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        customCalorieDelta: parseInt(e.target.value) || 0 
                      }))}
                      className="w-24 p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-bold"
                    />
                    <span className="text-blue-700 font-medium">kcal/jour</span>
                  </div>
                  <div className="mt-2 text-xs text-blue-600">
                    {formData.objectiveId === 'loss' 
                      ? '💡 Recommandé : 200-500 kcal pour une perte progressive et durable'
                      : '💡 Recommandé : 200-300 kcal pour une prise de poids contrôlée'
                    }
                  </div>
                </div>
              )}
            </div>

            {/* Mode semaine */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mode semaine
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'normal', label: 'Normal' },
                  { value: 'rest', label: 'Repos' }
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, weekMode: option.value as 'normal' | 'rest' }))}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.weekMode === option.value
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Couleur avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur de profil
              </label>
              <div className="grid grid-cols-4 gap-2">
                {AVATAR_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, avatar: color }))}
                    className={`w-12 h-12 rounded-full ${color} border-4 transition-all ${
                      formData.avatar === color ? 'border-gray-800 scale-110' : 'border-gray-200'
                    }`}
                  >
                    <span className="text-white font-bold">
                      {formData.firstName.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Enregistrer
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