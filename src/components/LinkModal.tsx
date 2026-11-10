import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { LinkItem, IconType } from '../types';
import { PlatformIcon } from './PlatformIcon';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; url: string; icon: IconType; description?: string }) => void;
  editingLink: LinkItem | null;
}

const AVAILABLE_ICONS: { type: IconType; label: string }[] = [
  { type: 'github', label: 'GitHub' },
  { type: 'google', label: 'Google' },
  { type: 'blog', label: '블로그' },
  { type: 'portfolio', label: '포트폴리오' },
  { type: 'instagram', label: '인스타그램' },
  { type: 'youtube', label: '유튜브' },
  { type: 'custom', label: '기타 웹사이트' },
];

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingLink,
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState<IconType>('github');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingLink) {
      setTitle(editingLink.title);
      setUrl(editingLink.url);
      setIcon(editingLink.icon);
      setDescription(editingLink.description || '');
    } else {
      setTitle('');
      setUrl('');
      setIcon('github');
      setDescription('');
    }
    setError('');
  }, [editingLink, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('링크 제목을 입력해주세요.');
      return;
    }
    if (!url.trim()) {
      setError('링크 URL을 입력해주세요.');
      return;
    }

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    onSave({
      title: title.trim(),
      url: finalUrl,
      icon,
      description: description.trim(),
    });
  };

  // Auto-detect icon based on URL or title
  const handleUrlChange = (value: string) => {
    setUrl(value);
    const lower = value.toLowerCase();
    if (!editingLink) {
      if (lower.includes('github.com')) setIcon('github');
      else if (lower.includes('google.com') || lower.includes('docs.google')) setIcon('google');
      else if (lower.includes('velog.io') || lower.includes('tistory.com') || lower.includes('medium.com') || lower.includes('blog.')) setIcon('blog');
      else if (lower.includes('notion.site') || lower.includes('notion.so') || lower.includes('behance.net')) setIcon('portfolio');
      else if (lower.includes('instagram.com')) setIcon('instagram');
      else if (lower.includes('youtube.com') || lower.includes('youtu.be')) setIcon('youtube');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60">
          <h2 className="text-lg font-bold text-gray-900">
            {editingLink ? '링크 수정하기' : '새로운 링크 추가하기'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-md">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Link Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              링크 제목 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 깃허브, 구글, 내 블로그, 포트폴리오"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Link URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              링크 URL <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="예: https://github.com/dongyoung"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              플랫폼 아이콘 선택
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {AVAILABLE_ICONS.map((item) => {
                const isSelected = icon === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setIcon(item.type)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border text-center transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <PlatformIcon icon={item.type} className="w-7 h-7" />
                    <span className="text-[11px] font-medium text-gray-700 leading-tight">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              설명 문구 (선택 사항)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="예: 마케팅 전략 및 브랜딩 케이스 스터디"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              {editingLink ? '수정 완료' : '링크 등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
