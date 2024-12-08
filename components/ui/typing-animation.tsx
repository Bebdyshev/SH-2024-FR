"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypingAnimationProps {
  text: string;
  duration?: number;
  className?: string;
  onComplete?: () => void; // Optional onComplete handler
}

export function TypingAnimation({
  text,
  duration = 200,
  className,
  onComplete,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [i, setI] = useState<number>(0);

  useEffect(() => {
    const typingEffect = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        setI(i + 1);
      } else {
        clearInterval(typingEffect);
        // Call onComplete when typing is done
        if (onComplete) {
          onComplete();
        }
      }
    }, duration);

    return () => {
      clearInterval(typingEffect);
    };
  }, [duration, i, text, onComplete]);

  return (
    <h1
      className={cn(
        "font-display text-4xl font-bold leading-[5rem] tracking-[-0.02em] drop-shadow-sm",
        className,
      )}
    >
      {displayedText ? displayedText : text}
    </h1>
  );
}
