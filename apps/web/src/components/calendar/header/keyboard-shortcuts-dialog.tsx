
"use client";

import { KeyboardIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { KeyboardShortcut } from "@/components/ui/keyboard-shortcut";

const SHORTCUTS = [
    {
        category: "Navigation",
        items: [
            { label: "Next period", keys: ["N"] },
            { label: "Previous period", keys: ["P"] },
            { label: "Go to Today", keys: ["T"] },
        ],
    },
    {
        category: "View",
        items: [
            { label: "Month view", keys: ["M"] },
            { label: "Week view", keys: ["W"] },
            { label: "Day view", keys: ["D"] },
            { label: "Agenda view", keys: ["A"] },
        ],
    },
    {
        category: "Actions",
        items: [
            { label: "Create event", keys: ["C"] },
            { label: "Delete event", keys: ["⌫"] },
            { label: "Join meeting", keys: ["J"] },
            { label: "Unselect event", keys: ["Esc"] },
            { label: "Command menu", keys: ["⌘", "K"] },
        ],
    },
];

export function KeyboardShortcutsDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Keyboard shortcuts">
                    <KeyboardIcon className="size-4 text-muted-foreground" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Keyboard Shortcuts</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    {SHORTCUTS.map((category) => (
                        <div key={category.category} className="space-y-3">
                            <h4 className="text-sm font-medium text-muted-foreground">
                                {category.category}
                            </h4>
                            <div className="grid gap-2">
                                {category.items.map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-sm">{item.label}</span>
                                        <div className="flex gap-1">
                                            {item.keys.map((key) => (
                                                <KeyboardShortcut key={key}>{key}</KeyboardShortcut>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
