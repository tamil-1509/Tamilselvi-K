import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Patient } from '../../types';
import {
  Users,
  Search,
  UserPlus,
  Trash2,
  Edit,
  Activity,
  BedDouble,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { AddPatientModal } from '../common/AddPatientModal';
import { VitalsModal } from '../common/VitalsModal';
import { Modal } from '../common/Modal';

export const PatientsView: React.FC = () => {
  const {
    patients,
    deletePatient,
    dischargePatient,
    currentRole,
    medicalRecords,
    beds,
    admitPatient,
    setActiveTab,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Vitals recording modal
  const [vitalsPatient, setVitalsPatient] = useState<Patient | null>(null);

  // Admit modal
  const [admitPatientTarget, setAdmitPatientTarget] = useState<Patient | null>(null);
  const [selectedBedId, setSelectedBedId] = useState('');
  const availableBeds = beds.filter((b) => b.status === 'Available');

  // Medical Record View Modal
  const [recordsPatient, setRecordsPatient] = useState<Patient | null>(null);

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || p.admissionStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleConfirmAdmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!admitPatientTarget || !selectedBedId) return;
    admitPatient(admitPatientTarget.id, selectedBedId);
    setAdmitPatientTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Patient Registry & Medical Admissions</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Electronic Medical Record (EMR) index, clinical admission status, and vital sign history
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Register New Patient
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone number, or ID..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 text-xs">
          {['All', 'Admitted', 'Outpatient', 'Discharged'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Patient Name & ID</th>
                <th className="py-3 px-4">Demographics</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Allergies & Alerts</th>
                <th className="py-3 px-4">Ward / Admission</th>
                <th className="py-3 px-4 text-right">Clinical Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map((pat) => (
                <tr key={pat.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{pat.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{pat.id}</p>
                  </td>

                  <td className="py-3 px-4">
                    <p className="text-slate-800">{pat.age}y · {pat.gender}</p>
                    <p className="text-[11px] text-slate-500 font-mono">Blood: {pat.bloodGroup}</p>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-600">
                    <p>{pat.phone}</p>
                    <p className="text-[11px] text-slate-400">{pat.emergencyContact}</p>
                  </td>

                  <td className="py-3 px-4">
                    {pat.allergies && pat.allergies.length > 0 ? (
                      <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {pat.allergies.join(', ')}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">None documented</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        pat.admissionStatus === 'Admitted'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {pat.admissionStatus}
                    </span>
                    {pat.assignedRoomNumber && (
                      <p className="text-[11px] font-mono text-slate-600 mt-0.5">
                        {pat.assignedRoomNumber}
                      </p>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => setRecordsPatient(pat)}
                      className="px-2.5 py-1 border border-slate-200 hover:bg-slate-50 rounded text-slate-700 text-[11px] font-medium cursor-pointer"
                    >
                      Records
                    </button>

                    <button
                      onClick={() => setVitalsPatient(pat)}
                      className="px-2.5 py-1 bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 rounded text-[11px] font-semibold cursor-pointer"
                    >
                      Vitals
                    </button>

                    {pat.admissionStatus === 'Admitted' ? (
                      <button
                        onClick={() => dischargePatient(pat.id)}
                        className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 rounded text-[11px] font-semibold cursor-pointer"
                      >
                        Discharge
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setAdmitPatientTarget(pat);
                          if (availableBeds.length > 0) setSelectedBedId(availableBeds[0].id);
                        }}
                        className="px-2.5 py-1 bg-slate-900 text-white hover:bg-slate-800 rounded text-[11px] font-semibold cursor-pointer"
                      >
                        Admit Bed
                      </button>
                    )}

                    {currentRole === 'admin' && (
                      <button
                        onClick={() => deletePatient(pat.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Delete patient"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bed Admission Dialog */}
      <Modal
        isOpen={!!admitPatientTarget}
        onClose={() => setAdmitPatientTarget(null)}
        title="Admit Patient to Hospital Room"
        subtitle={`Select available bed for ${admitPatientTarget?.name}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleConfirmAdmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Available Hospital Bed</label>
            {availableBeds.length === 0 ? (
              <p className="text-xs text-rose-600">No beds available. Please check bed management.</p>
            ) : (
              <select
                value={selectedBedId}
                onChange={(e) => setSelectedBedId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                required
              >
                {availableBeds.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.roomNumber} ({b.wardType} - ${b.dailyRate}/day)
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setAdmitPatientTarget(null)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={availableBeds.length === 0}
              className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
            >
              Confirm Admission
            </button>
          </div>
        </form>
      </Modal>

      {/* Patient Records Quick Inspector Modal */}
      <Modal
        isOpen={!!recordsPatient}
        onClose={() => setRecordsPatient(null)}
        title={`Medical Records · ${recordsPatient?.name}`}
        subtitle={`Clinical Consultations, Symptoms, & Treatments`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4 text-xs">
          {medicalRecords.filter((r) => r.patientId === recordsPatient?.id).length === 0 ? (
            <p className="text-slate-400 italic py-6 text-center">No previous clinical records found for this patient.</p>
          ) : (
            medicalRecords
              .filter((r) => r.patientId === recordsPatient?.id)
              .map((rec) => (
                <div key={rec.id} className="p-3.5 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{rec.diagnosis}</span>
                    <span className="text-[10px] font-mono text-slate-400">{rec.date} · {rec.doctorName}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rec.doctorNotes}</p>
                  <p className="text-teal-700 text-[11px] font-medium">Care Plan: {rec.treatmentPlan}</p>
                </div>
              ))
          )}
        </div>
      </Modal>

      <AddPatientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <VitalsModal
        isOpen={!!vitalsPatient}
        onClose={() => setVitalsPatient(null)}
        preselectedPatient={vitalsPatient}
      />
    </div>
  );
};
