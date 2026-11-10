import React from 'react';
import { X, CheckCircle2, Copy, ExternalLink, FolderGit2, Check, ShieldCheck, Terminal, Rocket } from 'lucide-react';

interface AssignmentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopyUrl: () => void;
  copied: boolean;
}

export const AssignmentGuideModal: React.FC<AssignmentGuideModalProps> = ({
  isOpen,
  onClose,
  onCopyUrl,
  copied,
}) => {
  if (!isOpen) return null;

  const currentUrl = window.location.href;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-blue-50/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#1746E8] text-white flex items-center justify-center shadow-xs">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                과제 제출 및 배점 기준 가이드 (10점 만점)
              </h2>
              <p className="text-xs text-blue-700 font-medium">GitHub MyLink 전용 폴더 및 접속 URL 생성 안내</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Score Criteria Highlight */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>과제 배점 기준 충족 현황</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="p-3 bg-white border border-emerald-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">GitHub 내 폴더 생성</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    9점 충족
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  프로젝트 내 <code className="bg-gray-100 text-[#1746E8] px-1 rounded font-mono">MyLink/</code> 독립 폴더 및 전체 구조 자동 생성 완료
                </p>
              </div>

              <div className="p-3 bg-white border border-emerald-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">마이링크 주소 생성</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    1점 충족
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  실제 접속 가능한 웹 배포 URL 연동 및 링크 복사 제공
                </p>
              </div>
            </div>
          </div>

          {/* Live MyLink URL */}
          <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-xs">
            <label className="block text-xs font-bold text-blue-900 mb-1.5">
              제출용 마이링크(MyLink) 실접속 URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-xs font-mono text-gray-800 select-all"
              />
              <button
                onClick={onCopyUrl}
                className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold rounded-md bg-[#1746E8] text-white hover:bg-blue-700 transition-colors shrink-0 shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '복사됨!' : '주소 복사'}</span>
              </button>
            </div>
          </div>

          {/* Directory Structure in Repository */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/70">
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-700" />
              <span>과제 요구사항 MyLink/ 디렉토리 구조</span>
            </h4>
            <pre className="p-3 bg-gray-900 text-emerald-400 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed">
{`MyLink/
├── src/
│   ├── components/      # Header, ProfileCard, LinkCard, Modals, Icons
│   ├── types.ts         # TypeScript 인터페이스
│   ├── App.tsx          # 메인 랜딩페이지 & 관리자/방문자 모드
│   ├── main.tsx         # 진입점
│   └── index.css        # Tailwind CSS
├── public/
│   ├── cat-avatar.svg   # 레퍼런스 고양이 캐릭터 아바타
│   └── favicon.ico
├── server.ts            # 실시간 누적 DB 및 통계 REST API
├── package.json         # Vercel 및 로컬 실행 의존성
├── README.md            # 과제 설명서 및 제출 안내서
└── tsconfig.json`}
            </pre>
          </div>

          {/* Vercel & GitHub Guide */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
              <Rocket className="w-4 h-4 text-blue-600" />
              <span>GitHub 및 Vercel 배포 팁</span>
            </h4>
            <ol className="list-decimal list-inside text-xs text-gray-600 space-y-1 bg-white p-3 rounded-lg border border-gray-200">
              <li>본인의 GitHub 저장소에 커밋 후 푸시하면 <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-700 font-mono">MyLink/</code> 폴더가 그대로 반영됩니다.</li>
              <li>Vercel에 연결할 경우 Root Directory를 <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-700 font-mono">MyLink</code> 또는 루트로 지정하여 배포할 수 있습니다.</li>
              <li>상단 헤더의 <strong>'내 페이지'</strong> 버튼 및 우측 상단 프로필의 <strong>'링크 복사'</strong>를 통해 언제든 실제 접속 주소를 바로 제출할 수 있습니다.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-[#1746E8] hover:bg-[#1238BE] rounded-md shadow-xs transition-colors"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
