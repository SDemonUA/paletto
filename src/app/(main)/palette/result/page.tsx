"use client";

import {
  UiPaletteSchema,
  UiPaletteHarmonyScheme,
  UiPalettePersonalityScheme,
  UiPalette,
  RootColor,
  ColorValue,
  ColorRef,
} from "@/schemas";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { PreviewToggle } from "../components/preview-toggle";
import { ExportButton } from "../components/export-button";
import { RootColorEditor } from "../components/root-color-editor";
import { ColorRefInput } from "@/components/color-ref-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { resolveColorValue } from "@/lib/color-utils";
import { generatePaletteAction } from "@/actions/generatePalette";
import { useState, useEffect } from "react";
import { z } from "zod";

export default function GeneratePalettePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [palette, setPalette] = useState<UiPalette | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize palette from URL params
  useEffect(() => {
    const json = searchParams.get("json");
    if (!json) {
      notFound();
      return;
    }

    try {
      const data = JSON.parse(json);
      const validationResult = UiPaletteSchema.safeParse(data);
      if (!validationResult.success) {
        console.error("Palette validation error:", validationResult.error);
        notFound();
        return;
      }
      setPalette(validationResult.data);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      notFound();
    }
  }, [searchParams]);

  const handleRegenerate = async (newHarmony?: string, newPersonality?: string) => {
    if (!palette) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await generatePaletteAction({
        baseColor: palette.baseColor,
        harmonyType: (newHarmony || palette.harmonyType) as z.infer<typeof UiPaletteHarmonyScheme>,
        personality: (newPersonality || palette.personality) as z.infer<
          typeof UiPalettePersonalityScheme
        >,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.palette) {
        setPalette(result.palette);
        // Update URL with new palette
        router.replace(
          `/palette/result?json=${encodeURIComponent(JSON.stringify(result.palette))}`
        );
      }
    } catch (err) {
      setError("Failed to regenerate palette");
      console.error("Regeneration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const harmonyOptions = [
    { value: "analogous", label: "Analogous" },
    { value: "complementary", label: "Complementary" },
    { value: "triadic", label: "Triadic" },
    { value: "tetradic", label: "Tetradic" },
    { value: "monochromatic", label: "Monochromatic" },
  ];

  const personalityOptions = [
    { value: "calm", label: "🌿 Calm" },
    { value: "energetic", label: "⚡ Energetic" },
    { value: "professional", label: "🏢 Professional" },
    { value: "playful", label: "🎉 Playful" },
    { value: "elegant", label: "✨ Elegant" },
    { value: "vibrant", label: "🌈 Vibrant" },
  ];

  if (!palette) {
    return <div>Loading...</div>;
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">Your Generated Palette</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => handleRegenerate()} disabled={isLoading}>
            {isLoading ? "Regenerating..." : "Regenerate"}
          </Button>
          <ExportButton palette={palette} />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Base Settings</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-500">Base Color</div>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: palette.baseColor }}
              ></div>
              <div>{palette.baseColor}</div>
            </div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-500 mb-2">Harmony Type</div>
            <select
              value={palette.harmonyType}
              onChange={(e) => handleRegenerate(e.target.value, undefined)}
              className="w-full p-2 border rounded bg-white"
              disabled={isLoading}
            >
              {harmonyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-500 mb-2">Personality</div>
            <select
              value={palette.personality}
              onChange={(e) => handleRegenerate(undefined, e.target.value)}
              className="w-full p-2 border rounded bg-white"
              disabled={isLoading}
            >
              {personalityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Root Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {palette.rootColors?.map((rootColor) => (
            <RootColorEditor
              key={rootColor.id}
              rootColor={rootColor}
              onUpdate={(updatedRootColor) => {
                const updatedPalette = {
                  ...palette,
                  rootColors:
                    palette.rootColors?.map((rc) =>
                      rc.id === rootColor.id ? updatedRootColor : rc
                    ) || [],
                };
                setPalette(updatedPalette);
                router.replace(
                  `/palette/result?json=${encodeURIComponent(JSON.stringify(updatedPalette))}`
                );
              }}
            />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Semantic Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(palette.semanticColors).map(([name, colorValue]) => (
            <ColorEditor
              key={name}
              colorValue={colorValue}
              rootColors={palette.rootColors || []}
              onUpdate={(newColorValue) => {
                const updatedPalette = {
                  ...palette,
                  semanticColors: {
                    ...palette.semanticColors,
                    [name]: newColorValue,
                  },
                };
                setPalette(updatedPalette);
                router.replace(
                  `/palette/result?json=${encodeURIComponent(JSON.stringify(updatedPalette))}`
                );
              }}
              label={name.charAt(0).toUpperCase() + name.slice(1)}
            />
          ))}
        </div>
      </div>

      {/* Additional color sections for the complete palette */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ColorSection
          title="Text Colors"
          colors={palette.textColors}
          rootColors={palette.rootColors || []}
          palette={palette}
          setPalette={setPalette}
          router={router}
        />
        <ColorSection
          title="Background Colors"
          colors={palette.backgroundColors}
          rootColors={palette.rootColors || []}
          palette={palette}
          setPalette={setPalette}
          router={router}
        />
        <ColorSection
          title="Border Colors"
          colors={palette.borderColors}
          rootColors={palette.rootColors || []}
          palette={palette}
          setPalette={setPalette}
          router={router}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Shadow Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(palette.shadowColors).map(([name, colorValue]) => (
            <ColorEditor
              key={name}
              colorValue={colorValue}
              rootColors={palette.rootColors || []}
              onUpdate={(newColorValue) => {
                const updatedPalette = {
                  ...palette,
                  shadowColors: {
                    ...palette.shadowColors,
                    [name]: newColorValue,
                  },
                };
                setPalette(updatedPalette);
                router.replace(
                  `/palette/result?json=${encodeURIComponent(JSON.stringify(updatedPalette))}`
                );
              }}
              label={name.charAt(0).toUpperCase() + name.slice(1) + " Shadow"}
            />
          ))}
        </div>
      </div>

      <PreviewToggle palette={palette} framework="mui" />
    </main>
  );
}

function ColorSection({
  title,
  colors,
  rootColors,
  palette,
  setPalette,
  router,
}: {
  title: string;
  colors: Record<string, ColorValue>;
  rootColors: RootColor[];
  palette: UiPalette;
  setPalette: React.Dispatch<React.SetStateAction<UiPalette | null>>;
  router: ReturnType<typeof useRouter>;
}) {
  const updateColor = (colorName: string, newColorValue: ColorValue) => {
    // Map title to correct property key
    const sectionKeyMap: Record<string, string> = {
      "Text Colors": "textColors",
      "Background Colors": "backgroundColors",
      "Border Colors": "borderColors",
    };

    const sectionKey = sectionKeyMap[title];
    if (!sectionKey) {
      console.error("Unknown section:", title);
      return;
    }

    const updatedPalette = {
      ...palette,
      [sectionKey]: {
        ...colors,
        [colorName]: newColorValue,
      },
    };
    setPalette(updatedPalette);
    router.replace(`/palette/result?json=${encodeURIComponent(JSON.stringify(updatedPalette))}`);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(colors).map(([name, colorValue]) => (
          <ColorEditor
            key={name}
            colorValue={colorValue}
            rootColors={rootColors}
            onUpdate={(newColorValue) => updateColor(name, newColorValue)}
            label={name.charAt(0).toUpperCase() + name.slice(1)}
          />
        ))}
      </div>
    </div>
  );
}

// New ColorEditor component using ColorRefInput for better UX
function ColorEditor({
  colorValue,
  rootColors,
  onUpdate,
  label,
}: {
  colorValue: ColorValue;
  rootColors: RootColor[];
  onUpdate: (newColorValue: ColorValue) => void;
  label: string;
}) {
  // Track the current ColorRef value (what the ColorRefInput is showing)
  const [currentColorRef, setCurrentColorRef] = useState<ColorRef | null>(() => {
    // Initialize based on the current colorValue
    if (typeof colorValue === "string") {
      // For direct colors, start with the first root color as a default
      return rootColors.length > 0
        ? {
            rootColorId: rootColors[0].id,
            modifications: undefined,
          }
        : null;
    }
    return colorValue;
  });

  // The displayed color should be from the current selection, not the original colorValue
  const displayedColor = currentColorRef
    ? resolveColorValue(currentColorRef, rootColors)
    : resolveColorValue(colorValue, rootColors);

  const handleColorRefChange = (colorRef: ColorRef | null) => {
    if (colorRef) {
      setCurrentColorRef(colorRef);
      onUpdate(colorRef);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded border flex-shrink-0"
          style={{ backgroundColor: displayedColor }}
        />
        <div className="flex-1">
          <ColorRefInput
            palette={rootColors}
            value={currentColorRef}
            onChange={handleColorRefChange}
            placeholder={`Select color for ${label.toLowerCase()}`}
          />
        </div>
      </div>
      {typeof colorValue === "string" && (
        <div className="text-xs text-muted-foreground">Original: {colorValue}</div>
      )}
    </div>
  );
}
