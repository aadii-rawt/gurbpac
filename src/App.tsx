import { useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';
import Board from './pages/Board';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

import { useAppStore } from "./store/appStore";
import PublicRoute from './components/PublicRoute';

function App() {
  const restoreSession = useAppStore(
    (state) => state.restoreSession
  );

  const isInitializing = useAppStore(
    (state) => state.isInitializing
  );

  useEffect(() => {
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
      element: <ProtectedRoute><Layout/></ProtectedRoute> ,
      children : [
        {
          path : "/",
          element : <Dashboard />
        },
        {
          path : "/board",
          element : <Board />

        },
        {
          path : "/analytics",
          element : <Analytics />
        }
      ]
    },
    {
      path : "/login",
      element :<PublicRoute > <Login /></PublicRoute>
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App
