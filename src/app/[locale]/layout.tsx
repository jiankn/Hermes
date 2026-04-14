import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import '../globals.css';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return {
    title: {
      template: `%s | ${isZh ? 'Hermes Agent 学习社区' : 'Hermes Agent Community'}`,
      default: isZh ? 'Hermes Agent 学习社区' : 'Hermes Agent Community',
    },
    description: isZh
      ? 'Hermes Agent 一站式学习社区 — 从安装到多 Agent 协作的完整知识库。'
      : 'The definitive learning hub for Hermes Agent — from first install to multi-agent orchestration.',
    metadataBase: new URL('https://hermesagent.sbs'),
    alternates: {
      canonical: `https://hermesagent.sbs/${locale}`,
      languages: {
        en: 'https://hermesagent.sbs/en',
        zh: 'https://hermesagent.sbs/zh',
        'x-default': 'https://hermesagent.sbs/en',
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as 'en' | 'zh')) {
    notFound();
  }

  // Load messages
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          <main style={{ paddingTop: 'var(--navbar-height)' }}>
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
