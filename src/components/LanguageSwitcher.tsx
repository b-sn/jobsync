"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "next-intl";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
];

export function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const currentLocale = useLocale();
  const handleLanguageChange = async (locale: string) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/user/locale", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ locale }),
        });

        if (response.ok) {
          // Refresh the page to apply the new locale
          router.refresh();
        } else {
          console.error("Failed to update locale");
        }
      } catch (error) {
        console.error("Error updating locale:", error);
      }
    });
  };

  const currentLanguage = LANGUAGES.find((lang) => lang.code === currentLocale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          disabled={isPending}
          className="font-semibold text-xs"
        >
          <span aria-hidden="true">{currentLocale.toUpperCase()}</span>
          <span className="sr-only">{currentLanguage?.name || "Language"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            disabled={language.code === currentLocale || isPending}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
