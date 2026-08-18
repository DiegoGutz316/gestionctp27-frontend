"use client";

import { MoreVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AccionesMenuProps = {
  "aria-label": string;
  children: React.ReactNode;
};

export function AccionesMenu({
  "aria-label": ariaLabel,
  children,
}: AccionesMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={ariaLabel}
            className="text-muted-foreground hover:text-foreground aria-expanded:bg-primary/10 aria-expanded:text-primary"
          />
        }
      >
        <MoreVerticalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-auto min-w-48 rounded-xl p-1.5 shadow-lg"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Acciones
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="mb-1" />
          {children}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
