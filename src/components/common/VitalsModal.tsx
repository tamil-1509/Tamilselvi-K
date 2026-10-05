import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Modal } from './Modal';
import { Patient } from '../../types';
import { Activity, Heart, Thermometer, Wind, CheckCircle2 } from 'lucide-react';

interface VitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPatient?: Patient | null;
}

export const VitalsModal: React.FC<VitalsModalProps> = ({
  isOpen,
  onClose,
  preselectedPatient,
}) => {
  const { patients, addPatientVitals } = useHospital();

  const [patientId, setPatientId] = useState<string>(
    preselectedPatient?.id || (patients[0]?.id || '')
  );
  const [bloodPressure, setBloodPressure] = useState('120/80');
  const [pulseRate, setPulseRate] = useState<number>(75);
  const [temperature, setTemperature] = useState<number>(98.6);
  const [spO2, setSpO2] = useState<number>(99);
  const [respiratoryRate, setRespiratoryRate] = useState<number>(16);
  const [notes, setNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const targetPatient = patients.find((p) => p.id === patientId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return;

    addPatientVitals(patientId, {
      bloodPressure,
      pulseRate: Number(pulseRate),
      temperature: Number(temperature),
      spO2: Number(spO2),
      respiratoryRate: Number(respiratoryRate),
      notes: notes.trim() || undefined,
    });

    setSuccessMsg('Patient vital signs successfully charted!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Patient Vital Signs"
      subtitle="Clinical telemetry & nurse observation charting"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Patient Selection */}
        <div>
          <label className="font-semibold text-slate-700 block mb-1">Select Inpatient / Outpatient</label>
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
            required
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.admissionStatus} {p.assignedRoomNumber ? `(${p.assignedRoomNumber})` : ''} · Age {p.age}
              </option>
            ))}
          </select>
        </div>

        {targetPatient && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500">Blood Group: </span>
              <span className="font-semibold text-slate-800 font-mono">{targetPatient.bloodGroup}</span>
            </div>
            <div>
              <span className="text-slate-500">Attending: </span>
              <span className="font-semibold text-slate-800">{targetPatient.assignedDoctorName || 'Triage Officer'}</span>
            </div>
            <div>
              <span className="text-slate-500">Ward: </span>
              <span className="font-semibold text-slate-800">{targetPatient.assignedRoomNumber || 'Outpatient'}</span>
            </div>
          </div>
        )}

        {/* Vitals Form Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 flex items-center gap-1 mb-1">
              <Activity className="w-3.5 h-3.5 text-rose-500" />
              Blood Pressure (mmHg)
            </label>
            <input
              type="text"
              value={bloodPressure}
              onChange={(e) => setBloodPressure(e.target.value)}
              placeholder="e.g. 120/80"
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 flex items-center gap-1 mb-1">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              Pulse Rate (bpm)
            </label>
            <input
              type="number"
              value={pulseRate}
              onChange={(e) => setPulseRate(Number(e.target.value))}
              placeholder="72"
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 flex items-center gap-1 mb-1">
              <Thermometer className="w-3.5 h-3.5 text-amber-500" />
              Temperature (°F)
            </label>
            <input
              type="number"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              placeholder="98.6"
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 flex items-center gap-1 mb-1">
              <Wind className="w-3.5 h-3.5 text-cyan-500" />
              Oxygen Saturation SpO2 (%)
            </label>
            <input
              type="number"
              value={spO2}
              onChange={(e) => setSpO2(Number(e.target.value))}
              placeholder="99"
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="font-semibold text-slate-700 block mb-1">
              Respiratory Rate (Breaths/min)
            </label>
            <input
              type="number"
              value={respiratoryRate}
              onChange={(e) => setRespiratoryRate(Number(e.target.value))}
              placeholder="16"
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Nursing Observations */}
        <div>
          <label className="font-semibold text-slate-700 block mb-1">Clinical Observations & Comments</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Patient resting quietly. Good peripheral perfusion, no dyspnea."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Save Vitals Log
          </button>
        </div>
      </form>
    </Modal>
  );
};
