import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Pill,
  Search,
  Plus,
  Printer,
  Calendar,
  User,
  Stethoscope,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { PrescriptionModal } from '../common/PrescriptionModal';
import { Modal } from '../common/Modal';
import { Prescription } from '../../types';

export const PrescriptionsView: React.FC = () => {
  const {
    prescriptions,
    currentUser,
    currentRole,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNewRxModal, setShowNewRxModal] = useState(false);
  const [selectedRxForPrint, setSelectedRxForPrint] = useState<Prescription | null>(null);

  // Filter based on role
  let roleRx = prescriptions;
  if (currentRole === 'patient') {
    roleRx = prescriptions.filter((p) => p.patientId === currentUser?.id);
  } else if (currentRole === 'doctor') {
    roleRx = prescriptions.filter((p) => p.doctorId === currentUser?.id);
  }

  const filteredRx = roleRx.filter(
    (p) =>
      p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.items.some((i) => i.medicineName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Electronic Prescriptions (e-Rx)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified digital pharmacy orders, medication frequencies, dosage guidelines, and patient advice
          </p>
        </div>

        {currentRole === 'doctor' && (
          <button
            onClick={() => setShowNewRxModal(true)}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Issue Digital Prescription
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient, medication name, or diagnosis..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Prescriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRx.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
            No electronic prescriptions found.
          </div>
        ) : (
          filteredRx.map((rx) => (
            <div
              key={rx.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{rx.patientName}</span>
                      <span className="text-[10px] font-mono text-slate-400">ID: {rx.id}</span>
                    </div>
                    <p className="text-xs text-teal-800 font-semibold mt-0.5">Dx: {rx.diagnosis}</p>
                    <p className="text-[11px] text-slate-500">
                      Physician: {rx.doctorName} ({rx.doctorSpecialization})
                    </p>
                  </div>

                  <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    {rx.date}
                  </span>
                </div>

                {/* Medication Items */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Prescribed Medications ({rx.items.length})
                  </span>

                  {rx.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{item.medicineName}</p>
                        <p className="text-[11px] text-slate-500">{item.instructions || 'As directed'}</p>
                      </div>

                      <div className="text-right font-mono text-xs">
                        <span className="font-bold text-teal-800">{item.dosage}</span>
                        <span className="text-[11px] text-slate-500 block">{item.frequency}</span>
                        <span className="text-[10px] text-slate-400 block">{item.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Advice & Follow-up */}
                {rx.advice && (
                  <p className="text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100 text-[11px] leading-relaxed">
                    <strong>Doctor Instructions:</strong> {rx.advice}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                {rx.followUpDate ? (
                  <span className="text-[11px] font-mono text-teal-700">
                    Follow-up: {rx.followUpDate}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">PRN / As needed</span>
                )}

                <button
                  onClick={() => setSelectedRxForPrint(rx)}
                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print e-Rx
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Print Prescription Preview Modal */}
      <Modal
        isOpen={!!selectedRxForPrint}
        onClose={() => setSelectedRxForPrint(null)}
        title="Official Digital Hospital Prescription"
        subtitle={`Rx Serial: ${selectedRxForPrint?.id}`}
        maxWidth="max-w-2xl"
      >
        {selectedRxForPrint && (
          <div className="space-y-6 text-xs print:p-0">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-teal-600 text-white font-black flex items-center justify-center text-lg">
                  +
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">PulseCare Medical Center</h3>
                  <p className="text-xs text-slate-500">Department of Electronic Health & Pharmacy</p>
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-500 font-mono">
                <p>Prescription ID: {selectedRxForPrint.id}</p>
                <p>Date: {selectedRxForPrint.date}</p>
              </div>
            </div>

            {/* Doctor & Patient Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px]">PRESCRIBING PHYSICIAN</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedRxForPrint.doctorName}</p>
                <p className="text-slate-600">{selectedRxForPrint.doctorSpecialization}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">PATIENT INFORMATION</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedRxForPrint.patientName}</p>
                <p className="text-slate-600">Diagnosis: {selectedRxForPrint.diagnosis}</p>
              </div>
            </div>

            {/* Medicines List */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b text-slate-600 font-semibold">
                  <tr>
                    <th className="p-3">Rx Item</th>
                    <th className="p-3">Dosage</th>
                    <th className="p-3">Frequency</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedRxForPrint.items.map((item) => (
                    <tr key={item.id}>
                      <td className="p-3 font-semibold text-slate-900">{item.medicineName}</td>
                      <td className="p-3 font-mono">{item.dosage}</td>
                      <td className="p-3">{item.frequency}</td>
                      <td className="p-3 font-mono">{item.duration}</td>
                      <td className="p-3 text-slate-600">{item.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedRxForPrint.advice && (
              <div className="p-3 bg-slate-50 rounded border">
                <span className="font-semibold block mb-1">Clinical Advice:</span>
                <p className="text-slate-700">{selectedRxForPrint.advice}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-[11px] text-slate-400">
                Electronically signed by {selectedRxForPrint.doctorName}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setSelectedRxForPrint(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <PrescriptionModal
        isOpen={showNewRxModal}
        onClose={() => setShowNewRxModal(false)}
      />
    </div>
  );
};
