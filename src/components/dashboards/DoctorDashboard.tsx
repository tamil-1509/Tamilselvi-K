import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Appointment, Patient } from '../../types';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Pill,
  FileText,
  Activity,
  CheckCircle,
  XCircle,
  Plus,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { PrescriptionModal } from '../common/PrescriptionModal';
import { Modal } from '../common/Modal';

export const DoctorDashboard: React.FC = () => {
  const {
    currentDoctor,
    currentUser,
    appointments,
    patients,
    medicalRecords,
    labTests,
    prescriptions,
    updateAppointmentStatus,
    addMedicalRecord,
    orderLabTest,
  } = useHospital();

  const docId = currentDoctor?.id || currentUser?.id || 'doc-elena';
  const doctorName = currentDoctor?.name || 'Dr. Elena Rostova';

  // Filter doctor's appointments
  const myAppointments = appointments.filter((a) => a.doctorId === docId);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = myAppointments.filter((a) => a.date === todayStr);

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedPatientForRx, setSelectedPatientForRx] = useState<Patient | null>(null);

  // Clinical Notes & Diagnosis Modal
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [consultPatient, setConsultPatient] = useState<Patient | null>(null);
  const [consultDiagnosis, setConsultDiagnosis] = useState('');
  const [consultNotes, setConsultNotes] = useState('');
  const [consultSymptoms, setConsultSymptoms] = useState('');
  const [consultTreatmentPlan, setConsultTreatmentPlan] = useState('');
  const [orderLabName, setOrderLabName] = useState('');

  // Patient History Inspector Modal
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyPatient, setHistoryPatient] = useState<Patient | null>(null);

  const handleOpenConsult = (apt: Appointment) => {
    const patientObj = patients.find((p) => p.id === apt.patientId) || null;
    setSelectedAppointment(apt);
    setConsultPatient(patientObj);
    setConsultDiagnosis(apt.diagnosisSummary || '');
    setConsultNotes(apt.notes || '');
    setConsultSymptoms(apt.reason || '');
    setConsultTreatmentPlan('');
    setConsultModalOpen(true);
  };

  const handleOpenHistory = (patientId: string) => {
    const patientObj = patients.find((p) => p.id === patientId) || null;
    setHistoryPatient(patientObj);
    setHistoryModalOpen(true);
  };

  const handleSaveConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultPatient) return;

    if (consultDiagnosis.trim()) {
      addMedicalRecord({
        patientId: consultPatient.id,
        patientName: consultPatient.name,
        doctorId: docId,
        doctorName: doctorName,
        date: new Date().toISOString().split('T')[0],
        symptoms: consultSymptoms.split(',').map((s) => s.trim()).filter(Boolean),
        diagnosis: consultDiagnosis.trim(),
        treatmentPlan: consultTreatmentPlan.trim() || 'Prescribed outpatient regimen and follow-up as directed.',
        doctorNotes: consultNotes.trim() || 'Consultation concluded satisfactorily.',
      });
    }

    if (orderLabName.trim()) {
      orderLabTest({
        testName: orderLabName.trim(),
        category: 'Biochemistry',
        patientId: consultPatient.id,
        patientName: consultPatient.name,
        doctorId: docId,
        doctorName: doctorName,
        orderedDate: new Date().toISOString().split('T')[0],
        cost: 95,
        summary: `Diagnostic evaluation ordered during consultation.`,
      });
    }

    if (selectedAppointment) {
      updateAppointmentStatus(
        selectedAppointment.id,
        'Completed',
        consultNotes.trim(),
        consultDiagnosis.trim()
      );
    }

    setConsultModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Doctor Welcome & Status Banner */}
      <div className="p-5 bg-gradient-to-r from-teal-900 to-slate-900 rounded-xl text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">{doctorName}</h1>
            <span className="px-2 py-0.5 bg-teal-500/30 text-teal-200 border border-teal-400/40 rounded text-[11px] font-medium">
              {currentDoctor?.status || 'Active On Duty'}
            </span>
          </div>
          <p className="text-xs text-teal-100">
            {currentDoctor?.specialization} · {currentDoctor?.departmentName} · Room: {currentDoctor?.roomNumber}
          </p>
          <p className="text-[11px] text-slate-300">
            Clinical Schedule: {currentDoctor?.availableDays.join(', ')} ({currentDoctor?.availableHours})
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 p-3 rounded-lg backdrop-blur-xs text-xs">
          <div>
            <span className="text-[10px] text-slate-300 block uppercase font-medium">Today's Queue</span>
            <span className="text-lg font-bold font-mono tabular-nums">{todayAppointments.length} Patients</span>
          </div>
          <div className="border-l border-white/20 pl-4">
            <span className="text-[10px] text-slate-300 block uppercase font-medium">Total Consulted</span>
            <span className="text-lg font-bold font-mono tabular-nums">
              {myAppointments.filter((a) => a.status === 'Completed').length + 84}
            </span>
          </div>
        </div>
      </div>

      {/* Today's Appointments Section */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Today's Clinical Roster ({todayStr})</h2>
            <p className="text-xs text-slate-500">Scheduled outpatient visits & triage consultations</p>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-white px-2.5 py-1 border border-slate-200 rounded">
            {todayAppointments.length} Active Slots
          </span>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No consultations scheduled for today. Check upcoming appointments below.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {todayAppointments.map((apt) => {
              const patientObj = patients.find((p) => p.id === apt.patientId);

              return (
                <div key={apt.id} className="p-4 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-lg bg-teal-50 border border-teal-200 flex flex-col items-center justify-center text-teal-800 shrink-0">
                      <Clock className="w-3.5 h-3.5 mb-0.5 text-teal-600" />
                      <span className="font-mono text-[10px] font-bold leading-none">{apt.timeSlot}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{apt.patientName}</span>
                        <span className="text-xs text-slate-400 font-mono">
                          {apt.patientAge}y · {apt.patientGender} · {patientObj?.bloodGroup || 'Blood on file'}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            apt.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : apt.status === 'Completed'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium">Chief Complaint: {apt.reason}</p>

                      {patientObj?.allergies && patientObj.allergies.length > 0 && (
                        <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                          <AlertTriangle className="w-3 h-3" /> Allergies: {patientObj.allergies.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions for this appointment */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => handleOpenHistory(apt.patientId)}
                      className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
                      title="View past medical records & labs"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      History
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPatientForRx(patientObj || null);
                        setShowPrescriptionModal(true);
                      }}
                      className="px-2.5 py-1.5 border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Pill className="w-3.5 h-3.5 text-teal-600" />
                      Issue Rx
                    </button>

                    <button
                      onClick={() => handleOpenConsult(apt)}
                      className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      Consult & Diagnose
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Consultation & Diagnosis Modal */}
      <Modal
        isOpen={consultModalOpen}
        onClose={() => setConsultModalOpen(false)}
        title={`Clinical Consultation · ${consultPatient?.name}`}
        subtitle={`Scheduled: ${selectedAppointment?.timeSlot} · Type: ${selectedAppointment?.type}`}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveConsultation} className="space-y-4 text-xs">
          {/* Patient Quick Glance */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <span className="text-slate-400 block text-[10px]">PATIENT NAME</span>
              <span className="font-semibold text-slate-900">{consultPatient?.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">AGE / GENDER</span>
              <span className="font-semibold text-slate-900">{consultPatient?.age}y / {consultPatient?.gender}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">BLOOD GROUP</span>
              <span className="font-mono font-semibold text-slate-900">{consultPatient?.bloodGroup}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">ALLERGIES</span>
              <span className="font-semibold text-rose-700">{consultPatient?.allergies?.join(', ') || 'None'}</span>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Reported Symptoms</label>
            <input
              type="text"
              value={consultSymptoms}
              onChange={(e) => setConsultSymptoms(e.target.value)}
              placeholder="e.g. Sharp chest pain on exertion, shortness of breath, dizziness"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Clinical Diagnosis</label>
            <input
              type="text"
              value={consultDiagnosis}
              onChange={(e) => setConsultDiagnosis(e.target.value)}
              placeholder="e.g. Non-ST Elevation Angina / Acute Respiratory Infection"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Physician Clinical Notes</label>
            <textarea
              rows={3}
              value={consultNotes}
              onChange={(e) => setConsultNotes(e.target.value)}
              placeholder="Detailed physical exam observations, auscultation findings, neurological reflexes..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Treatment Plan / Orders</label>
              <input
                type="text"
                value={consultTreatmentPlan}
                onChange={(e) => setConsultTreatmentPlan(e.target.value)}
                placeholder="Bed rest, outpatient therapy, low sodium intake"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Order Diagnostic Lab Test (Optional)</label>
              <input
                type="text"
                value={orderLabName}
                onChange={(e) => setOrderLabName(e.target.value)}
                placeholder="e.g. Serum Electrolytes, Cardiac Troponin I"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setSelectedPatientForRx(consultPatient);
                setShowPrescriptionModal(true);
              }}
              className="px-3 py-1.5 border border-teal-300 bg-teal-50 text-teal-800 rounded-lg font-medium flex items-center gap-1 cursor-pointer"
            >
              <Pill className="w-3.5 h-3.5" />
              Attach Digital Prescription (Rx)
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setConsultModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
              >
                Complete & Sign Off
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Patient Medical History Inspector Modal */}
      <Modal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title={`Medical History · ${historyPatient?.name}`}
        subtitle={`Electronic Health Records & Diagnostic Findings`}
        maxWidth="max-w-3xl"
      >
        <div className="space-y-5 text-xs">
          {historyPatient && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <span className="text-slate-400 block text-[10px]">PATIENT ID</span>
                <span className="font-mono font-semibold text-slate-800">{historyPatient.id}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">STATUS</span>
                <span className="font-semibold text-slate-800">{historyPatient.admissionStatus}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">EMERGENCY CONTACT</span>
                <span className="text-slate-800">{historyPatient.emergencyContact}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">EMERGENCY PHONE</span>
                <span className="font-mono text-slate-800">{historyPatient.emergencyPhone}</span>
              </div>
            </div>
          )}

          {/* Vitals History */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              Recorded Vital Signs History
            </h4>
            {historyPatient?.vitalsHistory && historyPatient.vitalsHistory.length > 0 ? (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Date/Time</th>
                      <th className="py-2 px-3">BP (mmHg)</th>
                      <th className="py-2 px-3">Pulse</th>
                      <th className="py-2 px-3">Temp</th>
                      <th className="py-2 px-3">SpO2</th>
                      <th className="py-2 px-3">Nurse</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {historyPatient.vitalsHistory.map((v) => (
                      <tr key={v.id}>
                        <td className="py-2 px-3 font-mono text-slate-600">{v.recordedAt}</td>
                        <td className="py-2 px-3 font-mono font-medium text-slate-900">{v.bloodPressure}</td>
                        <td className="py-2 px-3 font-mono">{v.pulseRate} bpm</td>
                        <td className="py-2 px-3 font-mono">{v.temperature}°F</td>
                        <td className="py-2 px-3 font-mono text-emerald-700 font-semibold">{v.spO2}%</td>
                        <td className="py-2 px-3 text-slate-500">{v.recordedByNurseName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-400 italic">No historical vitals recorded yet.</p>
            )}
          </div>

          {/* Past Clinical Records */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-600" />
              Past Consultations & Diagnoses
            </h4>
            {medicalRecords.filter((r) => r.patientId === historyPatient?.id).length > 0 ? (
              <div className="space-y-2">
                {medicalRecords
                  .filter((r) => r.patientId === historyPatient?.id)
                  .map((rec) => (
                    <div key={rec.id} className="p-3 border border-slate-200 rounded-lg space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{rec.diagnosis}</span>
                        <span className="text-[10px] font-mono text-slate-400">{rec.date} · {rec.doctorName}</span>
                      </div>
                      <p className="text-slate-600 text-xs">{rec.doctorNotes}</p>
                      <p className="text-teal-700 text-[11px] font-medium">Plan: {rec.treatmentPlan}</p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-slate-400 italic">No past consultation records on file.</p>
            )}
          </div>
        </div>
      </Modal>

      {/* Prescription Modal */}
      <PrescriptionModal
        isOpen={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
        preselectedPatient={selectedPatientForRx}
      />
    </div>
  );
};
