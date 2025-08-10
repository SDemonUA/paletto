"use client";

import { useEffect, useRef, useState } from "react";
import type { UiPalette } from "@/schemas";
import { Button } from "@/components/ui/button";

export function PreviewToggle({ palette, framework }: { palette: UiPalette; framework: string }) {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isPreviewVisible) {
      ref.current?.focus();
    }
    document.body.style.touchAction = isPreviewVisible ? "none" : "auto";
    document.body.style.userSelect = isPreviewVisible ? "none" : "auto";

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
      document.body.style.userSelect = "auto";
    };
  }, [isPreviewVisible]);

  return (
    <div>
      <iframe
        ref={ref}
        src={`/preview/${framework}?palette=${encodeURIComponent(JSON.stringify(palette))}`}
        className="w-full h-full fixed top-0 left-0"
        style={{
          clipPath: isPreviewVisible
            ? "polygon(0 -100%, 200% 100%, 0 100%)"
            : "polygon(0 100%, 0 100%, 0 100%)",
          transition: "clip-path 0.5s ease-in-out",
          pointerEvents: isPreviewVisible ? "auto" : "none",
        }}
      />

      <Button
        className="fixed top-2 right-2"
        variant="outline"
        onClick={() => {
          setIsPreviewVisible(!isPreviewVisible);
        }}
      >
        Toggle Preview: {isPreviewVisible ? "ON" : "OFF"}
      </Button>
    </div>
  );
}
