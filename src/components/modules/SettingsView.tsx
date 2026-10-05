import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Settings,
  Server,
  Database,
  Shield,
  RotateCcw,
  CheckCircle2,
  Terminal,
  Code,
  Key,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    currentRole,
    resetAllToDefaults,
  } = useHospital();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'permissions' | 'mongodb_docs'>('mongodb_docs');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    resetAllToDefaults();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Settings & Architecture</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Role-based security configuration, application environment variables, and MongoDB full-stack deployment instructions
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs text-xs">
        <button
          onClick={() => setActiveSubTab('mongodb_docs')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeSubTab === 'mongodb_docs' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Backend & MongoDB Deployment Guide
        </button>
        <button
          onClick={() => setActiveSubTab('permissions')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeSubTab === 'permissions' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Role-Based Access Matrix (RBAC)
        </button>
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeSubTab === 'profile' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Current User Profile & Reset
        </button>
      </div>

      {activeSubTab === 'mongodb_docs' && (
        <div className="space-y-6 text-xs text-slate-700">
          {/* Quick Architecture Overview */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-teal-600" />
              Full-Stack Hospital Management Architecture
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              PulseCare HMS is structured as an enterprise React 19 application running with a Node.js/Express REST backend layer and scalable MongoDB document storage. Every API endpoint matches the clinical data schemas shown below.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block text-xs">Frontend</span>
                <span className="text-slate-500 text-[11px]">React 19 + TypeScript + Vite + Tailwind CSS v4 + Lucide Icons</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block text-xs">Backend API</span>
                <span className="text-slate-500 text-[11px]">Node.js Express Server (`server.ts`) with modular routes</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block text-xs">Database</span>
                <span className="text-slate-500 text-[11px]">MongoDB Atlas / Mongoose collections with foreign key references</span>
              </div>
            </div>
          </div>

          {/* 7 Required Sections */}
          <div className="space-y-4">
            {/* 1. Installing Dependencies */}
            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-teal-600" />
                1. Installing Dependencies
              </h4>
              <p className="text-slate-600">Run npm to install all required client and server modules:</p>
              <pre className="p-3 bg-slate-900 text-teal-300 rounded-lg font-mono text-[11px] overflow-x-auto">
{`npm install
# Core packages: react, react-dom, express, dotenv, lucide-react, motion, tsx`}
              </pre>
            </div>

            {/* 2. Running Frontend */}
            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Code className="w-4 h-4 text-teal-600" />
                2. Running the Frontend Development Server
              </h4>
              <p className="text-slate-600">Starts Vite with HMR on port 3000:</p>
              <pre className="p-3 bg-slate-900 text-teal-300 rounded-lg font-mono text-[11px] overflow-x-auto">
{`npm run dev
# The frontend launches at http://localhost:3000 with interactive mock data persistence`}
              </pre>
            </div>

            {/* 3. Running Backend */}
            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Server className="w-4 h-4 text-teal-600" />
                3. Running the Express Backend APIs
              </h4>
              <p className="text-slate-600">Launch the backend Express proxy server via TypeScript executor:</p>
              <pre className="p-3 bg-slate-900 text-teal-300 rounded-lg font-mono text-[11px] overflow-x-auto">
{`npx tsx server.ts
# Launches Express endpoints on port 3000 /api/* with CORS enabled`}
              </pre>
            </div>

            {/* 4. Connecting MongoDB */}
            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-teal-600" />
                4. Connecting MongoDB & Schema Architecture
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Connect your local MongoDB daemon or MongoDB Atlas cluster URI in your environment:
              </p>
              <pre className="p-3 bg-slate-900 text-teal-300 rounded-lg font-mono text-[11px] overflow-x-auto">
{`// MongoDB Mongoose Connection Snippet:
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pulsecare_hms';

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully to PulseCare database');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}`}
              </pre>
              <div className="p-3 bg-slate-50 border rounded-lg text-slate-600 text-[11px] space-y-1">
                <p className="font-bold text-slate-900">Database Collections Created:</p>
                <p>• <strong>Users:</strong> Authentication, role enum ('admin'|'doctor'|'patient'|'receptionist'|'nurse'), contact</p>
                <p>• <strong>Doctors:</strong> Specialization, department foreign key, license, daily schedules, consultation fee</p>
                <p>• <strong>Patients:</strong> Emergency contact, blood group, allergies array, admission bed reference</p>
                <p>• <strong>Appointments:</strong> Date, time slot, doctorId, patientId, unique compound index (doctorId + date + timeSlot) to prevent double-booking</p>
                <p>• <strong>Beds & Rooms:</strong> Room number, wardType ('ICU'|'General'|'Private'|'Emergency'), status, daily rate</p>
                <p>• <strong>Pharmacy:</strong> Drug inventory, batch number, unit price, stock threshold, expiry</p>
                <p>• <strong>LabTests:</strong> Diagnostic parameters, reference intervals, abnormal flags, status</p>
                <p>• <strong>Bills & Invoices:</strong> Invoice serial, breakdown of consultation, lab, pharma, room stay, payment status</p>
              </div>
            </div>

            {/* 5. Setting Environment Variables */}
            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-teal-600" />
                5. Setting Environment Variables (.env)
              </h4>
              <p className="text-slate-600">Configure your `.env` file with MongoDB connection string and security secrets:</p>
              <pre className="p-3 bg-slate-900 text-teal-300 rounded-lg font-mono text-[11px] overflow-x-auto">
{`PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/pulsecare_hms?retryWrites=true&w=majority
JWT_SECRET=super_secret_clinical_jwt_key_2026
GEMINI_API_KEY=MY_GEMINI_API_KEY
APP_URL=http://localhost:3000`}
              </pre>
            </div>

            {/* 6. Testing */}
            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                6. Testing the Application
              </h4>
              <p className="text-slate-600">Run automated typechecking and linters to verify zero defects:</p>
              <pre className="p-3 bg-slate-900 text-teal-300 rounded-lg font-mono text-[11px] overflow-x-auto">
{`npm run lint
# Executes tsc --noEmit to validate all TypeScript types, interfaces, and syntax`}
              </pre>
            </div>

            {/* 7. Deploying */}
            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-600" />
                7. Deploying the Application
              </h4>
              <p className="text-slate-600">Build the client and deploy to production container / Cloud Run / Vercel / Render:</p>
              <pre className="p-3 bg-slate-900 text-teal-300 rounded-lg font-mono text-[11px] overflow-x-auto">
{`npm run build
# Compiles minified bundle into /dist ready for high-performance production serving`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'permissions' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-sm">Role-Based Access Control (RBAC) Matrix</h3>
            <p className="text-xs text-slate-500">Explicit security boundary separating clinical, administrative, and patient privileges</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <th className="py-2.5 px-4">Feature / Permission</th>
                  <th className="py-2.5 px-4 text-center">Admin</th>
                  <th className="py-2.5 px-4 text-center">Doctor</th>
                  <th className="py-2.5 px-4 text-center">Nurse</th>
                  <th className="py-2.5 px-4 text-center">Receptionist</th>
                  <th className="py-2.5 px-4 text-center">Patient</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { feature: 'View Administrative Dashboard & Financial Analytics', admin: true, doc: false, nurse: false, rec: false, pat: false },
                  { feature: 'Manage Doctors & Hospital Departments', admin: true, doc: false, nurse: false, rec: false, pat: false },
                  { feature: 'View Clinical Schedule & Consult Patients', admin: true, doc: true, nurse: false, rec: false, pat: false },
                  { feature: 'Issue Digital Prescriptions (e-Rx)', admin: true, doc: true, nurse: false, rec: false, pat: false },
                  { feature: 'Order Diagnostic Laboratory Workups', admin: true, doc: true, nurse: false, rec: false, pat: false },
                  { feature: 'Chart Patient Vital Signs (BP, Pulse, SpO2)', admin: true, doc: true, nurse: true, rec: false, pat: false },
                  { feature: 'Bed Admissions & Ward Discharges', admin: true, doc: false, nurse: true, rec: true, pat: false },
                  { feature: 'Generate Digital Hospital Invoices', admin: true, doc: false, nurse: false, rec: true, pat: false },
                  { feature: 'Register New Patients at Front Desk', admin: true, doc: false, nurse: false, rec: true, pat: false },
                  { feature: 'Book Appointments (Self or Patient)', admin: true, doc: true, nurse: true, rec: true, pat: true },
                  { feature: 'Access Personal Medical Records & Labs', admin: true, doc: true, nurse: true, rec: false, pat: true },
                  { feature: 'Settle Hospital Statements & Invoices', admin: true, doc: false, nurse: false, rec: true, pat: true },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-medium text-slate-800">{row.feature}</td>
                    <td className="py-3 px-4 text-center">
                      {row.admin ? <span className="text-emerald-700 font-bold">✓ Granted</span> : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.doc ? <span className="text-emerald-700 font-bold">✓ Granted</span> : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.nurse ? <span className="text-emerald-700 font-bold">✓ Granted</span> : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.rec ? <span className="text-emerald-700 font-bold">✓ Granted</span> : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.pat ? <span className="text-emerald-700 font-bold">✓ Granted</span> : <span className="text-slate-300">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'profile' && (
        <div className="space-y-6">
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Active Account Credentials</h3>

            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px]">FULL NAME</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{currentUser?.name}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">EMAIL ADDRESS</span>
                <p className="font-mono text-slate-900 mt-0.5">{currentUser?.email}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">CURRENT ROLE</span>
                <p className="font-bold text-teal-800 uppercase mt-0.5">{currentRole}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">PHONE</span>
                <p className="font-mono text-slate-800 mt-0.5">{currentUser?.phone || '+1 (555) 000-0000'}</p>
              </div>
            </div>
          </div>

          <div className="p-5 bg-rose-50/50 border border-rose-200 rounded-xl shadow-2xs space-y-3 text-xs">
            <h3 className="font-bold text-rose-950 text-sm flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-600" />
              Reset Demonstration Database to Defaults
            </h3>
            <p className="text-rose-800 leading-relaxed">
              If you have added test records, booked appointments, or discharged patients and wish to restore the initial realistic dataset, click below.
            </p>

            {resetSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded font-semibold">
                Database successfully restored to pristine initial clinical state!
              </div>
            )}

            <button
              onClick={handleReset}
              className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Reset All Hospital Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
