import React, { useState, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { DashboardView } from './components/Dashboard/DashboardView';
import { ProfileView } from './components/Profile/ProfileView';
import { ShoppingView } from './components/Shopping/ShoppingView';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { UserProfile, FoodEntry, DailyIntake, Food, NutrientData, MealPlan } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profiles, setProfiles] = useLocalStorage<UserProfile[]>('nutri-profiles', []);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(
    profiles.length > 0 ? profiles[0] : null
  );
  const [foodEntries, setFoodEntries] = useLocalStorage<{ [userId: string]: FoodEntry[] }>('nutri-food-entries', {});
  const [mealPlans, setMealPlans] = useLocalStorage<{ [userId: string]: MealPlan[] }>('nutri-meal-plans', {});
  const [familyMealPlans, setFamilyMealPlans] = useLocalStorage<MealPlan[]>('nutri-family-meal-plans', []);

  // Mettre à jour le profil sélectionné quand les profils changent
  useEffect(() => {
    if (!selectedProfile && profiles.length > 0) {
      setSelectedProfile(profiles[0]);
    }
    if (selectedProfile && !profiles.find(p => p.id === selectedProfile.id)) {
      setSelectedProfile(profiles.length > 0 ? profiles[0] : null);
    }
  }, [profiles, selectedProfile]);

  // Calculer les apports quotidiens pour chaque profil
  const dailyIntakes: { [userId: string]: DailyIntake } = {};
  
  profiles.forEach(profile => {
    const userEntries = foodEntries[profile.id] || [];
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = userEntries.filter(entry => 
      new Date(entry.date).toISOString().split('T')[0] === today
    );

    // Calculer les totaux nutritionnels
    const totalNutrients = todayEntries.reduce((total, entry) => {
      const factor = entry.quantity / 100;
      const entryNutrients = entry.nutritionalValues;
      
      return {
        kcal: total.kcal + (entryNutrients.kcal * factor),
        proteins: total.proteins + (entryNutrients.proteins * factor),
        carbohydrates: total.carbohydrates + (entryNutrients.carbohydrates * factor),
        lipids: total.lipids + (entryNutrients.lipids * factor),
        fibers: total.fibers + ((entryNutrients.fibers || 0) * factor),
        calcium: total.calcium + ((entryNutrients.calcium || 0) * factor),
        iron: total.iron + ((entryNutrients.iron || 0) * factor),
        magnesium: total.magnesium + ((entryNutrients.magnesium || 0) * factor),
        potassium: total.potassium + ((entryNutrients.potassium || 0) * factor),
        sodium: total.sodium + ((entryNutrients.sodium || 0) * factor),
        phosphorus: total.phosphorus + ((entryNutrients.phosphorus || 0) * factor),
        zinc: total.zinc + ((entryNutrients.zinc || 0) * factor),
        selenium: total.selenium + ((entryNutrients.selenium || 0) * factor),
        iodine: total.iodine + ((entryNutrients.iodine || 0) * factor),
        vitaminB1: total.vitaminB1 + ((entryNutrients.vitaminB1 || 0) * factor),
        vitaminB2: total.vitaminB2 + ((entryNutrients.vitaminB2 || 0) * factor),
        vitaminB3: total.vitaminB3 + ((entryNutrients.vitaminB3 || 0) * factor),
        vitaminB6: total.vitaminB6 + ((entryNutrients.vitaminB6 || 0) * factor),
        vitaminB9: total.vitaminB9 + ((entryNutrients.vitaminB9 || 0) * factor),
        vitaminB12: total.vitaminB12 + ((entryNutrients.vitaminB12 || 0) * factor),
        vitaminC: total.vitaminC + ((entryNutrients.vitaminC || 0) * factor),
        vitaminD: total.vitaminD + ((entryNutrients.vitaminD || 0) * factor),
        vitaminE: total.vitaminE + ((entryNutrients.vitaminE || 0) * factor)
      };
    }, {
      kcal: 0,
      proteins: 0,
      carbohydrates: 0,
      lipids: 0,
      fibers: 0,
      calcium: 0,
      iron: 0,
      magnesium: 0,
      potassium: 0,
      sodium: 0,
      phosphorus: 0,
      zinc: 0,
      selenium: 0,
      iodine: 0,
      vitaminB1: 0,
      vitaminB2: 0,
      vitaminB3: 0,
      vitaminB6: 0,
      vitaminB9: 0,
      vitaminB12: 0,
      vitaminC: 0,
      vitaminD: 0,
      vitaminE: 0
    } as NutrientData);

    dailyIntakes[profile.id] = {
      date: new Date(today),
      userId: profile.id,
      totalNutrients,
      entries: todayEntries,
      targets: {
        calories: 2000, // Will be calculated properly in the component
        proteins: 120,
        carbohydrates: 250,
        lipids: 70,
        fibers: 30,
        micronutrients: {
          calcium: 1000,
          iron: 14,
          magnesium: 390,
          potassium: 3500,
          sodium: 1500,
          phosphorus: 550,
          zinc: 11,
          selenium: 70,
          iodine: 150,
          vitaminB1: 1.3,
          vitaminB2: 1.65,
          vitaminB3: 16.5,
          vitaminB6: 1.85,
          vitaminB9: 330,
          vitaminB12: 4,
          vitaminC: 110,
          vitaminD: 7.5,
          vitaminE: 12
        }
      }
    };
  });

  // Gestion des profils
  const handleCreateProfile = (profileData: Omit<UserProfile, 'id' | 'createdAt'>) => {
    const newProfile: UserProfile = {
      ...profileData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setProfiles(prev => [...prev, newProfile]);
    if (!selectedProfile) {
      setSelectedProfile(newProfile);
    }
  };

  const handleUpdateProfile = (id: string, profileData: Omit<UserProfile, 'id' | 'createdAt'>) => {
    setProfiles(prev => prev.map(p => 
      p.id === id 
        ? { ...profileData, id, createdAt: p.createdAt }
        : p
    ));
    
    if (selectedProfile?.id === id) {
      setSelectedProfile({ ...profileData, id, createdAt: selectedProfile.createdAt });
    }
  };

  const handleDeleteProfile = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
    if (selectedProfile?.id === id) {
      const remainingProfiles = profiles.filter(p => p.id !== id);
      setSelectedProfile(remainingProfiles.length > 0 ? remainingProfiles[0] : null);
    }
    
    // Supprimer aussi les entrées alimentaires de ce profil
    setFoodEntries(prev => {
      const newEntries = { ...prev };
      delete newEntries[id];
      return newEntries;
    });
  };

  // Gestion des entrées alimentaires
  const handleAddFoodEntry = (
    userId: string, 
    food: Food, 
    quantity: number, 
    mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner'
  ) => {
    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      foodId: food.id,
      foodName: food.name,
      quantity,
      mealType,
      nutritionalValues: food.nutritionalValues,
      date: new Date(),
      userId
    };

    setFoodEntries(prev => ({
      ...prev,
      [userId]: [...(prev[userId] || []), newEntry]
    }));
  };

  const handleUpdateFoodEntry = (entryId: string, quantity: number) => {
    setFoodEntries(prev => {
      const newEntries = { ...prev };
      
      Object.keys(newEntries).forEach(userId => {
        newEntries[userId] = newEntries[userId].map(entry =>
          entry.id === entryId ? { ...entry, quantity } : entry
        );
      });
      
      return newEntries;
    });
  };

  const handleDeleteFoodEntry = (entryId: string) => {
    setFoodEntries(prev => {
      const newEntries = { ...prev };
      
      Object.keys(newEntries).forEach(userId => {
        newEntries[userId] = newEntries[userId].filter(entry => entry.id !== entryId);
      });
      
      return newEntries;
    });
  };

  // Gestion des plans de repas
  const handleAddMealPlan = (userId: string, mealPlan: Omit<MealPlan, 'id'>) => {
    const newMealPlan: MealPlan = {
      ...mealPlan,
      id: Date.now().toString()
    };

    setMealPlans(prev => ({
      ...prev,
      [userId]: [...(prev[userId] || []), newMealPlan]
    }));
  };

  // Copier un repas familial vers le planning personnel
  const handleCopyToPersonalPlanning = (familyMealPlan: MealPlan) => {
    // Changer vers l'onglet planning
    setActiveTab('profile');
    
    // Copier les aliments vers le profil sélectionné pour aujourd'hui
    if (selectedProfile) {
      const today = new Date();
      const personalMealPlan: Omit<MealPlan, 'id'> = {
        userId: selectedProfile.id,
        date: today,
        mealType: familyMealPlan.mealType,
        foods: familyMealPlan.foods.map(food => ({
          ...food,
          quantity: 100 // Quantité par défaut à ajuster
        })),
        isTemplate: false,
        isFamilyPlan: false
      };
      
      handleAddMealPlan(selectedProfile.id, personalMealPlan);
    }
  };
  const handleAddFamilyMealPlan = (mealPlan: Omit<MealPlan, 'id'>) => {
    const newMealPlan: MealPlan = {
      ...mealPlan,
      id: Date.now().toString()
    };

    setFamilyMealPlans(prev => [...prev, newMealPlan]);
  };

  const handleUpdateMealPlan = (planId: string, foods: MealPlan['foods']) => {
    // Vérifier d'abord dans les plans familiaux
    const familyPlan = familyMealPlans.find(plan => plan.id === planId);
    if (familyPlan) {
      setFamilyMealPlans(prev => prev.map(plan =>
        plan.id === planId ? { ...plan, foods } : plan
      ));
      return;
    }

    // Sinon, chercher dans les plans individuels
    setMealPlans(prev => {
      const newPlans = { ...prev };
      
      Object.keys(newPlans).forEach(userId => {
        newPlans[userId] = newPlans[userId].map(plan =>
          plan.id === planId ? { ...plan, foods } : plan
        );
      });
      
      return newPlans;
    });
  };

  const handleDeleteMealPlan = (planId: string) => {
    // Vérifier d'abord dans les plans familiaux
    const familyPlan = familyMealPlans.find(plan => plan.id === planId);
    if (familyPlan) {
      setFamilyMealPlans(prev => prev.filter(plan => plan.id !== planId));
      return;
    }

    // Sinon, chercher dans les plans individuels
    setMealPlans(prev => {
      const newPlans = { ...prev };
      
      Object.keys(newPlans).forEach(userId => {
        newPlans[userId] = newPlans[userId].filter(plan => plan.id !== planId);
      });
      
      return newPlans;
    });
  };

  const handleCopyMealPlan = (planId: string, targetDate: Date) => {
    // Vérifier d'abord dans les plans familiaux
    const familyPlan = familyMealPlans.find(plan => plan.id === planId);
    if (familyPlan) {
      const newPlan: MealPlan = {
        ...familyPlan,
        id: Date.now().toString(),
        date: targetDate
      };
      setFamilyMealPlans(prev => [...prev, newPlan]);
      return;
    }

    // Sinon, chercher dans les plans individuels
    setMealPlans(prev => {
      const newPlans = { ...prev };
      
      // Trouver le plan à copier
      let planToCopy: MealPlan | null = null;
      let userId = '';
      
      Object.keys(newPlans).forEach(uid => {
        const plan = newPlans[uid].find(p => p.id === planId);
        if (plan) {
          planToCopy = plan;
          userId = uid;
        }
      });
      
      if (planToCopy && userId) {
        const newPlan: MealPlan = {
          ...planToCopy,
          id: Date.now().toString(),
          date: targetDate
        };
        
        newPlans[userId] = [...(newPlans[userId] || []), newPlan];
      }
      
      return newPlans;
    });
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            profiles={profiles}
            selectedProfile={selectedProfile}
            dailyIntakes={dailyIntakes}
            mealPlans={mealPlans}
            familyMealPlans={familyMealPlans}
            onAddMealPlan={handleAddMealPlan}
            onAddFamilyMealPlan={handleAddFamilyMealPlan}
            onUpdateMealPlan={handleUpdateMealPlan}
            onDeleteMealPlan={handleDeleteMealPlan}
            onCopyMealPlan={handleCopyMealPlan}
            onCopyToPersonalPlanning={handleCopyToPersonalPlanning}
          />
        );
      case 'profile':
        return (
          <ProfileView
            profiles={profiles}
            selectedProfile={selectedProfile}
            onSelectProfile={setSelectedProfile}
            onCreateProfile={handleCreateProfile}
            onUpdateProfile={handleUpdateProfile}
            onDeleteProfile={handleDeleteProfile}
            foodEntries={foodEntries}
            dailyIntakes={dailyIntakes}
            onAddFoodEntry={handleAddFoodEntry}
            onUpdateFoodEntry={handleUpdateFoodEntry}
            onDeleteFoodEntry={handleDeleteFoodEntry}
          />
        );
      case 'shopping':
        return (
          <ShoppingView
            profiles={profiles}
            foodEntries={foodEntries}
          />
        );
      default:
        return <div>Page non trouvée</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        profileCount={profiles.length}
      />
      
      <main className="pb-8">
        {renderActiveView()}
      </main>
    </div>
  );
}

export default App;