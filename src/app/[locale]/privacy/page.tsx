import styles from '../static.module.css';

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Privacy Policy</h1>
      <div className={styles.content}>
        <p><strong>Last updated:</strong> April 15, 2026</p>

        <h2>1. Information We Collect</h2>
        <p>We collect minimal information necessary to operate the website:</p>
        <ul>
          <li>Anonymous usage analytics (page views, device type)</li>
          <li>Email address if you subscribe to our newsletter</li>
        </ul>

        <h2>2. How We Use Information</h2>
        <p>We use collected information solely to:</p>
        <ul>
          <li>Improve website content and user experience</li>
          <li>Send newsletter updates (with your consent)</li>
        </ul>

        <h2>3. Cookies</h2>
        <p>We use essential cookies for language preference and analytics. We do not use tracking cookies for advertising purposes.</p>

        <h2>4. Third-Party Services</h2>
        <p>We may use third-party services including Cloudflare (hosting), Google Analytics (analytics), and email delivery services. Each service has its own privacy policy.</p>

        <h2>5. Data Retention</h2>
        <p>We retain your data only as long as necessary for the purposes described above. You can request deletion at any time.</p>

        <h2>6. Contact</h2>
        <p>For privacy inquiries: <a href="mailto:privacy@hermesagent.sbs">privacy@hermesagent.sbs</a></p>
      </div>
    </div>
  );
}
