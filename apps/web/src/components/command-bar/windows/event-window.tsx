"use client";

import * as React from "react";
import { SparklesIcon } from "lucide-react";
import { useAtomValue } from "jotai";

import { windowStateAtom } from "@/atoms/window-state";
import {
  CommandBar,
  CommandBarInput,
} from "@/components/ai-input/command-bar";
import { EventForm } from "@/components/event-form/event-form";
import { cn } from "@/lib/utils";
import { ContextView } from "../context-view";
import { Window } from "../window";

const CONTAINER_VARIANTS = {
  default: {
    // height: "calc(var(--spacing) * 30)",
    width: "var(--container-sm)",
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
        "absolute bottom-0 left-1/2 h-12 w-lg max-w-screen -translate-x-1/2 overflow-hidden transition-[height] duration-500",
      )}
      variants={CONTAINER_VARIANTS}
      initial="default"
      animate={state}
    >
      <div
        className="size-full bg-background/60 backdrop-blur-xl shadow-2xl ring-1 ring-white/10"
        data-state={state}
      >
        <React.Activity mode={state === "default" ? "visible" : "hidden"}>
          <div className="absolute inset-0 flex items-center gap-2 p-2">
            <div className="shrink-0 opacity-100 transition-opacity delay-100 duration-500 ease-in-out in-data-[state=expanded]:opacity-0">
              <ContextView />
            </div>
            <CommandBar className="flex-1">
              <SparklesIcon className="size-4 shrink-0 text-muted-foreground/60" />
              <CommandBarInput placeholder="Create event with AI..." />
            </CommandBar>
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
