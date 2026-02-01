"use client";

import { useState } from "react";
import Link from "next/link";
import { PowerIcon, Settings, Info } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { SupportDialog } from "./SupportDialog";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ModeToggle } from "./ModeToggle";
import { useTranslations } from "next-intl";

interface ProfileDropdownProps {
  user: any;
  signOutAction: () => void;
}

export function ProfileDropdown({ user, signOutAction }: ProfileDropdownProps) {
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const t = useTranslations("profile");
  return (
    <>
      <div className="flex items-center gap-2 ml-auto">
        <LanguageSwitcher />
        <ModeToggle />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar user={user} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="cursor-pointer">
              <Settings className="w-5 mr-2" />
              {t("settings")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setSupportDialogOpen(true)}
            className="cursor-pointer"
          >
            <Info className="w-5 mr-2" />
            {t("support")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <form action={signOutAction}>
            <DropdownMenuItem>
              <Button variant="ghost" className="w-full">
                <PowerIcon className="w-5" />
                <div className="hidden md:block mx-2">{t("logout")}</div>
              </Button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>

      <SupportDialog
        open={supportDialogOpen}
        onOpenChange={setSupportDialogOpen}
      />
    </>
  );
}
