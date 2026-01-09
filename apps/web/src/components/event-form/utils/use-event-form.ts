"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { toast } from "sonner";

import { useEventQueryParams } from "@/components/calendar/hooks/use-events";
import { RouterOutputs } from "@/lib/trpc";

import { calendarSettingsAtom } from "@/atoms/calendar-settings";
import { selectedEventIdsAtom } from "@/atoms/selected-events";
import { EventFormStateContext } from "@/components/calendar/flows/event-form/event-form-state-provider";
import {
  useFormAction,
  useSaveAction,
} from "@/components/calendar/flows/event-form/use-form-action";
import { useDefaultCalendar } from "@/components/calendar/hooks/use-default-calendar";
import { getDefaultEvent } from "@/components/event-form/utils/defaults";
import { getEventById } from "@/lib/db";
import {
  requiresAttendeeConfirmation,
  requiresRecurrenceConfirmation,
} from "@/lib/utils/events";
import { defaultValuesAtom, formAtom, isPristineAtom } from "../atoms/form";
import { defaultFormMeta } from "./defaults";
import { useAppForm } from "./form";
import { FormValues, formSchema } from "./schema";
import { useUpdateFormState } from "./use-update-form-state";

function requiresConfirmation(values: FormValues) {
  return (
    requiresAttendeeConfirmation(values.attendees) ||
    requiresRecurrenceConfirmation(values.recurringEventId)
  );
}

export function useEventForm() {
  const queryClient = useQueryClient();
  const { queryKey } = useEventQueryParams();
  const actorRef = EventFormStateContext.useActorRef();
  const settings = useAtomValue(calendarSettingsAtom);
  const selectedEventId = useAtomValue(selectedEventIdsAtom)[0] ?? null;

  const defaultCalendar = useDefaultCalendar();

  const defaultValues = useAtomValue(defaultValuesAtom);
  const formState = useAtomValue(formAtom);
  const saveAction = useSaveAction();
  const formAction = useFormAction();
  const [isPristine, setIsPristine] = useAtom(isPristineAtom);

  const form = useAppForm({
    defaultValues,
    onSubmitMeta: defaultFormMeta,
    validators: {
      // @ts-expect-error -- validator types are slightly incompatible
      onBlur: formSchema,
      // @ts-expect-error -- validator types are slightly incompatible
      onSubmit: formSchema,
    },
    onSubmit: async ({ value, meta }) => {
      // Allow saving if it's a draft, even if pristine
      if (isPristine && value.type !== "draft") {
        actorRef.send({ type: "CONFIRMED" });
        toast.success("Event saved", {
          description: "Your event has been saved successfully.",
        });
        return;
      }

      try {
        await saveAction(value, meta?.sendUpdate, () => {
          actorRef.send({ type: "CONFIRMED" });
          setIsPristine(true);
          toast.success("Event saved", {
            description: "Your event has been saved successfully.",
          });
        });
      } catch (error) {
        toast.error("Failed to save event", {
          description: error instanceof Error ? error.message : "An unexpected error occurred.",
        });
      }
    },
    listeners: {
      onBlur: async ({ formApi }) => {
        // If invalid, do nothing
        if (
          !formApi.state.isValid ||
          requiresConfirmation(formApi.state.values)
        ) {
          return;
        }

        // Disable auto-submit on blur as it causes API spam loops when interacting with dialogs
        // await formApi.handleSubmit();
      },
      onChange: async ({ formApi }) => {
        if (formApi.state.isPristine) {
          return;
        }

        setIsPristine(false);
      },
    },
  });

  React.useEffect(() => {
    // Reset form with the NEW defaultValues from formState, not the initial ones
    form.reset(formState.values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState]);

  const updateFormState = useUpdateFormState();

  const loadingEvent = EventFormStateContext.useSelector((snapshot) =>
    snapshot.matches("loading") ? snapshot.context.formEvent : null,
  );

  // Safety net: if the initial LOAD is missed (e.g. window expands late), refetch
  // the selected event by id and force a LOAD so the form hydrates on first try.
  React.useEffect(() => {
    if (!selectedEventId) {
      return;
    }

    const snapshot = actorRef.getSnapshot();
    const currentId = snapshot.context.formEvent?.id;

    // Skip if the state machine already has this event (either loading or queued)
    // This prevents overwriting good data from useSelectAction with stale IndexedDB data
    if (currentId === selectedEventId || snapshot.context.queuedEvent?.id === selectedEventId) {
      return;
    }

    void (async () => {
      let event = queryClient
        .getQueryData<RouterOutputs["events"]["list"]>(queryKey)
        ?.events.find((e) => e.id === selectedEventId);

      if (!event) {
        event = await getEventById(selectedEventId);
      }

      if (!event) {
        return;
      }

      actorRef.send({ type: "LOAD", item: event });
    })();
  }, [actorRef, selectedEventId]);

  React.useEffect(() => {
    if (!loadingEvent) {
      return;
    }

    // Draft events need default calendar; real events can hydrate without it.
    if (loadingEvent.type === "draft" && !defaultCalendar) {
      return;
    }

    if (formState.event?.id !== loadingEvent.id || isPristine) {
      setIsPristine(true);
      updateFormState(loadingEvent);
    }
  }, [
    loadingEvent,
    defaultCalendar,
    formState.event?.id,
    isPristine,
    setIsPristine,
    updateFormState,
  ]);

  React.useEffect(() => {
    if (!defaultCalendar || form.state.values.calendar.id !== "") {
      return;
    }

    const event = getDefaultEvent({ settings, defaultCalendar });

    formAction(event);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultCalendar]);

  return form;
}

export type Form = ReturnType<typeof useEventForm>;
