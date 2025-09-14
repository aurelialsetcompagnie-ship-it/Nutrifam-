import React from 'react';

interface NutrientGaugeProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export function NutrientGauge({ label, current, target, unit, color, size = 'medium', onClick }: NutrientGaugeProps) {
  const percentage = target > 0 ? Math.min((current / target) * 100, 150) : 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const isOverTarget = percentage > 110;
  const isUnderTarget = percentage < 80;
  const isOptimal = percentage >= 80 && percentage <= 110;
  
  const sizeClasses = {
    small: { container: 'w-24 h-24', text: 'text-xs', number: 'text-sm' },
    medium: { container: 'w-28 h-28', text: 'text-sm', number: 'text-base' },
    large: { container: 'w-36 h-36', text: 'text-base', number: 'text-xl' }
  };

  const classes = sizeClasses[size];
  
  return (
    <div 
      className={`flex flex-col items-center bg-white/50 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/70 transition-all duration-300 transform hover:scale-105 ${
        onClick ? 'cursor-pointer hover:shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      <div className={`relative ${classes.container} mb-2`}>
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className={color}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              transition: 'stroke-dashoffset 0.5s ease-in-out',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${classes.number} text-gray-800`}>
            {Math.round(percentage)}%
          </span>
          {isOptimal && <span className="text-xs text-green-600">✓</span>}
          {isOverTarget && <span className="text-xs text-red-600">⚠️</span>}
          {isUnderTarget && <span className="text-xs text-orange-600">📊</span>}
        </div>
      </div>
      <div className="text-center mt-1">
        <div className={`font-semibold text-gray-800 ${classes.text} mb-1`}>{label}</div>
        <div className={`text-gray-600 ${classes.text} font-medium`}>
          {Math.round(current)}/{Math.round(target)} {unit}
        </div>
        {onClick && (
          <div className="text-xs text-gray-500 mt-1">Cliquez</div>
        )}
      </div>
    </div>
  );
}