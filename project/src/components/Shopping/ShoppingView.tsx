import React, { useMemo } from 'react';
import { ShoppingCart, Check, Printer, Share2 } from 'lucide-react';
import type { UserProfile, FoodEntry, ShoppingItem } from '../../types';

interface ShoppingViewProps {
  profiles: UserProfile[];
  foodEntries: { [userId: string]: FoodEntry[] };
}

export function ShoppingView({ profiles, foodEntries }: ShoppingViewProps) {
  const shoppingList = useMemo(() => {
    const itemsMap = new Map<string, ShoppingItem>();
    
    // Récupérer tous les aliments de la semaine pour tous les profils
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    profiles.forEach(profile => {
      const entries = foodEntries[profile.id] || [];
      
      entries.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate >= weekStart && entryDate <= weekEnd) {
          const existing = itemsMap.get(entry.foodId);
          if (existing) {
            existing.totalQuantity += entry.quantity;
          } else {
            itemsMap.set(entry.foodId, {
              foodId: entry.foodId,
              foodName: entry.foodName,
              totalQuantity: entry.quantity,
              unit: 'g',
              category: 'Divers'
            });
          }
        }
      });
    });

    return Array.from(itemsMap.values()).sort((a, b) => a.foodName.localeCompare(b.foodName));
  }, [profiles, foodEntries]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const listText = shoppingList
      .map(item => `• ${item.foodName}: ${Math.round(item.totalQuantity)}${item.unit}`)
      .join('\n');
    
    const text = `Liste de courses NutriFamily\n\n${listText}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Liste de courses NutriFamily',
          text: text
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Liste copiée dans le presse-papiers !');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Liste de courses</h2>
          <p className="text-gray-600">Générée automatiquement pour la semaine</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Partager
          </button>
          <button
            onClick={handlePrint}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 print:hidden"
          >
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
        </div>
      </div>

      {shoppingList.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🛒</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Liste vide</h3>
          <p className="text-gray-600">Ajoutez des aliments dans vos plannings pour générer une liste de courses</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">
                {shoppingList.length} article{shoppingList.length > 1 ? 's' : ''} à acheter
              </h3>
            </div>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {shoppingList.map((item, index) => (
                <ShoppingItemCard key={`${item.foodId}-${index}`} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Suggestions d'aliments sportifs */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Suggestions d'aliments sportifs</h3>
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl text-white p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-2">🥚</div>
              <div className="font-semibold">Œufs</div>
              <div className="text-xs text-white/80">Protéines complètes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🐟</div>
              <div className="font-semibold">Saumon</div>
              <div className="text-xs text-white/80">Oméga-3 + protéines</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🥜</div>
              <div className="font-semibold">Amandes</div>
              <div className="text-xs text-white/80">Magnésium + vitamine E</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🍌</div>
              <div className="font-semibold">Bananes</div>
              <div className="text-xs text-white/80">Potassium + énergie</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ShoppingItemCardProps {
  item: ShoppingItem;
}

function ShoppingItemCard({ item }: ShoppingItemCardProps) {
  const [checked, setChecked] = React.useState(false);

  return (
    <div
      className={`p-3 border rounded-lg transition-all cursor-pointer ${
        checked 
          ? 'bg-green-50 border-green-200 opacity-75' 
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => setChecked(!checked)}
    >
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          checked ? 'bg-green-500 border-green-500' : 'border-gray-300'
        }`}>
          {checked && <Check className="w-3 h-3 text-white" />}
        </div>
        <div className="flex-1">
          <div className={`font-medium ${checked ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
            {item.foodName}
          </div>
          <div className="text-sm text-gray-600">
            {Math.round(item.totalQuantity)} {item.unit}
          </div>
        </div>
      </div>
    </div>
  );
}