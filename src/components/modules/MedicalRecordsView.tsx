import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  FileText,
  Search,
  Plus,
  Stethoscope,
  Pill,
  FlaskConical,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const MedicalRecordsView: React.FC = () => {
  const {
    medicalRecords,
    patients,
    currentRole,
    currentUser,
    prescriptions,
    labTests,
    addMedicalRecord,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Record state
  const [newPatientId, setNewPatientId] = useState(patients[0]?.id || '');
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');

  // Role filtering
  let roleRecords = medicalRecords;
  if (currentRole === 'patient') {
    roleRecords = medicalRecords.filter((r) => r.patientId === currentUser?.id);
  }

  const filteredRecords = roleRecords.filter((rec) => {
    const matchesSearch =
      rec.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.doctorNotes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.treatmentPlan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPatient = selectedPatientId === 'All' || rec.patientId === selectedPatientId;

    return matchesSearch && matchesPatient;
  });

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === newPatientId);
    if (!pat) return;

    addMedicalRecord({
      patientId: pat.id,
      patientName: pat.name,
      doctorId: currentUser?.id || 'doc-elena',
      doctorName: currentUser?.name || 'Dr. Elena Rostova',
      date: new Date().toISOString().split('T')[0],
      symptoms: symptoms.split(',').map((s) => s.trim()).filter(Boolean),
      diagnosis: diagnosis.trim(),
      treatmentPlan: treatmentPlan.trim(),
      doctorNotes: doctorNotes.trim(),
    });

    setShowAddModal(false);
    setDiagnosis('');
    setSymptoms('');
    setTreatmentPlan('');
    setDoctorNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Electronic Medical Records (EMR)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Clinical diagnoses, symptom charting, physician notes, and outpatient/inpatient treatment histories
          </p>
        </div>

        {currentRole !== 'patient' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Medical Record
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search diagnosis, clinical notes, patient..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        {currentRole !== 'patient' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Filter Patient:</span>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none"
            >
              <option value="All">All Patients</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Records Feed */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
            No medical records found.
          </div>
        ) : (
          filteredRecords.map((rec) => {
            const linkedRx = prescriptions.find((p) => p.id === rec.prescriptionId);
            const linkedLabs = labTests.filter((l) => rec.labTestIds?.includes(l.id));

            return (
              <div
                key={rec.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-base text-slate-900">{rec.diagnosis}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                        Verified Clinical Entry
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Patient: <strong className="text-slate-800">{rec.patientName}</strong> · Attending: <strong className="text-slate-800">{rec.doctorName}</strong>
                    </p>
                  </div>

                  <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 self-start sm:self-auto">
                    {rec.date}
                  </span>
                </div>

                {/* Symptoms & Treatment Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-800 block text-[11px] uppercase tracking-wider">
                      Reported Symptoms & History
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {rec.symptoms.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-800 block text-[11px] uppercase tracking-wider">
                      Care & Treatment Plan
                    </span>
                    <p className="text-slate-700 leading-relaxed">{rec.treatmentPlan}</p>
                  </div>
                </div>

                {/* Doctor Clinical Notes */}
                <div className="p-3 bg-teal-50/40 rounded-lg border border-teal-100 text-xs">
                  <span className="font-semibold text-teal-900 block mb-1">Physician Exam & Progress Notes:</span>
                  <p className="text-slate-700 leading-relaxed">{rec.doctorNotes}</p>
                </div>

                {/* Linked Rx or Lab Chips */}
                {(linkedRx || linkedLabs.length > 0) && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                    {linkedRx && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 text-sky-800 border border-sky-200 font-medium">
                        <Pill className="w-3.5 h-3.5" />
                        Linked Rx: {linkedRx.items.map((i) => i.medicineName).join(', ')}
                      </span>
                    )}

                    {linkedLabs.map((l) => (
                      <span
                        key={l.id}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 font-medium"
                      >
                        <FlaskConical className="w-3.5 h-3.5" />
                        Diagnostic: {l.testName} ({l.status})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Medical Record Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create Electronic Medical Record"
        subtitle="Clinical progress notes & diagnostic documentation"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateRecord} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Select Patient</label>
            <select
              value={newPatientId}
              onChange={(e) => setNewPatientId(e.target.value)}
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

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Clinical Diagnosis</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Essential Hypertension / Type 2 Diabetes Mellitus"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Symptoms (comma separated)</label>
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Headache, dizziness, fatigue"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Treatment Plan</label>
            <textarea
              rows={2}
              value={treatmentPlan}
              onChange={(e) => setTreatmentPlan(e.target.value)}
              placeholder="Prescribed oral therapy, dietary restrictions..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Doctor Exam & Progress Notes</label>
            <textarea
              rows={3}
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder="Detailed findings from physical examination..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
            >
              Save Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
