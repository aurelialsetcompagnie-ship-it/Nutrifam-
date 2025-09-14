import React from 'react';
import { Target, Zap, Shield, Heart, Dumbbell, Bone, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import type { UserProfile, DailyIntake } from '../../types';
import { getDynamicRecommendations } from '../../utils/nutritionCalculations';

interface DynamicRecommendationsProps {
  profile: UserProfile;
  dailyIntake?: DailyIntake;
}

const CATEGORY_ICONS = {
  energy: <Zap className="w-5 h-5" />,
  recovery: <Heart className="w-5 h-5" />,
  immunity: <Shield className="w-5 h-5" />,
  bones: <Bone className="w-5 h-5" />,
  performance: <Dumbbell className="w-5 h-5" />
};

const CATEGORY_COLORS = {
  energy: 'from-yellow-500 to-orange-500',
  recovery: 'from-pink-500 to-red-500',
  immunity: 'from-green-500 to-emerald-500',
  bones: 'from-blue-500 to-indigo-500',
  performance: 'from-purple-500 to-violet-500'
};

const PRIORITY_COLORS = {
  high: 'border-red-300 bg-red-50',
  medium: 'border-yellow-300 bg-yellow-50',
  low: 'border-green-300 bg-green-50'
};

export function DynamicRecommendations({ profile, dailyIntake }: DynamicRecommendationsProps) {
  const recommendations = getDynamicRecommendations(profile, dailyIntake?.totalNutrients);

  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Recommandations Personnalisées
          </h2>
          <p className="text-gray-600">
            Conseils adaptés à votre profil : {profile.firstName}, {profile.gender === 'F' ? 'Femme' : 'Homme'}, {profile.age} ans
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.slice(0, 4).map((rec, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl shadow-lg border-2 ${PRIORITY_COLORS[rec.priority]} hover:shadow-xl transition-all duration-300 overflow-hidden`}
          >
            {/* En-tête avec priorité */}
            <div className={`bg-gradient-to-r ${CATEGORY_COLORS[rec.category]} text-white p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {CATEGORY_ICONS[rec.category]}
                  <h3 className="font-bold text-lg">{rec.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  {rec.priority === 'high' && <AlertCircle className="w-4 h-4" />}
                  {rec.priority === 'medium' && <TrendingUp className="w-4 h-4" />}
                  {rec.priority === 'low' && <CheckCircle className="w-4 h-4" />}
                  <span className="text-xs font-medium uppercase">
                    {rec.priority === 'high' ? 'Priorité' : rec.priority === 'medium' ? 'Important' : 'Conseil'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Message principal */}
              <p className="text-gray-700 mb-4 font-medium">{rec.message}</p>

              {/* Bénéfices */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                <div className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-blue-700 mb-1">Bénéfices :</div>
                    <div className="text-sm text-blue-800">{rec.benefits}</div>
                  </div>
                </div>
              </div>

              {/* Aliments recommandés */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Aliments recommandés :</div>
                <div className="flex flex-wrap gap-2">
                  {rec.foods.slice(0, 4).map((food, foodIndex) => (
                    <span
                      key={foodIndex}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      {food}
                    </span>
                  ))}
                  {rec.foods.length > 4 && (
                    <span className="text-gray-500 text-sm">
                      +{rec.foods.length - 4} autres
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommandations supplémentaires */}
      {recommendations.length > 4 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Autres conseils nutritionnels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.slice(4).map((rec, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  {CATEGORY_ICONS[rec.category]}
                  <h4 className="font-medium text-gray-800">{rec.title}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">{rec.message}</p>
                <div className="flex flex-wrap gap-1">
                  {rec.foods.slice(0, 3).map((food, foodIndex) => (
                    <span
                      key={foodIndex}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                    >
                      {food}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}