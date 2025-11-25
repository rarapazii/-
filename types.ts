import React from 'react';

export type CategoryType = 'fabric' | 'decoration' | 'natural';

export interface SourceItem {
  id: string;
  name: string;
  type: CategoryType;
  color: string;
  gradient?: string; // CSS gradient string
  shape: 'rect' | 'circle' | 'rounded-rect';
  icon?: React.ReactNode;
  imageUrl?: string; // If it's an image
}

export interface CategoryData {
  id: CategoryType;
  title: string;
  themeColor: string; // Tailwind class prefix e.g., 'pink'
  items: SourceItem[];
}

export interface WorkspaceItem extends SourceItem {
  uniqueId: string; // Unique instance ID
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
}