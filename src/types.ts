/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface PhotographyWork {
  id: string;
  vol: string;
  title: string;
  chineseTitle: string;
  cycles: string;
  isPortrait?: boolean;
  imageUrl: string;
  description?: string;
  dispatches?: string;
  imgStyle?: React.CSSProperties;
}

export interface PostLayers {
  layerBg: string;
  layerMid: string;
  layerFront: string;
}

export interface PostDesignWork {
  id: string;
  index: string;
  tag: string;
  date?: string;
  rec?: string;
  title: string;
  description: string;
  loc?: string;
  theme: 'light' | 'dark' | string;
  yOffset: 'up' | 'down' | string;
  graphicUrl: string;
  detailGraphicUrl?: string;
  layers?: PostLayers;
  frontScale?: number;
}

export interface SocialStat {
  label: string;
  target: number;
  suffix: string;
}

export interface SocialMediaWork {
  id: string;
  title: string;
  platform: string;
  coverUrl: string;
  snippet: string;
  stats: SocialStat[];
}

export interface PodcastWork {
  id?: string;
  episode?: string;
  title: string;
  duration?: string;
  summary: string;
  audioLink?: string;
  imageUrl: string;
  show?: 'chat' | 'precedent' | string;
}

export type WorksCategory = 'photography' | 'design' | 'social' | 'podcast' | 'pending';
