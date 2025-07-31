"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Switch } from "@/components/ui/switch";
import { Form, FormField } from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  baseColor: z.string(),
  harmonyType: z.enum(["complementary", "analogous", "triadic", "tetradic"]),
  framework: z.enum(["mui", "shadcn"]),
  mode: z.enum(["light", "dark"]).nullable().nonoptional(),
});

export default function PalettePage() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mode: null,
    },
  });

  const { watch } = form;
  const mode = watch("mode");
  const darkMode = mode === "dark";

  // TODO: remove this when adding dark mode support to the app
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl">Palette Creation</h1>
      <p className="mt-4">
        Use the tools below to create and customize your palette. Adjust colors, spacing, and
        borders to fit your project needs.
      </p>
      <div className="mt-8 w-full max-w-md">
        <Form {...form}>
          <h2 className="mt-12 text-2xl">Step by Step</h2>
          <Step description="Will you be using dark mode?">
            <DarkModeToggle />
          </Step>

          <Step description="Choose your base color" hidden={!mode}>
            <FormField
              name="baseColor"
              render={({ field }) => (
                <input
                  type="color"
                  value={field.value}
                  onChange={field.onChange}
                  className="w-full border rounded-md p-2"
                />
              )}
            />
          </Step>

          <Step description="Select a color harmony type" hidden={!watch("baseColor")}>
            <FormField
              name="harmonyType"
              render={({ field }) => (
                <ToggleGroup
                  type="single"
                  value={field.value}
                  onValueChange={field.onChange}
                  className="w-full"
                >
                  <ToggleGroupItem value="complementary" className="cursor-pointer">
                    Complementary
                  </ToggleGroupItem>
                  <ToggleGroupItem value="analogous" className="cursor-pointer">
                    Analogous
                  </ToggleGroupItem>
                  <ToggleGroupItem value="triadic" className="cursor-pointer">
                    Triadic
                  </ToggleGroupItem>
                  <ToggleGroupItem value="tetradic" className="cursor-pointer">
                    Tetradic
                  </ToggleGroupItem>
                </ToggleGroup>
              )}
            />
          </Step>

          <Step description="Choose your framework" hidden={!watch("harmonyType")}>
            <FormField
              name="framework"
              render={({ field }) => (
                <ToggleGroup
                  type="single"
                  value={field.value}
                  onValueChange={field.onChange}
                  className="w-full"
                >
                  <ToggleGroupItem value="mui" className="cursor-pointer">
                    MUI
                  </ToggleGroupItem>
                  <ToggleGroupItem value="shadcn" className="cursor-pointer">
                    shadcn/ui
                  </ToggleGroupItem>
                </ToggleGroup>
              )}
            />
          </Step>

          <div className="mt-8">
            <Button type="submit" className="w-full" disabled={!form.formState.isValid}>
              Generate Palette
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Once you generate your palette, you can export the settings for your chosen framework.
          </p>
        </Form>
      </div>
    </main>
  );
}

function Step({
  children,
  description,
  hidden,
}: {
  children: React.ReactNode;
  description: string;
  hidden?: boolean;
}) {
  return (
    <div
      className="mt-8 p-4 border rounded-lg shadow-sm transition-all duration-300 aria-hidden:opacity-0 aria-hidden:translate-y-4"
      aria-hidden={hidden}
    >
      <p className="text-sm text-gray-500">{description}</p>
      {children}
    </div>
  );
}

function DarkModeToggle() {
  return (
    <div className="mt-4">
      <FormField
        name="mode"
        render={({ field }) => (
          <ToggleGroup
            type="single"
            value={field.value}
            onValueChange={field.onChange}
            className="w-full"
          >
            <ToggleGroupItem value="light" className="cursor-pointer">
              Light Mode
            </ToggleGroupItem>
            <ToggleGroupItem value="dark" className="cursor-pointer">
              Dark Mode
            </ToggleGroupItem>
          </ToggleGroup>
        )}
      />
    </div>
  );
}
