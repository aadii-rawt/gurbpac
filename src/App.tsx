import { lazy, useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { useAppStore } from "./store/appStore";
import SuspenseWrapper from './components/Suspense';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './layout/Layout';
import PublicRoute from './components/PublicRoute';
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Board = lazy(() => import('./pages/Board'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Login = lazy(() => import('./pages/Login'));

const App = () => {

  const restoreSession = useAppStore(
    (state) => state.restoreSession
  );

  const isInitializing = useAppStore(
    (state) => state.isInitializing
  );
  useEffect((

  ) => {
    restoreSession();
  }, [restoreSession]);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white bg-black">
        Checking session...
      </div>
    );
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute><Layout /></ProtectedRoute>,
      children: [
        {
          path: "",
          element:<SuspenseWrapper>  <Dashboard /></SuspenseWrapper>
        },
        {
          path: "/board",
          element: <SuspenseWrapper><Board /></SuspenseWrapper>

        },
        {
          path: "/analytics",
          element: <SuspenseWrapper><Analytics /></SuspenseWrapper>
        }
      ]
    },
    {
      path: "/login",
      element:<SuspenseWrapper><PublicRoute > <Login /></PublicRoute></SuspenseWrapper> 
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App
