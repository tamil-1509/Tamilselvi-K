import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  LayoutDashboard,
  CalendarDays,
  UserRound,
  Users,
  FileText,
  Pill,
  FlaskConical,
  CreditCard,
  BedDouble,
  Building,
  Bell,
  PhoneCall,
  Settings,
  Activity,
  HeartPulse,
  AlertTriangle,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    activeTab,
    setActiveTab,
    currentRole,
    appointments,
    beds,
    medicines,
    bills,
  } = useHospital();

  // Metrics for badges
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAptsCount = appointments.filter((a) => a.date === todayStr && a.status !== 'Cancelled').length;
  const occupiedBedsCount = beds.filter((b) => b.status === 'Occupied').length;
  const lowStockCount = medicines.filter((m) => m.stockStatus !== 'In Stock').length;
  const pendingBillsCount = bills.filter((b) => b.status === 'Pending' || b.status === 'Partial').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      roles: ['admin', 'doctor', 'patient', 'receptionist', 'nurse'],
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: CalendarDays,
      badge: todayAptsCount > 0 ? `${todayAptsCount} today` : null,
      roles: ['admin', 'doctor', 'patient', 'receptionist', 'nurse'],
    },
    {
      id: 'doctors',
      label: 'Doctors & Specialists',
      icon: UserRound,
      badge: null,
      roles: ['admin', 'doctor', 'patient', 'receptionist', 'nurse'],
    },
    {
      id: 'patients',
      label: 'Patients & Admissions',
      icon: Users,
      badge: null,
      roles: ['admin', 'doctor', 'receptionist', 'nurse'],
    },
    {
      id: 'records',
      label: 'Medical Records',
      icon: FileText,
      badge: null,
      roles: ['admin', 'doctor', 'patient', 'nurse'],
    },
    {
      id: 'prescriptions',
      label: 'Prescriptions (Rx)',
      icon: Pill,
      badge: null,
      roles: ['admin', 'doctor', 'patient', 'nurse', 'receptionist'],
    },
    {
      id: 'laboratory',
      label: 'Laboratory Diagnostics',
      icon: FlaskConical,
      badge: null,
      roles: ['admin', 'doctor', 'patient', 'nurse', 'receptionist'],
    },
    {
      id: 'pharmacy',
      label: 'Pharmacy & Stock',
      icon: HeartPulse,
      badge: lowStockCount > 0 ? `${lowStockCount} alerts` : null,
      badgeVariant: 'warning',
      roles: ['admin', 'doctor', 'nurse', 'receptionist'],
    },
    {
      id: 'beds',
      label: 'Bed & Room Matrix',
      icon: BedDouble,
      badge: `${occupiedBedsCount}/${beds.length} occ`,
      roles: ['admin', 'doctor', 'receptionist', 'nurse'],
    },
    {
      id: 'billing',
      label: 'Billing & Invoices',
      icon: CreditCard,
      badge: pendingBillsCount > 0 ? `${pendingBillsCount} due` : null,
      roles: ['admin', 'receptionist', 'patient'],
    },
    {
      id: 'departments',
      label: 'Departments',
      icon: Building,
      badge: null,
      roles: ['admin', 'receptionist', 'doctor'],
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: null,
      roles: ['admin', 'doctor', 'patient', 'receptionist', 'nurse'],
    },
    {
      id: 'contact',
      label: 'Hospital Contact',
      icon: PhoneCall,
      badge: null,
      roles: ['admin', 'doctor', 'patient', 'receptionist', 'nurse'],
    },
    {
      id: 'settings',
      label: 'System & Architecture',
      icon: Settings,
      badge: null,
      roles: ['admin', 'doctor', 'patient', 'receptionist', 'nurse'],
    },
  ];

  const filteredItems = navItems.filter((item) => item.roles.includes(currentRole));

  const handleSelect = (id: string) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Clinical Services & Portals
          </div>

          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-teal-600' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ml-1 ${
                      item.badgeVariant === 'warning'
                        ? 'bg-amber-100 text-amber-800 font-semibold'
                        : isActive
                        ? 'bg-teal-200/70 text-teal-900 font-semibold'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Emergency Triage Hotbox */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70">
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200/80 text-rose-900 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[11px] text-rose-800 uppercase tracking-wide">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Emergency Triage
            </div>
            <p className="text-[11px] text-rose-700 leading-tight">
              Hospital Hotline: <span className="font-mono font-bold">+1 (555) 911-CARE</span>
            </p>
            <p className="text-[10px] text-rose-600">Ambulance Bay: Station 4</p>
          </div>
        </div>
      </aside>
    </>
  );
};
