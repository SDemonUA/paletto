"use client";

import { useEffect, useRef } from "react";

interface FadeInTransitionProps {
  children: React.ReactNode;
  in: boolean;
  scrollIntoView?: boolean;
}

export function FadeInTransition({
  children,
  in: isVisible,
  scrollIntoView,
}: FadeInTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const shouldScroll = useRef(scrollIntoView ?? false);

  useEffect(() => {
    shouldScroll.current = scrollIntoView ?? false;
  }, [scrollIntoView]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (!ref.current) return;
    const el = ref.current;

    const animationOptions = { duration: 300, fill: "forwards" as const };

    const fadeInKeyframes = [
      { opacity: 0, transform: "translateY(20px)" },
      { opacity: 1, transform: "translateY(0)" },
    ];

    if (isVisible) {
      const animation = el.animate(fadeInKeyframes, animationOptions);
      if (shouldScroll.current) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return () => animation.cancel();
    }

    const animation = el.animate(fadeInKeyframes.reverse(), animationOptions);
    return () => animation.cancel();
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return <div ref={ref}>{children}</div>;
}
