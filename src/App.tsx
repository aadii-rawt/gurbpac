import { lazy, useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { useAppStore } from "./store/appStore";

const Layout = lazy(() => import("./layout/Layout"));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Board = lazy(() => import('./pages/Board'));
const Analytics = lazy(() => import('./pages/Analytics'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const PublicRoute = lazy(() => import('./components/PublicRoute'));
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
      <div className="flex min-h-screen items-center justify-center">
        Checking session...
      </div>
    );
  }

  const router = createBrowserRouter([
    {
      path: "",
      element: <ProtectedRoute><Layout /></ProtectedRoute>,
      children: [
        {
          path: "/",
          element: <Dashboard />
        },
        {
          path: "/board",
          element: <Board />

        },
        {
          path: "/analytics",
          element: <Analytics />
        }
      ]
    },
    {
      path: "/login",
      element: <PublicRoute > <Login /></PublicRoute>
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App
