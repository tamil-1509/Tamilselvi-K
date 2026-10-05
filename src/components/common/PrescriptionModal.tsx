import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Modal } from './Modal';
import { PrescriptionItem, Patient } from '../../types';
import { Plus, Trash2, CheckCircle2, Pill } from 'lucide-react';

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPatient?: Patient | null;
  appointmentId?: string;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  isOpen,
  onClose,
  preselectedPatient,
  appointmentId,
}) => {
  const {
    currentUser,
    currentDoctor,
    patients,
    medicines,
    addPrescription,
  } = useHospital();

  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    preselectedPatient?.id || (patients[0]?.id || '')
  );
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [advice, setAdvice] = useState<string>('Rest adequately, stay well hydrated, and complete prescribed course.');
  const [followUpDate, setFollowUpDate] = useState<string>('');
  const [items, setItems] = useState<PrescriptionItem[]>([
    {
      id: 'item-1',
      medicineName: 'Amoxicillin & Clavulanate 625mg',
      dosage: '625mg',
      frequency: 'Twice daily after meals',
      duration: '5 days',
      instructions: 'Take with warm water after meals',
    },
  ]);
  const [successMsg, setSuccessMsg] = useState('');

  const doctorName = currentDoctor?.name || currentUser?.name || 'Dr. Elena Rostova';
  const doctorSpecialization = currentDoctor?.specialization || 'Attending Physician';
  const doctorId = currentDoctor?.id || currentUser?.id || 'doc-elena';

  const patient = patients.find((p) => p.id === selectedPatientId);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        medicineName: medicines[0]?.name || 'Paracetamol 500mg',
        dosage: '500mg',
        frequency: 'As needed',
        duration: '3 days',
        instructions: 'Take when in pain',
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof PrescriptionItem, val: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;
    if (!diagnosis.trim()) return;

    addPrescription({
      appointmentId,
      patientId: patient.id,
      patientName: patient.name,
      doctorId,
      doctorName,
      doctorSpecialization,
      date: new Date().toISOString().split('T')[0],
      diagnosis: diagnosis.trim(),
      advice: advice.trim(),
      followUpDate: followUpDate || undefined,
      items,
    });

    setSuccessMsg('Digital prescription issued and synced to patient records!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Digital Prescription (Rx)"
      subtitle={`Physician: ${doctorName} (${doctorSpecialization})`}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Patient Select */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Select Patient</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
              required
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.age}y, {p.gender} (ID: {p.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Known Allergies</label>
            <div className="text-xs text-rose-700 font-medium py-1.5 px-2 bg-rose-50 border border-rose-100 rounded-md">
              {patient?.allergies?.length ? patient.allergies.join(', ') : 'No known drug allergies on record'}
            </div>
          </div>
        </div>

        {/* Clinical Diagnosis */}
        <div>
          <label className="font-semibold text-slate-700 block mb-1">Primary Clinical Diagnosis</label>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="e.g. Acute Bronchitis with Mild Hypoxia / Essential Hypertension Grade 1"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
            required
          />
        </div>

        {/* Medications Table / Form */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-teal-600" />
              Prescribed Medications
            </h4>
            <button
              type="button"
              onClick={addItem}
              className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3 h-3" />
              Add Medicine
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="p-3 bg-white border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
              >
                <div className="sm:col-span-4">
                  <label className="text-[10px] text-slate-400 block mb-0.5">Medicine Name</label>
                  <input
                    type="text"
                    value={item.medicineName}
                    onChange={(e) => updateItem(item.id, 'medicineName', e.target.value)}
                    list="hospital-pharmacy-list"
                    className="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:border-teal-500"
                    placeholder="Search medicine or type..."
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] text-slate-400 block mb-0.5">Dosage</label>
                  <input
                    type="text"
                    value={item.dosage}
                    onChange={(e) => updateItem(item.id, 'dosage', e.target.value)}
                    className="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:border-teal-500 font-mono"
                    placeholder="e.g. 500mg"
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="text-[10px] text-slate-400 block mb-0.5">Frequency</label>
                  <input
                    type="text"
                    value={item.frequency}
                    onChange={(e) => updateItem(item.id, 'frequency', e.target.value)}
                    className="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:border-teal-500"
                    placeholder="e.g. Twice daily"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] text-slate-400 block mb-0.5">Duration</label>
                  <input
                    type="text"
                    value={item.duration}
                    onChange={(e) => updateItem(item.id, 'duration', e.target.value)}
                    className="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:border-teal-500"
                    placeholder="e.g. 7 days"
                    required
                  />
                </div>

                <div className="sm:col-span-1 flex justify-center pt-3 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length <= 1}
                    className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="sm:col-span-12">
                  <input
                    type="text"
                    value={item.instructions}
                    onChange={(e) => updateItem(item.id, 'instructions', e.target.value)}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 focus:outline-none"
                    placeholder="Specific clinical instructions: e.g. With warm milk / Take before bedtime"
                  />
                </div>
              </div>
            ))}
          </div>

          <datalist id="hospital-pharmacy-list">
            {medicines.map((m) => (
              <option key={m.id} value={m.name} />
            ))}
          </datalist>
        </div>

        {/* Clinical Advice & Follow-up */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Clinical Advice / Diet Instructions</label>
            <textarea
              rows={2}
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Follow-up Date (Optional)</label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
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
            Issue Prescription
          </button>
        </div>
      </form>
    </Modal>
  );
};
