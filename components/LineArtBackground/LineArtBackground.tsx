"use client";

import React from "react";
import {
  CoffeeIcon,
  CameraIcon,
  DumbbellIcon,
  FishingIcon,
  CodeIcon,
  ElectronicsIcon,
  PrinterIcon,
  AirplaneIcon,
  MotorcycleIcon,
} from "./icons";

// All available icons
const icons = [
  CoffeeIcon,
  CameraIcon,
  DumbbellIcon,
  FishingIcon,
  CodeIcon,
  ElectronicsIcon,
  PrinterIcon,
  AirplaneIcon,
  MotorcycleIcon,
];

// Predefined scattered placements for a natural, hand-placed feel
// Coordinates are percentages, rotations in degrees
const placements = [
  // Spread across the viewport with varied sizes and rotations
  { x: 3, y: 5, rotation: -12, size: 48, iconIndex: 0 },
  { x: 25, y: 2, rotation: 18, size: 42, iconIndex: 7 },
  { x: 48, y: 8, rotation: -5, size: 52, iconIndex: 4 },
  { x: 72, y: 3, rotation: 22, size: 46, iconIndex: 2 },
  { x: 91, y: 6, rotation: -15, size: 50, iconIndex: 5 },

  { x: 8, y: 18, rotation: 10, size: 44, iconIndex: 5 },
  { x: 35, y: 22, rotation: -20, size: 56, iconIndex: 3 },
  { x: 60, y: 16, rotation: 8, size: 48, iconIndex: 8 },
  { x: 85, y: 20, rotation: -12, size: 42, iconIndex: 6 },

  { x: 5, y: 35, rotation: 15, size: 50, iconIndex: 1 },
  { x: 28, y: 38, rotation: -8, size: 46, iconIndex: 2 },
  { x: 52, y: 32, rotation: 25, size: 54, iconIndex: 7 },
  { x: 78, y: 36, rotation: -18, size: 48, iconIndex: 0 },

  { x: 15, y: 52, rotation: -10, size: 44, iconIndex: 4 },
  { x: 42, y: 48, rotation: 12, size: 52, iconIndex: 8 },
  { x: 68, y: 54, rotation: -22, size: 46, iconIndex: 5 },
  { x: 92, y: 50, rotation: 8, size: 50, iconIndex: 3 },

  { x: 2, y: 68, rotation: 20, size: 48, iconIndex: 6 },
  { x: 25, y: 65, rotation: -15, size: 54, iconIndex: 1 },
  { x: 50, y: 70, rotation: 5, size: 42, iconIndex: 0 },
  { x: 75, y: 66, rotation: -25, size: 50, iconIndex: 2 },

  { x: 12, y: 82, rotation: -8, size: 46, iconIndex: 7 },
  { x: 38, y: 85, rotation: 18, size: 52, iconIndex: 4 },
  { x: 62, y: 80, rotation: -12, size: 48, iconIndex: 6 },
  { x: 88, y: 84, rotation: 15, size: 44, iconIndex: 8 },

  { x: 6, y: 95, rotation: 10, size: 50, iconIndex: 3 },
  { x: 32, y: 92, rotation: -20, size: 46, iconIndex: 5 },
  { x: 55, y: 96, rotation: 8, size: 52, iconIndex: 1 },
  { x: 80, y: 94, rotation: -15, size: 48, iconIndex: 0 },
];

export const LineArtBackground: React.FC = () => {
  return (
    <div className="line-art-background" aria-hidden="true">
      {placements.map(({ x, y, rotation, size, iconIndex }, index) => {
        const Icon = icons[iconIndex];
        return (
          <div
            key={index}
            className="line-art-icon-wrapper"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            }}
          >
            <Icon className="line-art-icon" />
          </div>
        );
      })}
    </div>
  );
};

export default LineArtBackground;
