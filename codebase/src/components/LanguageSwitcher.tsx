"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Button, Menu, Portal } from "@chakra-ui/react";
import { Globe } from "lucide-react";
import { routing } from "@/i18n/routing";

const localeNames: Record<string, string> = {
  de: "Deutsch",
  en: "English",
};

const localeFlags: Record<string, string> = {
  de: "🇩🇪",
  en: "🇬🇧",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Remove current locale prefix if present and add new one
    const segments = pathname.split("/").filter(Boolean);

    // Check if first segment is a locale
    if (routing.locales.includes(segments[0] as "de" | "en")) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }

    const newPath = `/${segments.join("/")}`;

    // Always use the full path with locale prefix for consistency
    router.push(newPath);
    router.refresh();
  };

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          variant="outline"
          size="sm"
          gap={2}
          borderColor={{ base: "gray.600", _light: "gray.300" }}
          color={{ base: "gray.300", _light: "gray.600" }}
          _hover={{
            bg: { base: "gray.700", _light: "blue.50" },
            borderColor: { base: "blue.400", _light: "blue.400" },
            color: { base: "blue.300", _light: "blue.500" },
          }}
        >
          <Globe size={16} />
           {locale.toUpperCase()}
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {routing.locales.map((loc) => (
              <Menu.Item
                key={loc}
                value={loc}
                onClick={() => switchLocale(loc)}
                fontWeight={loc === locale ? "bold" : "normal"}
              >
                {localeFlags[loc]} {localeNames[loc]}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
