import React from 'react';
import { Eye, Pencil, Trash2, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { LinkItem } from '../types';
import { PlatformIcon } from './PlatformIcon';

interface LinkCardProps {
  link: LinkItem;
  isAdmin: boolean;
  isFirst: boolean;
  isLast: boolean;
  onClick: (link: LinkItem) => void;
  onEdit: (link: LinkItem) => void;
  onDelete: (link: LinkItem) => void;
  onMoveUp: (link: LinkItem) => void;
  onMoveDown: (link: LinkItem) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({
  link,
  isAdmin,
  isFirst,
  isLast,
  onClick,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  return (
    <div
      onClick={() => onClick(link)}
      className="group relative w-full bg-white border border-gray-200/90 rounded-md p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer flex items-center justify-between"
    >
      {/* Left side: Platform Icon + Details */}
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 pr-2">
        <PlatformIcon icon={link.icon} className="w-11 h-11" />
        
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg tracking-tight group-hover:text-[#1746E8] transition-colors truncate">
              {link.title}
            </h3>
            {!isAdmin && (
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            )}
          </div>

          {/* Description if present */}
          {link.description && (
            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs sm:max-w-md">
              {link.description}
            </p>
          )}

          {/* View Counter (Matches reference: Eye icon + count) */}
          <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 font-medium">
            <Eye className="w-3.5 h-3.5 text-gray-400" />
            <span>{link.clicks.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Right side: Action buttons */}
      <div
        className="flex items-center gap-1 sm:gap-1.5 shrink-0"
        onClick={(e) => e.stopPropagation()} // Prevent triggering card link navigation
      >
        {isAdmin ? (
          <>
            {/* Reorder Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-0.5 mr-1">
              <button
                onClick={() => onMoveUp(link)}
                disabled={isFirst}
                className={`p-1 rounded-sm transition-colors ${
                  isFirst
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                }`}
                title="위로 이동"
                aria-label="위로 이동"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onMoveDown(link)}
                disabled={isLast}
                className={`p-1 rounded-sm transition-colors ${
                  isLast
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                }`}
                title="아래로 이동"
                aria-label="아래로 이동"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Edit Button (Pencil) */}
            <button
              onClick={() => onEdit(link)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="링크 수정"
              aria-label="링크 수정"
            >
              <Pencil className="w-4 h-4" />
            </button>

            {/* Delete Button (Trash) */}
            <button
              onClick={() => onDelete(link)}
              className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
              title="링크 삭제"
              aria-label="링크 삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all p-2">
            <ExternalLink className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
};
