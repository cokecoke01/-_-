import React, { useState, useEffect } from 'react';
import { X, RefreshCw, BarChart3, ExternalLink, Eye } from 'lucide-react';
import { StatsData, LinkStat } from '../types';
import { PlatformIcon } from './PlatformIcon';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1746E8] flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                통계 확인하기
              </h2>
              <p className="text-xs text-gray-500">실제 링크별 방문 결과</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={fetchStats}
              disabled={loading}
              className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-gray-100 transition-colors"
              title="새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body - Only the actual link visit results */}
        <div className="p-6 space-y-3.5">
          {loading && !stats ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400">
              <RefreshCw className="w-7 h-7 animate-spin text-[#1746E8] mb-2" />
              <p className="text-xs font-medium">통계 불러오는 중...</p>
            </div>
          ) : stats && stats.linkStats.length > 0 ? (
            stats.linkStats.map((link: LinkStat) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50/40 border border-gray-200 rounded-xl transition-colors"
              >
                {/* Platform Icon & Title */}
                <div className="flex items-center gap-3 min-w-0">
                  <PlatformIcon icon={link.icon} className="w-10 h-10" />
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-base leading-tight truncate">
                      {link.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5 max-w-[180px] sm:max-w-[220px]">
                      {link.url}
                    </p>
                  </div>
                </div>

                {/* Actual Click/Visit Result */}
                <div className="text-right shrink-0 pl-3">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-2xl font-black text-[#1746E8]">
                      {link.clicks.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">회</span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">실제 방문</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-400 text-sm">
              등록된 링크 데이터가 없습니다.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">
            총 방문 합계: <strong className="text-gray-900 font-bold">{stats?.totalClicks || 0}회</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-[#1746E8] hover:bg-[#1238BE] rounded-md shadow-xs transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
