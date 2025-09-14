import React, { useState } from 'react';
import { Users, Calendar, BarChart3, ShoppingCart, Menu } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  profileCount: number;
}

export function Header({ activeTab, onTabChange, profileCount }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
    { id: 'profile', label: 'Profil', icon: Users },
    { id: 'shopping', label: 'Courses', icon: ShoppingCart }
  ];

  return (
    <header className="bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
              🏃‍♂️
            </div>
            NutriFamily
          </h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{profileCount} profil{profileCount > 1 ? 's' : ''}</span>
            </div>
            <button
              onClick={() => setIsMenuOpen(o => !o)}
              className="p-2 rounded-md bg-white/20 hover:bg-white/30 md:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav
          className={`${isMenuOpen ? 'flex' : 'hidden'} flex-col gap-2 overflow-x-auto md:flex md:flex-row`}
        >
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  setIsMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white font-semibold'
                    : 'hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}