import React from "react";
import { cn } from "@/lib/utils";
import { getColorName } from "@/lib/colorUtils";
import chroma from "chroma-js";

interface ColorSwatchProps {
  color: string;
  name?: string;
  showName?: boolean;
  showHex?: boolean;
  className?: string;
}

export function ColorSwatch({
  color,
  name,
  showName = true,
  showHex = true,
  className,
}: ColorSwatchProps) {
  // Validate if the color is a valid hex color
  const isValidColor = /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);

  if (!isValidColor) {
    return (
      <div className={cn("p-4 border rounded-lg", className)}>
        <div className="text-red-500">Invalid color format: {color}</div>
      </div>
    );
  }

  // Get color name if not provided
  const displayName = name || getColorName(color) || "Unnamed Color";

  return (
    <div
      className={cn(
        "flex flex-col items-center p-4 border rounded-lg shadow-sm transition-all duration-200 hover:shadow-md",
        className
      )}
    >
      <div
        className="w-full h-16 rounded mb-2 border"
        style={{
          backgroundColor: color,
          color: chroma(color).luminance() > 0.5 ? "black" : "white",
        }}
      />

      {showName && <span className="text-sm font-medium text-center">{displayName}</span>}

      {showHex && <span className="text-xs text-gray-500 mt-1">{color.toUpperCase()}</span>}
    </div>
  );
}
