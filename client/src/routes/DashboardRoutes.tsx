import DefaultLayout from '../layout/DefaultLayout';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '../utils/Utils';
import SignIn from '../page/Authentication/SignIn';
import SignUp from '../page/Authentication/SignUp';
import PageTitle from '../components/PageTitle';
import BlogPage from '../page/Blog/BlogPage';

export default function DashboardRoutes() {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(isAuthenticated());

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthorized(isAuthenticated());
    };

    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  if (!isAuthorized) {
    return (
      <Routes>
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Sign In" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Sign Up" />
              <SignUp />
            </>
          }
        />
        <Route path="*" element={<Navigate to="/auth/signin" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <DefaultLayout>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <PageTitle title="Blog Dashboard" />
                <BlogPage />
              </>
            }
          />
          {/* <Route
            path="/profile"
            element={
              <>
                <PageTitle title="Profile | Admin Dashboard" />
                <Profile />
              </>
            }
          />
          <Route
            path="/users"
            element={
              <>
                <PageTitle title="User | Admin Dashboard" />
                <User />
              </>
            }
          /> */}
          <Route path="/auth/*" element={<Navigate to="/" replace />} />
        </Routes>
      </DefaultLayout>
    </>
  );
}
