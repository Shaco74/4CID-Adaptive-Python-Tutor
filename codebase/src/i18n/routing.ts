import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["de", "en"],
  defaultLocale: "de",
  localePrefix: "as-needed", // Only show locale in URL for non-default locale
});

export type Locale = (typeof routing.locales)[number];
