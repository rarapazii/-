import { CategoryData } from './types';
import { Leaf } from 'lucide-react';
import React from 'react';

// Custom hand-drawn icon for Fabric category to match user request
const FabricHandDrawnIcon = () => (
  <svg 
    viewBox="0 0 200 160" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className="w-10 h-10 -ml-1" // Slightly larger to fit the container nicely
  >
    {/* Main Shape - Irregular hand-drawn rectangle */}
    <path 
      d="M20 30 C 60 20, 140 20, 180 30 C 190 60, 185 110, 180 130 C 140 140, 60 140, 20 130 C 15 100, 10 60, 20 30 Z" 
      fill="#F4C5D6" 
      stroke="#1a1a1a" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    {/* Inner details - short wavy lines */}
    <path d="M60 55 L 90 55" stroke="#1a1a1a" strokeWidth="8" strokeLinecap="round" />
    <path d="M120 50 L 150 50" stroke="#1a1a1a" strokeWidth="8" strokeLinecap="round" />
    
    <path d="M50 85 L 140 90" stroke="#1a1a1a" strokeWidth="8" strokeLinecap="round" />
    
    <path d="M40 115 L 80 113" stroke="#1a1a1a" strokeWidth="8" strokeLinecap="round" />
    <path d="M130 115 L 160 117" stroke="#1a1a1a" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

// Custom hand-drawn icon for Decoration category
const DecorationHandDrawnIcon = () => (
  <svg 
    viewBox="0 0 200 160" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className="w-10 h-10"
  >
    {/* Red Bucket/Button Thing (Top Center) */}
    <path 
      d="M90 25 L 130 20 L 120 70 L 100 75 Z" 
      fill="#C00" 
      stroke="#1a1a1a" 
      strokeWidth="7" 
      strokeLinejoin="round"
    />
    <ellipse cx="110" cy="25" rx="20" ry="8" fill="#A00" stroke="#1a1a1a" strokeWidth="6" />
    {/* Swirl detail inside red thing */}
    <path d="M105 30 Q 115 35 110 40" stroke="#1a1a1a" strokeWidth="5" strokeLinecap="round" />

    {/* Pink Heart (Center Left) */}
    <path 
      d="M70 70 C 50 40, 20 50, 20 80 C 20 110, 70 140, 80 145 C 90 140, 140 110, 140 80 C 140 50, 110 40, 90 70 Z" 
      fill="#EFA7A7" 
      stroke="#1a1a1a" 
      strokeWidth="7" 
      strokeLinejoin="round"
    />
    {/* Shine on heart */}
    <path d="M110 70 Q 120 60 120 80" stroke="#1a1a1a" strokeWidth="6" strokeLinecap="round" />

    {/* Green Blob (Right) */}
    <path 
      d="M140 80 C 130 60, 160 50, 180 60 C 200 80, 190 120, 160 120 C 140 110, 140 90, 140 80 Z" 
      fill="#9DCE68" 
      stroke="#1a1a1a" 
      strokeWidth="7" 
      strokeLinejoin="round"
    />
    {/* Detail on green blob */}
    <path d="M165 80 Q 170 90 165 100" stroke="#1a1a1a" strokeWidth="6" strokeLinecap="round" />
    <circle cx="165" cy="108" r="2" fill="#1a1a1a" />

    {/* Yellow Dot (Top Left) */}
    <circle cx="50" cy="40" r="15" fill="#F8BC45" stroke="#1a1a1a" strokeWidth="6" />

    {/* Blue Dot (Far Left) */}
    <circle cx="25" cy="100" r="12" fill="#5D9BCF" stroke="#1a1a1a" strokeWidth="6" />
  </svg>
);

// Custom hand-drawn icon for Natural category
const NaturalHandDrawnIcon = () => (
  <svg 
    viewBox="0 0 200 160" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className="w-10 h-10"
  >
    {/* Big Green Leaf (Top Left) */}
    <path 
      d="M40 80 C 40 40, 90 20, 130 40 C 160 60, 150 100, 110 110 C 80 120, 40 110, 40 80 Z" 
      fill="#86EFAC" 
      stroke="#1a1a1a" 
      strokeWidth="7" 
      strokeLinejoin="round"
    />
    {/* Leaf Stem & Veins */}
    <path d="M40 100 L 130 40" stroke="#1a1a1a" strokeWidth="7" strokeLinecap="round" />
    <path d="M70 80 L 70 60" stroke="#1a1a1a" strokeWidth="6" strokeLinecap="round" />
    <path d="M90 65 L 100 50" stroke="#1a1a1a" strokeWidth="6" strokeLinecap="round" />
    <path d="M90 70 L 90 90" stroke="#1a1a1a" strokeWidth="6" strokeLinecap="round" />

    {/* Brown Twig (Right, Diagonal) */}
    <path 
      d="M130 110 L 180 50" 
      stroke="#5D4037" 
      strokeWidth="16" 
      strokeLinecap="round" 
    />
    <path 
      d="M130 110 L 180 50" 
      stroke="#1a1a1a" 
      strokeWidth="6" 
      strokeLinecap="round" 
      fill="none"
      className="mix-blend-multiply" // Hack to create outline effect without double geometry
    />
    {/* Outline for twig main body */}
    <path d="M132 112 L 178 52" stroke="#1a1a1a" strokeWidth="7" strokeLinecap="round" />
    
    {/* Branch off twig */}
    <path d="M160 70 L 180 80" stroke="#5D4037" strokeWidth="12" strokeLinecap="round" />
    <path d="M160 70 L 180 80" stroke="#1a1a1a" strokeWidth="6" strokeLinecap="round" />

    {/* Grey Stone 1 (Bottom Left) */}
    <path 
      d="M50 125 C 40 115, 80 110, 90 120 C 100 130, 80 145, 60 140 C 50 135, 50 125, 50 125 Z" 
      fill="#D1D5DB" 
      stroke="#1a1a1a" 
      strokeWidth="6" 
      strokeLinejoin="round"
    />

    {/* Grey Stone 2 (Top Right) */}
    <path 
      d="M160 30 C 150 20, 180 15, 190 25 C 200 35, 180 45, 170 40 C 160 35, 160 30, 160 30 Z" 
      fill="#E5E7EB" 
      stroke="#1a1a1a" 
      strokeWidth="6" 
      strokeLinejoin="round"
    />
  </svg>
);

export const INITIAL_CATEGORIES: CategoryData[] = [
  {
    id: 'fabric',
    title: '布料类',
    themeColor: 'pink',
    items: [
      {
        id: 'fabric-1',
        name: '布料1',
        type: 'fabric',
        color: 'bg-pink-300',
        shape: 'rounded-rect',
        gradient: 'linear-gradient(135deg, #f9a8d4 0%, #f472b6 100%)',
      },
      {
        id: 'fabric-2',
        name: '布料2',
        type: 'fabric',
        color: 'bg-pink-400',
        shape: 'rounded-rect',
        gradient: 'linear-gradient(135deg, #fbcfe8 0%, #f9a8d4 100%)',
      },
    ],
  },
  {
    id: 'decoration',
    title: '装饰类',
    themeColor: 'orange',
    items: [
      {
        id: 'deco-1',
        name: '橙黄色纽扣',
        type: 'decoration',
        color: 'bg-orange-500',
        shape: 'rounded-rect',
        icon: <div className="grid grid-cols-2 gap-1"><div className="w-2 h-2 bg-white rounded-full"></div><div className="w-2 h-2 bg-white rounded-full"></div><div className="w-2 h-2 bg-white rounded-full"></div><div className="w-2 h-2 bg-white rounded-full"></div></div>,
        gradient: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
      },
      {
        id: 'deco-2',
        name: '黑白圆环',
        type: 'decoration',
        color: 'bg-blue-600',
        shape: 'circle',
        gradient: 'radial-gradient(circle, #818cf8 30%, #4f46e5 100%)',
      },
    ],
  },
  {
    id: 'natural',
    title: '自然材料类',
    themeColor: 'green',
    items: [
      {
        id: 'nat-1',
        name: '蓝色矩形',
        type: 'natural',
        color: 'bg-blue-500',
        shape: 'rect',
        gradient: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)',
      },
      {
        id: 'nat-2',
        name: '绿色色块',
        type: 'natural',
        color: 'bg-green-600',
        shape: 'rounded-rect',
        gradient: 'linear-gradient(45deg, #4ade80 0%, #16a34a 100%)',
      },
    ],
  },
];

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  fabric: <FabricHandDrawnIcon />,
  decoration: <DecorationHandDrawnIcon />,
  natural: <NaturalHandDrawnIcon />,
};
