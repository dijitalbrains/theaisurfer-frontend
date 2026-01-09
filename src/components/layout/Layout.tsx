import React from 'react';
import { Outlet } from 'react-router';
import { Header } from './Header';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
