import React from 'react';
import { Camera, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileCardProps {
  profile: UserProfile;
  isAdmin: boolean;
  onEditProfile: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, isAdmin, onEditProfile }) => {
  return (
    <div className="flex flex-col items-center text-center pt-8 pb-6 px-4">
      {/* Profile Avatar */}
      <div className="relative group">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-white flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
          <img
            src={profile.avatar || '/cat-avatar.svg'}
            alt={profile.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/cat-avatar.svg';
            }}
          />
        </div>
        {isAdmin && (
          <button
            onClick={onEditProfile}
            className="absolute bottom-0 right-0 p-1.5 bg-[#1746E8] text-white rounded-full shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
            title="프로필 수정하기"
          >
            <Camera className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Name */}
      <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
        {profile.name}
      </h1>

      {/* Username / ID */}
      <p className="mt-1 text-sm sm:text-base font-mono text-gray-500 font-medium">
        @{profile.username}
      </p>

      {/* Bio / Core identity */}
      <p className="mt-3 text-base sm:text-lg font-medium text-gray-800 max-w-lg leading-relaxed">
        {profile.bio}
      </p>

      {/* Introduction Quote / Tagline */}
      {profile.tagline && (
        <p className="mt-2 text-sm text-gray-500 italic max-w-md">
          {profile.tagline}
        </p>
      )}

    </div>
  );
};
