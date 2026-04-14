'use client';

import styles from './NewsletterForm.module.css';

interface NewsletterFormProps {
  title: string;
  description: string;
  placeholder: string;
  buttonText: string;
}

export default function NewsletterForm({ title, description, placeholder, buttonText }: NewsletterFormProps) {
  return (
    <section className={styles.newsletter}>
      <h2 className={styles.newsletterTitle}>{title}</h2>
      <p className={styles.newsletterDesc}>{description}</p>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          className={styles.input}
          placeholder={placeholder}
          required
        />
        <button type="submit" className={styles.submitBtn}>
          {buttonText}
        </button>
      </form>
    </section>
  );
}
