import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Projects } from './pages/Projects';
import { RedirectHandler } from './pages/RedirectHandler';
import { SSOConfirm } from './pages/SSOConfirm';
import { SSOLogin } from './pages/SSOLogin';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/projects',
    element: <Projects />,
  },
  {
    path: '/redirect/:projectSlug',
    element: <RedirectHandler />,
  },
  {
    path: '/sso/confirm',
    element: <SSOConfirm />,
  },
  {
    path: '/sso/login',
    element: <SSOLogin />,
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
