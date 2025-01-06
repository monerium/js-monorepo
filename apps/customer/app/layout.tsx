import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { cookies } from 'next/headers';

import Providers from 'components/App/Providers';
import ThemeModeToggle from 'components/ThemeModeToggle';

import '@rainbow-me/rainbowkit/styles.css';
import './globals.scss';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'Monerium',
  description:
    'Monerium issues onchain fiat – directly transferable between your wallet and bank accounts.',
};

const fetchThemeMode = async () => {
  const cookieStore = await cookies();
  return cookieStore?.get('themeMode')?.value || 'light';
};

const LayoutWrapper = async ({ children }: { children: React.ReactNode }) => {
  const themeMode = await fetchThemeMode();

  return <Layout themeMode={themeMode}>{children}</Layout>;
};

const Layout = ({
  children,
  themeMode,
}: {
  children: React.ReactNode;
  themeMode: string;
}) => {
  return (
    <html lang="en" data-mui-color-scheme={themeMode}>
      <body>
        {' '}
        <Providers>
          <ThemeModeToggle />
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default LayoutWrapper;
