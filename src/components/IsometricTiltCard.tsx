/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PostLayers } from '../types';

interface IsometricTiltCardProps {
  title: string;
  tag: string;
  index: string;
  graphicUrl: string;
  layers?: PostLayers;
  description?: string;
  theme?: string; // 'light' | 'dark'
  aspectRatio?: number;
  onClick?: () => void;
}

export function IsometricTiltCard({
  title,
  tag,
  index,
  graphicUrl,
  layers,
  description,
  theme = 'light',
  aspectRatio: propAspectRatio,
  onClick,
}: IsometricTiltCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    if (propAspectRatio !== undefined) {
      setAspectRatio(propAspectRatio);
      return;
    }
    if (!graphicUrl) return;
    const img = new Image();
    img.src = graphicUrl;
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setAspectRatio(img.naturalWidth / img.naturalHeight);
      }
    };
  }, [graphicUrl, propAspectRatio]);

  const isDarkTheme = theme === 'dark';
  const cardBgClass = isDarkTheme 
    ? 'bg-neutral-100 text-[#231f20] border-black' 
    : 'bg-[#fafafa] text-[#231f20] border-black';
  const shadowClass = 'shadow-[4px_4px_0px_0px_rgba(35,31,32,1)]';

  // Fallback styling background
  const fallbackBg = 'bg-[#ff9ec6]';

  // For vertical/portrait images (ratio < 0.95), we force the displayed aspect ratio to 1.0 (square like "the puff" keychain mockup)
  const displayAspectRatio = aspectRatio !== null 
    ? (aspectRatio < 0.95 ? 1.0 : aspectRatio) 
    : 0.8;

  return (
    <div 
      className={`relative w-full rounded-none border-[3px] border-black ${cardBgClass} ${shadowClass} overflow-hidden flex flex-col justify-between p-1.5 sm:p-2 md:p-2.5 select-none transition-all duration-300 hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(35,31,32,1)] cursor-pointer`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Small header info */}
      <div className="flex justify-between items-center mb-1 sm:mb-1.5">
        <span className="px-1 py-0.5 text-[7px] sm:text-[8px] md:text-[9px] font-mono font-black border border-black bg-black text-[#ff9ec6] uppercase">
          {tag}
        </span>
        <span className="font-mono text-[9px] sm:text-[10px] font-bold tracking-wider">{index}</span>
      </div>

      {/* Main Flat Graphic Container with Dynamic Aspect Ratio */}
      <div 
        className="relative w-full bg-black border border-black overflow-hidden mb-1 sm:mb-1.5"
        style={{ aspectRatio: displayAspectRatio }}
      >
        {!imgFailed ? (
          <img
            src={graphicUrl}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
            onError={() => setImgFailed(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className={`w-full h-full ${fallbackBg} flex flex-col justify-center items-center p-1.5`}>
            <div className="bg-white border border-black font-mono font-black text-[8px] px-1 py-0.5 transform -rotate-2">
              POSTER ART
            </div>
            <p className="font-sans font-black text-[10px] text-center uppercase tracking-tight mt-1 leading-none text-black">
              {title}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Title Info */}
      <div className="flex flex-col gap-0.5 text-[#231f20]">
        <h3 className="font-display font-black text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-tight truncate leading-tight">
          {title}
        </h3>
        {description && (
          <p className="text-[7px] sm:text-[8px] md:text-[9px] font-mono text-gray-500 leading-none line-clamp-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default IsometricTiltCard;
