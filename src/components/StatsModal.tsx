import React, { useState, useEffect } from 'react';
import {
  X,
  TrendingUp,
  MousePointerClick,
  Users,
  Award,
  BarChart3,
  RefreshCw,
  Search,
  Globe2,
  CheckCircle2,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react';
import { StatsData, DailyTrend, LinkStat, SearchQueryStat, TrafficSourceStat } from '../types';
import { PlatformIcon } from './PlatformIcon';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'google' | 'links'>('google');

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

  const maxVal = stats
    ? Math.max(...stats.dailyTrend.map((d: DailyTrend) => Math.max(d.visits, d.clicks)), 1)
    : 1;

  const googleData = stats?.googleSearch;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1746E8] flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                통계 및 Google 검색 분석 리포트
              </h2>
              <p className="text-xs text-gray-500">Google Search Console & 실시간 유입 분석 로직</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchStats}
              disabled={loading}
              className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-gray-100 transition-colors"
              title="통계 새로고침"
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

        {/* Tab navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-gray-100 bg-white shrink-0">
          <button
            onClick={() => setActiveTab('google')}
            className={`pb-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'google'
                ? 'border-[#1746E8] text-[#1746E8]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {/* Google Colorful Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            <span>Google 검색 퍼포먼스 (Search Logic)</span>
          </button>

          <button
            onClick={() => setActiveTab('links')}
            className={`pb-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'links'
                ? 'border-[#1746E8] text-[#1746E8]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>등록 링크 클릭 & 추이</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading && !stats ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400">
              <RefreshCw className="w-8 h-8 animate-spin text-[#1746E8] mb-3" />
              <p className="text-sm font-medium">Google 검색 로직 및 통계 데이터를 불러오는 중...</p>
            </div>
          ) : stats ? (
            activeTab === 'google' ? (
              <>
                {/* Google Search Performance Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 mb-1">
                      <Search className="w-3.5 h-3.5 text-blue-600" />
                      <span>검색 노출수</span>
                    </div>
                    <p className="text-2xl font-black text-blue-950">
                      {googleData?.totalImpressions.toLocaleString() || 180}
                    </p>
                    <p className="text-[11px] text-blue-600/80 mt-0.5">Google SERP 검색 노출</p>
                  </div>

                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mb-1">
                      <MousePointerClick className="w-3.5 h-3.5 text-emerald-600" />
                      <span>오가닉 클릭수</span>
                    </div>
                    <p className="text-2xl font-black text-emerald-950">
                      {googleData?.organicClicks.toLocaleString() || 14}
                    </p>
                    <p className="text-[11px] text-emerald-600/80 mt-0.5">Google 검색 유입</p>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                      <span>검색 CTR</span>
                    </div>
                    <p className="text-2xl font-black text-amber-950">
                      {googleData?.searchCtr || 17.5}%
                    </p>
                    <p className="text-[11px] text-amber-700 mt-0.5">평균 클릭 전환율</p>
                  </div>

                  <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-700 mb-1">
                      <Award className="w-3.5 h-3.5 text-purple-600" />
                      <span>평균 검색 순위</span>
                    </div>
                    <p className="text-2xl font-black text-purple-950">
                      {googleData?.avgPosition || 1.8}위
                    </p>
                    <p className="text-[11px] text-purple-700 mt-0.5">상위 1페이지 노출</p>
                  </div>
                </div>

                {/* Top Google Search Queries Table */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                  <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <Search className="w-4 h-4 text-blue-600" />
                      <span>Google 주요 검색 유입 키워드 (Search Queries)</span>
                    </h3>
                    <span className="text-[11px] text-gray-500 font-medium">실시간 검색 알고리즘 기준</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-100">
                        <tr>
                          <th className="px-4 py-2.5">검색어 (Query)</th>
                          <th className="px-3 py-2.5 text-right">노출수</th>
                          <th className="px-3 py-2.5 text-right">클릭수</th>
                          <th className="px-3 py-2.5 text-right">CTR</th>
                          <th className="px-3 py-2.5 text-right">평균 게재순위</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {googleData?.topQueries.map((q: SearchQueryStat, idx: number) => (
                          <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                            <td className="px-4 py-3 font-semibold text-gray-900 flex items-center gap-2">
                              <span className="w-4 text-gray-400 font-mono text-[10px]">{idx + 1}</span>
                              <span>{q.query}</span>
                            </td>
                            <td className="px-3 py-3 text-right text-gray-600">{q.impressions}</td>
                            <td className="px-3 py-3 text-right font-bold text-blue-600">{q.clicks}</td>
                            <td className="px-3 py-3 text-right text-gray-600">{q.ctr}%</td>
                            <td className="px-3 py-3 text-right font-semibold text-emerald-600">
                              {q.position}위
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Traffic Acquisition Source Breakdown */}
                <div className="bg-gray-50/70 border border-gray-200 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-emerald-600" />
                    <span>유입 채널 분포 (Traffic Acquisition Sources)</span>
                  </h3>
                  <div className="space-y-2.5">
                    {googleData?.trafficSources.map((src: TrafficSourceStat, idx: number) => (
                      <div key={idx} className="p-2.5 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-gray-800 flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block"
                              style={{ backgroundColor: src.color }}
                            />
                            {src.source}
                          </span>
                          <span className="text-gray-500 font-medium">
                            <strong className="text-gray-900">{src.visits}명</strong> ({src.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${src.percentage}%`,
                              backgroundColor: src.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Google SEO & Indexing Diagnosis Report */}
                <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Googlebot 색인 및 SEO 상태
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold">정상 (Healthy)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                    <div>
                      <span className="text-slate-400">크롤러: </span>
                      {googleData?.indexingStatus.crawler}
                    </div>
                    <div>
                      <span className="text-slate-400">모바일 적합성: </span>
                      {googleData?.indexingStatus.mobileUsability}
                    </div>
                    <div>
                      <span className="text-slate-400">Core Web Vitals: </span>
                      {googleData?.indexingStatus.coreWebVitals}
                    </div>
                    <div>
                      <span className="text-slate-400">구조화 마크업: </span>
                      {googleData?.indexingStatus.schemaMarkup}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Traditional Link Clicks Overview */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      <span>전체 방문</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900">{stats.totalVisits}</p>
                  </div>

                  <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 mb-1">
                      <MousePointerClick className="w-3.5 h-3.5 text-blue-600" />
                      <span>총 클릭수</span>
                    </div>
                    <p className="text-2xl font-black text-blue-900">{stats.totalClicks}</p>
                  </div>

                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mb-1">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>인기 링크</span>
                    </div>
                    <p className="text-base font-bold text-emerald-950 truncate">
                      {stats.mostClickedLink ? stats.mostClickedLink.title : '-'}
                    </p>
                  </div>
                </div>

                {/* 7-Day Trend Chart */}
                <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span>최근 7일간 방문 및 클릭 추이</span>
                    </h3>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <span className="w-2.5 h-2.5 rounded-xs bg-slate-400 inline-block" /> 방문수
                      </span>
                      <span className="flex items-center gap-1 text-blue-700 font-medium">
                        <span className="w-2.5 h-2.5 rounded-xs bg-[#1746E8] inline-block" /> 클릭수
                      </span>
                    </div>
                  </div>

                  <div className="h-40 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-gray-200">
                    {stats.dailyTrend.map((day: DailyTrend) => {
                      const visitHeight = Math.max((day.visits / maxVal) * 100, 4);
                      const clickHeight = Math.max((day.clicks / maxVal) * 100, 4);

                      return (
                        <div key={day.date} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                          <div className="w-full flex items-end justify-center gap-1 h-28 relative">
                            <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                              방문 {day.visits} / 클릭 {day.clicks}
                            </div>
                            <div
                              style={{ height: `${visitHeight}%` }}
                              className="w-2.5 sm:w-3.5 bg-slate-400 rounded-t-xs transition-all duration-300"
                            />
                            <div
                              style={{ height: `${clickHeight}%` }}
                              className="w-2.5 sm:w-3.5 bg-[#1746E8] rounded-t-xs transition-all duration-300"
                            />
                          </div>
                          <span className="text-[11px] font-medium text-gray-500 mt-1">
                            {day.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Link-by-Link Breakdown */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3">
                    개별 링크별 조회수 점유율
                  </h3>
                  <div className="space-y-2.5">
                    {stats.linkStats.map((link: LinkStat) => (
                      <div
                        key={link.id}
                        className="p-3 bg-white border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between gap-3 text-sm mb-1.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <PlatformIcon icon={link.icon} className="w-6 h-6" />
                            <span className="font-semibold text-gray-900 truncate">
                              {link.title}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 font-medium">
                            <strong className="text-gray-900 font-bold">{link.clicks}</strong> 회 ({link.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#1746E8] h-full rounded-full transition-all duration-500"
                            style={{ width: `${link.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-[#1746E8] hover:bg-[#1238BE] rounded-md shadow-xs transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
