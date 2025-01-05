import TabLayout from '@/components/TabLayout';
import PageLayout from '@/components/PageLayout';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

function AppContent({ Component, pageProps }: AppProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const isLoginPage = router.pathname === '/login';

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <PageLayout>
      {isLoginPage ? (
        <Component {...pageProps} />
      ) : isAuthenticated ? (
        <TabLayout>
          <Component {...pageProps} />
        </TabLayout>
      ) : null}
    </PageLayout>
  );
}

export default function App(props: AppProps) {
  return (
    <AuthProvider>
      <AppContent {...props} />
    </AuthProvider>
  );
}
