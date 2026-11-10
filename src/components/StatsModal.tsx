import React, { useState, useEffect } from 'react';
import { X, RefreshCw, BarChart3, TrendingUp, Users } from 'lucide-react';
import { StatsData, LinkStat, DailyTrend } from '../types';
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

  // Maximum value for the 7-day trend graph height scaling
  const maxTrendVal = stats && stats.dailyTrend && stats.dailyTrend.length > 0
    ? Math.max(...stats.dailyTrend.map((d: DailyTrend) => Math.max(d.visits, d.clicks)), 1)
    : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1746E8] flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                통계 확인하기
              </h2>
              <p className="text-xs text-gray-500">실제 링크별 방문 결과 및 추이 그래프</p>
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading && !stats ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400">
              <RefreshCw className="w-7 h-7 animate-spin text-[#1746E8] mb-2" />
              <p className="text-xs font-medium">통계 불러오는 중...</p>
            </div>
          ) : stats ? (
            <>
              {/* 1. Link Visit Cards with Proportion Bars */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  각 링크별 실제 방문수
                </h3>
                {stats.linkStats.map((link: LinkStat) => (
                  <div
                    key={link.id}
                    className="p-3.5 bg-gray-50 hover:bg-blue-50/40 border border-gray-200 rounded-xl transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      {/* Left: Platform Icon & Title */}
                      <div className="flex items-center gap-3 min-w-0">
                        <PlatformIcon icon={link.icon} className="w-9 h-9" />
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm leading-tight truncate">
                            {link.title}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate max-w-[170px] sm:max-w-[220px]">
                            {link.url}
                          </p>
                        </div>
                      </div>

                      {/* Right: Actual Visit Count */}
                      <div className="text-right shrink-0">
                        <div className="flex items-baseline justify-end gap-1">
                          <span className="text-xl font-black text-[#1746E8]">
                            {link.clicks.toLocaleString()}
                          </span>
                          <span className="text-xs font-semibold text-gray-500">회</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">
                          점유율 {link.percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Visual Comparison Progress Bar */}
                    <div className="w-full bg-gray-200/70 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#1746E8] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(link.percentage, link.clicks > 0 ? 8 : 0)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 2. Visual 7-Day Trend Bar Chart */}
              {stats.dailyTrend && stats.dailyTrend.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[#1746E8]" />
                      <span>최근 7일간 방문 및 클릭 추이 그래프</span>
                    </h3>
                    <div className="flex items-center gap-2.5 text-[11px]">
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <span className="w-2 h-2 rounded-xs bg-slate-400 inline-block" /> 방문수
                      </span>
                      <span className="flex items-center gap-1 text-[#1746E8] font-bold">
                        <span className="w-2 h-2 rounded-xs bg-[#1746E8] inline-block" /> 클릭수
                      </span>
                    </div>
                  </div>

                  {/* Dual Bar Chart */}
                  <div className="h-32 flex items-end justify-between gap-1.5 pt-4 pb-1 px-1 border-b border-slate-200">
                    {stats.dailyTrend.map((day: DailyTrend) => {
                      const visitHeight = Math.max((day.visits / maxTrendVal) * 100, 6);
                      const clickHeight = Math.max((day.clicks / maxTrendVal) * 100, 6);

                      return (
                        <div
                          key={day.date}
                          className="flex-1 flex flex-col items-center gap-1 h-full justify-end group"
                        >
                          <div className="w-full flex items-end justify-center gap-1 h-20 relative">
                            {/* Hover tooltip */}
                            <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                              방문 {day.visits} / 클릭 {day.clicks}
                            </div>
                            {/* Visit bar */}
                            <div
                              style={{ height: `${visitHeight}%` }}
                              className="w-2 sm:w-2.5 bg-slate-300 rounded-t-xs transition-all duration-300 group-hover:bg-slate-400"
                              title={`방문: ${day.visits}`}
                            />
                            {/* Click bar */}
                            <div
                              style={{ height: `${clickHeight}%` }}
                              className="w-2 sm:w-2.5 bg-[#1746E8] rounded-t-xs transition-all duration-300 group-hover:bg-blue-700"
                              title={`클릭: ${day.clicks}`}
                            />
                          </div>
                          <span className="text-[10px] font-medium text-slate-500 mt-1">
                            {day.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-gray-600 font-medium">
            전체 누적 클릭: <strong className="text-gray-900 font-bold">{stats?.totalClicks || 0}회</strong>
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
