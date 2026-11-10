import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, Eye, Copy, BarChart3, Settings, LogOut, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  profile: UserProfile;
  isAdmin: boolean;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  onOpenStats: () => void;
  onOpenProfile: () => void;
  onCopyLink: () => void;
  onToggleAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  isAdmin,
  isPreviewMode,
  onTogglePreview,
  onOpenStats,
  onOpenProfile,
  onCopyLink,
  onToggleAdmin,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-gray-100 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: MyLink Logo */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            onClick={(e) => {
              if (isPreviewMode) {
                e.preventDefault();
                onTogglePreview();
              }
            }}
            className="flex items-center gap-1.5 font-bold text-2xl tracking-tight text-[#1746E8] hover:opacity-90 transition-opacity"
          >
            <span>MyLink</span>
          </a>

          {isPreviewMode ? (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Eye className="w-3 h-3" /> 방문자 미리보기 모드
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Sparkles className="w-3 h-3" /> 관리자 모드
            </span>
          )}
        </div>

        {/* Right action area */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* '내 페이지' Button */}
          <button
            onClick={onTogglePreview}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-md shadow-xs transition-colors duration-150 ${
              isPreviewMode
                ? 'bg-gray-800 text-white hover:bg-gray-900'
                : 'bg-[#1746E8] text-white hover:bg-[#1238BE]'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{isPreviewMode ? '관리 화면으로' : '내 페이지'}</span>
          </button>

          {/* Profile Avatar Button with Dropdown (Matching Reference Image 2) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-transparent hover:border-blue-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all overflow-hidden bg-gray-100"
              aria-label="사용자 프로필 메뉴 열기"
            >
              <img
                src={profile.avatar || '/cat-avatar.svg'}
                alt={profile.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/cat-avatar.svg';
                }}
              />
            </button>

            {/* Dropdown Menu (Exact replication of Reference Image 2) */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-1.5 text-sm z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header Section: Name & Email */}
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                  <p className="font-bold text-gray-900 leading-tight">{profile.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{profile.email}</p>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  {/* 1. 내 페이지 미리보기 */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onTogglePreview();
                    }}
                    className="w-full text-left px-4 py-2.5 flex items-center gap-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                    <span>내 페이지 미리보기</span>
                  </button>

                  {/* 2. 링크 복사 */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onCopyLink();
                    }}
                    className="w-full text-left px-4 py-2.5 flex items-center gap-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                    <span>링크 복사</span>
                  </button>

                  {/* 3. 통계 확인하기 (구글 검색 로직 기반) */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenStats();
                    }}
                    className="w-full text-left px-4 py-2.5 flex items-center gap-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4 text-gray-500" />
                    <span>통계 확인하기</span>
                  </button>

                  {/* 4. 프로필 설정 */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenProfile();
                    }}
                    className="w-full text-left px-4 py-2.5 flex items-center gap-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span>프로필 설정</span>
                  </button>
                </div>

                {/* 5. 로그아웃 / 관리자 전환 */}
                <div className="border-t border-gray-100 pt-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onToggleAdmin();
                    }}
                    className="w-full text-left px-4 py-2.5 flex items-center gap-3 text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>{isAdmin ? '로그아웃' : '관리자 로그인'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
