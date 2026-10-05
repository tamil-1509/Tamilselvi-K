import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Calendar,
  Clock,
  Pill,
  FlaskConical,
  CreditCard,
  Plus,
  AlertTriangle,
  FileText,
  User,
  Heart,
  ChevronRight,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { NewAppointmentModal } from '../common/NewAppointmentModal';
import { InvoiceModal } from '../common/InvoiceModal';
import { Bill } from '../../types';

export const PatientDashboard: React.FC = () => {
  const {
    currentPatient,
    currentUser,
    appointments,
    prescriptions,
    labTests,
    bills,
    cancelAppointment,
    setActiveTab,
  } = useHospital();

  const patient = currentPatient || (currentUser as any);
  const patientId = patient?.id || 'pat-marcus';

  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedBillForInvoice, setSelectedBillForInvoice] = useState<Bill | null>(null);

  // Filter items for this patient
  const myAppointments = appointments.filter((a) => a.patientId === patientId);
  const upcomingAppointments = myAppointments.filter(
    (a) => a.status === 'Confirmed' || a.status === 'Pending'
  );
  const pastAppointments = myAppointments.filter(
    (a) => a.status === 'Completed' || a.status === 'Cancelled'
  );

  const myPrescriptions = prescriptions.filter((p) => p.patientId === patientId);
  const myLabTests = labTests.filter((t) => t.patientId === patientId);
  const myBills = bills.filter((b) => b.patientId === patientId);
  const pendingBill = myBills.find((b) => b.status === 'Pending' || b.status === 'Partial');

  return (
    <div className="space-y-6">
      {/* Patient Welcome Hero Card */}
      <div className="p-6 bg-gradient-to-r from-teal-800 to-sky-900 rounded-2xl text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight">Welcome, {patient?.name || 'Marcus Chen'}</h1>
            <span className="px-2 py-0.5 bg-teal-400/20 text-teal-200 border border-teal-300/30 rounded text-xs font-mono font-medium">
              ID: {patient?.id}
            </span>
          </div>
          <p className="text-xs text-teal-100 max-w-xl leading-relaxed">
            Welcome to your digital patient portal. Manage your doctor appointments, view diagnostic laboratory results, access verified prescriptions, and settle hospital statements securely.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-teal-200 pt-1">
            <span>Blood Group: <strong className="text-white font-mono">{patient?.bloodGroup || 'O+'}</strong></span>
            <span>·</span>
            <span>Age: <strong className="text-white">{patient?.age || 38} years</strong></span>
            <span>·</span>
            <span>Status: <strong className="text-white">{patient?.admissionStatus || 'Outpatient'}</strong></span>
          </div>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="px-4 py-2.5 bg-white text-teal-900 hover:bg-teal-50 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-teal-700" />
          Book Appointment
        </button>
      </div>

      {/* Allergies Notice if present */}
      {patient?.allergies && patient.allergies.length > 0 && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-3 text-xs text-rose-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Documented Medical Allergies:</strong> {patient.allergies.join(', ')}. All hospital care teams are automatically notified.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200">
            EMR Alert Active
          </span>
        </div>
      )}

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          onClick={() => setActiveTab('appointments')}
          className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Upcoming Visits</span>
            <Calendar className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono mt-2 tabular-nums">
            {upcomingAppointments.length}
          </p>
          <p className="text-[11px] text-teal-700 font-medium mt-1">Next: {upcomingAppointments[0]?.date || 'None scheduled'}</p>
        </div>

        <div
          onClick={() => setActiveTab('prescriptions')}
          className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Prescriptions</span>
            <Pill className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono mt-2 tabular-nums">
            {myPrescriptions.length}
          </p>
          <p className="text-[11px] text-sky-700 font-medium mt-1">Digital e-scripts</p>
        </div>

        <div
          onClick={() => setActiveTab('laboratory')}
          className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Lab Diagnostic Tests</span>
            <FlaskConical className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono mt-2 tabular-nums">
            {myLabTests.length}
          </p>
          <p className="text-[11px] text-indigo-700 font-medium mt-1">
            {myLabTests.filter((t) => t.status === 'Completed').length} Verified Reports
          </p>
        </div>

        <div
          onClick={() => setActiveTab('billing')}
          className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Billing & Invoices</span>
            <CreditCard className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold font-mono mt-2 tabular-nums text-slate-900">
            {pendingBill ? `$${pendingBill.pendingAmount.toFixed(2)}` : '$0.00'}
          </p>
          <p className="text-[11px] font-medium mt-1 text-slate-500">
            {pendingBill ? 'Outstanding balance due' : 'All accounts settled'}
          </p>
        </div>
      </div>

      {/* Main Grid: Appointments & Prescriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments Card */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-teal-600" />
              Upcoming Doctor Consultations
            </h3>
            <button
              onClick={() => setShowBookModal(true)}
              className="text-xs font-semibold text-teal-700 hover:underline cursor-pointer"
            >
              + Book Another
            </button>
          </div>

          <div className="p-4 space-y-3 flex-1">
            {upcomingAppointments.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No upcoming consultations scheduled.
              </div>
            ) : (
              upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3.5 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{apt.doctorName}</h4>
                      <p className="text-xs text-slate-500">{apt.doctorSpecialization} · {apt.departmentName}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-semibold">
                      {apt.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600 bg-slate-50 p-2 rounded font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {apt.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {apt.timeSlot}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-500 truncate max-w-xs">{apt.reason}</span>
                    <button
                      onClick={() => cancelAppointment(apt.id)}
                      className="text-rose-600 hover:text-rose-800 font-medium hover:underline text-[11px] cursor-pointer"
                    >
                      Cancel Visit
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-right">
            <button
              onClick={() => setActiveTab('appointments')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              View Full Appointment History &rarr;
            </button>
          </div>
        </div>

        {/* Active Prescriptions Card */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-sky-600" />
              Current Medications & Prescriptions
            </h3>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className="text-xs font-semibold text-sky-700 hover:underline cursor-pointer"
            >
              View All Rx
            </button>
          </div>

          <div className="p-4 space-y-3 flex-1">
            {myPrescriptions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active medical prescriptions on file.
              </div>
            ) : (
              myPrescriptions.map((rx) => (
                <div key={rx.id} className="p-3.5 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs">{rx.diagnosis}</span>
                      <p className="text-[11px] text-slate-400">Prescribed by {rx.doctorName} on {rx.date}</p>
                    </div>
                    {rx.followUpDate && (
                      <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-mono">
                        Follow-up: {rx.followUpDate}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {rx.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-2 bg-slate-50 rounded border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">{item.medicineName}</p>
                          <p className="text-[11px] text-slate-500">{item.instructions}</p>
                        </div>
                        <div className="text-right font-mono text-xs">
                          <span className="font-bold text-slate-700">{item.dosage}</span>
                          <span className="text-[10px] text-slate-400 block">{item.frequency}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {rx.advice && (
                    <p className="text-[11px] text-slate-600 italic bg-amber-50/50 p-2 rounded border border-amber-100/60">
                      Diet / Lifestyle: {rx.advice}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-right">
            <span className="text-xs text-slate-500">Filled through PulseCare Certified Pharmacy</span>
          </div>
        </div>
      </div>

      {/* Lab Results & Invoices Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Diagnostic Reports */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-indigo-600" />
              Laboratory Diagnostic Reports
            </h3>
            <button
              onClick={() => setActiveTab('laboratory')}
              className="text-xs font-semibold text-indigo-700 hover:underline cursor-pointer"
            >
              Full Lab Archive &rarr;
            </button>
          </div>

          <div className="p-4 space-y-3">
            {myLabTests.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">No laboratory orders recorded.</div>
            ) : (
              myLabTests.map((t) => (
                <div key={t.id} className="p-3 border border-slate-200 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{t.testName}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {t.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Category: {t.category} · Ordered by: {t.doctorName} on {t.orderedDate}
                  </p>
                  {t.summary && (
                    <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                      {t.summary}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Invoices & Billing Settlement */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Hospital Statements & Digital Invoices
            </h3>
            <button
              onClick={() => setActiveTab('billing')}
              className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
            >
              View All Statements &rarr;
            </button>
          </div>

          <div className="p-4 space-y-3">
            {myBills.map((b) => (
              <div
                key={b.id}
                className="p-3 border border-slate-200 rounded-lg flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-xs">{b.billNumber}</span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        b.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Issued: {b.date} · Due: {b.dueDate}
                  </p>
                  <p className="text-xs font-mono font-semibold text-slate-800 mt-1">
                    Total: ${b.totalAmount.toFixed(2)} {b.pendingAmount > 0 && `(Balance: $${b.pendingAmount.toFixed(2)})`}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedBillForInvoice(b)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View Invoice
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment & Invoice Modals */}
      <NewAppointmentModal
        isOpen={showBookModal}
        onClose={() => setShowBookModal(false)}
      />
      <InvoiceModal
        bill={selectedBillForInvoice}
        isOpen={!!selectedBillForInvoice}
        onClose={() => setSelectedBillForInvoice(null)}
      />
    </div>
  );
};
