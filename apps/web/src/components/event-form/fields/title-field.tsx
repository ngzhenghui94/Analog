import * as React from "react";

import { Input } from "@/components/ui/input";

interface TitleFieldProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  disabled: boolean;
  autoFocus?: boolean;
}

export function TitleField({
  id,
  name,
  value,
  onChange,
  onBlur,
  disabled,
  autoFocus,
}: TitleFieldProps) {
  const onInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Ignore key events during IME composition
      if (e.nativeEvent.isComposing || e.key === "Process") {
        return;
      }

      if (e.key === "Enter") {
        e.currentTarget.blur();
      }
    },
    [],
  );

  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (autoFocus) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  return (
    <Input
      ref={inputRef}
      id={id}
      name={name}
      className="h-8 border-none bg-transparent px-2 text-base shadow-none dark:bg-transparent"
      value={value}
      onBlur={onBlur}
      onChange={onInputChange}
      onKeyDown={onKeyDown}
      placeholder="Title"
      disabled={disabled}
    />
  );
}
