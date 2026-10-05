import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  BedDouble,
  CheckCircle2,
  XCircle,
  Clock,
  Wrench,
  User,
  Activity,
  Plus,
  Filter,
} from 'lucide-react';
import { Bed, WardType, BedStatus } from '../../types';
import { Modal } from '../common/Modal';

export const BedManagementView: React.FC = () => {
  const {
    beds,
    patients,
    updateBedStatus,
    admitPatient,
    dischargePatient,
    currentRole,
  } = useHospital();

  const [wardFilter, setWardFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Admit modal state
  const [admitBedTarget, setAdmitBedTarget] = useState<Bed | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');

  const totalBeds = beds.length;
  const availableBeds = beds.filter((b) => b.status === 'Available').length;
  const occupiedBeds = beds.filter((b) => b.status === 'Occupied').length;
  const reservedBeds = beds.filter((b) => b.status === 'Reserved').length;
  const maintenanceBeds = beds.filter((b) => b.status === 'Maintenance').length;

  const filteredBeds = beds.filter((bed) => {
    const matchesWard = wardFilter === 'All' || bed.wardType === wardFilter;
    const matchesStatus = statusFilter === 'All' || bed.status === statusFilter;
    return matchesWard && matchesStatus;
  });

  const handleConfirmAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!admitBedTarget || !selectedPatientId) return;

    admitPatient(selectedPatientId, admitBedTarget.id);
    setAdmitBedTarget(null);
  };

  const getStatusColor = (status: BedStatus) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Occupied':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Reserved':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Maintenance':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Hospital Room & Bed Matrix</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time occupancy tracking for Intensive Care Units (ICU), General Wards, and Private Recovery Suites
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-lg">
            {availableBeds} / {totalBeds} Beds Ready
          </span>
        </div>
      </div>

      {/* 4 Occupancy Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Available Beds</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">{availableBeds}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Sanitized & ready</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Occupied Inpatients</span>
            <BedDouble className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-rose-700 mt-1 tabular-nums">{occupiedBeds}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Active clinical care</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Reserved / Pre-Op</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-700 mt-1 tabular-nums">{reservedBeds}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Scheduled arrivals</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Maintenance & Turnover</span>
            <Wrench className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-700 mt-1 tabular-nums">{maintenanceBeds}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Sterilization protocol</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Ward:</span>
            {['All', 'ICU', 'General Ward', 'Private Suite', 'Emergency Care'].map((w) => (
              <button
                key={w}
                onClick={() => setWardFilter(w)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  wardFilter === w ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {w}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            {['All', 'Available', 'Occupied', 'Reserved', 'Maintenance'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  statusFilter === st ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bed Cards Visual Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBeds.map((bed) => (
          <div
            key={bed.id}
            className={`border rounded-xl p-4 transition-all shadow-2xs flex flex-col justify-between space-y-3 bg-white ${
              bed.status === 'Occupied'
                ? 'border-rose-200/80 ring-1 ring-rose-200'
                : bed.status === 'Available'
                ? 'border-emerald-200/80 ring-1 ring-emerald-200'
                : 'border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-base font-bold text-slate-900 font-mono">{bed.roomNumber}</span>
                  <p className="text-[11px] text-slate-500">{bed.bedNumber} · {bed.wardType}</p>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${getStatusColor(bed.status)}`}>
                  {bed.status}
                </span>
              </div>

              <div className="mt-3 p-2.5 bg-slate-50 rounded-lg text-xs border border-slate-100 space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Location:</span>
                  <span className="font-medium text-slate-800">{bed.floor}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Daily Rate:</span>
                  <span className="font-mono font-semibold text-slate-900">${bed.dailyRate}/day</span>
                </div>

                {bed.assignedPatientName && (
                  <div className="pt-1.5 border-t border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Occupant</span>
                    <p className="font-bold text-slate-900 mt-0.5">{bed.assignedPatientName}</p>
                    {bed.admittedDate && (
                      <p className="text-[10px] text-slate-500 font-mono">Admitted: {bed.admittedDate}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              {bed.status === 'Available' ? (
                <button
                  onClick={() => setAdmitBedTarget(bed)}
                  className="w-full py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer text-center"
                >
                  Admit Patient
                </button>
              ) : bed.status === 'Occupied' ? (
                <button
                  onClick={() => {
                    if (bed.assignedPatientId) dischargePatient(bed.assignedPatientId, bed.id);
                    else updateBedStatus(bed.id, 'Available');
                  }}
                  className="w-full py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg font-semibold transition-colors cursor-pointer text-center"
                >
                  Discharge & Clean
                </button>
              ) : (
                <button
                  onClick={() => updateBedStatus(bed.id, 'Available')}
                  className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold transition-colors cursor-pointer text-center"
                >
                  Mark as Available
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bed Admission Modal */}
      <Modal
        isOpen={!!admitBedTarget}
        onClose={() => setAdmitBedTarget(null)}
        title="Inpatient Bed Admission"
        subtitle={`Assign ${admitBedTarget?.roomNumber} (${admitBedTarget?.wardType})`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleConfirmAdmission} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Select Patient to Admit</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              required
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.phone} ({p.admissionStatus})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-slate-50 border rounded-lg text-xs space-y-1">
            <p><strong>Room:</strong> {admitBedTarget?.roomNumber} ({admitBedTarget?.floor})</p>
            <p><strong>Ward Category:</strong> {admitBedTarget?.wardType}</p>
            <p><strong>Daily Accommodation Rate:</strong> ${admitBedTarget?.dailyRate}/day</p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={() => setAdmitBedTarget(null)}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
            >
              Confirm Room Admission
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
