/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';

interface DynamicTickerProps {
  value?: number;
  target?: number;
  suffix?: string;
}

export function DynamicTicker({ value, target, suffix = '' }: DynamicTickerProps) {
  const val = value !== undefined ? value : (target !== undefined ? target : 0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const durationCount = 1200;
    const isDecimal = val % 1 !== 0;
    
    const scaleAnimation = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / durationCount, 1);
      
      // easedProgress
      const easedProgress = progress * (2 - progress);
      const currentVal = easedProgress * val;
      setCount(isDecimal ? parseFloat(currentVal.toFixed(1)) : Math.floor(currentVal));

      if (progress < 1) {
        requestAnimationFrame(scaleAnimation);
      } else {
        setCount(val);
      }
    };

    setCount(0);
    const animFrame = requestAnimationFrame(scaleAnimation);
    return () => cancelAnimationFrame(animFrame);
  }, [val]);

  const isDecimal = val % 1 !== 0;
  return (
    <span className="font-mono text-2xl md:text-3xl font-semibold tracking-tight text-neutral-800">
      {count.toLocaleString(undefined, { 
        minimumFractionDigits: isDecimal ? 1 : 0, 
        maximumFractionDigits: isDecimal ? 1 : 0 
      })}{suffix}
    </span>
  );
}

export default DynamicTicker;
