"use client";

import { useState } from "react";
import chroma from "chroma-js";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, ChevronDown, Palette } from "lucide-react";
import type { RootColor, ColorRef, ColorModification } from "@/schemas";
import { applyColorModifications } from "@/lib/color-utils";

interface ColorRefInputProps {
  palette: RootColor[];
  value?: ColorRef | null;
  onChange?: (colorRef: ColorRef | null) => void;
  placeholder?: string;
}

export function ColorRefInput({
  palette,
  value,
  onChange,
  placeholder = "Select color",
}: ColorRefInputProps) {
  const [open, setOpen] = useState(false);
  const [selectedRootColorId, setSelectedRootColorId] = useState<string>(value?.rootColorId || "");
  const [modifications, setModifications] = useState<ColorModification>(value?.modifications || {});

  const selectedRootColor = palette.find((color) => color.id === selectedRootColorId);
  const finalColor = selectedRootColor
    ? applyColorModifications(selectedRootColor.color, modifications)
    : null;

  const updateColorRef = (rootColorId: string, mods: ColorModification) => {
    const colorRef: ColorRef = {
      rootColorId,
      modifications: Object.keys(mods).length > 0 ? mods : undefined,
    };
    onChange?.(colorRef);
  };

  const handleRootColorChange = (rootColorId: string) => {
    setSelectedRootColorId(rootColorId);
    updateColorRef(rootColorId, modifications);
  };

  const handleModificationChange = (key: keyof ColorModification, value: number) => {
    const newMods = { ...modifications, [key]: value };
    setModifications(newMods);
    if (selectedRootColorId) {
      updateColorRef(selectedRootColorId, newMods);
    }
  };

  const resetModifications = () => {
    setModifications({});
    if (selectedRootColorId) {
      updateColorRef(selectedRootColorId, {});
    }
  };

  const hasModifications = Object.keys(modifications).length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9 px-3 bg-transparent"
        >
          <div className="flex items-center gap-2 min-w-0">
            {finalColor ? (
              <>
                <div
                  className="w-4 h-4 rounded border flex-shrink-0"
                  style={{ backgroundColor: chroma(finalColor).css() }}
                />
                <span className="truncate text-sm">
                  {selectedRootColor?.label || selectedRootColor?.id}
                  {hasModifications && (
                    <Badge variant="secondary" className="ml-1 text-xs px-1">
                      Modified
                    </Badge>
                  )}
                </span>
              </>
            ) : (
              <>
                <Palette className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">{placeholder}</span>
              </>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4 space-y-4">
          {/* Color Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Base Color</Label>
            <div className="grid grid-cols-6 gap-1.5">
              {palette.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleRootColorChange(color.id)}
                  className={`relative w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                    selectedRootColorId === color.id
                      ? "border-primary ring-1 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  }`}
                  style={{ backgroundColor: color.color }}
                  title={color.label || color.id}
                >
                  {selectedRootColorId === color.id && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border border-background" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Color Preview */}
          {selectedRootColor && finalColor && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Preview</Label>
                {hasModifications && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetModifications}
                    className="h-6 px-2"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reset
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <div className="flex-1 text-center">
                  <div
                    className="w-full h-8 rounded border mb-1"
                    style={{ backgroundColor: selectedRootColor.color }}
                  />
                  <span className="text-xs text-muted-foreground">Original</span>
                </div>
                <div className="flex-1 text-center">
                  <div
                    className="w-full h-8 rounded border mb-1"
                    style={{ backgroundColor: chroma(finalColor).css() }}
                  />
                  <span className="text-xs text-muted-foreground">Modified</span>
                </div>
              </div>
            </div>
          )}

          {/* Modifications */}
          {selectedRootColor && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Adjustments</Label>

              {/* Lightness */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Lightness</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {((modifications.lightness ?? 0.5) * 100).toFixed(0)}%
                  </span>
                </div>
                <Slider
                  value={[modifications.lightness ?? 0.5]}
                  onValueChange={([value]) => handleModificationChange("lightness", value)}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
              </div>

              {/* Saturation */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Saturation</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {((modifications.saturation ?? 0.5) * 100).toFixed(0)}%
                  </span>
                </div>
                <Slider
                  value={[modifications.saturation ?? 0.5]}
                  onValueChange={([value]) => handleModificationChange("saturation", value)}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
              </div>

              {/* Alpha */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Opacity</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {((modifications.alpha ?? 1) * 100).toFixed(0)}%
                  </span>
                </div>
                <Slider
                  value={[modifications.alpha ?? 1]}
                  onValueChange={([value]) => handleModificationChange("alpha", value)}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
              </div>

              {/* Hue Shift */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Hue Shift</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {modifications.hueShift ?? 0}°
                  </span>
                </div>
                <Slider
                  value={[modifications.hueShift ?? 0]}
                  onValueChange={([value]) => handleModificationChange("hueShift", value)}
                  min={-360}
                  max={360}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
