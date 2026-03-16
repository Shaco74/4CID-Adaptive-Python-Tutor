import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Provider } from "@/components/ui/provider";
import { UserProvider } from "@/context/UserContext";
import { CourseProgressProvider } from "@/context/CourseProgressContext";
import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as "de" | "en")) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Provider>
        <UserProvider>
          <CourseProgressProvider>
            <Navigation />
            {children}
            <Toaster />
          </CourseProgressProvider>
        </UserProvider>
      </Provider>
    </NextIntlClientProvider>
  );
}
