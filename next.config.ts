import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'export',
  experimental: {
    // Workaround for Next.js workStore race condition
    // during concurrent static page generation
    staticGenerationRetryCount: 5,
  },
};

export default withNextIntl(nextConfig);
