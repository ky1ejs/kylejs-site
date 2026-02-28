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
// Dense layout with icons every ~10% vertically
const placements = [
  // Row 1 (y: 0-6)
  { x: 2, y: 2, rotation: -12, size: 44, iconIndex: 0 },
  { x: 12, y: 5, rotation: 22, size: 46, iconIndex: 7 },
  { x: 24, y: 3, rotation: -8, size: 42, iconIndex: 4 },
  { x: 36, y: 6, rotation: 15, size: 48, iconIndex: 2 },
  { x: 48, y: 2, rotation: -18, size: 44, iconIndex: 5 },
  { x: 60, y: 5, rotation: 10, size: 46, iconIndex: 1 },
  { x: 72, y: 3, rotation: -5, size: 42, iconIndex: 8 },
  { x: 84, y: 6, rotation: 20, size: 48, iconIndex: 3 },
  { x: 96, y: 4, rotation: -15, size: 44, iconIndex: 6 },

  // Row 2 (y: 8-14)
  { x: 6, y: 11, rotation: 8, size: 46, iconIndex: 5 },
  { x: 18, y: 9, rotation: -15, size: 50, iconIndex: 3 },
  { x: 30, y: 13, rotation: 25, size: 44, iconIndex: 8 },
  { x: 42, y: 10, rotation: -10, size: 48, iconIndex: 6 },
  { x: 54, y: 14, rotation: 12, size: 42, iconIndex: 0 },
  { x: 66, y: 11, rotation: -22, size: 46, iconIndex: 4 },
  { x: 78, y: 9, rotation: 5, size: 50, iconIndex: 1 },
  { x: 90, y: 13, rotation: -18, size: 44, iconIndex: 7 },

  // Row 3 (y: 16-22)
  { x: 3, y: 19, rotation: -18, size: 48, iconIndex: 1 },
  { x: 14, y: 17, rotation: 15, size: 44, iconIndex: 2 },
  { x: 26, y: 21, rotation: -8, size: 46, iconIndex: 7 },
  { x: 38, y: 18, rotation: 20, size: 50, iconIndex: 0 },
  { x: 50, y: 22, rotation: -12, size: 42, iconIndex: 5 },
  { x: 62, y: 19, rotation: 8, size: 48, iconIndex: 3 },
  { x: 74, y: 17, rotation: -20, size: 44, iconIndex: 6 },
  { x: 86, y: 21, rotation: 12, size: 46, iconIndex: 8 },
  { x: 97, y: 18, rotation: -5, size: 42, iconIndex: 4 },

  // Row 4 (y: 24-30)
  { x: 8, y: 27, rotation: 10, size: 46, iconIndex: 4 },
  { x: 20, y: 25, rotation: -15, size: 48, iconIndex: 8 },
  { x: 32, y: 29, rotation: 22, size: 44, iconIndex: 5 },
  { x: 44, y: 26, rotation: -5, size: 50, iconIndex: 3 },
  { x: 56, y: 30, rotation: 18, size: 42, iconIndex: 6 },
  { x: 68, y: 27, rotation: -25, size: 46, iconIndex: 1 },
  { x: 80, y: 25, rotation: 8, size: 48, iconIndex: 2 },
  { x: 92, y: 29, rotation: -12, size: 44, iconIndex: 0 },

  // Row 5 (y: 32-38)
  { x: 1, y: 35, rotation: -10, size: 44, iconIndex: 6 },
  { x: 12, y: 33, rotation: 20, size: 48, iconIndex: 0 },
  { x: 24, y: 37, rotation: -18, size: 46, iconIndex: 2 },
  { x: 36, y: 34, rotation: 12, size: 42, iconIndex: 7 },
  { x: 48, y: 38, rotation: -8, size: 50, iconIndex: 4 },
  { x: 60, y: 35, rotation: 15, size: 44, iconIndex: 8 },
  { x: 72, y: 33, rotation: -22, size: 48, iconIndex: 5 },
  { x: 84, y: 37, rotation: 5, size: 46, iconIndex: 3 },
  { x: 96, y: 34, rotation: -15, size: 42, iconIndex: 1 },

  // Row 6 (y: 40-46)
  { x: 5, y: 43, rotation: 18, size: 48, iconIndex: 3 },
  { x: 17, y: 41, rotation: -12, size: 44, iconIndex: 1 },
  { x: 29, y: 45, rotation: 8, size: 50, iconIndex: 6 },
  { x: 41, y: 42, rotation: -20, size: 46, iconIndex: 5 },
  { x: 53, y: 46, rotation: 25, size: 42, iconIndex: 0 },
  { x: 65, y: 43, rotation: -5, size: 48, iconIndex: 2 },
  { x: 77, y: 41, rotation: 15, size: 44, iconIndex: 7 },
  { x: 89, y: 45, rotation: -18, size: 46, iconIndex: 4 },

  // Row 7 (y: 48-54)
  { x: 2, y: 51, rotation: -15, size: 46, iconIndex: 7 },
  { x: 14, y: 49, rotation: 10, size: 50, iconIndex: 4 },
  { x: 26, y: 53, rotation: -22, size: 44, iconIndex: 6 },
  { x: 38, y: 50, rotation: 18, size: 48, iconIndex: 8 },
  { x: 50, y: 54, rotation: -8, size: 42, iconIndex: 1 },
  { x: 62, y: 51, rotation: 12, size: 46, iconIndex: 3 },
  { x: 74, y: 49, rotation: -18, size: 50, iconIndex: 0 },
  { x: 86, y: 53, rotation: 5, size: 44, iconIndex: 5 },
  { x: 98, y: 50, rotation: -12, size: 42, iconIndex: 2 },

  // Row 8 (y: 56-62)
  { x: 7, y: 59, rotation: 22, size: 48, iconIndex: 2 },
  { x: 19, y: 57, rotation: -10, size: 44, iconIndex: 5 },
  { x: 31, y: 61, rotation: 15, size: 46, iconIndex: 1 },
  { x: 43, y: 58, rotation: -25, size: 50, iconIndex: 4 },
  { x: 55, y: 62, rotation: 8, size: 42, iconIndex: 7 },
  { x: 67, y: 59, rotation: -12, size: 48, iconIndex: 6 },
  { x: 79, y: 57, rotation: 20, size: 44, iconIndex: 8 },
  { x: 91, y: 61, rotation: -5, size: 46, iconIndex: 3 },

  // Row 9 (y: 64-70)
  { x: 4, y: 67, rotation: -8, size: 46, iconIndex: 8 },
  { x: 16, y: 65, rotation: 15, size: 42, iconIndex: 3 },
  { x: 28, y: 69, rotation: -18, size: 48, iconIndex: 0 },
  { x: 40, y: 66, rotation: 10, size: 44, iconIndex: 2 },
  { x: 52, y: 70, rotation: -5, size: 50, iconIndex: 5 },
  { x: 64, y: 67, rotation: 22, size: 46, iconIndex: 1 },
  { x: 76, y: 65, rotation: -15, size: 42, iconIndex: 4 },
  { x: 88, y: 69, rotation: 8, size: 48, iconIndex: 7 },
  { x: 99, y: 66, rotation: -20, size: 44, iconIndex: 6 },

  // Row 10 (y: 72-78)
  { x: 1, y: 75, rotation: 12, size: 48, iconIndex: 4 },
  { x: 13, y: 73, rotation: -18, size: 44, iconIndex: 6 },
  { x: 25, y: 77, rotation: 5, size: 46, iconIndex: 8 },
  { x: 37, y: 74, rotation: -10, size: 50, iconIndex: 1 },
  { x: 49, y: 78, rotation: 25, size: 42, iconIndex: 3 },
  { x: 61, y: 75, rotation: -22, size: 48, iconIndex: 0 },
  { x: 73, y: 73, rotation: 15, size: 44, iconIndex: 5 },
  { x: 85, y: 77, rotation: -8, size: 46, iconIndex: 2 },
  { x: 97, y: 74, rotation: 18, size: 42, iconIndex: 7 },

  // Row 11 (y: 80-86)
  { x: 6, y: 83, rotation: -15, size: 46, iconIndex: 5 },
  { x: 18, y: 81, rotation: 20, size: 48, iconIndex: 7 },
  { x: 30, y: 85, rotation: -5, size: 44, iconIndex: 2 },
  { x: 42, y: 82, rotation: 12, size: 50, iconIndex: 4 },
  { x: 54, y: 86, rotation: -18, size: 42, iconIndex: 6 },
  { x: 66, y: 83, rotation: 8, size: 46, iconIndex: 8 },
  { x: 78, y: 81, rotation: -25, size: 48, iconIndex: 0 },
  { x: 90, y: 85, rotation: 15, size: 44, iconIndex: 3 },

  // Row 12 (y: 88-94)
  { x: 3, y: 91, rotation: 10, size: 44, iconIndex: 3 },
  { x: 15, y: 89, rotation: -12, size: 48, iconIndex: 1 },
  { x: 27, y: 93, rotation: 22, size: 46, iconIndex: 6 },
  { x: 39, y: 90, rotation: -8, size: 42, iconIndex: 5 },
  { x: 51, y: 94, rotation: 18, size: 50, iconIndex: 0 },
  { x: 63, y: 91, rotation: -20, size: 44, iconIndex: 2 },
  { x: 75, y: 89, rotation: 5, size: 48, iconIndex: 7 },
  { x: 87, y: 93, rotation: -15, size: 46, iconIndex: 4 },
  { x: 98, y: 90, rotation: 12, size: 42, iconIndex: 8 },

  // Row 13 (y: 96-100)
  { x: 8, y: 98, rotation: -18, size: 46, iconIndex: 8 },
  { x: 22, y: 97, rotation: 8, size: 44, iconIndex: 4 },
  { x: 36, y: 99, rotation: -5, size: 48, iconIndex: 1 },
  { x: 50, y: 97, rotation: 20, size: 42, iconIndex: 7 },
  { x: 64, y: 99, rotation: -12, size: 46, iconIndex: 3 },
  { x: 78, y: 98, rotation: 15, size: 50, iconIndex: 6 },
  { x: 92, y: 97, rotation: -22, size: 44, iconIndex: 5 },
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
