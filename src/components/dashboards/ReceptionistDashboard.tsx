import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Users,
  UserPlus,
  CalendarCheck,
  Search,
  CheckCircle,
  XCircle,
  Building2,
  Clock,
  CreditCard,
  BedDouble,
  LogOut,
  LogIn,
} from 'lucide-react';
import { AddPatientModal } from '../common/AddPatientModal';
import { NewAppointmentModal } from '../common/NewAppointmentModal';
import { InvoiceModal } from '../common/InvoiceModal';
import { Modal } from '../common/Modal';
import { Patient, Bill } from '../../types';

export const ReceptionistDashboard: React.FC = () => {
  const {
    patients,
    doctors,
    appointments,
    beds,
    admitPatient,
    dischargePatient,
    generateBill,
    updateAppointmentStatus,
    updateDoctor,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showBookApt, setShowBookApt] = useState(false);

  // Admission Modal
  const [admissionModalOpen, setAdmissionModalOpen] = useState(false);
  const [selectedPatientForAdmit, setSelectedPatientForAdmit] = useState<Patient | null>(null);
  const [selectedBedId, setSelectedBedId] = useState<string>('');
  const [admitReason, setAdmitReason] = useState<string>('');

  // Bill Generation Modal
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [billPatient, setBillPatient] = useState<Patient | null>(null);
  const [consultFee, setConsultFee] = useState<number>(120);
  const [labFee, setLabFee] = useState<number>(0);
  const [pharmFee, setPharmFee] = useState<number>(0);
  const [roomFee, setRoomFee] = useState<number>(0);
  const [otherFee, setOtherFee] = useState<number>(25);
  const [billDiscount, setBillDiscount] = useState<number>(0);
  const [paidNow, setPaidNow] = useState<number>(0);
  const [createdBill, setCreatedBill] = useState<Bill | null>(null);

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableBeds = beds.filter((b) => b.status === 'Available');

  const handleOpenAdmit = (patient: Patient) => {
    setSelectedPatientForAdmit(patient);
    if (availableBeds.length > 0) setSelectedBedId(availableBeds[0].id);
    setAdmissionModalOpen(true);
  };

  const handleConfirmAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientForAdmit || !selectedBedId) return;

    admitPatient(selectedPatientForAdmit.id, selectedBedId, admitReason);
    setAdmissionModalOpen(false);
  };

  const handleOpenBillGen = (patient: Patient) => {
    setBillPatient(patient);
    setConsultFee(120);
    setLabFee(0);
    setPharmFee(0);
    setRoomFee(patient.admissionStatus === 'Admitted' ? 440 : 0);
    setOtherFee(25);
    setBillDiscount(0);
    setPaidNow(0);
    setBillModalOpen(true);
  };

  const handleGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billPatient) return;

    const total = consultFee + labFee + pharmFee + roomFee + otherFee - billDiscount;

    const items = [
      { id: 'bi-c', description: 'Consultation & Registration Assessment', category: 'Consultation' as const, amount: consultFee },
      ...(labFee > 0 ? [{ id: 'bi-l', description: 'Clinical Diagnostics & Laboratory', category: 'Laboratory' as const, amount: labFee }] : []),
      ...(pharmFee > 0 ? [{ id: 'bi-p', description: 'Pharmacy & Dispensed Medications', category: 'Pharmacy' as const, amount: pharmFee }] : []),
      ...(roomFee > 0 ? [{ id: 'bi-r', description: 'Ward Accommodations & Room Stay', category: 'Room & Bed' as const, amount: roomFee }] : []),
      ...(otherFee > 0 ? [{ id: 'bi-o', description: 'Nursing & Administrative Charges', category: 'Nursing & Service' as const, amount: otherFee }] : []),
    ];

    const newBill = generateBill({
      patientId: billPatient.id,
      patientName: billPatient.name,
      patientPhone: billPatient.phone,
      patientAddress: billPatient.address,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      consultationFee: consultFee,
      laboratoryCharges: labFee,
      medicineCharges: pharmFee,
      roomCharges: roomFee,
      otherCharges: otherFee,
      discount: billDiscount,
      totalAmount: total,
      paidAmount: paidNow,
      items,
    });

    setBillModalOpen(false);
    setCreatedBill(newBill);
  };

  return (
    <div className="space-y-6">
      {/* Reception Desk Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Patient Reception & Registration Desk</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Admit patients, check in doctor appointments, schedule consultations, and generate hospital invoices
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddPatient(true)}
            className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            New Patient Register
          </button>
          <button
            onClick={() => setShowBookApt(true)}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            Book Consultation
          </button>
        </div>
      </div>

      {/* Doctor Availability Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-teal-600" />
          Doctor Duty Status & Live Rooms
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1.5 text-xs"
            >
              <div className="flex items-start justify-between">
                <span className="font-bold text-slate-800 leading-tight">{doc.name}</span>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    doc.status === 'Available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : doc.status === 'In Consultation'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {doc.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{doc.departmentName} · {doc.roomNumber}</p>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-slate-400 font-mono">{doc.availableHours}</span>
                <select
                  value={doc.status}
                  onChange={(e) => updateDoctor(doc.id, { status: e.target.value as any })}
                  className="text-[10px] bg-white border border-slate-300 rounded px-1 py-0.5 cursor-pointer"
                >
                  <option value="Available">Available</option>
                  <option value="In Consultation">In Consultation</option>
                  <option value="Off Duty">Off Duty</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patient Search & Triage Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Hospital Patient Directory & Admissions</h3>
            <p className="text-xs text-slate-500">Live patient directory with instant bed admission and billing actions</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, or ID..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-2.5 px-4">Patient Info</th>
                <th className="py-2.5 px-4">Demographics</th>
                <th className="py-2.5 px-4">Contact</th>
                <th className="py-2.5 px-4">Status / Bed</th>
                <th className="py-2.5 px-4 text-right">Desk Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{p.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">ID: {p.id}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-slate-800">{p.age} years · {p.gender}</p>
                    <p className="text-[11px] text-slate-500 font-mono">Blood: {p.bloodGroup}</p>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    <p>{p.phone}</p>
                    <p className="text-[11px] text-slate-400">{p.emergencyContact}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-0.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          p.admissionStatus === 'Admitted'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {p.admissionStatus}
                      </span>
                      {p.assignedRoomNumber && (
                        <p className="text-[11px] font-mono text-slate-600">
                          {p.assignedRoomNumber}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                    {p.admissionStatus === 'Admitted' ? (
                      <button
                        onClick={() => dischargePatient(p.id)}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Discharge
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenAdmit(p)}
                        className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Admit Bed
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenBillGen(p)}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      Generate Bill
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bed Admission Modal */}
      <Modal
        isOpen={admissionModalOpen}
        onClose={() => setAdmissionModalOpen(false)}
        title="Admit Patient to Hospital Ward"
        subtitle={`Assign bed and inpatient care for ${selectedPatientForAdmit?.name}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleConfirmAdmission} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Available Hospital Beds</label>
            {availableBeds.length === 0 ? (
              <p className="text-xs text-rose-600">No beds currently available. Check bed management.</p>
            ) : (
              <select
                value={selectedBedId}
                onChange={(e) => setSelectedBedId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none font-mono"
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

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Admission Reason / Clinical Referral</label>
            <textarea
              rows={2}
              value={admitReason}
              onChange={(e) => setAdmitReason(e.target.value)}
              placeholder="e.g. Scheduled for orthopedic surgery; observation required..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setAdmissionModalOpen(false)}
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

      {/* Bill Generation Modal */}
      <Modal
        isOpen={billModalOpen}
        onClose={() => setBillModalOpen(false)}
        title="Generate Official Hospital Invoice"
        subtitle={`Billing calculation for ${billPatient?.name}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleGenerateInvoice} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Consultation Fee ($)</label>
              <input
                type="number"
                value={consultFee}
                onChange={(e) => setConsultFee(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Laboratory Diagnostics ($)</label>
              <input
                type="number"
                value={labFee}
                onChange={(e) => setLabFee(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Pharmacy & Meds ($)</label>
              <input
                type="number"
                value={pharmFee}
                onChange={(e) => setPharmFee(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Room / Bed Charges ($)</label>
              <input
                type="number"
                value={roomFee}
                onChange={(e) => setRoomFee(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nursing & Supplies ($)</label>
              <input
                type="number"
                value={otherFee}
                onChange={(e) => setOtherFee(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Hospital Discount ($)</label>
              <input
                type="number"
                value={billDiscount}
                onChange={(e) => setBillDiscount(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono text-emerald-700"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between font-bold text-slate-900 text-sm">
            <span>Total Billable:</span>
            <span className="font-mono text-teal-800">
              ${(consultFee + labFee + pharmFee + roomFee + otherFee - billDiscount).toFixed(2)}
            </span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Amount Paid at Desk ($)</label>
            <input
              type="number"
              value={paidNow}
              onChange={(e) => setPaidNow(Number(e.target.value))}
              placeholder="0.00"
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setBillModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
            >
              Generate Digital Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Digital Printable Invoice Modal if created */}
      <InvoiceModal
        bill={createdBill}
        isOpen={!!createdBill}
        onClose={() => setCreatedBill(null)}
      />

      <AddPatientModal
        isOpen={showAddPatient}
        onClose={() => setShowAddPatient(false)}
      />
      <NewAppointmentModal
        isOpen={showBookApt}
        onClose={() => setShowBookApt(false)}
      />
    </div>
  );
};
