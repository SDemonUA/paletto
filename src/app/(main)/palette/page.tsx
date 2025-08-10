"use client";

import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRightIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

import { Form, FormField } from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { FadeInTransition } from "@/components/fade-in-transition";

import { SelectFrameworkInput } from "./components/SelectFrameworkInput";
import { ColorInput } from "./components/ColorInput";

const colorPersonalities = [
  { type: "professional", label: "🏢 Professional", harmony: "complementary" },
  { type: "playful", label: "🎉 Playful", harmony: "triadic" },
  { type: "calm", label: "🌿 Calm", harmony: "analogous" },
  { type: "energetic", label: "⚡ Energetic", harmony: "tetradic" },
  { type: "bold", label: "🎯 Bold", harmony: "complementary" },
  { type: "elegant", label: "✨ Elegant", harmony: "analogous" },
];

const popularColors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];
const trendingColors = ["#F97316", "#84CC16", "#EC4899", "#6366F1", "#14B8A6", "#F59E0B"];

const formSchema = z.object({
  baseColor: z.string(),
  personality: z.enum(["professional", "playful", "calm", "energetic", "bold", "elegant"]),
  harmonyType: z.enum(["complementary", "analogous", "triadic", "tetradic"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function PalettePage() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      baseColor: trendingColors[Math.floor(Math.random() * trendingColors.length)],
    },
  });

  const { watch, handleSubmit } = form;
  const personality = watch("personality");

  const getRecommendedHarmony = (): "complementary" | "analogous" | "triadic" | "tetradic" => {
    if (!personality) return "complementary";
    const selectedPersonality = colorPersonalities.find((p) => p.type === personality);
    return (
      (selectedPersonality?.harmony as "complementary" | "analogous" | "triadic" | "tetradic") ||
      "complementary"
    );
  };

  const generateRandomColor = () => {
    const randomColor =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
    form.setValue("baseColor", randomColor);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await fetch("/api/generate-palette", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to generate palette");
      }

      const palette = await response.json();

      // Navigate to the generate page with the query parameters
      router.push(`/palette/result?json=${encodeURIComponent(JSON.stringify(palette))}`);
    } catch (error) {
      console.error("Error generating palette:", error);
    }
  });

  return (
    <main className="flex flex-col items-center justify-center p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl">Palette Creation</h1>
      <p className="mt-4">Create a beautiful color palette for your project in just a few steps.</p>
      <div className="mt-8 w-full max-w-md">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <h2 className="mt-12 text-2xl">Step by Step</h2>

            {/* Framework Selection */}
            <Step description="Which framework are you using? You can change it later.">
              <SelectFrameworkInput name="framework" />
            </Step>

            {/* Color Source Selection */}
            <Step description="What's your brand color?">
              <div className="space-y-4">
                <ColorInput name="baseColor" />

                <p className="text-sm text-gray-500 text-center flex items-center gap-2">
                  <span className="flex-1 shrink border-t" />
                  or try one of these options
                  <span className="flex-1 shrink border-t" />
                </p>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const color =
                          popularColors[Math.floor(Math.random() * popularColors.length)];
                        form.setValue("baseColor", color);
                      }}
                      className="flex-1"
                    >
                      🔥 Popular
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const color =
                          trendingColors[Math.floor(Math.random() * trendingColors.length)];
                        form.setValue("baseColor", color);
                      }}
                      className="flex-1"
                    >
                      🌟 Trending
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateRandomColor}
                      className="flex-1"
                    >
                      🎲 Random
                    </Button>
                  </div>
                </div>
              </div>
            </Step>

            {/* Personality Selection */}
            <Step description="What personality should your app have?">
              <FormField
                name="personality"
                render={({ field }) => (
                  <div className="space-y-4">
                    <ToggleGroup
                      type="single"
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-2 gap-2 w-full"
                    >
                      {colorPersonalities.map((p) => (
                        <ToggleGroupItem
                          key={p.type}
                          value={p.type}
                          className="cursor-pointer h-auto p-3 text-center"
                        >
                          {p.label}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>

                    {personality && (
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Recommended harmony:{" "}
                          <span className="font-medium capitalize">{getRecommendedHarmony()}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => form.setValue("harmonyType", getRecommendedHarmony())}
                            className="ml-2"
                          >
                            Select
                          </Button>
                        </p>
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => {
                            form.setValue("harmonyType", getRecommendedHarmony());
                          }}
                          className="text-sm mt-1 flex items-center gap-1"
                        >
                          <EyeIcon className="w-4 h-4" />
                          See other options
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              />
            </Step>

            <FadeInTransition in={!!watch("harmonyType")} scrollIntoView={true}>
              <Step description="Advanced: Choose specific color harmony">
                <FormField
                  name="harmonyType"
                  render={({ field }) => (
                    <ToggleGroup
                      type="single"
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-2 gap-2 w-full"
                    >
                      <ToggleGroupItem value="complementary" className="cursor-pointer h-auto p-3">
                        Complementary
                      </ToggleGroupItem>
                      <ToggleGroupItem value="analogous" className="cursor-pointer h-auto p-3">
                        Analogous
                      </ToggleGroupItem>
                      <ToggleGroupItem value="triadic" className="cursor-pointer h-auto p-3">
                        Triadic
                      </ToggleGroupItem>
                      <ToggleGroupItem value="tetradic" className="cursor-pointer h-auto p-3">
                        Tetradic
                      </ToggleGroupItem>
                    </ToggleGroup>
                  )}
                />
              </Step>
            </FadeInTransition>

            <div className="mt-8 flex gap-2">
              <Button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2"
                disabled={!form.formState.isValid}
              >
                Continue
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}

function Step({ children, description }: { children: React.ReactNode; description: string }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className="mt-8 p-4 border rounded-lg shadow-sm">
      {description && <p className="text-sm text-gray-500 mb-2">{description}</p>}
      {children}
    </div>
  );
}
