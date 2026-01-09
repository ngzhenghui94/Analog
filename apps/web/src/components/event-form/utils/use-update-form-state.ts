import * as React from "react";
import { useAtomValue, useSetAtom } from "jotai";

import { calendarSettingsAtom } from "@/atoms/calendar-settings";
import { useDefaultCalendar } from "@/components/calendar/hooks/use-default-calendar";
import type { CalendarEvent } from "@/lib/interfaces";
import { formAtom } from "../atoms/form";
import { parseFormValues } from "./transform/input";

export function useUpdateFormState() {
  const defaultCalendar = useDefaultCalendar();
  const settings = useAtomValue(calendarSettingsAtom);

  const setFormState = useSetAtom(formAtom);

  return React.useCallback(
    async (event: CalendarEvent) => {
      if (!defaultCalendar) {
        throw new Error("Default calendar not found");
      }

      // DEBUG: Trace event data for timezone debugging
      console.log("[useUpdateFormState] Input event:", {
        id: event.id,
        title: event.title,
        start: event.start.toString(),
        end: event.end.toString(),
        startType: event.start.constructor.name,
      });

      const values = parseFormValues(event, defaultCalendar, settings);

      console.log("[useUpdateFormState] Parsed values:", {
        id: values.id,
        title: values.title,
        start: values.start.toString(),
        end: values.end.toString(),
        startTz: values.start.timeZoneId,
      });

      setFormState({
        event,
        values,
      });

      return;
    },
    [defaultCalendar, setFormState, settings],
  );
}
