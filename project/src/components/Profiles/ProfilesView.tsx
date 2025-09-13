import React, { useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { ProfileCard } from '../Profile/ProfileCard';
import { ProfileForm } from '../Profile/ProfileForm';
import type { UserProfile } from '../../types';

interface ProfilesViewProps {
  profiles: UserProfile[];
  selectedProfile: UserProfile | null;
  onSelectProfile: (profile: UserProfile) => void;
  onCreateProfile: (profile: Omit<UserProfile, 'id' | 'createdAt'>) => void;
  onUpdateProfile: (id: string, profile: Omit<UserProfile, 'id' | 'createdAt'>) => void;
  onDeleteProfile: (id: string) => void;
}

export function ProfilesView({
  profiles,
  selectedProfile,
  onSelectProfile,
  onCreateProfile,
  onUpdateProfile,
  onDeleteProfile
}: ProfilesViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);

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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Profils familiaux</h2>
          <p className="text-gray-600">Gérez les profils nutritionnels de votre famille</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouveau profil
        </button>
      </div>

      {profiles.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map(profile => (
            <div key={profile.id} className="relative">
              <ProfileCard
                profile={profile}
                onClick={() => onSelectProfile(profile)}
                isActive={selectedProfile?.id === profile.id}
              />
              
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  onClick={() => setEditingProfile(profile)}
                  className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
                >
                  <Edit3 className="w-3 h-3 text-gray-600" />
                </button>
                
                {profiles.length > 1 && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Êtes-vous sûr de vouloir supprimer le profil de ${profile.firstName} ?`)) {
                        onDeleteProfile(profile.id);
                      }
                    }}
                    className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulaire de création/modification */}
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
    </div>
  );
}