import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/organisms/Sidebar/Sidebar';
import './ProtectedLayout.css';

/**
 * ProtectedLayout — wraps authenticated routes with a sidebar + main content area.
 */
export const ProtectedLayout: React.FC = () => (
  <div className="protected-layout">
    <Sidebar />
    <main className="protected-layout__main">
      <Outlet />
    </main>
  </div>
);
