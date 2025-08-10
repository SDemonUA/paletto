import { useFormContext, Controller } from "react-hook-form";
import { HexColorInput, HslStringColorPicker } from "react-colorful";
import chroma from "chroma-js";

import React from "react";
import { cn } from "@/lib/utils";
import { inputClassName } from "@/components/ui/input";
import { getColorName } from "@/lib/colorUtils";

export function ColorInput({ name }: { name: string }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="w-full grid-cols-2 grid gap-4">
          <HslStringColorPicker
            color={chroma(field.value).css("hsl")}
            onChange={(color) => field.onChange(chroma(color).hex())}
            className="w-full h-48"
          />

          <div
            className="flex flex-col items-center justify-center rounded-md border border-gray-300 p-4"
            style={{
              backgroundColor: field.value,
              color: chroma(field.value).luminance() > 0.5 ? "black" : "white",
            }}
          >
            <span className="text-md mt-2">{field.value}</span>
            <span className="text-sx font-semibold mt-1">{getColorName(field.value)}</span>
          </div>

          <HexColorInput
            className={cn(inputClassName, "col-span-2 w-full")}
            color={field.value}
            onChange={field.onChange}
          />
        </div>
      )}
    />
  );
}
