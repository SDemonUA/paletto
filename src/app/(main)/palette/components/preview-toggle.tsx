"use client";

import { useEffect, useRef, useState } from "react";
import type { UiPalette } from "@/schemas";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const isLargeScreen = () => window.innerWidth >= 1024;

export function PreviewToggle({ palette, framework }: { palette: UiPalette; framework: string }) {
  const [previewMode, setPreviewMode] = useState<"off" | "side" | "full">(
    isLargeScreen() ? "side" : "off"
  );
  const [isPreviewReady, setIsPreviewReady] = useState(false);
  const ref = useRef<HTMLIFrameElement>(null);

  // Listen for preview ready message
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "PREVIEW_READY") {
        setIsPreviewReady(true);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Send palette updates via postMessage when palette changes
  useEffect(() => {
    if (ref.current && isPreviewReady) {
      ref.current.contentWindow?.postMessage(
        {
          type: "PALETTE_UPDATE",
          palette: palette,
        },
        "*"
      );
    }
  }, [palette, isPreviewReady]);

  // Reset preview ready state when iframe src changes (framework change)
  useEffect(() => {
    setIsPreviewReady(false);
  }, [framework]);

  useEffect(() => {
    if (previewMode === "full") {
      ref.current?.focus();
    }
    document.body.style.touchAction = previewMode === "full" ? "none" : "auto";
    document.body.style.userSelect = previewMode === "full" ? "none" : "auto";

    document.body.animate(
      {
        width: previewMode === "side" ? ["100%", "calc(100% - 50vw)"] : "100%",
      },
      {
        duration: 500,
        fill: "forwards",
      }
    );

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
      document.body.style.userSelect = "auto";

      document.body.style.width = "auto";
    };
  }, [previewMode]);

  return (
    <>
      <iframe
        key={`preview-${framework}`}
        ref={ref}
        src={`/preview/${framework}`}
        className={cn(
          "w-full h-full fixed top-0 left-0",
          previewMode === "side" && "md:w-1/2 md:left-1/2 border-l border-secondary"
        )}
        style={{
          clipPath:
            previewMode === "full"
              ? "polygon(0 -100%, 200% 100%, 0 100%)"
              : previewMode === "side"
              ? "none"
              : "polygon(0 100%, 0 100%, 0 100%)",
          transition: "clip-path 0.5s ease-in-out",
          pointerEvents: previewMode !== "off" ? "auto" : "none",
        }}
      />

      <div className="fixed top-0 right-0 flex items-center gap-2 p-2 bg-white dark:bg-gray-800 z-50">
        <Label>Framework</Label>
        <ToggleGroup type="single" value={framework}>
          <ToggleGroupItem value="mui" className="cursor-pointer">
            Material UI
          </ToggleGroupItem>
          <ToggleGroupItem value="shadcn" className="cursor-pointer">
            ShadCN
          </ToggleGroupItem>
        </ToggleGroup>

        <Label>Preview Mode</Label>
        <ToggleGroup
          type="single"
          value={previewMode}
          onValueChange={(value) => {
            if (value) setPreviewMode(value as "off" | "side" | "full");
          }}
          className="cursor-pointer"
        >
          <ToggleGroupItem value="off">Hide</ToggleGroupItem>
          <ToggleGroupItem value="full">Full</ToggleGroupItem>
          <ToggleGroupItem value="side">Aside</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </>
  );
}
