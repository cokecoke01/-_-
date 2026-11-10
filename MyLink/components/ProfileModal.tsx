import React, { useState, useEffect } from 'react';
import { X, User, Mail, AtSign, FileText, Sparkles, Image as ImageIcon } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  profile: UserProfile;
  onClose: () => void;
  onSave: (updated: UserProfile) => void;
}

const AVATAR_PRESETS = [
  { label: '고양이 캐릭터 (레퍼런스)', url: '/cat-avatar.svg' },
  { label: '비즈니스 봇', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=dongyoung' },
  { label: '프로페셔널 아바타', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dongyoung' },
  { label: '심플 일러스트', url: 'https://api.dicebear.com/7.x/micah/svg?seed=dongyoung' },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);

  useEffect(() => {
    setFormData(profile);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60 shrink-0">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#1746E8]" />
            <h2 className="text-lg font-bold text-gray-900">프로필 설정 및 브랜딩 수정</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Avatar Preview & Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              프로필 이미지
            </label>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 shadow-sm bg-gray-100 shrink-0">
                <img
                  src={formData.avatar || '/cat-avatar.svg'}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/cat-avatar.svg';
                  }}
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="이미지 URL 직접 입력"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-2 gap-2">
              {AVATAR_PRESETS.map((p) => (
                <button
                  key={p.url}
                  type="button"
                  onClick={() => setFormData({ ...formData, avatar: p.url })}
                  className={`px-2.5 py-1.5 text-xs rounded-md border text-left truncate transition-colors ${
                    formData.avatar === p.url
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Name & ID Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                이름 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                아이디 (Username) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 font-mono text-sm">@</span>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.replace(/^@/, '') })}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              이메일 주소
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              자기소개 (핵심 정체성)
            </label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tagline / Quote */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              소개 문구 (슬로건)
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1746E8] hover:bg-[#1238BE] rounded-md shadow-xs transition-colors"
            >
              프로필 저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
