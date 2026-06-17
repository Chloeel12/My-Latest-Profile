/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, animate } from 'motion/react';
import { 
  Camera, 
  Paintbrush, 
  TrendingUp, 
  Podcast, 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Heart, 
  Share2, 
  Volume2, 
  Zap,
  Grid,
  Maximize2,
  Lock,
  FileSpreadsheet,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  PHOTOGRAPHY_WORKS, 
  POST_DESIGN_WORKS, 
  SOCIAL_MEDIA_WORKS, 
  PODCAST_WORKS 
} from '../data';
import { DynamicTicker } from './DynamicTicker';
import { IsometricTiltCard } from './IsometricTiltCard';
import { PhotographyWork, PostDesignWork, SocialMediaWork, PodcastWork, WorksCategory } from '../types';

// Image load helper for lightbox / normal slides to prevent standard broken icons to prevent re-instantiation and flickering
const ImageWithFallback = ({ src, alt, className, style }: { src: string; alt: string; className: string; style?: React.CSSProperties }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-yellow-101 to-pink-101 border-4 border-black text-black select-none ${className}`}>
        <div className="bg-white border-2 border-black font-mono font-black text-xs px-2 py-1 transform -rotate-1 shadow-brutal-sm">
          MEDIA ASSET
        </div>
        <p className="font-sans font-black text-lg text-center tracking-tight uppercase leading-none mt-4">{alt || "Untitled Piece"}</p>
        <p className="font-mono text-[10px] text-gray-500 mt-2">LOCAL STATIC PATH SOURCE</p>
      </div>
    );
  }
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      style={style}
      onError={() => setFailed(true)} 
      referrerPolicy="no-referrer" 
    />
  );
};

interface PhotoCardProps {
  photo: PhotographyWork;
  idx: number;
  openPhotoLightbox: (photo: PhotographyWork) => void;
  key?: React.Key | number;
}

const PhotoCard = ({ photo, idx, openPhotoLightbox }: PhotoCardProps) => {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    if (!photo.imageUrl) return;
    const img = new Image();
    img.src = photo.imageUrl;
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setAspectRatio(img.naturalWidth / img.naturalHeight);
      }
    };
  }, [photo.imageUrl]);

  const isPortrait = photo.isPortrait !== undefined ? photo.isPortrait : true;
  const computedAspect = aspectRatio !== null ? aspectRatio : (isPortrait ? 0.75 : 1.33);
  const isPortraitReal = computedAspect < 1.0;

  return (
    <div 
      className={`flex-none group relative bg-black border-4 border-black transition-all duration-300 hover:border-black shadow-[4px_4px_0px_0px_rgba(35,31,32,1)] hover:shadow-[7px_7px_0px_0px_rgba(35,31,32,1)] hover:-translate-y-1 cursor-pointer horizontal-snap-item transition-all duration-500 ${
        isPortraitReal 
          ? 'h-[210px] sm:h-[230px] md:h-[245px]' 
          : 'h-[150px] sm:h-[165px] md:h-[180px]'
      }`}
      style={{ aspectRatio: computedAspect }}
      onClick={() => openPhotoLightbox(photo)}
    >
      <div className="w-full h-full relative overflow-hidden bg-black">
        <ImageWithFallback 
          src={photo.imageUrl} 
          alt={photo.chineseTitle || photo.title || "Photo Item"} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          style={photo.imgStyle}
        />
        {/* Bottom Info Stripe banner */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black border-t-2 border-black flex flex-col justify-end text-white z-20">
          <div className="flex justify-between items-center text-[8px] font-mono text-[#fef9df] mb-0.5">
            <span>{photo.vol || 'VOL. UNK'}</span>
            {/* The P0... ID is deleted as requested */}
          </div>
          <h4 className="font-display font-bold text-[10px] sm:text-[11px] truncate uppercase tracking-tight">
            {photo.chineseTitle || photo.title}
          </h4>
        </div>
        {/* Hover Magnify Icon Banner */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end p-2 pointer-events-none">
          <div className="w-6 h-6 rounded-none bg-[#fef9df] border border-black flex items-center justify-center text-black">
            <Maximize2 size={11} className="stroke-[3]" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface WorksSectionProps {
  onBackToHome?: () => void;
}

export function WorksSection({ onBackToHome }: WorksSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // States
  const [activeCategory, setActiveCategory] = useState<WorksCategory>('photography');
  const [dragProgress, setDragProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  
  // Interactive detail modals
  const [selectedPhoto, setSelectedPhoto] = useState<PhotographyWork | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<PostDesignWork | null>(null);
  const [modalAspectRatio, setModalAspectRatio] = useState<number | null>(null);
  const [selectedSocial, setSelectedSocial] = useState<SocialMediaWork | null>(null);
  const [activePodcast, setActivePodcast] = useState<PodcastWork | null>(null);

  useEffect(() => {
    if (!selectedDesign) {
      setModalAspectRatio(null);
      return;
    }
    const imgUrl = selectedDesign.detailGraphicUrl || selectedDesign.graphicUrl;
    if (!imgUrl) return;
    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setModalAspectRatio(img.naturalWidth / img.naturalHeight);
      }
    };
  }, [selectedDesign]);
  
  // Audio Mock State
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(38); // percentage
  const [likeCount, setLikeCount] = useState<Record<string, number>>({
    'PC01': 124,
    'PC02': 98
  });
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});
  const [designAspectRatios, setDesignAspectRatios] = useState<Record<string, number>>({});

  useEffect(() => {
    POST_DESIGN_WORKS.forEach(work => {
      const img = new Image();
      img.src = work.graphicUrl;
      img.onload = () => {
        if (img.naturalWidth && img.naturalHeight) {
          setDesignAspectRatios(prev => ({
            ...prev,
            [work.id]: img.naturalWidth / img.naturalHeight
          }));
        }
      };
    });
  }, []);

  // Friction-based spring variables for STAY TUNED rubber-band pull
  const overscrollMV = useMotionValue(0);
  const springOverscroll = useSpring(overscrollMV, {
    stiffness: 80, // Gentler spring resistance
    damping: 18,   // Beautiful smooth glide bounce
    mass: 1.0
  });

  const springBackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const snapLockRef = useRef<boolean>(false);
  const snapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // New Section-level Snapping and Interactive Rebound Refs
  const activeSnapAnimRef = useRef<any>(null);
  const isNavigatingRef = useRef<boolean>(false);
  const wheelStopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hoveringWorkStackRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const activeHoveredStreamRef = useRef<HTMLElement | null>(null);
  const isEdgeReleasingRef = useRef<boolean>(false);

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  const triggerSectionSnap = () => {
    if (isDraggingRef.current || isNavigatingRef.current) return;

    // Status Interception: Block snapping when user is actively inside a work stream, unless we released the edge boundary
    if (activeHoveredStreamRef.current && !isEdgeReleasingRef.current) {
      return;
    }

    const el = scrollContainerRef.current;
    if (!el) return;

    const currentScroll = el.scrollLeft;

    // Check if we are near any card-snapping items. If they are in progress or cursor hovers over them,
    // we bypass section snapping to keep focus on nested items.
    const snapItems = Array.from(el.querySelectorAll('.horizontal-snap-item')) as HTMLElement[];
    const containerRect = el.getBoundingClientRect();
    
    let isNearAnyCard = false;
    if (snapItems.length > 0) {
      const itemsWithTargets = snapItems.map((item) => {
        const rect = item.getBoundingClientRect();
        const itemOffsetInContainer = el.scrollLeft + rect.left - containerRect.left;
        const targetScroll = itemOffsetInContainer - (containerRect.width / 2) + (rect.width / 2);
        return Math.max(0, targetScroll);
      });

      const distances = itemsWithTargets.map(t => Math.abs(currentScroll - t));
      const minDiff = Math.min(...distances);
      if (minDiff < 85 && hoveringWorkStackRef.current) {
        isNearAnyCard = true;
      }
    }

    if (isNearAnyCard) {
      return;
    }

    const sectionIds = ['photography', 'design', 'social', 'podcast', 'pending'];
    const candidates = sectionIds.map((id) => {
      const sectionEl = document.getElementById(`sec-${id}`);
      return {
        id,
        offsetLeft: sectionEl ? sectionEl.offsetLeft : null
      };
    }).filter(c => c.offsetLeft !== null) as { id: string; offsetLeft: number }[];

    if (candidates.length === 0) return;

    let closestSection = candidates[0];
    let minDistance = Math.abs(currentScroll - candidates[0].offsetLeft);

    candidates.forEach((candidate) => {
      const dist = Math.abs(currentScroll - candidate.offsetLeft);
      if (dist < minDistance) {
        minDistance = dist;
        closestSection = candidate;
      }
    });

    const targetScroll = closestSection.offsetLeft;

    if (activeSnapAnimRef.current) {
      activeSnapAnimRef.current.stop();
    }

    activeSnapAnimRef.current = animate(currentScroll, targetScroll, {
      type: 'spring',
      stiffness: 95,
      damping: 17,
      mass: 0.9,
      onUpdate: (latest) => {
        if (el) {
          el.scrollLeft = latest;
        }
      },
      onComplete: () => {
        activeSnapAnimRef.current = null;
        const catMap: Record<string, WorksCategory> = {
          photography: 'photography',
          design: 'design',
          social: 'social',
          podcast: 'podcast',
          pending: 'pending'
        };
        const cat = catMap[closestSection.id];
        if (cat) {
          setActiveCategory(cat);
        }
      }
    });
  };

  const scheduleDynamicSpringBack = () => {
    if (springBackTimeoutRef.current) {
      clearTimeout(springBackTimeoutRef.current);
    }
    // Give user 1500ms of peace to read or look at STAY TUNED before auto-spring-back
    springBackTimeoutRef.current = setTimeout(() => {
      overscrollMV.set(0);
    }, 1500);
  };

  const cancelSpringBack = () => {
    if (springBackTimeoutRef.current) {
      clearTimeout(springBackTimeoutRef.current);
      springBackTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (springBackTimeoutRef.current) {
        clearTimeout(springBackTimeoutRef.current);
      }
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }
      if (wheelStopTimeoutRef.current) {
        clearTimeout(wheelStopTimeoutRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (activeSnapAnimRef.current) {
        activeSnapAnimRef.current.stop();
      }
    };
  }, []);

  // Keyboard navigation, contextual scroll step snaps & horizontal mouse wheel redirection
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;

      // 1. If user is hovering inside an element with vertical scroll (overflow-y-auto, sheet / metrics list etc.)
      const vertScrollEl = target?.closest('.overflow-y-auto') as HTMLElement | null;
      if (vertScrollEl && vertScrollEl.scrollHeight > vertScrollEl.clientHeight) {
        // Let native scrolling handle vertical scrolling of the sheet / metrics list
        return;
      }

      // Stop any running snapping animation as soon as the user touches the wheel
      if (activeSnapAnimRef.current) {
        activeSnapAnimRef.current.stop();
        activeSnapAnimRef.current = null;
      }

      // ALWAYS clear the outer snap timeout as soon as the user uses the scroll wheel
      if (wheelStopTimeoutRef.current) {
        clearTimeout(wheelStopTimeoutRef.current);
        wheelStopTimeoutRef.current = null;
      }

      // 2. Check if user is hovering inside a horizontal work stream
      const horizScrollEl = activeHoveredStreamRef.current || (target?.closest('.detailed-work-stream') as HTMLElement | null);
      if (horizScrollEl && horizScrollEl.scrollWidth > horizScrollEl.clientWidth) {
        const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
        if (delta !== 0) {
          const curScroll = horizScrollEl.scrollLeft;
          const maxScroll = horizScrollEl.scrollWidth - horizScrollEl.clientWidth;

          const isAtRightBoundary = curScroll >= maxScroll - 2;
          const isAtLeftBoundary = curScroll <= 2;

          const isScrollingRightAtRight = delta > 0 && isAtRightBoundary;
          const isScrollingLeftAtLeft = delta < 0 && isAtLeftBoundary;

          if (isScrollingRightAtRight || isScrollingLeftAtLeft) {
            // Edge Release: User has scrolled to the edge and continues in that direction. 
            // Allow outer container scroll & snapping by manually scrolling the outer container.
            isEdgeReleasingRef.current = true;
            e.preventDefault();
            const outerDelta = delta * 1.3;
            el.scrollLeft = el.scrollLeft + outerDelta;

            // Schedule smart section auto snap when scrolling stops near the edge
            if (wheelStopTimeoutRef.current) {
              clearTimeout(wheelStopTimeoutRef.current);
            }
            wheelStopTimeoutRef.current = setTimeout(() => {
              triggerSectionSnap();
            }, 250);
            return;
          } else {
            // Status Interception: Block outer snapping of page entirely and intercept scroll
            isEdgeReleasingRef.current = false;

            if (wheelStopTimeoutRef.current) {
              clearTimeout(wheelStopTimeoutRef.current);
              wheelStopTimeoutRef.current = null;
            }

            e.preventDefault();
            horizScrollEl.scrollLeft = Math.max(0, Math.min(maxScroll, curScroll + delta * 0.95));
            return;
          }
        }
      }

      // If active step snapping transition is in progress, cushion additional wheel signals
      if (snapLockRef.current) {
        e.preventDefault();
        return;
      }

      // Standard page navigation: Scrolling scroll wheel moves the main viewport horizontally
      if (e.deltaY !== 0) {
        e.preventDefault();
        const delta = e.deltaY * 1.3; // Comfortably responsive scrolling speed
        el.scrollLeft = el.scrollLeft + delta;
      }

      // Schedule smart section auto snap when scrolling stops
      if (wheelStopTimeoutRef.current) {
        clearTimeout(wheelStopTimeoutRef.current);
      }
      wheelStopTimeoutRef.current = setTimeout(() => {
        triggerSectionSnap();
      }, 250);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Update active section category based on scroll position (Immersive Theme toggler)
  const handleScroll = (e?: React.UIEvent<HTMLDivElement>) => {
    if (e && e.target !== e.currentTarget) {
      return; // Ignore scroll events bubbling up from nested scrollable child elements
    }
    const el = scrollContainerRef.current;
    if (!el) return;

    if (!isScrolling) {
      setIsScrolling(true);
    }
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);

    const scrollLeft = el.scrollLeft;
    const scrollWidth = el.scrollWidth - el.clientWidth;
    const progress = scrollWidth > 0 ? scrollLeft / scrollWidth : 0;
    setDragProgress(progress);

    // Dynamic thresholds based on horizontal child width
    const sections = ['photography', 'design', 'social', 'podcast', 'pending'] as const;
    
    // Detect which section occupies the main viewport center
    let currentIdx = 0;
    const scrollCenter = scrollLeft + el.clientWidth / 2;
    
    const photographyEl = document.getElementById('sec-photography');
    const designEl = document.getElementById('sec-design');
    const socialEl = document.getElementById('sec-social');
    const podcastEl = document.getElementById('sec-podcast');
    const pendingEl = document.getElementById('sec-pending');

    if (photographyEl && designEl && socialEl && podcastEl && pendingEl) {
      const offsets = [
        photographyEl.offsetLeft + photographyEl.clientWidth / 2,
        designEl.offsetLeft + designEl.clientWidth / 2,
        socialEl.offsetLeft + socialEl.clientWidth / 2,
        podcastEl.offsetLeft + podcastEl.clientWidth / 2,
        pendingEl.offsetLeft + pendingEl.clientWidth / 2
      ];

      let minDiff = Infinity;
      offsets.forEach((centerOffset, idx) => {
        const diff = Math.abs(scrollCenter - centerOffset);
        if (diff < minDiff) {
          minDiff = diff;
          currentIdx = idx;
        }
      });

      if (sections[currentIdx] !== activeCategory) {
        setActiveCategory(sections[currentIdx]);
      }
    }
  };

  // Scroll to section helper
  const scrollToSection = (id: string, cat: WorksCategory) => {
    const sectionEl = document.getElementById(`sec-${id}`);
    const container = scrollContainerRef.current;
    if (sectionEl && container) {
      if (activeSnapAnimRef.current) {
        activeSnapAnimRef.current.stop();
        activeSnapAnimRef.current = null;
      }
      isNavigatingRef.current = true;
      container.scrollTo({
        left: sectionEl.offsetLeft,
        behavior: 'smooth'
      });
      setActiveCategory(cat);

      // Disable snapping check while active bottom-nav programmatic gliding is in progress
      const timeoutName = (window as any)._navScrollTimeout;
      if (timeoutName) clearTimeout(timeoutName);
      (window as any)._navScrollTimeout = setTimeout(() => {
        isNavigatingRef.current = false;
      }, 900);
    }
  };

  // Drag-scrolling mapping for desktop cursor convenience
  const dragStartRef = useRef({ scrollLeft: 0, x: 0 });
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // Filter out drags starting on cards, streams, buttons or scrollboxes
    const target = e.target as HTMLElement;
    if (
      target.closest('.detailed-work-stream') || 
      target.closest('.overflow-y-auto') || 
      target.closest('button') || 
      target.closest('a') ||
      target.closest('.horizontal-snap-item') ||
      target.closest('[role="button"]')
    ) {
      return;
    }

    setIsDragging(true);
    cancelSpringBack();
    if (activeSnapAnimRef.current) {
      activeSnapAnimRef.current.stop();
      activeSnapAnimRef.current = null;
    }
    dragStartRef.current = {
      scrollLeft: el.scrollLeft,
      x: e.pageX
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = scrollContainerRef.current;
    if (!el) return;
    if (activeSnapAnimRef.current) {
      activeSnapAnimRef.current.stop();
      activeSnapAnimRef.current = null;
    }
    const walk = (e.pageX - dragStartRef.current.x) * 1.5; // multiplier for sensitivity
    const targetScrollLeft = dragStartRef.current.scrollLeft - walk;
    el.scrollLeft = targetScrollLeft;
  };

  const handleMouseUpOrLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      scheduleDynamicSpringBack();
      // Precise section snapping when manual dragging is completed
      setTimeout(() => {
        triggerSectionSnap();
      }, 50);
    }
  };

  // Theme configuration details for beautiful dynamic backdrop rendering
  const getThemeStyles = () => {
    switch (activeCategory) {
      case 'photography':
        return {
          wrapperBg: 'bg-[#f0f4ff]',
          gridClass: 'opacity-25 bg-[linear-gradient(rgba(139,115,85,0.08)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(139,115,85,0.08)_1.5px,transparent_1.5px)] bg-[size:40px_40px]',
          navBg: 'bg-white/95 border-b-4 border-black',
          navText: 'text-black',
          navBtnActive: 'bg-black text-[#f0f4ff] border-2 border-black',
          navBtnInactive: 'text-black hover:bg-black/5 border-2 border-black/30',
          trackBg: 'bg-[#d0ddff]',
          trackThumb: 'bg-[#0047ff]',
          headerTag: 'bg-[#0047ff] text-white border border-black shadow-brutal-xs',
        };
      case 'design':
        return {
          wrapperBg: 'bg-[#fdf0f4]',
          gridClass: 'opacity-15 bg-[linear-gradient(rgba(139,115,85,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(139,115,85,0.08)_1px,transparent_1px)] bg-[size:30px_30px]',
          navBg: 'bg-white/95 border-b-4 border-black',
          navText: 'text-black',
          navBtnActive: 'bg-black text-[#fdf0f4] border-2 border-black',
          navBtnInactive: 'text-black hover:bg-black/5 border-2 border-black/20',
          trackBg: 'bg-[#ffd5e5]',
          trackThumb: 'bg-[#ec4899]',
          headerTag: 'bg-[#ec4899] text-white border border-black shadow-brutal-xs',
        };
      case 'social':
        return {
          wrapperBg: 'bg-[#ebfbf9]',
          gridClass: 'opacity-20 bg-[linear-gradient(rgba(139,115,85,0.08)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(139,115,85,0.08)_1.5px,transparent_1.5px)] bg-[size:35px_35px]',
          navBg: 'bg-white/95 border-b-4 border-black',
          navText: 'text-black',
          navBtnActive: 'bg-black text-[#ebfbf9] border-2 border-black',
          navBtnInactive: 'text-black hover:bg-black/5 border-2 border-black/20',
          trackBg: 'bg-[#c3faf2]',
          trackThumb: 'bg-[#00a194]',
          headerTag: 'bg-[#00a194] text-white border border-black shadow-brutal-xs',
        };
      case 'podcast':
        return {
          wrapperBg: 'bg-[#fef9df]',
          gridClass: 'opacity-15 bg-[linear-gradient(rgba(139,115,85,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(139,115,85,0.08)_1px,transparent_1px)] bg-[size:24px_24px]',
          navBg: 'bg-white/95 border-b-4 border-black',
          navText: 'text-[#231f20]',
          navBtnActive: 'bg-black text-[#fef9df] border-2 border-black',
          navBtnInactive: 'text-black hover:bg-black/5 border-2 border-black/20',
          trackBg: 'bg-[#fbe795]',
          trackThumb: 'bg-[#7000ff]',
          headerTag: 'bg-[#fdd427] text-black border border-black shadow-brutal-xs',
        };
      case 'pending':
        return {
          wrapperBg: 'bg-black',
          gridClass: 'opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]',
          navBg: 'bg-black/95 border-b-4 border-neutral-900',
          navText: 'text-white',
          navBtnActive: 'bg-white text-black border-2 border-white',
          navBtnInactive: 'text-white hover:bg-white/5 border-2 border-white/20',
          trackBg: 'bg-[#1a1a1a]',
          trackThumb: 'bg-[#ff2a00]',
          headerTag: 'bg-neutral-800 text-white border border-neutral-700 shadow-brutal-xs',
        };
    }
  };

  const ts = getThemeStyles();

  // Handle slide click to see modal details (Photography Lightbox)
  const openPhotoLightbox = (photo: PhotographyWork) => {
    setSelectedPhoto(photo);
  };

  // Share helper mock
  const handleShare = (title: string) => {
    const text = `Take a look at "${title}" on this hyper-interactive Neo-Brutalist Portfolio!`;
    navigator.clipboard.writeText(window.location.href);
    alert('📋 URL copied to clipboard!\nShare it with your friends!');
  };

  const toggleLike = (id: string | undefined) => {
    if (!id) return;
    setIsLiked(prev => {
      const isCurrentlyLiked = !!prev[id];
      setLikeCount(likes => ({
        ...likes,
        [id]: likes[id] + (isCurrentlyLiked ? -1 : 1)
      }));
      return {
        ...prev,
        [id]: !isCurrentlyLiked
      };
    });
  };

  return (
    <div className={`w-full h-full flex-grow min-h-0 transition-colors duration-700 ${ts.wrapperBg} relative overflow-hidden flex flex-col justify-between select-none font-sans`}>
      
      {/* Background Pop-Flat Grid Overlay - Elegant light-brown dashes */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="works-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#8b7355" strokeWidth="1" strokeDasharray="3 3" opacity="0.10" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#works-grid)" />
        </svg>
      </div>

      {/* HORIZONTAL CINEMATIC SCROLL CONTAINER */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="w-full h-0 flex-grow min-h-0 overflow-x-auto overflow-y-hidden select-none no-scrollbar z-10 py-2 sm:py-3 md:py-4"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <motion.div 
          className="flex flex-row items-stretch min-h-full"
        >
        
        {/* ======================================================== */}
        {/* STATION 1: PHOTOGRAPHY STAGGERED LAYOUT (活力波普摄影) */}
        {/* ======================================================== */}
        <section 
          id="sec-photography"
          className={`snap-start flex-none w-[100vw] sm:w-[90vw] md:w-[130vw] xl:w-[150vw] min-h-full flex flex-col justify-start pt-4 sm:pt-7 md:pt-[35px] px-6 sm:px-12 md:px-20 border-r-8 relative select-none transition-all duration-500 ${isScrolling ? 'border-dashed border-black' : 'border-transparent'}`}
        >
          {/* Header */}
          <div className="flex flex-col gap-1 mb-1.5 md:mb-2.5 text-[#231f20] z-10">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 font-mono font-black text-[10px] border border-black shadow-brutal-xs ${ts.headerTag}`}>
                  STATION 01 
                </span>
                <span className="font-sans font-black tracking-widest text-[9px] sm:text-[10px] uppercase bg-black text-[#fef9df] px-2 py-0.5 border border-white">
                  THE SENSORY CAPTURES
                </span>
              </div>
              <p className="font-mono text-[9px] text-[#231f20]/60 tracking-wider uppercase flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 bg-[#0047ff] rounded-full animate-pulse" />
                💡 DRAG HORIZONTALLY OR USE SCROLL WHEEL // 鼠标拖拽或滚轮可左右滑动切换
              </p>
            </div>
             <h2 
              style={{ paddingTop: '7px' }}
              className="font-heading font-black text-2xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[76px] uppercase tracking-tighter leading-none text-[#231f20] mt-3 sm:mt-6 break-words whitespace-normal"
            >
              PHOTOGRAPHY
            </h2>
          </div>

          {/* Staggered Portfolio Canvas Grid */}
          <div 
            style={{ paddingTop: '8px', marginTop: '65px', height: '309px' }}
            onMouseEnter={(e) => { activeHoveredStreamRef.current = e.currentTarget; }}
            onMouseLeave={() => { 
              activeHoveredStreamRef.current = null; 
              isEdgeReleasingRef.current = false;
            }}
            className="flex flex-row gap-5 md:gap-7 items-center overflow-x-auto py-2 no-scrollbar detailed-work-stream overscroll-x-contain"
          >
            {PHOTOGRAPHY_WORKS.map((photo, idx) => (
              <PhotoCard 
                key={idx}
                photo={photo}
                idx={idx}
                openPhotoLightbox={openPhotoLightbox}
              />
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* STATION 2: POST DESIGN WITH PARALLAX CARDS (粉黑画报) */}
        {/* ======================================================== */}
        <section 
          id="sec-design"
          className={`snap-start flex-none w-[100vw] sm:w-[95vw] md:w-[130vw] xl:w-[150vw] min-h-full flex flex-col justify-start pt-2 sm:pt-4 md:pt-6 px-6 sm:px-12 md:px-20 border-r-8 relative select-none transition-all duration-500 ${isScrolling ? 'border-dashed border-black' : 'border-transparent'}`}
        >
          {/* Header */}
          <div className="flex flex-col gap-0.5 mb-1 md:mb-2 text-[#231f20] z-10">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 font-mono font-black text-[10px] border border-black shadow-brutal-xs ${ts.headerTag}`}>
                  STATION 02
                </span>
                <span className="font-sans font-black tracking-widest text-[9px] sm:text-[10px] uppercase bg-black text-[#fef9df] px-2 py-0.5 border border-black">
                  THE GRAPHIC LAYERS
                </span>
              </div>
              <p className="font-mono text-[9px] text-[#231f20]/60 tracking-wider uppercase flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 bg-[#ec4899] rounded-full animate-pulse" />
                💡 STAGGERED PARALLAX STACKS // 左右拖拽或滚轮滑动浏览作品集
              </p>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tighter leading-none text-[#231f20] break-words whitespace-normal">
              GRAPHIC WORK
            </h2>
          </div>

          {/* Mobile View: Flat vertical list layout for screen < 768px */}
          <div className="md:hidden flex flex-col gap-6 overflow-y-auto w-full max-h-[58vh] mt-4 pr-1.5 select-text border-2 border-black p-3 bg-[#fff9fa] shadow-brutal-sm rounded-none">
            {POST_DESIGN_WORKS.map((work) => {
              const naturalAr = designAspectRatios[work.id] || 0.8;
              const ar = naturalAr < 0.95 ? 1.0 : naturalAr;
              return (
                <div key={work.id} className="w-full max-w-full">
                  <IsometricTiltCard
                    title={work.title}
                    tag={work.tag}
                    index={work.index}
                    graphicUrl={work.graphicUrl}
                    layers={work.layers}
                    theme={work.theme}
                    aspectRatio={ar}
                    onClick={() => setSelectedDesign(work)}
                  />
                </div>
              );
            })}
          </div>

          {/* Desktop View: Alternating Staggered Timeline Canvas with dynamic mid-lane node axis */}
          <div 
            style={{ marginLeft: '0px', marginTop: '13px', height: '463px' }}
            onMouseEnter={(e) => { activeHoveredStreamRef.current = e.currentTarget; }}
            onMouseLeave={() => { 
              activeHoveredStreamRef.current = null; 
              isEdgeReleasingRef.current = false;
            }}
            className="hidden md:block overflow-x-auto no-scrollbar w-full max-w-full lg:max-w-[1200px] xl:max-w-[1300px] detailed-work-stream overscroll-x-contain"
          >
            <div className="relative flex flex-row gap-3 sm:gap-6 items-center h-full min-w-max pr-24 py-5 sm:py-6">
              {/* Horizontal Timeline central axis wire */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] bg-black pointer-events-none" />
              
              {POST_DESIGN_WORKS.map((work, idx) => {
                const isTop = idx % 2 === 1; // Alternating layout
                const naturalAr = designAspectRatios[work.id] || 0.8;
                // If it's vertical/portrait (ratio < 0.95), force it to 1.0 (the puff's ratio) so it behaves as a square card
                const ar = naturalAr < 0.95 ? 1.0 : naturalAr;
                const scalingFactor = ar > 0.82 ? Math.min(2.0, ar / 0.8) : 1.0;

                return (
                  <div 
                    key={work.id} 
                    style={{ '--scaling-factor': scalingFactor } as React.CSSProperties}
                    className="flex-none w-[calc(100px*var(--scaling-factor))] sm:w-[calc(125px*var(--scaling-factor))] md:w-[calc(150px*var(--scaling-factor))] flex flex-col justify-between items-center relative h-full px-1 horizontal-snap-item"
                  >
                    {/* Top Lane (Card Slot) */}
                    <div className="h-[46%] w-full flex items-end justify-center relative pb-1">
                      {isTop && (
                        /* Top Card */
                        <div 
                          className="w-[calc(85px*var(--scaling-factor))] sm:w-[calc(105px*var(--scaling-factor))] md:w-[calc(125px*var(--scaling-factor))] cursor-pointer relative z-10 hover:scale-[1.03] transition-transform duration-350"
                        >
                          <IsometricTiltCard
                            title={work.title}
                            tag={work.tag}
                            index={work.index}
                            graphicUrl={work.graphicUrl}
                            layers={work.layers}
                            theme={work.theme}
                            aspectRatio={ar}
                            onClick={() => setSelectedDesign(work)}
                          />
                        </div>
                      )}
                    </div>

                    {/* Center Node Segment on timeline axis (No overlapping vertical connector line) */}
                    <div className="h-[8%] w-full flex items-center justify-center relative">
                      {/* Central Diamond intersection marker */}
                      <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-white border-[3px] border-black rotate-45 z-10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                        <div className="w-1.2 h-1.2 sm:w-1.5 sm:h-1.5 bg-black" />
                      </div>
                    </div>

                    {/* Bottom Lane (Card Slot) */}
                    <div className="h-[46%] w-full flex items-start justify-center relative pt-1">
                      {!isTop && (
                        /* Bottom Card */
                        <div 
                          className="w-[calc(85px*var(--scaling-factor))] sm:w-[calc(105px*var(--scaling-factor))] md:w-[calc(125px*var(--scaling-factor))] cursor-pointer relative z-10 hover:scale-[1.03] transition-transform duration-350"
                        >
                          <IsometricTiltCard
                            title={work.title}
                            tag={work.tag}
                            index={work.index}
                            graphicUrl={work.graphicUrl}
                            layers={work.layers}
                            theme={work.theme}
                            aspectRatio={ar}
                            onClick={() => setSelectedDesign(work)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* STATION 3: SOCIAL MEDIA EXCEL CONVERSION STATS (极客社媒) */}
        {/* ======================================================== */}
        <section 
          id="sec-social"
          className={`snap-start flex-none w-[100vw] min-h-full flex flex-col justify-start pt-8 sm:pt-14 md:pt-[70px] px-6 sm:pl-12 md:pl-20 sm:pr-8 md:pr-10 border-r-8 relative select-none transition-all duration-500 ${isScrolling ? 'border-dashed border-black' : 'border-transparent'}`}
        >
          {/* Header */}
          <div className="flex flex-col gap-2 mb-3 md:mb-5 text-[#231f20] z-10">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 font-mono font-black text-[10px] border border-black shadow-brutal-xs ${ts.headerTag}`}>
                  STATION 03
                </span>
                <span className="font-sans font-black text-[9px] sm:text-[10px] uppercase bg-black text-[#fef9df] px-2 py-0.5 border border-black">
                  CONTENT ANALYTICS
                </span>
              </div>
              <p className="font-mono text-[9px] text-[#231f20]/60 tracking-wider uppercase flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 bg-[#00a194] rounded-full animate-pulse" />
                💡 SCROLL SHEET LIST VERTICALLY // 列表数据可上下滚动滚动浏览
              </p>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-4xl md:text-5xl lg:text-7xl uppercase tracking-tighter leading-none text-[#231f20] break-words whitespace-normal">
              SOCIAL MEDIA SPECIALIST
            </h2>
          </div>

          {/* Excel Columns Stacked Vertically with scrolling inside (极客社媒) */}
          <div className="flex flex-col items-center gap-4 overflow-y-auto max-h-[38dvh] sm:max-h-[44dvh] md:max-h-[48dvh] w-full max-w-full z-10 my-1 py-2 sm:py-3 pr-2 no-scrollbar">
            {SOCIAL_MEDIA_WORKS.map((social, index) => (
              <div 
                key={social.id}
                style={{ width: '883px', maxWidth: '100%' }}
                className="w-full bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(35,31,32,1)] hover:shadow-[10px_10px_0px_0px_rgba(35,31,32,1)] hover:-translate-y-1 transition-all flex flex-col sm:flex-row gap-5 p-5 text-black h-auto min-h-[180px] lg:min-h-[200px]"
              >
                {/* Left Column: Clean Cover with embedded platform & ref id badges */}
                <div className="flex-none w-full sm:w-[155px] lg:w-[160px] mx-auto sm:mx-0 flex flex-col justify-center">
                  <div className="relative w-full aspect-[4/3] sm:aspect-[3/4] border-4 border-black bg-stone-100 rounded-none overflow-hidden group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <ImageWithFallback 
                      src={social.coverUrl} 
                      alt={social.title} 
                      className="w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-500" 
                    />
                    {/* Embedded platform badge in bottom right (replaces REF_ tag) */}
                    <div className="absolute bottom-2 right-2 bg-black text-[#00ebd7] px-2 py-0.5 text-[8.5px] font-mono font-black border border-black uppercase tracking-wider">
                      {social.platform}
                    </div>
                  </div>
                </div>

                {/* Right Column: Title and Horizontal Columns for Metrics (Optimised layout) */}
                <div className="flex-grow flex flex-col justify-between gap-4">
                  <div className="border-b-4 border-black pb-2 flex items-center justify-between gap-4">
                    <h4 className="font-display font-black text-lg sm:text-xl md:text-2xl text-black tracking-tight uppercase leading-none truncate max-w-[80vw]">
                      {social.title}
                    </h4>
                    <button 
                      onClick={() => setSelectedSocial(social)}
                      className="p-1.5 w-8 h-8 flex items-center justify-center border-2 border-black bg-black text-[#00ebd7] hover:text-white cursor-pointer hover:bg-neutral-900 active:translate-y-[1px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-250 flex-none rounded-none"
                      title="展开 SPREADSHEET 📊"
                    >
                      <Maximize2 size={16} className="stroke-[3.5]" />
                    </button>
                  </div>

                  {/* Horizontal metrics grid - styled with crisp sharp borders with professional pop-accent hover states */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {social.stats.map((stat, sIdx) => (
                      <div 
                        key={sIdx}
                        className="bg-stone-50/30 border-2 border-black rounded-none p-3 flex flex-col justify-between h-20 hover:bg-[#00ebd7]/10 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
                      >
                        <span className="font-sans font-black text-[11px] text-stone-850 tracking-tight leading-none border-b border-black/10 pb-1.5 mb-1 block">
                          {stat.label}
                        </span>
                        
                        <div className="flex flex-col">
                          <span className="font-heading font-black text-xl sm:text-2xl text-black tracking-tighter leading-none">
                            <DynamicTicker target={stat.target} suffix={stat.suffix} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* STATION 4: PODCAST LIST AND FULL AUDIO CONTROLS (金黄播客) */}
        {/* ======================================================== */}
        <section 
          id="sec-podcast"
          className={`snap-start flex-none w-[100vw] sm:w-[95vw] md:w-[130vw] min-h-full flex flex-col justify-start pt-4 sm:pt-7 md:pt-[35px] px-6 sm:px-12 md:px-20 border-r-8 relative select-none transition-all duration-500 ${isScrolling ? 'border-dashed border-black' : 'border-transparent'}`}
        >
          {/* Header */}
          <div className="flex flex-col gap-2 mb-3 md:mb-5 text-[#231f20] z-10">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 font-mono font-black text-[10px] border border-black shadow-brutal-xs ${ts.headerTag}`}>
                  STATION 04
                </span>
                <span className="font-sans font-black text-[9px] sm:text-[10px] uppercase bg-black text-[#fef9df] px-2 py-0.5 border border-black">
                  AUDIO TALK SHOWS
                </span>
              </div>
              <p className="font-mono text-[9px] text-[#231f20]/60 tracking-wider uppercase flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 bg-[#f3d410] rounded-full animate-pulse" />
                💡 LIVE EPISODE STACKS // 点击并展开下侧播放控制板播放音频
              </p>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-4xl md:text-5xl lg:text-7xl uppercase tracking-tighter leading-none text-[#231f20] break-words whitespace-normal">
              EPISODES
            </h2>
          </div>

          {/* Podcast Columns Grid (Music Player Layout: Left Chat, Right Precedent) */}
          <div className="flex flex-col lg:flex-row gap-5 items-stretch w-full max-w-5xl z-10 my-1 no-scrollbar overflow-y-auto max-h-[40dvh] sm:max-h-[45dvh] md:max-h-[48dvh]">
            
            {/* L1 Column: 《闲聊无事》 */}
            <div className="flex-1 flex flex-col justify-start p-1">
              <div className="flex items-center justify-between border-b-2 border-black pb-1.5 mb-3 flex-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#fdd427] border border-black inline-block animate-pulse" />
                  <span className="font-heading font-black text-xs sm:text-sm uppercase tracking-tight">《闲聊无事》 Chat No-Business</span>
                </div>
                <span className="font-mono text-[8px] bg-black text-[#fef9df] px-1 py-0.5 border border-black">ACTIVE</span>
              </div>

              <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar">
                {PODCAST_WORKS.filter(p => !p.show || p.show === 'chat').map((podcast, idx) => {
                  const pId = podcast.id || `PC${idx+1}`;
                  const activePlaying = activePodcast?.id === pId && isPlaying;
                  return (
                    <div 
                      key={pId}
                      className={`group relative flex items-center gap-3 p-2 border-2 border-black transition-colors ${
                        activePlaying ? 'bg-[#7000ff]/10 border-[#7000ff]' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {/* Play Button */}
                      <div className="flex-none">
                        <button 
                          onClick={() => {
                            setActivePodcast(podcast);
                            setIsPlaying(!activePlaying);
                          }}
                          className={`w-7 h-7 border border-black flex items-center justify-center cursor-pointer transition-colors ${
                            activePlaying ? 'bg-[#7000ff] text-white' : 'bg-white hover:bg-black hover:text-white'
                          }`}
                        >
                          {activePlaying ? (
                            <Pause size={10} className="stroke-[3]" />
                          ) : (
                            <Play size={10} className="stroke-[3] ml-0.5" />
                          )}
                        </button>
                      </div>

                      {/* Cover Thumbnail */}
                      <div className="w-9 h-9 border border-black relative bg-black flex-none overflow-hidden">
                        <ImageWithFallback 
                          src={podcast.imageUrl} 
                          alt={podcast.title} 
                          className="w-full h-full object-cover" 
                        />
                        {activePlaying && (
                          <div className="absolute inset-0 bg-[#7000ff]/20 flex items-center justify-center animate-spin duration-5000">
                            <Zap size={8} className="text-white fill-current" />
                          </div>
                        )}
                      </div>

                      {/* Info Metadata */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="bg-[#e9c21e] text-black px-1 py-0.5 font-mono text-[6px] font-black border border-black leading-none uppercase">
                            {podcast.episode}
                          </span>
                          <span className="font-mono text-[7px] font-bold text-gray-500">{podcast.duration}</span>
                        </div>
                        <h4 className="font-display font-black text-[10px] sm:text-xs text-black leading-tight uppercase truncate" title={podcast.title}>
                          {podcast.title}
                        </h4>
                        <p className="font-mono text-[8px] text-gray-500 truncate mt-0.5" title={podcast.summary}>
                          {podcast.summary}
                        </p>
                      </div>

                      {/* Interaction & Stats */}
                      <div className="flex-none flex items-center gap-1">
                        <button 
                          onClick={() => toggleLike(pId)}
                          className={`flex items-center gap-0.5 font-mono text-[7px] font-black px-1 py-0.5 border border-black cursor-pointer shadow-brutal-xs hover:translate-y-[1px] active:translate-y-[1px] ${
                            isLiked[pId] ? 'bg-red-500 text-white' : 'bg-white text-black hover:bg-red-50 hover:text-red-500'
                          }`}
                        >
                          <Heart size={7} className={isLiked[pId] ? 'fill-current stroke-white' : ''} />
                          <span>{likeCount[pId]}</span>
                        </button>
                        <button 
                          onClick={() => {
                            setActivePodcast(podcast);
                            setIsPlaying(true);
                          }}
                          className="w-5 h-5 border border-black bg-white flex items-center justify-center hover:bg-black hover:text-white cursor-pointer"
                          title="Open Slide play"
                        >
                          <ChevronRight size={8} className="stroke-[3]" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* TO BE CONTINUED INDICATOR */}
                <div className="mt-3.5 pt-3.5 border-t-2 border-dashed border-black flex flex-col items-center justify-center p-3.5 bg-[#fef9df] text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black flex-none">
                  <div className="font-mono text-[9px] uppercase font-black tracking-widest text-[#7000ff] animate-pulse flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#fdd427] rounded-full" />
                    <span>Stay Tuned // 未完待续 ⏳</span>
                  </div>
                  <p className="font-display font-black text-[11px] text-black mt-1 uppercase tracking-tight">
                    NEXT EPISODE UNDER PREPARATION
                  </p>
                  <div className="font-mono text-[7px] text-gray-500 mt-0.5 leading-none">
                    更多有趣单集和嘉宾连线策划中 📻
                  </div>
                </div>
              </div>
            </div>

            {/* L2 Column: 《前车之见》 */}
            <div className="flex-1 flex flex-col justify-start p-1">
              <div className="flex items-center justify-between border-b-2 border-black pb-1.5 mb-3 flex-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gray-400 border border-black inline-block" />
                  <span className="font-heading font-black text-xs sm:text-sm uppercase tracking-tight">《前车之见》 Precedent Outlook</span>
                </div>
                <span className="font-mono text-[8px] bg-gray-100 text-gray-500 px-1 py-0.5 border border-black">ARCHIVE</span>
              </div>

              <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar">
                {PODCAST_WORKS.filter(p => p.show === 'precedent').map((podcast, idx) => {
                  const pId = podcast.id || `PC${idx+3}`;
                  return (
                    <div 
                      key={pId}
                      className="group relative flex items-center gap-3 p-2 bg-gray-50 border-2 border-black/80 opacity-80"
                    >
                      {/* Locked Lock Display */}
                      <div className="flex-none">
                        <div className="w-7 h-7 bg-gray-200 border border-black flex items-center justify-center text-gray-500">
                          <Lock size={10} className="stroke-[2.5]" />
                        </div>
                      </div>

                      {/* Cover Thumbnail */}
                      <div className="w-9 h-9 border border-black relative bg-black flex-none overflow-hidden grayscale">
                        <ImageWithFallback 
                          src={podcast.imageUrl} 
                          alt={podcast.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>

                      {/* Info Metadata */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="bg-gray-300 text-gray-600 px-1 py-0.5 font-mono text-[6px] font-black border border-black leading-none uppercase">
                            {podcast.episode || 'EP'}
                          </span>
                          <span className="font-mono text-[7px] font-bold text-gray-500">COMING SOON</span>
                        </div>
                        <h4 className="font-display font-black text-[10px] sm:text-xs text-gray-500 leading-tight uppercase truncate" title={podcast.title}>
                          {podcast.title}
                        </h4>
                        <p className="font-mono text-[8px] text-gray-400 truncate mt-0.5" title={podcast.summary}>
                          {podcast.summary}
                        </p>
                      </div>

                      {/* Interaction & Stats */}
                      <div className="flex-none text-[8px] font-mono font-black text-gray-400 uppercase tracking-wider px-1">
                        LOCKED
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* STATION 5: STAY TUNED (CENTRAL MINIMAL BREATHING CORE) */}
        {/* ======================================================== */}
        <section 
          id="sec-pending"
          className="snap-start flex-none w-[100vw] min-h-full flex flex-col items-center justify-center relative select-none bg-black overflow-hidden"
        >
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="url(#works-grid)" />
            </svg>
          </div>

          {/* Ambient colorful breathing orb aura */}
          <div className="relative flex flex-col justify-center items-center z-10 text-center">
            <motion.div 
              animate={{ 
                scale: [1, 1.25, 1],
                opacity: [0.15, 0.45, 0.15] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4, 
                ease: "easeInOut" 
              }}
              className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-r from-[#ff2a00] via-[#ec4899] to-[#8b5cf6] filter blur-3xl opacity-30"
            />

            {/* Centered stay tuned text */}
            <div className="relative z-20 flex flex-col sm:flex-row items-center justify-center px-4">
              <h2 className="font-heading font-black text-2xl sm:text-4xl md:text-5xl lg:text-[76px] lowercase tracking-tighter leading-none text-white select-none pointer-events-none break-words whitespace-normal">
                stay tuned...
              </h2>
            </div>
          </div>
        </section>

        </motion.div>
      </div>

      {/* BOTTOM TRACKBAR DETAILS / CINEMATIC SCROLL METERS WITH INTEGRATED NAVIGATION */}
      <footer className="footer z-20 w-full px-4 sm:px-8 py-3.5 border-t-4 border-black bg-black select-none text-white flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Dynamic Category Navigation Links (Moved from Top to Bottom, unique background matched category color-way) */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 md:order-1 font-display">
          {onBackToHome && (
            <button 
              onClick={onBackToHome}
              className="px-2 py-1 text-xs font-black uppercase transition-all duration-300 cursor-pointer bg-transparent border-0 hover:underline underline-offset-4 text-neutral-400 hover:text-white"
            >
              HOME
            </button>
          )}
          <button 
            onClick={() => scrollToSection('photography', 'photography')}
            className={`px-2 py-1 text-xs font-black uppercase transition-all duration-300 cursor-pointer bg-transparent border-0 hover:underline underline-offset-4 decoration-2 ${
              activeCategory === 'photography' ? 'text-[#3b82f6] underline opacity-100 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            PHOTOGRAPHY
          </button>
          <button 
            onClick={() => scrollToSection('design', 'design')}
            className={`px-2 py-1 text-xs font-black uppercase transition-all duration-300 cursor-pointer bg-transparent border-0 hover:underline underline-offset-4 decoration-2 ${
              activeCategory === 'design' ? 'text-[#ec4899] underline opacity-100 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            DESIGN
          </button>
          <button 
            onClick={() => scrollToSection('social', 'social')}
            className={`px-2 py-1 text-xs font-black uppercase transition-all duration-300 cursor-pointer bg-transparent border-0 hover:underline underline-offset-4 decoration-2 ${
              activeCategory === 'social' ? 'text-[#00ebd7] underline opacity-100 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            CONTENT
          </button>
          <button 
            onClick={() => scrollToSection('podcast', 'podcast')}
            className={`px-2 py-1 text-xs font-black uppercase transition-all duration-300 cursor-pointer bg-transparent border-0 hover:underline underline-offset-4 decoration-2 ${
              activeCategory === 'podcast' ? 'text-[#eab308] underline opacity-100 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            PODCAST
          </button>
        </div>

        {/* Scroll meter indicator progress */}
        <div className="flex items-center gap-3 w-full sm:max-w-xs md:order-2">
          <div className="w-full h-2 bg-neutral-800 relative rounded-none overflow-hidden border border-neutral-700">
            <motion.div 
              className={`h-full ${ts.trackThumb} transition-colors duration-500`} 
              style={{ width: `${dragProgress * 100}%` }}
            />
          </div>
          <span className="font-mono text-[10px] font-bold w-12 text-right text-gray-300">
            {Math.round(dragProgress * 100)}%
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-4 text-[10px] font-mono font-bold text-gray-400 md:order-3">
          <span>© 2026 BRUTAL STUDIO</span>
        </div>
      </footer>


      {/* ======================================================== */}
      {/* GLOBAL MODALS & INTERACTIVE DETAILED POPUPS */}
      {/* ======================================================== */}
      <AnimatePresence>
        
        {/* 1. PHOTOGRAPHY LIGHTBOX */}
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-55 flex items-center justify-center p-4 md:p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-[#121215] border-4 border-[#facc15] shadow-brutal-xl rounded-none w-full max-w-4xl p-4 md:p-6"
            >
              <div className="flex justify-between items-center border-b-2 border-[#facc15]/30 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Camera size={18} className="text-[#facc15]" />
                  <span className="font-mono text-xs text-[#facc15] font-black tracking-widest">
                    {selectedPhoto.vol || 'VOL. PHOTOGRAPHY'}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedPhoto(null)} 
                  className="w-8 h-8 cursor-pointer rounded-none bg-[#facc15] text-black border-2 border-black flex items-center justify-center hover:bg-white active:translate-y-[1px]"
                >
                  <X size={16} className="stroke-[3]" />
                </button>
              </div>

              {/* Lightbox Main Frame container */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className={`md:col-span-8 flex justify-center border-4 border-black bg-black ${
                  selectedPhoto.isPortrait ? 'h-[400px] md:h-[550px]' : 'h-[280px] md:h-[400px]'
                } overflow-hidden relative`}>
                  <ImageWithFallback 
                    src={selectedPhoto.imageUrl} 
                    alt={selectedPhoto.chineseTitle || selectedPhoto.title || "Selected Frame"} 
                    className="h-full w-full object-contain" 
                  />
                </div>

                <div className="md:col-span-4 text-white flex flex-col h-full justify-between gap-6">
                  <div>
                    <span className="font-mono text-xs text-[#facc15] font-black bg-[#facc15]/10 px-2 py-1 border border-[#facc15]/30 inline-block mb-3">
                      SERIAL {selectedPhoto.id || 'P-001'}
                    </span>
                    <h2 className="font-heading font-black text-3xl leading-none uppercase text-white tracking-tighter mb-2">
                      {selectedPhoto.title || 'FLUID DIARY'}
                    </h2>
                    <h3 className="font-display font-black text-xl text-[#facc15] leading-tight mb-4">
                      {selectedPhoto.chineseTitle}
                    </h3>
                    
                    <p className="font-mono text-xs text-slate-300 leading-relaxed border-t border-gray-800 pt-4 whitespace-pre-wrap">
                      {selectedPhoto.description || "直線歸於人類，曲線歸于上帝。This physical exploration curates dynamic proportions, tactile shadows, and environmental shapes, capturing direct camera sensory patterns."}
                    </p>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleShare(selectedPhoto.chineseTitle || selectedPhoto.title)}
                      className="flex-1 py-3 text-center border-3 border-black bg-[#facc15] text-black font-mono font-black text-xs uppercase hover:bg-white transition-colors cursor-pointer"
                    >
                      SHARE PHOTO
                    </button>
                    <button 
                      onClick={() => handleShare(selectedPhoto.title || "Picture")}
                      className="px-4 border-3 border-black bg-black hover:bg-gray-900 border-white text-white flex items-center justify-center cursor-pointer"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 2. DESIGN CARD DETAILS */}
        {selectedDesign && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-55 flex items-center justify-center p-4"
          >
            <motion.div 
               initial={{ scale: 0.92, y: 30 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.92, y: 30 }}
               className="bg-[#faf6ed] border-4 border-black text-black shadow-brutal-xl rounded-none w-full max-w-2xl p-5 max-h-[90vh] overflow-y-auto no-scrollbar"
             >
               <div className="flex justify-between items-center border-b-2 border-black pb-3 mb-4">
                 <div className="flex items-center gap-2">
                   <Paintbrush size={16} />
                   <span className="font-mono text-xs font-black">GRAPHICS METRICS / SPEC_SHEET</span>
                 </div>
                 <button 
                   onClick={() => setSelectedDesign(null)} 
                   className="w-8 h-8 cursor-pointer rounded-none bg-black text-white border-2 border-black flex items-center justify-center hover:bg-red-500 active:translate-y-[1px]"
                 >
                   <X size={16} className="stroke-[3]" />
                 </button>
               </div>
 
               {/* Poster Breakout analysis */}
               <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                 <div 
                   className="sm:col-span-6 border-4 border-black bg-transparent overflow-hidden relative w-full"
                   style={{ aspectRatio: modalAspectRatio || designAspectRatios[selectedDesign.id] || 0.75 }}
                 >
                   <ImageWithFallback 
                     src={selectedDesign.detailGraphicUrl || selectedDesign.graphicUrl} 
                     alt={selectedDesign.title} 
                     className="w-full h-full object-contain" 
                   />
                 </div>

                <div className="sm:col-span-6 flex flex-col justify-between h-full gap-4">
                  <div>
                    <span className="font-mono text-xs font-black bg-[#ff007f] text-white px-2 py-0.5 border-2 border-black shadow-brutal-xs inline-block mb-2">
                      {selectedDesign.tag}
                    </span>
                    <h3 className="font-display font-black text-2xl uppercase tracking-tighter leading-none mb-2">
                      {selectedDesign.title}
                    </h3>
                    <p className="font-mono text-xs text-gray-600">
                      Index reference: {selectedDesign.index}
                    </p>

                    <div className="mt-4 border-t border-black/15 pt-3 font-mono text-xs text-gray-800 flex flex-col gap-2">
                      <div className="flex justify-between">
                        <span>TIMECODE //</span>
                        <span className="font-bold">{selectedDesign.date || 'OCTOBER_2024'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>COORDINATES //</span>
                        <span className="font-bold">{selectedDesign.loc || 'LOC_UNKNOWN'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>MATERIAL RENDER //</span>
                        <span className="font-bold uppercase">{selectedDesign.layers ? '3D SPLIT LAYERS' : 'FLAT GRAPHIC'}</span>
                      </div>
                    </div>
                  </div>

                  {selectedDesign.description && (
                    <p className="text-xs font-medium leading-relaxed italic bg-yellow-100 border-2 border-black p-3 font-mono transform rotate-1">
                      "{selectedDesign.description}"
                    </p>
                  )}

                  <button 
                    onClick={() => handleShare(selectedDesign.title)}
                    className="w-full py-2 text-center bg-black hover:bg-gray-800 border-2 border-black text-white font-mono font-black text-xs uppercase transition-colors cursor-pointer"
                  >
                    COFFEE SOURCE CODES API
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 3. SOCIAL SHEET METRICS DETAILED SPREADSHEET */}
        {selectedSocial && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 z-55 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.92, y: 35 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 35 }}
              className="bg-white border-4 border-black text-black shadow-brutal-xl rounded-none w-full max-w-md p-5"
            >
              <div className="flex justify-between items-center border-b-2 border-black pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-black" />
                  <span className="font-mono text-xs text-black font-bold">EXCEL_ENGINE_CONSOLE_V2</span>
                </div>
                <button 
                  onClick={() => setSelectedSocial(null)} 
                  className="w-8 h-8 cursor-pointer rounded-none bg-[#00ebd7] text-black border-2 border-black flex items-center justify-center hover:bg-white active:translate-y-[1px]"
                >
                  <X size={16} className="stroke-[3]" />
                </button>
              </div>

              <div className="p-4 bg-gray-50 border-2 border-black font-mono text-xs flex flex-col gap-4">
                <div>
                  <div className="text-[10px] text-gray-500 font-mono">FILE_INDEX</div>
                  <h3 className="font-display font-black text-lg text-black leading-none mb-1">
                    {selectedSocial.title}
                  </h3>
                  <p className="text-[10px] text-gray-650">{selectedSocial.platform}</p>
                </div>

                <div className="space-y-3 border-t-2 border-black pt-4">
                  <div className="grid grid-cols-1 gap-2.5">
                    {selectedSocial.stats.map((stat, sIdx) => {
                      let colBgStyle = "bg-[#fef9df]";
                      if (sIdx === 0) colBgStyle = "bg-[#00ebd7]";
                      else if (sIdx === 1) colBgStyle = "bg-[#ff9ec6]";
                      return (
                        <div 
                          key={sIdx} 
                          className="flex items-center gap-3.5 border-2 border-black p-3 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] transition-all"
                        >
                          {/* Bento Numeric Badge */}
                          <div className={`w-8 h-8 ${colBgStyle} border-2 border-black flex items-center justify-center font-black font-mono text-xs text-black shadow-brutal-xs flex-none`}>
                            0{sIdx + 1}
                          </div>
                          {/* Metric Info */}
                          <div className="flex-grow min-w-0">
                            <span className="block text-[8.5px] leading-none mb-1 font-mono font-black text-gray-500 uppercase tracking-tight">
                              {stat.label}
                            </span>
                            <span className="font-heading font-black text-lg text-black block tracking-tight font-mono leading-none">
                              <DynamicTicker value={stat.target} suffix={stat.suffix} />
                            </span>
                          </div>
                          {/* Visual Indicator Stamp */}
                          <div className="flex-none text-right">
                            <span className="text-[7.5px] font-mono bg-black text-[#00ebd7] px-1.5 py-0.5 border border-black font-black uppercase tracking-wider">
                              VERIFIED
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    alert('📊 Calculating database... Full export to CSV completed securely!');
                    setSelectedSocial(null);
                  }}
                  className="w-full text-center border-2 border-black py-2 bg-black text-white font-black font-mono text-xs uppercase cursor-pointer hover:bg-yellow-300 hover:text-black"
                >
                  RECALCULATE COEFFICIENTS
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 4. ACTIVE PODCAST MINI-PLAYER CONTROLLER */}
        {activePodcast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-55 w-[330px] sm:w-[380px] bg-white border-4 border-black text-black p-4 shadow-brutal-xl select-none"
          >
            {/* Player Head */}
            <div className="flex justify-between items-center pb-2 border-b-2 border-black mb-3">
              <div className="flex items-center gap-2">
                <Podcast size={16} className="text-[#7000ff]" />
                <span className="font-mono text-[10px] font-black uppercase">LIVE_MINI_PLAYHEAD</span>
              </div>
              <button 
                onClick={() => {
                  setIsPlaying(false);
                  setActivePodcast(null);
                }} 
                className="w-6 h-6 border-2 border-black cursor-pointer bg-red-100 flex items-center justify-center hover:bg-red-500 hover:text-white"
              >
                <X size={12} className="stroke-[3]" />
              </button>
            </div>

            {/* Title Block & Spin Cover */}
            <div className="flex gap-3 items-center mb-3">
              <div className="w-16 h-16 border-2 border-black relative bg-black flex-none overflow-hidden">
                <ImageWithFallback src={activePodcast.imageUrl} alt={activePodcast.title} className="w-full h-full object-cover" />
                {isPlaying && (
                  <div className="absolute inset-0 bg-[#7000ff]/30 flex items-center justify-center animate-spin duration-5000">
                    <div className="w-6 h-6 rounded-full border-2 border-black bg-white flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-black" />
                    </div>
                  </div>
                )}
              </div>
              <div className="overflow-hidden flex-1">
                <span className="font-mono text-[10px] font-bold text-gray-500 block uppercase mb-1">
                  {activePodcast.episode || 'EPISODE'} • {activePodcast.duration || 'Talk Show'}
                </span>
                <h4 className="font-display font-black text-sm text-black uppercase leading-none truncate mb-1">
                  {activePodcast.title}
                </h4>
                <p className="font-mono text-[10px] text-gray-600 truncate leading-none">
                  {activePodcast.summary}
                </p>
              </div>
            </div>

            {/* Progress Slider (Interactive progress click mock) */}
            <div className="space-y-1.5 mb-3 font-mono">
              <div 
                className="w-full h-3 border-2 border-black bg-gray-100 relative rounded-none cursor-pointer overflow-hidden"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percentage = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                  setAudioProgress(percentage);
                }}
              >
                <div className="h-full bg-[#7000ff]" style={{ width: `${audioProgress}%` }} />
              </div>
              <div className="flex justify-between text-[9px] font-bold text-gray-500">
                <span>{Math.floor((audioProgress * 81) / 100)}:20</span>
                <span>{activePodcast.duration || '81 Mins'}</span>
              </div>
            </div>

            {/* Play controls row */}
            <div className="flex justify-between items-center pt-2 border-t border-black/10">
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 border-2 border-black bg-[#7000ff] text-white flex items-center justify-center shadow-brutal-xs cursor-pointer active:translate-y-[1px] active:shadow-brutal-none hover:bg-black transition-colors"
                >
                  {isPlaying ? (
                    <Pause size={16} className="stroke-[3]" />
                  ) : (
                    <Play size={16} className="stroke-[3] ml-0.5" />
                  )}
                </button>
                <div className="flex items-center gap-1 text-gray-500 font-mono text-[10px] font-bold ml-1">
                  <Volume2 size={12} />
                  <span>MOCKED_AUDIO</span>
                </div>
              </div>

              {/* Real Audio URL Redirector (XiaoYuZhou) */}
              {activePodcast.audioLink && (
                <a 
                  href={activePodcast.audioLink}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[10px] font-black underline underline-offset-4 decoration-2 hover:text-[#7000ff] text-right"
                >
                  LISTEN ON XIAOYUZHOU (小宇宙) ↗
                </a>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}

export default WorksSection;
