import React from 'react';
import { ROUTES } from '@/app/routes/routes';
import { NavItem } from '@/components/atoms/NavItem/NavItem';
import { useAuthContext } from '@/app/providers/auth';
import './Sidebar.css';

// Simple icon placeholders - replace with your icon library (e.g., lucide-react, react-icons)
const DashboardIcon = () => <span>📊</span>;
const ProfileIcon = () => <span>👤</span>;
const LogoutIcon = () => <span>🚪</span>;

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthContext();

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <h1 className="sidebar__title">App</h1>
      </div>

      <nav className="sidebar__nav">
        <NavItem
          label="Dashboard"
          path={ROUTES.DASHBOARD}
          icon={<DashboardIcon />}
        />
        <NavItem
          label="Profile"
          path={ROUTES.PROFILE}
          icon={<ProfileIcon />}
        />
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <span className="sidebar__user-name">{user?.name || 'User'}</span>
        </div>
        <button
          onClick={logout}
          className="sidebar__logout"
          aria-label="Logout"
        >
          <LogoutIcon />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
