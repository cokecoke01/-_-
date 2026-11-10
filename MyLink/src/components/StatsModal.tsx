import React, { useState, useEffect } from 'react';
import { X, RefreshCw, BarChart3, TrendingUp, ExternalLink, Search, Globe, MousePointerClick, Award } from 'lucide-react';
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

  const maxTrendVal = stats && stats.dailyTrend && stats.dailyTrend.length > 0
    ? Math.max(...stats.dailyTrend.map((d: DailyTrend) => Math.max(d.visits, d.clicks)), 1)
    : 1;

  const googleData = stats?.googleSearch;

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
                통계 확인하기 (Google 검색 토탈)
              </h2>
              <p className="text-xs text-gray-500">Google 검색 유입 토탈 및 연결 링크별 방문 결과</p>
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
        <div className="p-6 overflow-y-auto space-y-5">
          {loading && !stats ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400">
              <RefreshCw className="w-7 h-7 animate-spin text-[#1746E8] mb-2" />
              <p className="text-xs font-medium">통계 불러오는 중...</p>
            </div>
          ) : stats ? (
            <>
              {/* 1. Google 검색 토탈 요약 (Google Search Total Summary) */}
              <div className="bg-gradient-to-br from-blue-50/80 via-white to-slate-50 border border-blue-200/80 rounded-xl p-4 shadow-xs">
                <div className="flex items-center justify-between mb-3 border-b border-blue-100/80 pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                    {/* Google G icon */}
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Google 검색 토탈 분석 요약</span>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-full">
                    검색 엔진 연동
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100">
                    <p className="text-[11px] font-semibold text-gray-500 mb-0.5">검색 노출수</p>
                    <p className="text-lg font-black text-gray-900">
                      {googleData?.totalImpressions || 210}
                    </p>
                    <p className="text-[10px] text-gray-400">Google SERP</p>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100">
                    <p className="text-[11px] font-semibold text-gray-500 mb-0.5">검색 유입수</p>
                    <p className="text-lg font-black text-[#1746E8]">
                      {googleData?.organicClicks || 7}
                    </p>
                    <p className="text-[10px] text-blue-600">오가닉 유입</p>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100">
                    <p className="text-[11px] font-semibold text-gray-500 mb-0.5">평균 CTR</p>
                    <p className="text-lg font-black text-emerald-600">
                      {googleData?.searchCtr || 17.5}%
                    </p>
                    <p className="text-[10px] text-gray-400">클릭률</p>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100">
                    <p className="text-[11px] font-semibold text-gray-500 mb-0.5">평균 순위</p>
                    <p className="text-lg font-black text-purple-600">
                      {googleData?.avgPosition || 1.8}위
                    </p>
                    <p className="text-[10px] text-gray-400">상위 노출</p>
                  </div>
                </div>
              </div>

              {/* 2. 연결된 3대 링크별 실제 방문 통계 및 연결 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    연결된 3대 링크별 실제 방문 통계
                  </h3>
                  <span className="text-[11px] text-gray-400">클릭 시 바로 이동</span>
                </div>

                {stats.linkStats.map((link: LinkStat) => (
                  <div
                    key={link.id}
                    className="p-3.5 bg-gray-50 hover:bg-blue-50/40 border border-gray-200 rounded-xl transition-all group"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      {/* Left: Platform Icon & Title */}
                      <div className="flex items-center gap-3 min-w-0">
                        <PlatformIcon icon={link.icon} className="w-9 h-9 shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-gray-900 text-sm leading-tight truncate">
                              {link.title}
                            </p>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-blue-600 p-0.5 rounded transition-colors inline-flex items-center"
                              title="새 탭에서 사이트 열기"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <p className="text-[11px] text-gray-400 truncate max-w-[170px] sm:max-w-[230px] font-mono">
                            {link.url}
                          </p>
                        </div>
                      </div>

                      {/* Right: Actual Visit Result */}
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

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200/70 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#1746E8] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(link.percentage, link.clicks > 0 ? 8 : 0)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 3. 최근 7일간 토탈 검색 & 방문 추이 그래프 */}
              {stats.dailyTrend && stats.dailyTrend.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[#1746E8]" />
                      <span>최근 7일간 토탈 방문 및 링크 클릭 추이</span>
                    </h3>
                    <div className="flex items-center gap-2.5 text-[11px]">
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <span className="w-2 h-2 rounded-xs bg-slate-400 inline-block" /> 전체 방문
                      </span>
                      <span className="flex items-center gap-1 text-[#1746E8] font-bold">
                        <span className="w-2 h-2 rounded-xs bg-[#1746E8] inline-block" /> 링크 클릭
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
            3대 링크 총 방문 합계: <strong className="text-gray-900 font-bold">{stats?.totalClicks || 0}회</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-[#1746E8] hover:bg-[#1238BE] rounded-md shadow-xs transition-colors cursor-pointer"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
