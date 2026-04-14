'use client';

import { useState } from 'react';
import styles from './FAQAccordion.module.css';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  title: string;
  items: FAQItem[];
}

export default function FAQAccordion({ title, items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <h2 className={styles.faqTitle}>{title}</h2>
      <div className={styles.faqList}>
        {items.map((item, index) => (
          <div key={index} className={styles.faqItem}>
            <button
              className={styles.faqQuestion}
              onClick={() => toggle(index)}
              aria-expanded={openIndex === index}
            >
              {item.question}
              <span className={`${styles.faqChevron} ${openIndex === index ? styles.faqChevronOpen : ''}`}>
                ▼
              </span>
            </button>
            <div className={`${styles.faqAnswer} ${openIndex === index ? styles.faqAnswerOpen : ''}`}>
              <div className={styles.faqAnswerInner}>
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
