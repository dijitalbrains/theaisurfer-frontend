import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { AuthInitializer } from "./components/AuthInitializer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Projects } from "./pages/Projects";
import { SSOConfirm } from "./pages/SSOConfirm";
import { SSORedirect } from "./pages/SSORedirect";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/projects",
    element: <Projects />,
    errorElement: <ErrorBoundary />,
  },

  {
    path: "/sso/confirm",
    element: <SSOConfirm />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/sso/redirect",
    element: <SSORedirect />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
    errorElement: <ErrorBoundary />,
  },
]);

function App() {
  return (
    <AuthInitializer>
      <RouterProvider router={router} />
    </AuthInitializer>
  );
}

export default App;
