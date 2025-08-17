import { Controller, useFormContext } from "react-hook-form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SelectFrameworkInputProps {
  name: string;
}

const frameworks = [
  {
    value: "mui",
    label: "MUI",
    icon: "/icons/mui-logo.svg",
  },
  {
    value: "shadcn",
    label: "shadcn",
    icon: "/icons/shadcn-logo.svg",
    darkIcon: "/icons/shadcn-logo-white.svg",
  },
];

export function SelectFrameworkInput({ name }: SelectFrameworkInputProps) {
  const form = useFormContext();

  if (!form) {
    throw new Error("SelectFrameworkInput must be used within a FormProvider");
  }
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field }) => (
        <ToggleGroup
          type="single"
          value={field.value}
          onValueChange={field.onChange}
          className="flex gap-4 w-full justify-center"
        >
          {frameworks.map((framework) => (
            <ToggleGroupItem
              key={framework.value}
              value={framework.value}
              className={`flex flex-col items-center justify-center w-32 h-32 p-4 border rounded-lg`}
            >
              <div className="relative w-12 h-12 mb-2">
                <Image
                  src={framework.icon}
                  alt={framework.label}
                  width={48}
                  height={48}
                  className={cn("object-contain", { "dark:hidden": !!framework.darkIcon })}
                />
                {framework.darkIcon && (
                  <Image
                    src={framework.darkIcon}
                    alt={framework.label}
                    width={48}
                    height={48}
                    className="object-contain hidden dark:block"
                  />
                )}
              </div>
              <span className="font-medium text-center">{framework.label}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      )}
    />
  );
}
