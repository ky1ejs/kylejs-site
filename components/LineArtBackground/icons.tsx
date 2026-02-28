import React from "react";

// Shared props for all icons
interface IconProps {
  className?: string;
}

// Coffee cup with steam - steam animates on hover
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
    {/* Steam lines - these will animate */}
    <g className="line-art-steam">
      <path d="M14 14c0-3 2-3 2-6s-2-3-2-6" />
      <path d="M20 14c0-3 2-3 2-6s-2-3-2-6" />
      <path d="M26 14c0-3 2-3 2-6s-2-3-2-6" />
    </g>
  </svg>
);

// Camera - shutter click animation on hover
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
    {/* Lens - outer */}
    <circle cx="24" cy="28" r="9" />
    {/* Lens - inner (animates) */}
    <circle cx="24" cy="28" r="5" className="line-art-shutter" />
    {/* Lens - center */}
    <circle cx="24" cy="28" r="2" />
    {/* Viewfinder bump */}
    <path d="M16 14V10a2 2 0 012-2h12a2 2 0 012 2v4" />
    {/* Flash */}
    <circle cx="38" cy="20" r="2" />
    {/* Shutter button */}
    <rect x="20" y="6" width="8" height="4" rx="1" />
  </svg>
);

// Dumbbell - pumps up and down on hover
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
    <g className="line-art-pump">
      {/* Bar */}
      <path d="M12 24h24" />
      {/* Left weight */}
      <rect x="4" y="16" width="8" height="16" rx="1" />
      <rect x="8" y="12" width="4" height="24" rx="1" />
      {/* Right weight */}
      <rect x="36" y="16" width="8" height="16" rx="1" />
      <rect x="36" y="12" width="4" height="24" rx="1" />
    </g>
  </svg>
);

// Fishing rod with fish - line wobbles on hover
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
    {/* Fishing rod */}
    <path d="M4 40L20 8" strokeWidth="2" />
    {/* Rod handle */}
    <path d="M4 40l-2 2" strokeWidth="2.5" />
    {/* Rod tip */}
    <path d="M20 8l2-2" />
    {/* Fishing line - animates */}
    <path d="M22 6c0 8 4 16 4 24" className="line-art-fishing-line" />
    {/* Hook */}
    <path d="M26 30c2 2 4 4 2 6s-4 0-4-2" />
    {/* Fish */}
    <g className="line-art-fish">
      <path d="M32 34c4-2 10-2 12 2s-2 6-6 6-8-2-8-4 0-2 2-4z" />
      <circle cx="40" cy="37" r="1" />
      {/* Fish tail */}
      <path d="M32 36l-4-3v8l4-3" />
    </g>
  </svg>
);

// Terminal/code window - cursor blinks on hover
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
    {/* Terminal window */}
    <rect x="4" y="6" width="40" height="36" rx="3" />
    {/* Title bar */}
    <path d="M4 14h40" />
    {/* Window buttons */}
    <circle cx="10" cy="10" r="1.5" />
    <circle cx="16" cy="10" r="1.5" />
    <circle cx="22" cy="10" r="1.5" />
    {/* Code lines */}
    <path d="M10 22h8" />
    <path d="M14 28h12" />
    <path d="M10 34h6" />
    {/* Cursor - animates */}
    <path d="M20 34v-4" className="line-art-cursor" strokeWidth="2" />
    {/* Curly braces hint */}
    <path d="M30 20c-2 0-3 1-3 3s1 3 0 3-1 1-1 2 0 1 1 2 1 3 0 3 3 3 3 3" />
    <path d="M36 20c2 0 3 1 3 3s-1 3 0 3 1 1 1 2 0 1-1 2-1 3 0 3-3 3-3 3" />
  </svg>
);

// Circuit/chip - electricity pulses on hover
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
    {/* Inner circuit detail */}
    <path d="M18 18h4v4h4v4h4" className="line-art-circuit" />
    <circle cx="18" cy="18" r="1.5" className="line-art-pulse" />
    <circle cx="30" cy="30" r="1.5" className="line-art-pulse" />
  </svg>
);

// 3D Printer - simple box frame with nozzle
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
    {/* Simple cube frame */}
    <path d="M8 8h32v32H8z" />
    <path d="M8 8l6-4h20l6 4" />
    <path d="M40 8l4 4v24l-4 4" />
    {/* Print head - moves on hover */}
    <g className="line-art-printhead">
      <rect x="18" y="12" width="12" height="6" rx="1" />
      <path d="M24 18v8" strokeWidth="2" />
    </g>
    {/* Bed */}
    <path d="M12 36h24" strokeWidth="2" />
    {/* Printed object */}
    <path d="M18 36v-6h12v6" />
  </svg>
);

// Airplane - simple side view silhouette
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
    <g className="line-art-fly">
      {/* Fuselage */}
      <path d="M4 24h36c3 0 6-2 6-4s-3-2-6-2H14" />
      <path d="M4 24c0 2 2 4 6 4h30c3 0 4-2 4-4" />
      {/* Wing */}
      <path d="M16 24l-4-14h6l6 14" />
      {/* Tail */}
      <path d="M6 24l-2-8h4" />
      <path d="M6 20h6" />
      {/* Windows */}
      <circle cx="38" cy="22" r="1.5" />
    </g>
  </svg>
);

// Motorcycle - simple profile with spinning wheels
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
    {/* Back wheel */}
    <g className="line-art-wheel-back">
      <circle cx="10" cy="32" r="8" />
      <circle cx="10" cy="32" r="3" />
    </g>
    {/* Front wheel */}
    <g className="line-art-wheel-front">
      <circle cx="38" cy="32" r="7" />
      <circle cx="38" cy="32" r="2.5" />
    </g>
    {/* Body frame */}
    <path d="M10 32l8-14h8l12 14" strokeWidth="2" />
    {/* Tank */}
    <ellipse cx="22" cy="16" rx="5" ry="2.5" />
    {/* Seat */}
    <path d="M26 14c3 0 6 2 8 6" strokeWidth="2" />
    {/* Handlebars */}
    <path d="M32 12l6-4" strokeWidth="2" />
    {/* Fork */}
    <path d="M34 18l4 14" strokeWidth="1.5" />
    {/* Exhaust */}
    <path d="M18 28l-6 8" />
  </svg>
);
