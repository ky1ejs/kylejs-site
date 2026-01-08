import React from "react";

// Shared props for all icons
interface IconProps {
  className?: string;
}

// Coffee cup with steam
export const CoffeeIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Cup body */}
    <path d="M8 18h24v20a4 4 0 01-4 4H12a4 4 0 01-4-4V18z" />
    {/* Handle */}
    <path d="M32 22h4a4 4 0 014 4v2a4 4 0 01-4 4h-4" />
    {/* Steam lines */}
    <path d="M14 8c0-2 2-4 2-6" />
    <path d="M20 10c0-2.5 2.5-5 2.5-7.5" />
    <path d="M26 8c0-2 2-4 2-6" />
  </svg>
);

// Camera
export const CameraIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Camera body */}
    <rect x="4" y="14" width="40" height="28" rx="4" />
    {/* Lens */}
    <circle cx="24" cy="28" r="8" />
    <circle cx="24" cy="28" r="4" />
    {/* Viewfinder bump */}
    <path d="M16 14V10a2 2 0 012-2h12a2 2 0 012 2v4" />
    {/* Flash */}
    <circle cx="38" cy="20" r="2" />
  </svg>
);

// Dumbbell
export const DumbbellIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Bar */}
    <path d="M12 24h24" />
    {/* Left weight */}
    <rect x="4" y="16" width="8" height="16" rx="1" />
    <rect x="8" y="12" width="4" height="24" rx="1" />
    {/* Right weight */}
    <rect x="36" y="16" width="8" height="16" rx="1" />
    <rect x="36" y="12" width="4" height="24" rx="1" />
  </svg>
);

// Fish with hook
export const FishingIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Fishing line */}
    <path d="M38 4v12" />
    {/* Hook */}
    <path d="M38 16c0 4-4 6-4 8s2 4 0 6" />
    {/* Fish body */}
    <path d="M6 30c4-6 12-8 20-4 4 2 6 6 4 10s-8 6-14 4c-6-2-12-4-10-10z" />
    {/* Fish eye */}
    <circle cx="12" cy="32" r="1.5" />
    {/* Fish tail */}
    <path d="M26 34l6-4v10l-6-4" />
  </svg>
);

// Code brackets
export const CodeIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Left bracket */}
    <path d="M14 8l-8 16 8 16" />
    {/* Right bracket */}
    <path d="M34 8l8 16-8 16" />
    {/* Slash */}
    <path d="M28 6L20 42" />
  </svg>
);

// Circuit/chip
export const ElectronicsIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Chip body */}
    <rect x="12" y="12" width="24" height="24" rx="2" />
    {/* Pins - top */}
    <path d="M18 12V6M24 12V6M30 12V6" />
    {/* Pins - bottom */}
    <path d="M18 36v6M24 36v6M30 36v6" />
    {/* Pins - left */}
    <path d="M12 18H6M12 24H6M12 30H6" />
    {/* Pins - right */}
    <path d="M36 18h6M36 24h6M36 30h6" />
    {/* Inner detail */}
    <circle cx="24" cy="24" r="4" />
  </svg>
);

// 3D Printer
export const PrinterIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Frame */}
    <path d="M8 8v32M40 8v32M8 8h32M8 40h32" />
    {/* Print bed */}
    <rect x="12" y="32" width="24" height="4" rx="1" />
    {/* Extruder */}
    <rect x="20" y="12" width="8" height="6" rx="1" />
    {/* Nozzle */}
    <path d="M24 18v6" />
    {/* Printed object (layer lines) */}
    <path d="M16 32v-4h16v4" />
    <path d="M18 28v-2h12v2" />
    <path d="M20 26v-2h8v2" />
  </svg>
);

// Airplane
export const AirplaneIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Fuselage */}
    <path d="M4 24h36c2 0 4-1 4-3s-2-3-4-3c-8 0-12 2-16 6H4" />
    {/* Wings */}
    <path d="M18 24l-4 12h4l6-12" />
    <path d="M20 18l8-10h-4l-8 10" />
    {/* Tail */}
    <path d="M6 24l-2-6h4" />
    {/* Engine */}
    <ellipse cx="30" cy="24" rx="2" ry="3" />
  </svg>
);

// Motorcycle
export const MotorcycleIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Wheels */}
    <circle cx="10" cy="34" r="6" />
    <circle cx="38" cy="34" r="6" />
    {/* Frame */}
    <path d="M10 34l8-12h8l4 6" />
    <path d="M30 28l8 6" />
    {/* Tank & seat */}
    <path d="M16 22c2-2 6-2 8 0" />
    <path d="M24 22h6l2 4" />
    {/* Handlebars */}
    <path d="M18 22l-4-6h8" />
    {/* Exhaust */}
    <path d="M26 32h8" />
    {/* Fender */}
    <path d="M4 30c2-1 4-1 6 0" />
    <path d="M38 28c2-1 4 0 6 2" />
  </svg>
);
