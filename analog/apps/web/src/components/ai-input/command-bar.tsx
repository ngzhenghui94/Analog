"use client";

import * as React from "react";
import Document from "@tiptap/extension-document";
import Mention from "@tiptap/extension-mention";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, mergeAttributes, useEditor } from "@tiptap/react";
import { useAtomValue } from "jotai";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Temporal } from "temporal-polyfill";

import { calendarSettingsAtom } from "@/atoms/calendar-settings";
import { useCreateDraftAction } from "@/components/calendar/hooks/use-optimistic-mutations";
import { createDraftEvent } from "@/lib/utils/calendar";
import { cn } from "@/lib/utils";
import { createEventInputSuggestions } from "./create-event-input-suggestions";

interface CommandBarInputProps {
  className?: string;
  placeholder?: string;
}

export function CommandBarInput({
  className,
  placeholder,
}: CommandBarInputProps) {
  const [isEmpty, setIsEmpty] = React.useState(true);
  const calendarSettings = useAtomValue(calendarSettingsAtom);
  const createDraftAction = useCreateDraftAction();
  const submitRef = React.useRef<() => void>(undefined);

  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Paragraph,
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        renderHTML({ options, node }) {
          return [
            "span",
            mergeAttributes(options.HTMLAttributes),
            `@${node.attrs.label ?? node.attrs.id}`,
          ];
        },
        deleteTriggerWithBackspace: true,
        suggestion: createEventInputSuggestions,
      }),
    ],
    content: "",
    injectCSS: false,
    immediatelyRender: false,
    editorProps: {
      handleKeyDown: (view, event) => {
        if (event.key !== "Enter" || event.shiftKey) {
          return false;
        }

        // @ts-expect-error this property exists as a custom extension
        const isSuggestionActive = view.state.mention$?.active;

        if (isSuggestionActive) {
          return false;
        }

        // Otherwise handle the enter key
        event.preventDefault();
        submitRef.current?.();

        return true;
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor?.getText() ?? "";

      setIsEmpty(content.trim().length === 0);
    },
  });

  const handleSubmit = React.useCallback(async () => {
    if (!editor) {
      return;
    }

    const content = editor.getText();

    // handle empty content
    if (!content || content.trim().length === 0) {
      toast.error("Please enter event details");
      return;
    }

    const promise = fetch("/api/ai/parse", {
      method: "POST",
      body: JSON.stringify({
        text: content,
        timeZone: calendarSettings.defaultTimeZone,
      }),
    }).then(async (res) => {
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    });

    toast.promise(promise, {
      loading: "Creating event...",
      success: (data) => {
        const start = Temporal.Instant.from(data.start).toZonedDateTimeISO(
          calendarSettings.defaultTimeZone,
        );
        const end = Temporal.Instant.from(data.end).toZonedDateTimeISO(
          calendarSettings.defaultTimeZone,
        );

        const event = createDraftEvent({
          title: data.title,
          start,
          end,
          allDay: data.allDay,
          description: data.description,
          location: data.location,
        });

        createDraftAction(event);
        editor?.commands.clearContent();
        setIsEmpty(true);
        return "Event created";
      },
      error: "Failed to create event",
    });
  }, [editor, calendarSettings, createDraftAction]);

  // Keep the ref updated with the latest handleSubmit
  React.useEffect(() => {
    submitRef.current = handleSubmit;
  }, [handleSubmit]);

  if (!editor) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {isEmpty ? (
          <CommandBarPlaceholder
            className={className}
            placeholder={placeholder}
          />
        ) : null}
      </AnimatePresence>

      <EditorContent
        editor={editor}
        placeholder={placeholder}
        className={cn(
          "event-editor-content flex w-full min-w-0 items-center text-sm",
          className,
        )}
      />
    </>
  );
}

interface CommandBarPlaceholderProps {
  className?: string;
  placeholder?: string;
}

function CommandBarPlaceholder({
  className,
  placeholder,
}: CommandBarPlaceholderProps) {
  return (
    <motion.div
      initial={{ opacity: 1, filter: "blur(2px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(2px)" }}
      transition={{ type: "spring", duration: 0.2 }}
      className={cn(
        className,
        "pointer-events-none absolute inset-x-3 top-1/2 line-clamp-1 -translate-y-1/2 truncate text-sm text-muted-foreground",
      )}
    >
      {placeholder}
    </motion.div>
  );
}

interface CommandBarProps {
  className?: string;
  children: React.ReactNode;
}

export function CommandBar({ children, className }: CommandBarProps) {
  return (
    <div
      className={cn(
        className,
        "relative flex h-9 min-h-9 flex-row items-center gap-2 rounded-2xl border border-border/20 bg-popover/80 px-3 backdrop-blur-lg",
      )}
    >
      {children}
    </div>
  );
}

