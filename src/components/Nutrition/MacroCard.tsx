import React from 'react';

interface MacroCardProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export function MacroCard({ label, current, target, unit, color, icon, onClick }: MacroCardProps) {
  const percentage = target > 0 ? (current / target) * 100 : 0;
  const isOverTarget = percentage > 110;
  const isUnderTarget = percentage < 80;
  
  return (
    <div 
      className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${
        onClick ? 'cursor-pointer hover:bg-white/90' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-3 rounded-xl ${color} text-white shadow-lg`}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base">{label}</h3>
            <p className="text-sm text-gray-600">{Math.round(current)}/{Math.round(target)} {unit}</p>
          </div>
        </div>
        <div className={`text-right ${isOverTarget ? 'text-red-600' : isUnderTarget ? 'text-orange-600' : 'text-green-600'}`}>
          <div className="text-2xl font-bold">{Math.round(percentage)}%</div>
          {onClick && (
            <div className="text-xs text-gray-500 mt-1">Cliquez pour détails</div>
          )}
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-4 mb-3 overflow-hidden">
        <div
          className={`h-4 rounded-full transition-all duration-700 ${
            isOverTarget ? 'bg-gradient-to-r from-red-500 to-red-600' : 
            isUnderTarget ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 
            'bg-gradient-to-r from-green-500 to-green-600'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      
      {isOverTarget && (
        <div className="text-sm text-red-600 font-semibold flex items-center gap-1">
          ⚠️ Objectif dépassé
        </div>
      )}
      {isUnderTarget && (
        <div className="text-sm text-orange-600 font-semibold flex items-center gap-1">
          📊 En dessous de l'objectif
        </div>
      )}
      {!isOverTarget && !isUnderTarget && (
        <div className="text-sm text-green-600 font-semibold flex items-center gap-1">
          ✅ Objectif atteint !
        </div>
      )}
    </div>
  );
}