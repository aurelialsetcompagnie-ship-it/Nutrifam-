import React from 'react';
import { User, Target, Activity, Calendar } from 'lucide-react';
import type { UserProfile } from '../../types';
import { calculateCalorieTarget, calculateTDEE } from '../../utils/nutritionCalculations';

interface ProfileCardProps {
  profile: UserProfile;
  onClick: () => void;
  isActive?: boolean;
}

export function ProfileCard({ profile, onClick, isActive = false }: ProfileCardProps) {
  const calorieTarget = calculateCalorieTarget(profile);
  const tdee = calculateTDEE(profile);

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-xl border-2 ${
        isActive ? 'border-green-500 transform scale-105' : 'border-gray-100'
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white ${profile.avatar}`}>
          {profile.firstName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{profile.firstName}</h3>
          <p className="text-sm text-gray-600">{profile.gender === 'M' ? 'Homme' : 'Femme'}, {profile.age} ans</p>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2 text-gray-600">
          <User className="w-3 h-3" />
          <span>{profile.height}cm • {profile.weight}kg</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <Activity className="w-3 h-3" />
          <span>{profile.activityLevel.name}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <Target className="w-3 h-3" />
          <span>{profile.objective.name}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-3 h-3" />
          <span>Mode {profile.weekMode === 'normal' ? 'normal' : 'repos'}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Objectif</span>
          <span className="text-sm font-bold text-green-600">{Math.round(calorieTarget)} kcal</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-600">DET</span>
          <span className="text-xs text-gray-500">{Math.round(tdee)} kcal</span>
        </div>
      </div>
    </div>
  );
}