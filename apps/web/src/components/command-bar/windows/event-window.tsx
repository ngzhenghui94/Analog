"use client";

import * as React from "react";
import { SparklesIcon } from "lucide-react";
import { useAtomValue } from "jotai";
import { motion } from "motion/react";

import { windowStateAtom } from "@/atoms/window-state";
import {
  CommandBar,
  CommandBarInput,
} from "@/components/ai-input/command-bar";
import { EventForm } from "@/components/event-form/event-form";
import { cn } from "@/lib/utils";
import { Window } from "../window";

const CONTAINER_VARIANTS = {
  default: {
    width: "var(--container-md)",
  },
  expanded: {
    height: "calc(19.25rem + 2px)",
    width: "var(--container-lg)",
  },
};

function useDelayedValue(value: "default" | "expanded", delay: number) {
  const [delayedValue, setDelayedValue] = React.useState(value);

  React.useEffect(() => {
    if (value === "default") {
      const id = setTimeout(() => setDelayedValue("default"), delay);

      return () => clearTimeout(id);
    }

    setDelayedValue("expanded");
  }, [value, delay]);

  return delayedValue;
}

export function EventWindow() {
  "use memo";

  const state = useAtomValue(windowStateAtom);
  const delayedState = useDelayedValue(state, 1000);

  return (
    <Window
      className={cn(
        "absolute bottom-4 left-1/2 h-14 w-lg max-w-screen -translate-x-1/2 overflow-hidden transition-[height] duration-500",
      )}
      variants={CONTAINER_VARIANTS}
      initial="default"
      animate={state}
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 p-[1px]">
        <div className="size-full rounded-2xl bg-background/90 backdrop-blur-xl" />
      </div>

      {/* Glow effect behind the bar */}
      <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 blur-xl" />

      <div
        className="relative size-full rounded-2xl shadow-2xl ring-1 ring-white/5"
        data-state={state}
      >
        <React.Activity mode={state === "default" ? "visible" : "hidden"}>
          <div className="absolute inset-0 flex items-center gap-3 px-4">
            <StandaloneAIInput />
          </div>
        </React.Activity>
        <React.Activity
          mode={delayedState === "expanded" ? "visible" : "hidden"}
        >
          <div className="absolute inset-0 p-2">
            <div className="opacity-0 transition-opacity delay-100 duration-200 ease-in-out in-data-[state=expanded]:opacity-100">
              <EventForm />
            </div>
          </div>
        </React.Activity>
      </div>
    </Window>
  );
}

function StandaloneAIInput() {
  return (
    <>
      {/* AI Icon with glow */}
      <div className="relative flex shrink-0 items-center justify-center">
        {/* Glow rings */}
        <motion.div
          className="absolute size-8 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-md"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute size-6 rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-sm"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.4, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <SparklesIcon className="relative size-5 text-purple-400/80" />
      </div>

      {/* Input area */}
      <CommandBar className="flex-1 border-none bg-transparent px-0 backdrop-blur-none">
        <CommandBarInput placeholder="Create an event with AI..." />
      </CommandBar>

      {/* Keyboard shortcut hint */}
      <div className="flex shrink-0 items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1">
        <kbd className="text-[10px] font-medium text-muted-foreground">⌘</kbd>
        <kbd className="text-[10px] font-medium text-muted-foreground">K</kbd>
      </div>
    </>
  );
}
