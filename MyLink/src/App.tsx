/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Plus, Eye, Sparkles, RefreshCw, AlertCircle, RotateCcw } from 'lucide-react';
import { UserProfile, LinkItem, IconType } from './types';
import { Header } from './components/Header';
import { ProfileCard } from './components/ProfileCard';
import { LinkCard } from './components/LinkCard';
import { LinkModal } from './components/LinkModal';
import { DeleteModal } from './components/DeleteModal';
import { StatsModal } from './components/StatsModal';
import { ProfileModal } from './components/ProfileModal';
import { Toast } from './components/Toast';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>({
    name: '김동영',
    username: 'dongyoung',
    bio: '사람의 심리를 읽고, 브랜드의 이야기를 기획하는 광고·마케팅 기획자',
    tagline: '사람을 관찰하고, 마음을 읽고, 브랜드의 이야기를 기획합니다.',
    email: 'ehrtnfl9700@gmail.com',
    avatar: '/cat-avatar.svg',
  });

  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Modals state
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [deletingLink, setDeletingLink] = useState<LinkItem | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2800);
  };

  // Get or initialize visitorId for accurate analytics
  const getVisitorId = () => {
    let id = localStorage.getItem('mylink_visitor_id');
    if (!id) {
      id = 'vis_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('mylink_visitor_id', id);
    }
    return id;
  };

  // Load initial data & record visit
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const [profileRes, linksRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/links'),
        ]);

        const profileData = await profileRes.json();
        const linksData = await linksRes.json();

        if (profileData.success && profileData.profile) {
          setProfile(profileData.profile);
        }
        if (linksData.success && Array.isArray(linksData.links)) {
          setLinks(linksData.links);
        }

        // Record real visit in persistent database
        const visitorId = getVisitorId();
        await fetch('/api/visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitorId }),
        });
      } catch (err) {
        console.error('Failed to initialize app data:', err);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  // Handle clicking a link card
  const handleLinkClick = async (link: LinkItem) => {
    const visitorId = getVisitorId();

    // Optimistically update click count in UI
    setLinks((prev) =>
      prev.map((l) => (l.id === link.id ? { ...l, clicks: l.clicks + 1 } : l))
    );

    // Call API to persist real view count in database
    try {
      fetch(`/api/links/${link.id}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId }),
      }).catch((e) => console.error('Click logging failed', e));
    } catch (e) {
      console.error(e);
    }

    // Navigate to target URL in new tab
    if (link.url) {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Save new or edited link
  const handleSaveLink = async (formData: {
    title: string;
    url: string;
    icon: IconType;
    description?: string;
  }) => {
    try {
      if (editingLink) {
        // Update existing link
        const res = await fetch(`/api/links/${editingLink.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success && data.link) {
          setLinks((prev) =>
            prev.map((l) => (l.id === editingLink.id ? data.link : l))
          );
          showToast('링크가 성공적으로 수정되었습니다.');
        }
      } else {
        // Create new link
        const res = await fetch('/api/links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success && data.link) {
          setLinks((prev) => [...prev, data.link]);
          showToast('새로운 링크가 추가되었습니다.');
        }
      }
      setIsLinkModalOpen(false);
      setEditingLink(null);
    } catch (err) {
      console.error('Failed to save link:', err);
      showToast('링크 저장 중 오류가 발생했습니다.');
    }
  };

  // Delete link
  const handleConfirmDelete = async () => {
    if (!deletingLink) return;
    try {
      const res = await fetch(`/api/links/${deletingLink.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setLinks((prev) => prev.filter((l) => l.id !== deletingLink.id));
        showToast('링크가 삭제되었습니다.');
      }
      setDeletingLink(null);
    } catch (err) {
      console.error('Failed to delete link:', err);
      showToast('링크 삭제 중 오류가 발생했습니다.');
    }
  };

  // Move link up
  const handleMoveUp = async (link: LinkItem) => {
    const index = links.findIndex((l) => l.id === link.id);
    if (index <= 0) return;

    const newLinks = [...links];
    const temp = newLinks[index - 1];
    newLinks[index - 1] = newLinks[index];
    newLinks[index] = temp;

    setLinks(newLinks);

    try {
      await fetch('/api/links-order', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkIds: newLinks.map((l) => l.id) }),
      });
    } catch (err) {
      console.error('Failed to update link order:', err);
    }
  };

  // Move link down
  const handleMoveDown = async (link: LinkItem) => {
    const index = links.findIndex((l) => l.id === link.id);
    if (index >= links.length - 1) return;

    const newLinks = [...links];
    const temp = newLinks[index + 1];
    newLinks[index + 1] = newLinks[index];
    newLinks[index] = temp;

    setLinks(newLinks);

    try {
      await fetch('/api/links-order', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkIds: newLinks.map((l) => l.id) }),
      });
    } catch (err) {
      console.error('Failed to update link order:', err);
    }
  };

  // Save profile
  const handleSaveProfile = async (updated: UserProfile) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success && data.profile) {
        setProfile(data.profile);
        showToast('프로필 정보가 저장되었습니다.');
      }
      setIsProfileModalOpen(false);
    } catch (err) {
      console.error('Failed to save profile:', err);
      showToast('프로필 저장 중 오류가 발생했습니다.');
    }
  };

  // Copy link handler
  const handleCopyLink = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        showToast('링크가 복사되었습니다');
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      showToast('링크가 복사되었습니다');
    }
  };

  // Reset sample data
  const handleResetDemo = async () => {
    if (!window.confirm('초기 샘플 데이터로 복원하시겠습니까? 등록된 링크와 통계가 초기화됩니다.')) {
      return;
    }
    try {
      const res = await fetch('/api/reset-demo', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.data) {
        setProfile(data.data.profile);
        setLinks(data.data.links);
        showToast('기본 샘플 데이터로 복원되었습니다.');
      }
    } catch (err) {
      console.error('Failed to reset:', err);
    }
  };

  // Toggle admin/logout
  const handleToggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
      setIsPreviewMode(true);
      showToast('로그아웃되었습니다. 방문자 모드로 전환되었습니다.');
    } else {
      setIsAdmin(true);
      setIsPreviewMode(false);
      showToast('관리자 모드로 전환되었습니다.');
    }
  };

  // Active viewing mode
  const effectiveIsAdmin = isAdmin && !isPreviewMode;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1E2022] flex flex-col font-sans selection:bg-blue-100 selection:text-[#1746E8]">
      {/* Top Header */}
      <Header
        profile={profile}
        isAdmin={isAdmin}
        isPreviewMode={isPreviewMode}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
        onOpenStats={() => setIsStatsModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onCopyLink={handleCopyLink}
        onToggleAdmin={handleToggleAdmin}
      />

      {/* Visitor Preview Banner if in preview mode */}
      {isPreviewMode && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs sm:text-sm font-medium flex items-center justify-between shadow-xs">
          <div className="max-w-xl mx-auto flex items-center justify-between w-full">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>방문자 시점 미리보기 중입니다 (수정/삭제 비활성화, 클릭 시 실제 조회수 증가)</span>
            </span>
            <button
              onClick={() => setIsPreviewMode(false)}
              className="ml-4 underline hover:text-emerald-100 font-semibold cursor-pointer shrink-0"
            >
              관리 화면 복귀
            </button>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 pb-16">
        {/* Profile Card Section */}
        <ProfileCard
          profile={profile}
          isAdmin={effectiveIsAdmin}
          onEditProfile={() => setIsProfileModalOpen(true)}
        />

        {/* Add Link CTA Button (Only in Admin Mode) */}
        {effectiveIsAdmin && (
          <div className="mt-2 mb-6">
            <button
              onClick={() => {
                setEditingLink(null);
                setIsLinkModalOpen(true);
              }}
              className="w-full py-3.5 px-6 bg-[#1746E8] hover:bg-[#1238BE] text-white font-semibold text-base rounded-md shadow-xs hover:shadow-md transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>새로운 링크 추가하기</span>
            </button>
          </div>
        )}

        {/* Link Cards List Section */}
        <section className="mt-2 space-y-3.5" aria-label="등록된 링크 목록">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-gray-400">
              <RefreshCw className="w-8 h-8 animate-spin text-[#1746E8] mb-3" />
              <p className="text-sm font-medium">링크 목록을 불러오는 중...</p>
            </div>
          ) : links.length === 0 ? (
            <div className="py-12 px-6 text-center bg-white border border-dashed border-gray-300 rounded-lg">
              <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-base font-bold text-gray-800">등록된 링크가 없습니다</p>
              <p className="text-xs text-gray-500 mt-1">
                상단의 '+ 새로운 링크 추가하기' 버튼을 눌러 첫 번째 링크를 등록해보세요.
              </p>
            </div>
          ) : (
            links.map((link, idx) => (
              <LinkCard
                key={link.id}
                link={link}
                isAdmin={effectiveIsAdmin}
                isFirst={idx === 0}
                isLast={idx === links.length - 1}
                onClick={handleLinkClick}
                onEdit={(item) => {
                  setEditingLink(item);
                  setIsLinkModalOpen(true);
                }}
                onDelete={(item) => setDeletingLink(item)}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
              />
            ))
          )}
        </section>

        {/* Bottom Helper Info & Reset */}
        <div className="mt-12 pt-6 border-t border-gray-200/80 text-center text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 MyLink · {profile.name} Personal Branding</p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDemo}
              className="text-gray-400 hover:text-gray-600 inline-flex items-center gap-1"
              title="데이터 초기화"
            >
              <RotateCcw className="w-3 h-3" /> 샘플 복원
            </button>
          </div>
        </div>
      </main>

      {/* Modals */}
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => {
          setIsLinkModalOpen(false);
          setEditingLink(null);
        }}
        onSave={handleSaveLink}
        editingLink={editingLink}
      />

      <DeleteModal
        isOpen={Boolean(deletingLink)}
        link={deletingLink}
        onClose={() => setDeletingLink(null)}
        onConfirm={handleConfirmDelete}
      />

      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        profile={profile}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfile}
      />

      {/* Toast notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
