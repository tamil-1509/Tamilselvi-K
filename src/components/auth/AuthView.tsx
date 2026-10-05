import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  ShieldCheck,
  Stethoscope,
  User,
  CalendarClock,
  Activity,
  ArrowRight,
  HeartPulse,
  KeyRound,
  CheckCircle2,
  Lock,
  Mail,
  UserPlus,
} from 'lucide-react';
import { UserRole } from '../../types';

export const AuthView: React.FC = () => {
  const { login, registerPatient, switchRole } = useHospital();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [regAge, setRegAge] = useState(30);
  const [regBlood, setRegBlood] = useState('O+');

  const demoAccounts = [
    {
      role: 'admin' as UserRole,
      name: 'Dr. Arthur Vance',
      email: 'admin@pulsecare.com',
      title: 'Administrator & Medical Director',
      icon: ShieldCheck,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      role: 'doctor' as UserRole,
      name: 'Dr. Elena Rostova',
      email: 'doctor@pulsecare.com',
      title: 'Chief of Cardiology & Specialist',
      icon: Stethoscope,
      color: 'text-teal-600 bg-teal-50 border-teal-200',
    },
    {
      role: 'patient' as UserRole,
      name: 'Marcus Chen',
      email: 'patient@pulsecare.com',
      title: 'Registered Patient / Outpatient',
      icon: User,
      color: 'text-sky-600 bg-sky-50 border-sky-200',
    },
    {
      role: 'receptionist' as UserRole,
      name: 'Sarah Jenkins',
      email: 'receptionist@pulsecare.com',
      title: 'Front Desk Registrar & Admissions',
      icon: CalendarClock,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      role: 'nurse' as UserRole,
      name: 'Nurse Clara Barton, RN',
      email: 'nurse@pulsecare.com',
      title: 'Inpatient Clinical Nurse',
      icon: Activity,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
  ];

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim()) {
      setErrorMsg('Please enter your email.');
      return;
    }

    const success = login(email.trim());
    if (!success) {
      setErrorMsg('Account not recognized. Try one of the 1-click accounts below.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regName.trim() || !regPhone.trim()) {
      setErrorMsg('Please fill in required patient fields.');
      return;
    }

    registerPatient({
      name: regName.trim(),
      email: regEmail.trim() || `${regName.toLowerCase().replace(/\s+/g, '.')}_${Date.now()}@patient.pulsecare.com`,
      phone: regPhone.trim(),
      gender: regGender,
      age: Number(regAge),
      bloodGroup: regBlood,
      admissionStatus: 'Outpatient',
    });
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSuccessMsg(`A secure clinical password reset link has been dispatched to ${email}.`);
    setTimeout(() => {
      setSuccessMsg('');
      setMode('login');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Bar for Auth */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-black flex items-center justify-center text-base shadow-xs">
            +
          </div>
          <span className="text-base font-bold text-slate-900 tracking-tight">
            PulseCare <span className="text-teal-600 text-xs uppercase">HMS</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="hidden sm:inline">Emergency Triage Line:</span>
          <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            +1 (555) 911-CARE
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Hospital Overview & 1-Click Role Logins */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-teal-700 tracking-wider uppercase bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
              Enterprise Hospital Information System
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Integrated Clinical Portals for Modern Healthcare
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
              Experience the unified hospital ecosystem designed for administrators, specialized physicians, staff nurses, receptionists, and patients.
            </p>
          </div>

          {/* 4 Stats Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Patients</span>
              <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">1,250</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">+14% Growth</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Physicians</span>
              <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">85</span>
              <span className="text-[10px] text-teal-600 block mt-0.5">9 Specialties</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Today's Visits</span>
              <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">48</span>
              <span className="text-[10px] text-indigo-600 block mt-0.5">Active Roster</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Available Beds</span>
              <span className="text-xl font-bold font-mono text-emerald-700 tabular-nums">32</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">ICU & Wards</span>
            </div>
          </div>

          {/* 1-Click Fast Login Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Instant Access Demonstration Accounts
              </span>
              <span className="text-[11px] text-teal-700 font-medium">Click any role to test</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {demoAccounts.map((acc) => {
                const Icon = acc.icon;

                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => switchRole(acc.role)}
                    className="p-3 bg-white border border-slate-200 hover:border-teal-500 hover:shadow-xs rounded-xl flex items-center justify-between gap-3 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${acc.color} shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          {acc.name}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">{acc.title}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition-colors shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          {/* Form Tabs */}
          <div className="flex border-b border-slate-200 pb-3 gap-4 text-xs font-bold">
            <button
              onClick={() => setMode('login')}
              className={`pb-1 cursor-pointer transition-colors ${
                mode === 'login'
                  ? 'text-teal-700 border-b-2 border-teal-700'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`pb-1 cursor-pointer transition-colors ${
                mode === 'register'
                  ? 'text-teal-700 border-b-2 border-teal-700'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Patient Registration
            </button>
            <button
              onClick={() => setMode('forgot')}
              className={`pb-1 cursor-pointer transition-colors ${
                mode === 'forgot'
                  ? 'text-teal-700 border-b-2 border-teal-700'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Password Recovery
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs">
              {successMsg}
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleStandardLogin} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Hospital Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@pulsecare.com or patient@pulsecare.com"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-700">Account Password</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-teal-700 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    defaultValue="hospital123"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg shadow-xs transition-colors cursor-pointer text-xs"
              >
                Sign In to Hospital Portal
              </button>

              <p className="text-[11px] text-center text-slate-400 pt-2">
                Tip: You can also click any of the 1-click role buttons on the left to enter instantly!
              </p>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Rachel Chen"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value as any)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    value={regAge}
                    onChange={(e) => setRegAge(Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Blood Group</label>
                  <select
                    value={regBlood}
                    onChange={(e) => setRegBlood(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white font-mono"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded text-xs cursor-pointer shadow-xs mt-2"
              >
                Register & Enter Portal
              </button>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
              <p className="text-slate-600 text-xs">
                Enter your registered hospital email address to receive an automated recovery key.
              </p>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Account Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@pulsecare.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="flex-1 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg cursor-pointer"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        PulseCare Health Management System · HIPAA & Clinical Data Protection Standard Compliant
      </div>
    </div>
  );
};
