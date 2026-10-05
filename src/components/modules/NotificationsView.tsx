import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Bell,
  CheckCheck,
  Calendar,
  Pill,
  FlaskConical,
  CreditCard,
  Activity,
  CheckCircle,
} from 'lucide-react';
import { NotificationType } from '../../types';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    currentUser,
    currentRole,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
  } = useHospital();

  const [typeFilter, setTypeFilter] = useState<string>('all');

  const visibleNotifications = notifications.filter(
    (n) => n.targetRole === 'all' || n.targetRole === currentRole || n.targetUserId === currentUser?.id
  );

  const filtered = visibleNotifications.filter(
    (n) => typeFilter === 'all' || n.type === typeFilter
  );

  const getNotifIcon = (type: NotificationType) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-4 h-4 text-teal-600" />;
      case 'prescription':
        return <Pill className="w-4 h-4 text-sky-600" />;
      case 'lab':
        return <FlaskConical className="w-4 h-4 text-indigo-600" />;
      case 'billing':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'vitals':
        return <Activity className="w-4 h-4 text-rose-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Hospital Clinical Communications & Alerts</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Appointment confirmations, medication updates, diagnostic results, and financial notices
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Mark All As Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto text-xs bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'appointment', label: 'Appointments' },
          { id: 'prescription', label: 'Prescriptions' },
          { id: 'lab', label: 'Diagnostics & Labs' },
          { id: 'billing', label: 'Billing & Invoices' },
          { id: 'vitals', label: 'Nursing Vitals' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTypeFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              typeFilter === tab.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No notifications in this category.
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`p-4 hover:bg-slate-50/70 transition-colors flex items-start justify-between gap-4 ${
                !n.isRead ? 'bg-teal-50/20' : ''
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                  {getNotifIcon(n.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xs font-bold ${!n.isRead ? 'text-teal-950 font-black' : 'text-slate-900'}`}>
                      {n.title}
                    </h3>
                    {!n.isRead && (
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{n.message}</p>
                </div>
              </div>

              <div className="text-right shrink-0 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 block">{n.createdAt}</span>

                <div className="flex items-center justify-end gap-2">
                  {!n.isRead && (
                    <button
                      onClick={() => markNotificationAsRead(n.id)}
                      className="text-[11px] text-teal-700 hover:underline font-medium cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  )}
                  {n.linkTab && (
                    <button
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        setActiveTab(n.linkTab!);
                      }}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      View &rarr;
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
