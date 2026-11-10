import React from 'react';
import { Eye, ExternalLink } from 'lucide-react';
import { LinkItem } from '../types';
import { PlatformIcon } from './PlatformIcon';

interface LinkCardProps {
  link: LinkItem;
  onClick: (link: LinkItem) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({ link, onClick }) => {
  return (
    <div
      onClick={() => onClick(link)}
      className="group relative w-full bg-white border border-gray-200/90 rounded-md p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-blue-400 hover:bg-blue-50/10 transition-all duration-200 cursor-pointer flex items-center justify-between"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(link);
        }
      }}
    >
      {/* Left side: Platform Icon + Details */}
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 pr-2">
        <PlatformIcon icon={link.icon} className="w-11 h-11 shrink-0" />

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg tracking-tight group-hover:text-[#1746E8] transition-colors truncate">
              {link.title}
            </h3>
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

      {/* Right side: External CTA Icon */}
      <div className="flex items-center text-gray-400 group-hover:text-[#1746E8] group-hover:translate-x-1 transition-all duration-150 p-2 shrink-0">
        <ExternalLink className="w-4 h-4" />
      </div>
    </div>
  );
};
