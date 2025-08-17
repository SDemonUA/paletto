"use client";

import { RootColor, ColorModification } from "@/schemas";
import { applyColorModifications } from "@/lib/color-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface RootColorEditorProps {
  rootColor: RootColor;
  onUpdate: (updatedRootColor: RootColor) => void;
  onDelete?: () => void;
}

export function RootColorEditor({ rootColor, onUpdate, onDelete }: RootColorEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedColor, setEditedColor] = useState(rootColor.color);
  const [editedLabel, setEditedLabel] = useState(rootColor.label || "");

  const handleSave = () => {
    onUpdate({
      ...rootColor,
      color: editedColor,
      label: editedLabel || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedColor(rootColor.color);
    setEditedLabel(rootColor.label || "");
    setIsEditing(false);
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full border border-gray-300"
            style={{ backgroundColor: rootColor.color }}
          />
          <div>
            <div className="font-medium">{rootColor.label}</div>
            <div className="text-sm text-gray-500">{rootColor.color}</div>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </>
          )}
          {onDelete && (
            <Button variant="destructive" size="sm" onClick={onDelete}>
              Delete
            </Button>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="space-y-3 mt-4">
          <div>
            <Label htmlFor={`color-${rootColor.id}`}>Color</Label>
            <div className="flex gap-2">
              <Input
                id={`color-${rootColor.id}`}
                type="color"
                value={editedColor}
                onChange={(e) => setEditedColor(e.target.value)}
                className="w-20"
              />
              <Input
                value={editedColor}
                onChange={(e) => setEditedColor(e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor={`label-${rootColor.id}`}>Label (optional)</Label>
            <Input
              id={`label-${rootColor.id}`}
              value={editedLabel}
              onChange={(e) => setEditedLabel(e.target.value)}
              placeholder="e.g., Brand Primary"
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface ColorModificationEditorProps {
  modification?: ColorModification;
  baseColor: string;
  onUpdate: (modification?: ColorModification) => void;
}

export function ColorModificationEditor({
  modification,
  baseColor,
  onUpdate,
}: ColorModificationEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mods, setMods] = useState<ColorModification>(modification || {});

  const previewColor = applyColorModifications(baseColor, mods);

  const handleSave = () => {
    // Remove undefined values
    const cleanMods = Object.fromEntries(
      Object.entries(mods).filter(([, value]) => value !== undefined)
    ) as ColorModification;

    onUpdate(Object.keys(cleanMods).length > 0 ? cleanMods : undefined);
    setIsOpen(false);
  };

  const handleReset = () => {
    setMods({});
    onUpdate(undefined);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: previewColor }} />
        <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
          {Object.keys(mods).length > 0 ? "Edit Modifications" : "Add Modifications"}
        </Button>
        {Object.keys(mods).length > 0 && (
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="p-4 border rounded bg-gray-50 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Lightness</Label>
              <Input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={mods.lightness !== undefined ? mods.lightness : 0.5}
                onChange={(e) =>
                  setMods((prev) => ({ ...prev, lightness: parseFloat(e.target.value) }))
                }
              />
              <div className="text-xs text-gray-500">
                {mods.lightness !== undefined ? mods.lightness.toFixed(2) : "0.50"}
              </div>
            </div>
            <div>
              <Label>Saturation</Label>
              <Input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={mods.saturation !== undefined ? mods.saturation : 0.5}
                onChange={(e) =>
                  setMods((prev) => ({ ...prev, saturation: parseFloat(e.target.value) }))
                }
              />
              <div className="text-xs text-gray-500">
                {mods.saturation !== undefined ? mods.saturation.toFixed(2) : "0.50"}
              </div>
            </div>
            <div>
              <Label>Alpha</Label>
              <Input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={mods.alpha !== undefined ? mods.alpha : 1}
                onChange={(e) =>
                  setMods((prev) => ({ ...prev, alpha: parseFloat(e.target.value) }))
                }
              />
              <div className="text-xs text-gray-500">
                {mods.alpha !== undefined ? mods.alpha.toFixed(2) : "1.00"}
              </div>
            </div>
            <div>
              <Label>Hue Shift</Label>
              <Input
                type="range"
                min="-360"
                max="360"
                step="1"
                value={mods.hueShift || 0}
                onChange={(e) =>
                  setMods((prev) => ({ ...prev, hueShift: parseFloat(e.target.value) }))
                }
              />
              <div className="text-xs text-gray-500">{mods.hueShift || 0}°</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave}>Apply</Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
