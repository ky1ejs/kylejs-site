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
// Denser layout with more icons
const placements = [
  // Row 1 (y: 0-10)
  { x: 2, y: 3, rotation: -12, size: 44, iconIndex: 0 },
  { x: 14, y: 7, rotation: 22, size: 48, iconIndex: 7 },
  { x: 28, y: 2, rotation: -8, size: 42, iconIndex: 4 },
  { x: 42, y: 8, rotation: 15, size: 50, iconIndex: 2 },
  { x: 56, y: 4, rotation: -18, size: 46, iconIndex: 5 },
  { x: 70, y: 9, rotation: 10, size: 44, iconIndex: 1 },
  { x: 84, y: 3, rotation: -5, size: 48, iconIndex: 8 },
  { x: 96, y: 7, rotation: 20, size: 42, iconIndex: 3 },

  // Row 2 (y: 12-20)
  { x: 6, y: 16, rotation: 8, size: 46, iconIndex: 5 },
  { x: 20, y: 13, rotation: -15, size: 52, iconIndex: 3 },
  { x: 34, y: 18, rotation: 25, size: 44, iconIndex: 8 },
  { x: 48, y: 14, rotation: -10, size: 48, iconIndex: 6 },
  { x: 62, y: 19, rotation: 12, size: 42, iconIndex: 0 },
  { x: 76, y: 15, rotation: -22, size: 50, iconIndex: 4 },
  { x: 90, y: 17, rotation: 5, size: 46, iconIndex: 1 },

  // Row 3 (y: 24-32)
  { x: 3, y: 28, rotation: -18, size: 48, iconIndex: 1 },
  { x: 16, y: 25, rotation: 15, size: 44, iconIndex: 2 },
  { x: 30, y: 30, rotation: -8, size: 50, iconIndex: 7 },
  { x: 44, y: 26, rotation: 20, size: 46, iconIndex: 0 },
  { x: 58, y: 31, rotation: -12, size: 42, iconIndex: 5 },
  { x: 72, y: 27, rotation: 8, size: 48, iconIndex: 3 },
  { x: 86, y: 29, rotation: -20, size: 44, iconIndex: 6 },
  { x: 98, y: 25, rotation: 12, size: 46, iconIndex: 8 },

  // Row 4 (y: 36-44)
  { x: 8, y: 40, rotation: 10, size: 46, iconIndex: 4 },
  { x: 22, y: 37, rotation: -15, size: 50, iconIndex: 8 },
  { x: 36, y: 42, rotation: 22, size: 44, iconIndex: 5 },
  { x: 50, y: 38, rotation: -5, size: 48, iconIndex: 3 },
  { x: 64, y: 43, rotation: 18, size: 42, iconIndex: 6 },
  { x: 78, y: 39, rotation: -25, size: 46, iconIndex: 1 },
  { x: 92, y: 41, rotation: 8, size: 50, iconIndex: 2 },

  // Row 5 (y: 48-56)
  { x: 1, y: 52, rotation: -10, size: 44, iconIndex: 6 },
  { x: 14, y: 49, rotation: 20, size: 48, iconIndex: 0 },
  { x: 28, y: 54, rotation: -18, size: 46, iconIndex: 2 },
  { x: 42, y: 50, rotation: 12, size: 42, iconIndex: 7 },
  { x: 56, y: 55, rotation: -8, size: 50, iconIndex: 4 },
  { x: 70, y: 51, rotation: 15, size: 44, iconIndex: 8 },
  { x: 84, y: 53, rotation: -22, size: 48, iconIndex: 5 },
  { x: 97, y: 49, rotation: 5, size: 46, iconIndex: 3 },

  // Row 6 (y: 60-68)
  { x: 5, y: 64, rotation: 18, size: 48, iconIndex: 3 },
  { x: 19, y: 61, rotation: -12, size: 44, iconIndex: 1 },
  { x: 33, y: 66, rotation: 8, size: 50, iconIndex: 6 },
  { x: 47, y: 62, rotation: -20, size: 46, iconIndex: 5 },
  { x: 61, y: 67, rotation: 25, size: 42, iconIndex: 0 },
  { x: 75, y: 63, rotation: -5, size: 48, iconIndex: 2 },
  { x: 89, y: 65, rotation: 15, size: 44, iconIndex: 7 },

  // Row 7 (y: 72-80)
  { x: 2, y: 76, rotation: -15, size: 46, iconIndex: 7 },
  { x: 16, y: 73, rotation: 10, size: 50, iconIndex: 4 },
  { x: 30, y: 78, rotation: -22, size: 44, iconIndex: 6 },
  { x: 44, y: 74, rotation: 18, size: 48, iconIndex: 8 },
  { x: 58, y: 79, rotation: -8, size: 42, iconIndex: 1 },
  { x: 72, y: 75, rotation: 12, size: 46, iconIndex: 3 },
  { x: 86, y: 77, rotation: -18, size: 50, iconIndex: 0 },
  { x: 98, y: 73, rotation: 5, size: 44, iconIndex: 5 },

  // Row 8 (y: 84-92)
  { x: 7, y: 88, rotation: 22, size: 48, iconIndex: 2 },
  { x: 21, y: 85, rotation: -10, size: 44, iconIndex: 5 },
  { x: 35, y: 90, rotation: 15, size: 46, iconIndex: 1 },
  { x: 49, y: 86, rotation: -25, size: 50, iconIndex: 4 },
  { x: 63, y: 91, rotation: 8, size: 42, iconIndex: 7 },
  { x: 77, y: 87, rotation: -12, size: 48, iconIndex: 6 },
  { x: 91, y: 89, rotation: 20, size: 44, iconIndex: 8 },

  // Row 9 (y: 94-100)
  { x: 4, y: 97, rotation: -8, size: 46, iconIndex: 8 },
  { x: 18, y: 95, rotation: 15, size: 42, iconIndex: 3 },
  { x: 32, y: 98, rotation: -18, size: 48, iconIndex: 0 },
  { x: 46, y: 94, rotation: 10, size: 44, iconIndex: 2 },
  { x: 60, y: 99, rotation: -5, size: 50, iconIndex: 5 },
  { x: 74, y: 96, rotation: 22, size: 46, iconIndex: 1 },
  { x: 88, y: 98, rotation: -15, size: 42, iconIndex: 4 },
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
