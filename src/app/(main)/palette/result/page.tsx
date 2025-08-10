import { UiPaletteSchema } from "@/schemas";
import { notFound } from "next/navigation";
import { PreviewToggle } from "../components/PreviewToggle";
import { ExportButton } from "../components/ExportButton";
import { Button } from "@/components/ui/button";

export default async function GeneratePalettePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { json } = await searchParams;

  let data;
  try {
    data = JSON.parse(json ? (Array.isArray(json) ? json[0] : json) : "");
  } catch (e) {
    console.log("Failed json", json);
    console.error("Failed to parse JSON:", e);
    // TODO: add better error handling
    notFound();
  }

  // Validate the palette against the schema
  const validationResult = UiPaletteSchema.safeParse(data);
  if (!validationResult.success) {
    console.error("Palette validation error:", validationResult.error);
    // TODO: add better error handling
    notFound();
  }

  // Use the validated palette
  const palette = validationResult.data;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">Your Generated Palette</h1>
        <div className="flex items-center gap-2">
          {/* TODO: Implement regeneration in future */}
          <Button variant="secondary" disabled title="Awaiting in near future">
            Regenerate
          </Button>
          <ExportButton palette={palette} />
        </div>
      </div>

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
            <div className="text-sm text-gray-500">Harmony Type</div>
            <div className="capitalize">{palette.harmonyType}</div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-500">Personality</div>
            <div className="capitalize">{palette.personality}</div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Semantic Colors</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {Object.entries(palette.semanticColors).map(([name, color]) => (
            <div key={name} className="p-4 border rounded">
              <div className="w-full h-12 rounded mb-2" style={{ backgroundColor: color }}></div>
              <div className="text-sm text-gray-500 capitalize">{name}</div>
              <div className="text-sm">{color}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional color sections for the complete palette */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ColorSection title="Text Colors" colors={palette.textColors} />
        <ColorSection title="Background Colors" colors={palette.backgroundColors} />
        <ColorSection title="Border Colors" colors={palette.borderColors} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Shadow Colors</h2>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(palette.shadowColors).map(([name, color]) => (
            <div key={name} className="p-4 border rounded">
              <div
                className="w-full h-12 rounded mb-2 shadow-lg"
                style={{ boxShadow: `0 4px 6px ${color}` }}
              ></div>
              <div className="text-sm text-gray-500 capitalize">{name}</div>
              <div className="text-sm">{color}</div>
            </div>
          ))}
        </div>
      </div>

      <PreviewToggle palette={palette} framework="mui" />
    </main>
  );
}

function ColorSection({ title, colors }: { title: string; colors: Record<string, string> }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(colors).map(([name, color]) => (
          <div key={name} className="p-4 border rounded">
            <div className="w-full h-12 rounded mb-2" style={{ backgroundColor: color }}></div>
            <div className="text-sm text-gray-500 capitalize">{name}</div>
            <div className="text-sm">{color}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
