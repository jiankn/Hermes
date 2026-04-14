import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware({
  ...routing,
  localeDetection: false,
});

export const config = {
  matcher: ['/((?!api|_next|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)'],
};
