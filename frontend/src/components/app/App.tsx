import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Grid from '@/components/grid/ContributionGrid.tsx';
import Links from '@/components/links/Links.tsx';
import LoginPage from '../../pages/LoginPage';
import SignupPage from '../../pages/SignupPage';
import ForgotPasswordPage from '../../pages/ForgotPasswordPage';
import UpdatePasswordPage from '../../pages/UpdatePasswordForm';
import { supabase } from '@/lib/supabase/client'; // Changed this
import { Theme } from '@radix-ui/themes';
import '@/styles/index.css';
import '@/styles/links.css';
import '@radix-ui/themes/styles.css';

function ProtectedMainApp() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login/" replace />;
  }

  // Authenticated - show main app
  return (
    <Theme style={{ backgroundColor: '#044447' }}>
      <Grid />
      <Links />
    </Theme>
  );
}

function App() {
  return (
    <BrowserRouter basename="/fitness-map">
      <Routes>
        {/* Protected main app at root */}
        <Route path="/" element={<ProtectedMainApp />} />

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
