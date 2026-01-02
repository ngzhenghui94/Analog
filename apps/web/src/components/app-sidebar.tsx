import * as React from "react";
import { useAtomValue } from "jotai";

import { calendarSettingsAtom } from "@/atoms/calendar-settings";
import { DatePicker } from "@/components/date-picker";
import { SubwaySurfers } from "@/components/easter-eggs/subway-surfers";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const calendarSettings = useAtomValue(calendarSettingsAtom);

  return (
    <Sidebar
      className="border-r border-white/5 bg-background/20 backdrop-blur-xl"
      {...props}
    >
      <SidebarContent className="relative gap-0 overflow-hidden">
        <div className="hidden h-12 titlebar-draggable mac:block" />
        <SidebarGroup className="pt-4 px-3">
          <SidebarGroupContent className="flex flex-col items-center gap-4">
            <DatePicker />
            {calendarSettings.easterEggsEnabled && <SubwaySurfers />}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
