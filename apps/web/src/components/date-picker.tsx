"use client";

import * as React from "react";
import { useAtom, useAtomValue } from "jotai";
import { Temporal } from "temporal-polyfill";

import { calendarSettingsAtom } from "@/atoms/calendar-settings";
import { calendarViewAtom, currentDateAtom } from "@/atoms/view-preferences";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

function toDate(date: Temporal.PlainDate): Date {
  return new Date(date.year, date.month - 1, date.day);
}

export function DatePicker() {
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom);
  const view = useAtomValue(calendarViewAtom);
  const [displayedDate, setDisplayedDate] = React.useState<Date>(
    toDate(currentDate),
  );
  const [displayedMonth, setDisplayedMonth] = React.useState<Date>(
    toDate(currentDate),
  );
  const updateSource = React.useRef<"internal" | "external">("external");

  // Prevent circular updates and animation conflicts by tracking update source:
  // - Internal (calendar clicks): Update context directly, skip useEffect
  // - External (navigation/hotkeys): Update local state via useEffect

  const onSelect = (date: Date | undefined) => {
    if (!date) {
      return;
    }

    updateSource.current = "internal";
    setDisplayedDate(date);
    setCurrentDate(
      Temporal.PlainDate.from({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      }),
    );
  };

  const { weekStartsOn } = useAtomValue(calendarSettingsAtom);

  React.useEffect(() => {
    if (updateSource.current === "external") {
      setDisplayedDate(toDate(currentDate));
      setDisplayedMonth(toDate(currentDate));
    }

    updateSource.current = "external";
  }, [currentDate]);

  const isWeekView = view === "week";
  const isDayView = view === "day" || view === "agenda";

  return (
    <Calendar
      weekStartsOn={(weekStartsOn % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6}
      animate
      mode="single"
      required
      fixedWeeks
      selected={displayedDate}
      onSelect={onSelect}
      month={displayedMonth}
      onMonthChange={setDisplayedMonth}
      className={cn("w-full px-0")}
      classNames={{
        month: "space-y-4 w-full",
        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full justify-between",
        row: "flex w-full mt-2 justify-between",
        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
        day: cn(
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-white/5 rounded-md transition-colors",
        ),
        day_selected:
          "bg-white/10 text-white hover:bg-white/15 focus:bg-white/15",
        day_today: "bg-white/5 text-white font-semibold",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_hidden: "invisible",
      }}
    />
  );
}
