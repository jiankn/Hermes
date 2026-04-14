import { getTranslations } from 'next-intl/server';
import FAQAccordion from '@/components/ui/FAQAccordion/FAQAccordion';

type Props = { params: Promise<{ locale: string }> };

export default async function FAQPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const isZh = locale === 'zh';

  const faqItems = [
    { question: t('faqItems.q1'), answer: t('faqItems.a1') },
    { question: t('faqItems.q2'), answer: t('faqItems.a2') },
    { question: t('faqItems.q3'), answer: t('faqItems.a3') },
    { question: t('faqItems.q4'), answer: t('faqItems.a4') },
    { question: t('faqItems.q5'), answer: t('faqItems.a5') },
  ];

  return (
    <div>
      <FAQAccordion
        title={isZh ? '常见问题' : 'Frequently Asked Questions'}
        items={faqItems}
      />
    </div>
  );
}
