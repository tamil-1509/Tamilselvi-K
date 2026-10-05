import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Activity,
  Heart,
  Thermometer,
  Wind,
  BedDouble,
  CheckCircle,
  FileText,
  AlertTriangle,
  Clock,
  User,
  Plus,
} from 'lucide-react';
import { VitalsModal } from '../common/VitalsModal';
import { Patient } from '../../types';

export const NurseDashboard: React.FC = () => {
  const {
    patients,
    beds,
    currentUser,
    prescriptions,
    addNotification,
  } = useHospital();

  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [selectedPatientForVitals, setSelectedPatientForVitals] = useState<Patient | null>(null);

  // Inpatients in hospital beds
  const inpatients = patients.filter((p) => p.admissionStatus === 'Admitted');
  const occupiedBeds = beds.filter((b) => b.status === 'Occupied');

  const handleRecordVitals = (patient: Patient) => {
    setSelectedPatientForVitals(patient);
    setShowVitalsModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Nurse Ward Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Clinical Nursing Station & Ward Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time inpatient monitoring, vital telemetry charting, physician care orders, and bed assignments
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedPatientForVitals(inpatients[0] || patients[0] || null);
            setShowVitalsModal(true);
          }}
          className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Activity className="w-3.5 h-3.5" />
          Chart Vital Signs
        </button>
      </div>

      {/* Ward Telemetry Stat Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Admitted Inpatients</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">{inpatients.length}</span>
            <span className="text-[10px] text-teal-600 font-medium">Under Monitoring</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">ICU & General Wards</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">ICU Bed Occupancy</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-rose-700 font-mono tabular-nums">
              {beds.filter((b) => b.wardType === 'ICU' && b.status === 'Occupied').length} / {beds.filter((b) => b.wardType === 'ICU').length}
            </span>
            <span className="text-[10px] text-rose-600 font-medium">Critical Unit</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Continuous telemetry</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Daily Vitals Charted</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
              {patients.reduce((acc, p) => acc + p.vitalsHistory.length, 0)}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">All Stable</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Next round: 12:00 PM</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Staff Nurse On Shift</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-base font-bold text-slate-800 truncate">
              {currentUser?.name || 'Nurse Clara Barton, RN'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Station 2 · Shift: 07:00 - 19:00</p>
        </div>
      </div>

      {/* Admitted Inpatients Roster with Quick Vital Readings */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Inpatient Ward Telemetry & Assigned Patients</h3>
            <p className="text-xs text-slate-500">Live bedside monitor readings, latest blood pressure, pulse, and physician care orders</p>
          </div>
          <span className="text-xs font-mono font-medium text-slate-600 bg-white px-2.5 py-1 border border-slate-200 rounded">
            {inpatients.length} Inpatients
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {inpatients.map((pat) => {
            const latestVital = pat.vitalsHistory[0];
            const assignedBed = beds.find((b) => b.id === pat.assignedBedId);
            const patRx = prescriptions.find((p) => p.patientId === pat.id);

            return (
              <div key={pat.id} className="p-4 hover:bg-slate-50/50 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                      {assignedBed?.roomNumber || 'BED'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{pat.name}</span>
                        <span className="text-xs text-slate-500 font-mono">
                          {pat.age}y · {pat.gender} · Blood: {pat.bloodGroup}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {assignedBed?.wardType || 'Ward'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Attending Physician: <strong className="text-slate-700">{pat.assignedDoctorName || 'Dr. Jonathan Hayes'}</strong> · Admitted: {pat.admissionDate || 'Recent'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRecordVitals(pat)}
                    className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors shrink-0 self-end sm:self-center cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    Record Vitals
                  </button>
                </div>

                {/* Latest Vitals Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-medium">BLOOD PRESSURE</span>
                    <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                      {latestVital ? latestVital.bloodPressure : '120/80'} <span className="text-[10px] font-normal text-slate-400">mmHg</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] font-medium">PULSE RATE</span>
                    <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                      {latestVital ? latestVital.pulseRate : 72} <span className="text-[10px] font-normal text-slate-400">bpm</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] font-medium">BODY TEMP</span>
                    <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                      {latestVital ? latestVital.temperature : 98.6} <span className="text-[10px] font-normal text-slate-400">°F</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] font-medium">SPO2 OXYGEN</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm mt-0.5 block">
                      {latestVital ? latestVital.spO2 : 99}%
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] font-medium">RESPIRATORY RATE</span>
                    <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                      {latestVital ? latestVital.respiratoryRate : 16} <span className="text-[10px] font-normal text-slate-400">/min</span>
                    </span>
                  </div>
                </div>

                {/* Doctor Care Instructions & Allergies */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 pt-1 text-slate-600">
                  <div className="flex items-center gap-1.5 truncate">
                    <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="truncate">
                      <strong>Physician Order:</strong> {patRx?.advice || 'Maintain current bed rest protocol and vitals telemetry every 4 hours.'}
                    </span>
                  </div>

                  {pat.allergies && pat.allergies.length > 0 && (
                    <span className="text-rose-700 font-semibold text-[11px] shrink-0 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Allergies: {pat.allergies.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <VitalsModal
        isOpen={showVitalsModal}
        onClose={() => setShowVitalsModal(false)}
        preselectedPatient={selectedPatientForVitals}
      />
    </div>
  );
};
