import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Users,
  UserRound,
  CalendarCheck,
  BedDouble,
  DollarSign,
  AlertCircle,
  Plus,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { NewAppointmentModal } from '../common/NewAppointmentModal';
import { AddPatientModal } from '../common/AddPatientModal';

export const AdminDashboard: React.FC = () => {
  const {
    patients,
    doctors,
    appointments,
    beds,
    bills,
    medicines,
    setActiveTab,
    updateAppointmentStatus,
  } = useHospital();

  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayApts = appointments.filter((a) => a.date === todayStr);
  const availableBeds = beds.filter((b) => b.status === 'Available').length;
  const occupiedBeds = beds.filter((b) => b.status === 'Occupied').length;
  const lowStockMeds = medicines.filter((m) => m.stockStatus !== 'In Stock');

  const totalRevenue = bills.reduce((acc, b) => acc + b.paidAmount, 0);
  const pendingRevenue = bills.reduce((acc, b) => acc + b.pendingAmount, 0);

  // SVG Chart Data
  const monthlyData = [
    { month: 'May', count: 180, rev: 42 },
    { month: 'Jun', count: 210, rev: 55 },
    { month: 'Jul', count: 260, rev: 68 },
    { month: 'Aug', count: 320, rev: 84 },
    { month: 'Sep', count: 390, rev: 110 },
    { month: 'Oct', count: 480, rev: 142 },
  ];

  const deptDistribution = [
    { name: 'Cardiology', percentage: 28, color: 'bg-teal-500' },
    { name: 'General Med', percentage: 24, color: 'bg-indigo-500' },
    { name: 'Orthopedics', percentage: 18, color: 'bg-sky-500' },
    { name: 'Neurology', percentage: 14, color: 'bg-amber-500' },
    { name: 'Pediatrics', percentage: 10, color: 'bg-rose-500' },
    { name: 'Other Depts', percentage: 6, color: 'bg-slate-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Administrative Command Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time overview of hospital throughput, clinical admissions, bed capacity, and finances
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddPatientModal(true)}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Register Patient
          </button>
          <button
            onClick={() => setShowAppointmentModal(true)}
            className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            Book Consultation
          </button>
        </div>
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockMeds.length > 0 && (
        <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Inventory Alert:</strong> {lowStockMeds.length} pharmaceutical items have fallen below minimum safety stock levels ({lowStockMeds.map((m) => m.name).join(', ')}).
            </span>
          </div>
          <button
            onClick={() => setActiveTab('pharmacy')}
            className="font-semibold text-amber-800 hover:underline shrink-0 cursor-pointer"
          >
            Review Pharmacy &rarr;
          </button>
        </div>
      )}

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Patients</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">{patients.length + 1248}</span>
            <span className="text-[10px] text-emerald-600 font-medium">+14% m/m</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{patients.length} active in system</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Specialist Doctors</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">{doctors.length + 79}</span>
            <span className="text-[10px] text-teal-600 font-medium">9 Depts</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{doctors.filter((d) => d.status === 'Available').length} available now</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Appointments Today</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">{todayApts.length + 42}</span>
            <span className="text-[10px] text-indigo-600 font-medium">{appointments.length} logged</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">All suites operational</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Available Beds</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-emerald-700 font-mono tabular-nums">{availableBeds}</span>
            <span className="text-[10px] text-slate-500 font-mono">{occupiedBeds} occupied</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {Math.round((occupiedBeds / beds.length) * 100)}% Occupancy Rate
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Revenue</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
              ${(totalRevenue + 138000).toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">+18%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Verified cash & insurance</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Pending Invoices</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-rose-600 font-mono tabular-nums">
              ${(pendingRevenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-500">Unsettled</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {bills.filter((b) => b.status === 'Pending' || b.status === 'Partial').length} pending bills
          </p>
        </div>
      </div>

      {/* Visual Analytics / Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Appointment Trends Chart */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl lg:col-span-2 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Hospital Throughput & Consultations</h3>
              <p className="text-xs text-slate-500">Monthly patient appointments over last 6 months</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-xs bg-teal-600 inline-block" /> Consultations
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-xs bg-indigo-500 inline-block" /> Revenue ($k)
              </span>
            </div>
          </div>

          {/* SVG Bar / Trend Chart */}
          <div className="h-52 w-full flex items-end justify-between gap-4 pt-4 px-2 border-b border-slate-100">
            {monthlyData.map((d) => {
              const maxVal = 500;
              const barHeightPct = (d.count / maxVal) * 100;
              const revHeightPct = (d.rev / 150) * 100;

              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-40">
                    {/* Consultations Bar */}
                    <div
                      style={{ height: `${barHeightPct}%` }}
                      className="w-1/2 max-w-[28px] bg-teal-600 hover:bg-teal-700 rounded-t transition-all relative flex justify-center"
                    >
                      <span className="absolute -top-6 text-[10px] font-mono text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-1 shadow-xs border border-slate-200 rounded">
                        {d.count}
                      </span>
                    </div>

                    {/* Revenue Bar */}
                    <div
                      style={{ height: `${revHeightPct}%` }}
                      className="w-1/2 max-w-[28px] bg-indigo-500 hover:bg-indigo-600 rounded-t transition-all relative flex justify-center"
                    >
                      <span className="absolute -top-6 text-[10px] font-mono text-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-1 shadow-xs border border-slate-200 rounded">
                        ${d.rev}k
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-500">{d.month}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-3">
            <span>Average: 306 appointments/month</span>
            <span className="font-semibold text-teal-700">+22.4% patient retention index</span>
          </div>
        </div>

        {/* Department-wise Breakdown */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Department Patient Distribution</h3>
            <p className="text-xs text-slate-500 mb-4">Patient volume allocated across hospital wings</p>

            <div className="space-y-3">
              {deptDistribution.map((dept) => (
                <div key={dept.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">{dept.name}</span>
                    <span className="font-mono text-slate-500 tabular-nums">{dept.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${dept.color} rounded-full transition-all`}
                      style={{ width: `${dept.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">9 Active Specialization Units</span>
            <button
              onClick={() => setActiveTab('departments')}
              className="text-teal-700 font-semibold hover:underline cursor-pointer"
            >
              Manage Units &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Today's Live Hospital Appointments Schedule */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Today's Consultation Schedule</h3>
            <p className="text-xs text-slate-500">Real-time status of physician appointments</p>
          </div>
          <button
            onClick={() => setActiveTab('appointments')}
            className="text-xs font-semibold text-teal-700 hover:underline cursor-pointer"
          >
            View Complete Ledger &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                <th className="py-2.5 px-4">Time Slot</th>
                <th className="py-2.5 px-4">Patient Details</th>
                <th className="py-2.5 px-4">Physician / Specialist</th>
                <th className="py-2.5 px-4">Department</th>
                <th className="py-2.5 px-4">Reason / Notes</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.slice(0, 6).map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                    {apt.timeSlot}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{apt.patientName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{apt.patientPhone}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-slate-800">{apt.doctorName}</p>
                    <p className="text-[11px] text-slate-400">{apt.doctorSpecialization}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{apt.departmentName}</td>
                  <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{apt.reason}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        apt.status === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : apt.status === 'Completed'
                          ? 'bg-slate-100 text-slate-700'
                          : apt.status === 'Cancelled'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                    {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                      <>
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                          className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment & Patient Modals */}
      <NewAppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
      />
      <AddPatientModal
        isOpen={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
      />
    </div>
  );
};
