"use client";

import { ColorValue, RootColor, ColorModification } from "@/schemas";
import { resolveColorValue, createColorRef, getColorName } from "@/lib/color-utils";
import { ColorModificationEditor } from "./root-color-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface ColorValueEditorProps {
  colorValue: ColorValue;
  rootColors: RootColor[];
  onUpdate: (newColorValue: ColorValue) => void;
  label: string;
}

export function ColorValueEditor({
  colorValue,
  rootColors,
  onUpdate,
  label,
}: ColorValueEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<"direct" | "reference">(
    typeof colorValue === "string" ? "direct" : "reference"
  );
  const [directColor, setDirectColor] = useState(
    typeof colorValue === "string" ? colorValue : "#000000"
  );
  const [selectedRootId, setSelectedRootId] = useState(
    typeof colorValue === "object" ? colorValue.rootColorId : rootColors[0]?.id || ""
  );

  const resolvedColor = resolveColorValue(colorValue, rootColors);
  const currentColorRef = typeof colorValue === "object" ? colorValue : undefined;

  const handleSave = () => {
    if (editMode === "direct") {
      onUpdate(directColor);
    } else {
      onUpdate(createColorRef(selectedRootId, currentColorRef?.modifications));
    }
    setIsEditing(false);
  };

  const handleUpdateModifications = (modifications?: ColorModification) => {
    if (editMode === "reference") {
      onUpdate(createColorRef(selectedRootId, modifications));
    }
  };

  return (
    <div className="p-3 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: resolvedColor }} />
          <div>
            <div className="font-medium">{label}</div>
            <div className="text-xs text-gray-500">
              {typeof colorValue === "string"
                ? `Direct: ${colorValue}`
                : `Ref: ${colorValue.rootColorId}`}
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Close" : "Edit"}
        </Button>
      </div>

      {isEditing && (
        <div className="space-y-4 mt-4 p-3 bg-gray-50 rounded">
          <div>
            <Label>Edit Mode</Label>
            <div className="flex gap-2 mt-1">
              <Button
                variant={editMode === "direct" ? "default" : "outline"}
                size="sm"
                onClick={() => setEditMode("direct")}
              >
                Direct Color
              </Button>
              <Button
                variant={editMode === "reference" ? "default" : "outline"}
                size="sm"
                onClick={() => setEditMode("reference")}
              >
                Reference Root Color
              </Button>
            </div>
          </div>

          {editMode === "direct" ? (
            <div>
              <Label htmlFor="direct-color">Color Value</Label>
              <div className="flex gap-2">
                <Input
                  id="direct-color"
                  type="color"
                  value={directColor}
                  onChange={(e) => setDirectColor(e.target.value)}
                  className="w-20"
                />
                <Input
                  value={directColor}
                  onChange={(e) => setDirectColor(e.target.value)}
                  placeholder="#000000"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label htmlFor="root-color-select">Root Color</Label>
                <select
                  id="root-color-select"
                  value={selectedRootId}
                  onChange={(e) => setSelectedRootId(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {rootColors.map((rootColor) => (
                    <option key={rootColor.id} value={rootColor.id}>
                      {rootColor.label || getColorName(rootColor.color)} ({rootColor.color})
                    </option>
                  ))}
                </select>
              </div>

              {selectedRootId && (
                <ColorModificationEditor
                  modification={currentColorRef?.modifications}
                  baseColor={rootColors.find((rc) => rc.id === selectedRootId)?.color || "#000000"}
                  onUpdate={handleUpdateModifications}
                />
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
