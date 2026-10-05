import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  CreditCard,
  Search,
  Plus,
  FileText,
  DollarSign,
  Printer,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { InvoiceModal } from '../common/InvoiceModal';
import { Modal } from '../common/Modal';
import { Bill } from '../../types';

export const BillingView: React.FC = () => {
  const {
    bills,
    patients,
    currentUser,
    currentRole,
    generateBill,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBillForInvoice, setSelectedBillForInvoice] = useState<Bill | null>(null);

  // Generate Bill State
  const [showGenModal, setShowGenModal] = useState(false);
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [consultationFee, setConsultationFee] = useState<number>(150);
  const [laboratoryCharges, setLaboratoryCharges] = useState<number>(85);
  const [medicineCharges, setMedicineCharges] = useState<number>(45);
  const [roomCharges, setRoomCharges] = useState<number>(0);
  const [otherCharges, setOtherCharges] = useState<number>(20);
  const [discount, setDiscount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);

  // Role filtering
  let roleBills = bills;
  if (currentRole === 'patient') {
    roleBills = bills.filter((b) => b.patientId === currentUser?.id);
  }

  const filteredBills = roleBills.filter((b) => {
    const matchesSearch =
      b.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.patientPhone.includes(searchQuery);

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalBilled = roleBills.reduce((acc, b) => acc + b.totalAmount, 0);
  const totalCollected = roleBills.reduce((acc, b) => acc + b.paidAmount, 0);
  const totalOutstanding = roleBills.reduce((acc, b) => acc + b.pendingAmount, 0);

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === patientId);
    if (!pat) return;

    const total =
      consultationFee + laboratoryCharges + medicineCharges + roomCharges + otherCharges - discount;

    const items = [
      { id: 'bi-1', description: 'Physician Consultation Fee', category: 'Consultation' as const, amount: consultationFee },
      ...(laboratoryCharges > 0
        ? [{ id: 'bi-2', description: 'Diagnostic Laboratory Workup', category: 'Laboratory' as const, amount: laboratoryCharges }]
        : []),
      ...(medicineCharges > 0
        ? [{ id: 'bi-3', description: 'Dispensed Pharmacy Medications', category: 'Pharmacy' as const, amount: medicineCharges }]
        : []),
      ...(roomCharges > 0
        ? [{ id: 'bi-4', description: 'Hospital Ward & Bed Accommodations', category: 'Room & Bed' as const, amount: roomCharges }]
        : []),
      ...(otherCharges > 0
        ? [{ id: 'bi-5', description: 'Nursing Service & Disposable Supplies', category: 'Nursing & Service' as const, amount: otherCharges }]
        : []),
    ];

    const newBill = generateBill({
      patientId: pat.id,
      patientName: pat.name,
      patientPhone: pat.phone,
      patientAddress: pat.address,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      consultationFee,
      laboratoryCharges,
      medicineCharges,
      roomCharges,
      otherCharges,
      discount,
      totalAmount: total,
      paidAmount,
      items,
    });

    setShowGenModal(false);
    setSelectedBillForInvoice(newBill);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Hospital Billing & Financial Ledger</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Patient invoices, itemized statements, fee reconciliations, and digital payment receipts
          </p>
        </div>

        {currentRole !== 'patient' && (
          <button
            onClick={() => setShowGenModal(true)}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Generate New Invoice
          </button>
        )}
      </div>

      {/* Financial Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Billed</span>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            ${totalBilled.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">{roleBills.length} Statements issued</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Collected</span>
          <p className="text-2xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
            ${totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Settled funds received</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Outstanding Balance</span>
          <p className="text-2xl font-bold font-mono text-rose-600 mt-1 tabular-nums">
            ${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Pending collection</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice number, patient, or phone..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 text-xs">
          {['All', 'Paid', 'Pending', 'Partial'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === st ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-right">Paid</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{bill.billNumber}</td>

                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-900">{bill.patientName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{bill.patientPhone}</p>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    <p>Issued: {bill.date}</p>
                    <p className="text-slate-400">Due: {bill.dueDate}</p>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                    ${bill.totalAmount.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-emerald-700 tabular-nums">
                    ${bill.paidAmount.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums">
                    <span className={bill.pendingAmount > 0 ? 'text-rose-600' : 'text-slate-400'}>
                      ${bill.pendingAmount.toFixed(2)}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        bill.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : bill.status === 'Partial'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {bill.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedBillForInvoice(bill)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-semibold flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <FileText className="w-3 h-3" />
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Invoice Modal */}
      <Modal
        isOpen={showGenModal}
        onClose={() => setShowGenModal(false)}
        title="Generate Official Hospital Invoice"
        subtitle="Itemized billing breakdown and ledger entry"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateBill} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Patient</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name} · {p.phone}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Consultation Fee ($)</label>
              <input
                type="number"
                value={consultationFee}
                onChange={(e) => setConsultationFee(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Laboratory Diagnostics ($)</label>
              <input
                type="number"
                value={laboratoryCharges}
                onChange={(e) => setLaboratoryCharges(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Pharmacy Charges ($)</label>
              <input
                type="number"
                value={medicineCharges}
                onChange={(e) => setMedicineCharges(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Room & Bed Charges ($)</label>
              <input
                type="number"
                value={roomCharges}
                onChange={(e) => setRoomCharges(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Other Hospital Charges ($)</label>
              <input
                type="number"
                value={otherCharges}
                onChange={(e) => setOtherCharges(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Discount ($)</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono text-emerald-700"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded border flex items-center justify-between text-sm font-bold">
            <span>Calculated Total:</span>
            <span className="font-mono text-teal-800">
              ${(consultationFee + laboratoryCharges + medicineCharges + roomCharges + otherCharges - discount).toFixed(2)}
            </span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Amount Paid Immediately ($)</label>
            <input
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
              placeholder="0.00"
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={() => setShowGenModal(false)}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded cursor-pointer"
            >
              Generate Digital Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Digital Printable Invoice Modal */}
      <InvoiceModal
        bill={selectedBillForInvoice}
        isOpen={!!selectedBillForInvoice}
        onClose={() => setSelectedBillForInvoice(null)}
      />
    </div>
  );
};
