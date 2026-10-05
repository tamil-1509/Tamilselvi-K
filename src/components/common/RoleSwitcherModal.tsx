import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Modal } from './Modal';
import { UserRole } from '../../types';
import { ShieldCheck, Stethoscope, User, CalendarClock, Activity, ArrowRight, KeyRound } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentRole, currentUser, switchRole, login } = useHospital();
  const [customEmail, setCustomEmail] = useState('');
  const [loginError, setLoginError] = useState('');

  const accounts: {
    role: UserRole;
    name: string;
    email: string;
    title: string;
    desc: string;
    icon: any;
    color: string;
    badgeBg: string;
  }[] = [
    {
      role: 'admin',
      name: 'Dr. Arthur Vance',
      email: 'admin@pulsecare.com',
      title: 'Hospital Administrator & Medical Director',
      desc: 'Full operational authority: doctors, beds, pharmacy, analytics, staff, and financial management.',
      icon: ShieldCheck,
      color: 'text-indigo-600',
      badgeBg: 'bg-indigo-50 border-indigo-200',
    },
    {
      role: 'doctor',
      name: 'Dr. Elena Rostova',
      email: 'doctor@pulsecare.com',
      title: 'Chief of Cardiology',
      desc: 'Manage daily appointments, consult patients, issue digital prescriptions, view labs, and write clinical notes.',
      icon: Stethoscope,
      color: 'text-teal-600',
      badgeBg: 'bg-teal-50 border-teal-200',
    },
    {
      role: 'patient',
      name: 'Marcus Chen',
      email: 'patient@pulsecare.com',
      title: 'Outpatient / Cardiology Patient',
      desc: 'Book consultations, view appointment history, access digital prescriptions, lab reports, and settle hospital bills.',
      icon: User,
      color: 'text-sky-600',
      badgeBg: 'bg-sky-50 border-sky-200',
    },
    {
      role: 'receptionist',
      name: 'Sarah Jenkins',
      email: 'receptionist@pulsecare.com',
      title: 'Front Desk & Patient Registrar',
      desc: 'Patient check-in/out, rapid appointment scheduling, bed admissions, and invoice generation.',
      icon: CalendarClock,
      color: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 border-emerald-200',
    },
    {
      role: 'nurse',
      name: 'Nurse Clara Barton, RN',
      email: 'nurse@pulsecare.com',
      title: 'Senior Clinical Staff Nurse',
      desc: 'Record patient vital signs, monitor ICU & general beds, view physician orders, and update inpatient statuses.',
      icon: Activity,
      color: 'text-rose-600',
      badgeBg: 'bg-rose-50 border-rose-200',
    },
  ];

  const handleSelectRole = (role: UserRole) => {
    switchRole(role);
    onClose();
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const ok = login(customEmail.trim());
    if (ok) {
      setLoginError('');
      onClose();
    } else {
      setLoginError('Email not found. Please choose one of the sample accounts below.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Switch Role or Login Account"
      subtitle="Select any hospital role to test specific permissions and workflows"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 text-xs">
        {/* Current Active User Banner */}
        <div className="p-3 bg-slate-100 rounded-lg flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 font-medium">Currently logged in as:</span>
            <div className="font-semibold text-slate-900 flex items-center gap-1.5 mt-0.5">
              <span>{currentUser?.name}</span>
              <span className="text-slate-400">({currentUser?.email})</span>
            </div>
          </div>
          <span className="font-semibold text-xs px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-800 uppercase tracking-wider">
            {currentRole}
          </span>
        </div>

        {/* 1-Click Role Accounts List */}
        <div className="space-y-2">
          <p className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
            Sample Hospital Portals (1-Click Switch)
          </p>
          <div className="grid grid-cols-1 gap-2">
            {accounts.map((acc) => {
              const Icon = acc.icon;
              const isActive = currentRole === acc.role;

              return (
                <div
                  key={acc.role}
                  onClick={() => handleSelectRole(acc.role)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-start justify-between gap-3 text-left ${
                    isActive
                      ? 'border-teal-500 bg-teal-50/50 shadow-xs ring-1 ring-teal-500'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-slate-100 ${acc.color} shrink-0 mt-0.5`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{acc.name}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{acc.email}</span>
                      </div>
                      <p className="font-medium text-slate-700 text-[11px] mt-0.5">{acc.title}</p>
                      <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">{acc.desc}</p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center self-center">
                    {isActive ? (
                      <span className="text-xs font-semibold text-teal-700 bg-teal-100/60 px-2 py-1 rounded">
                        Active Portal
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        Launch <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Email Login Form */}
        <div className="pt-3 border-t border-slate-200">
          <p className="font-semibold text-slate-500 uppercase tracking-wider text-[11px] mb-2">
            Or Login with Registered Email
          </p>
          <form onSubmit={handleCustomLogin} className="flex gap-2">
            <input
              type="email"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              placeholder="e.g. j.hayes@pulsecare.com or patient@pulsecare.com"
              className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Sign In
            </button>
          </form>
          {loginError && <p className="text-xs text-rose-600 mt-1">{loginError}</p>}
        </div>
      </div>
    </Modal>
  );
};
