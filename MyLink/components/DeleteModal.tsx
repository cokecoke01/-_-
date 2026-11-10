import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { LinkItem } from '../types';

interface DeleteModalProps {
  isOpen: boolean;
  link: LinkItem | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  link,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !link) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-rose-100 text-rose-600 rounded-full mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-gray-900 text-center">
          링크를 삭제하시겠습니까?
        </h3>
        
        <p className="mt-2 text-sm text-gray-600 text-center leading-relaxed">
          <strong className="text-gray-900 font-semibold">'{link.title}'</strong> 링크와 지금까지 누적된 조회수 통계가 함께 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md shadow-xs transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>삭제하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
