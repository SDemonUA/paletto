"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UiPalette } from "@/schemas";
import { exportMuiTheme } from "@/lib/muiUtils";
import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";

interface ExportButtonProps {
  palette: UiPalette;
}

export function ExportButton({ palette }: ExportButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const exportCode = exportMuiTheme(palette);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Export Theme</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Export MUI Theme</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex justify-end mb-4">
            <Button
              onClick={handleCopyToClipboard}
              variant="outline"
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckIcon className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <ClipboardIcon className="h-4 w-4" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          </div>

          <div className="flex-1 overflow-auto border rounded-lg">
            <pre className="p-4 text-sm bg-gray-50 dark:bg-gray-900 overflow-auto whitespace-pre-wrap">
              <code>{exportCode}</code>
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
