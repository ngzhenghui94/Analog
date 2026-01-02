"use client";

import * as React from "react";
import { useSetAtom } from "jotai";

import {
  calendarSettingsAtom,
  defaultTimeZone,
} from "@/atoms/calendar-settings";
import { AppSidebar } from "@/components/app-sidebar";
import { CalendarView } from "@/components/calendar-view";
import { FlowsProvider } from "@/components/calendar/flows/provider";
import { AppCommandMenu } from "@/components/command-menu/app-command-menu";
import { SidebarInset } from "@/components/ui/sidebar";
import { EventHotkeys } from "@/lib/hotkeys/event-hotkeys";
import { CommandWindow } from "./command-bar/command-window";

export function CalendarLayout() {
  const setSettings = useSetAtom(calendarSettingsAtom);

  React.useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      defaultTimeZone,
    }));
  }, [setSettings]);

  return (
    <FlowsProvider>
      <AppSidebar
        side="left"
        className="border-r-0 bg-background/60 backdrop-blur-xl select-none"
      />
      <EventHotkeys />
      <SidebarInset className="h-dvh overflow-hidden bg-background/40 backdrop-blur-md select-none">
        <CalendarView className="grow" />
      </SidebarInset>
      <AppCommandMenu />
      <CommandWindow />
    </FlowsProvider>
  );
}
