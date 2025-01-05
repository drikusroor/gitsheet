import TabLayout from '@/components/TabLayout';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TabLayout>
      <Component {...pageProps} />
    </TabLayout>
  );
}
