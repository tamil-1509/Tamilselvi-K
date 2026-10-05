import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Bell,
  Users,
  Shield,
  Stethoscope,
  UserCheck,
  CalendarCheck,
  Activity,
  LogOut,
  PhoneCall,
  Menu,
  CheckCheck,
} from 'lucide-react';
import { RoleSwitcherModal } from '../common/RoleSwitcherModal';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    currentUser,
    currentRole,
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
    logout,
  } = useHospital();

  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getRoleIcon = () => {
    switch (currentRole) {
      case 'admin':
        return <Shield className="w-3.5 h-3.5 text-indigo-600" />;
      case 'doctor':
        return <Stethoscope className="w-3.5 h-3.5 text-teal-600" />;
      case 'receptionist':
        return <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case 'nurse':
        return <Activity className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return <UserCheck className="w-3.5 h-3.5 text-sky-600" />;
    }
  };

  const getRoleBadgeStyle = () => {
    switch (currentRole) {
      case 'admin':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'doctor':
        return 'text-teal-700 bg-teal-50 border-teal-200';
      case 'receptionist':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'nurse':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      default:
        return 'text-sky-700 bg-sky-50 border-sky-200';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 h-16 px-4 lg:px-6 flex items-center justify-between shadow-2xs">
        {/* Zone 1: Brand title & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-black text-base shadow-xs group-hover:bg-teal-700 transition-colors">
              +
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                PulseCare <span className="text-xs font-semibold text-teal-600 tracking-normal uppercase">HMS</span>
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links & Active Portal Indicator (Strict Top Bar Contract) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
          >
            Clinical Overview
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className="hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className="hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
          >
            Specialists
          </button>
          <button
            onClick={() => setActiveTab('beds')}
            className="hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
          >
            Bed Matrix
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className="hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
          >
            Invoices
          </button>

          {/* Clean Unboxed Role Indicator */}
          <div className="hidden xl:flex items-center gap-1.5 text-slate-500 border-l border-slate-200 pl-4">
            <span className="text-slate-400">Portal:</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getRoleBadgeStyle()} flex items-center gap-1`}>
              {getRoleIcon()}
              {currentRole.toUpperCase()}
            </span>
          </div>
        </nav>

        {/* Zone 3: Primary Actions (Notifications, Role Switcher, Profile) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition-colors cursor-pointer"
              title="Hospital Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden text-xs animate-in fade-in duration-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">Hospital Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded text-[10px] font-mono">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400">No active notifications</div>
                  ) : (
                    notifications.slice(0, 10).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationAsRead(n.id);
                          if (n.linkTab) setActiveTab(n.linkTab);
                          setShowNotifications(false);
                        }}
                        className={`p-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                          !n.isRead ? 'bg-teal-50/30' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-semibold text-slate-800 ${!n.isRead ? 'text-teal-900' : ''}`}>
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{n.createdAt}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setActiveTab('notifications');
                      setShowNotifications(false);
                    }}
                    className="text-xs text-teal-700 hover:underline font-medium cursor-pointer"
                  >
                    View All Hospital Announcements
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Switch Role CTA */}
          <button
            type="button"
            onClick={() => setShowRoleSwitcher(true)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Switch Role</span>
          </button>

          {/* User Profile Pill & Sign Out */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="hidden md:block text-right">
              <p className="text-xs font-semibold text-slate-800 truncate max-w-[130px] leading-tight">
                {currentUser?.name || 'Guest User'}
              </p>
              <p className="text-[10px] text-slate-400 font-mono uppercase truncate max-w-[130px]">
                {currentUser?.role || 'Guest'}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={showRoleSwitcher}
        onClose={() => setShowRoleSwitcher(false)}
      />
    </>
  );
};
