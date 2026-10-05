import React, { useState } from 'react';
import { Bill } from '../../types';
import { useHospital } from '../../context/HospitalContext';
import { Modal } from './Modal';
import { Printer, CheckCircle, CreditCard, Building2, Phone, Mail, FileText } from 'lucide-react';

interface InvoiceModalProps {
  bill: Bill | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ bill, isOpen, onClose }) => {
  const { payBill } = useHospital();
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<Bill['paymentMethod']>('Credit Card');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!bill) return null;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(paymentAmount) || bill.pendingAmount;
    if (amount <= 0) return;

    payBill(bill.id, amount, paymentMethod);
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setIsPaying(false);
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Hospital Invoice · ${bill.billNumber}`}
      subtitle={`Billing Statement for ${bill.patientName}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6 print:p-0">
        {/* Hospital Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-xs">
              +
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">PulseCare Medical Center</h2>
              <p className="text-xs text-slate-500">Excellence in Healthcare & Digital Medicine</p>
            </div>
          </div>
          <div className="text-xs text-slate-500 sm:text-right space-y-0.5">
            <p className="font-medium text-slate-700">1200 Healthcare Blvd, Suite 100</p>
            <p>Metro City, MC 94016</p>
            <p>Tel: +1 (555) 911-CARE · billing@pulsecare.com</p>
          </div>
        </div>

        {/* Invoice Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">INVOICE NO.</span>
            <span className="font-mono font-semibold text-slate-800 text-sm mt-0.5 block">{bill.billNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">ISSUE DATE</span>
            <span className="font-mono text-slate-800 text-sm mt-0.5 block">{bill.date}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">DUE DATE</span>
            <span className="font-mono text-slate-800 text-sm mt-0.5 block">{bill.dueDate}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">PAYMENT STATUS</span>
            <span
              className={`inline-block mt-0.5 font-semibold text-xs px-2 py-0.5 rounded ${
                bill.status === 'Paid'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : bill.status === 'Partial'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {bill.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Billed To */}
        <div className="p-4 rounded-lg border border-slate-200/80">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Patient Details</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div>
              <p className="font-semibold text-slate-900">{bill.patientName}</p>
              <p className="text-xs text-slate-500 mt-0.5">{bill.patientAddress || 'Patient Address on file'}</p>
            </div>
            <div className="sm:text-right text-xs text-slate-600 space-y-1">
              <p>Phone: <span className="font-mono text-slate-800">{bill.patientPhone}</span></p>
              <p>Patient ID: <span className="font-mono text-slate-800">{bill.patientId}</span></p>
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-2.5 px-4">#</th>
                <th className="py-2.5 px-4">Item & Description</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4 text-right">Amount ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bill.items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-2.5 px-4 font-medium text-slate-800">{item.description}</td>
                  <td className="py-2.5 px-4 text-slate-500">{item.category}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-medium text-slate-800 tabular-nums">
                    ${item.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Breakdown */}
        <div className="flex justify-end">
          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
              <span>Consultation Charges</span>
              <span className="font-mono tabular-nums">${bill.consultationFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
              <span>Laboratory Diagnostic Fees</span>
              <span className="font-mono tabular-nums">${bill.laboratoryCharges.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
              <span>Pharmacy & Medications</span>
              <span className="font-mono tabular-nums">${bill.medicineCharges.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
              <span>Room & Bed Charges</span>
              <span className="font-mono tabular-nums">${bill.roomCharges.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
              <span>Nursing & Facility Fees</span>
              <span className="font-mono tabular-nums">${bill.otherCharges.toFixed(2)}</span>
            </div>
            {bill.discount > 0 && (
              <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-600 font-medium">
                <span>Hospital Discount</span>
                <span className="font-mono tabular-nums">-${bill.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 text-sm font-bold text-slate-900 border-b-2 border-slate-300">
              <span>Total Billable</span>
              <span className="font-mono tabular-nums">${bill.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-600">
              <span>Amount Paid</span>
              <span className="font-mono text-emerald-600 font-semibold tabular-nums">
                ${bill.paidAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-1 font-semibold text-slate-900 bg-slate-50 p-2 rounded">
              <span>Balance Outstanding</span>
              <span className={`font-mono tabular-nums ${bill.pendingAmount > 0 ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
                ${bill.pendingAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Form / Action Area */}
        {bill.pendingAmount > 0 && !isPaying && (
          <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-lg flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-teal-900">Outstanding Balance: ${bill.pendingAmount.toFixed(2)}</p>
              <p className="text-xs text-teal-700">Digital payments are verified and credited immediately to your medical ledger.</p>
            </div>
            <button
              onClick={() => {
                setPaymentAmount(bill.pendingAmount.toString());
                setIsPaying(true);
              }}
              className="px-4 py-2 bg-teal-700 text-white rounded-lg text-xs font-semibold hover:bg-teal-800 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Pay Balance
            </button>
          </div>
        )}

        {isPaying && (
          <form onSubmit={handlePayment} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <h4 className="text-xs font-semibold text-slate-900">Make Payment on Invoice</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">Payment Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  max={bill.pendingAmount}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-medium block mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as Bill['paymentMethod'])}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="Credit Card">Credit Card / Debit Card</option>
                  <option value="Online Banking">Online Banking / Wire</option>
                  <option value="Insurance">Insurance Claim Disbursement</option>
                  <option value="Cash">Cash at Hospital Desk</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPaying(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 text-white rounded-md text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {paymentSuccess ? <CheckCircle className="w-3.5 h-3.5" /> : <CreditCard className="w-3.5 h-3.5" />}
                {paymentSuccess ? 'Payment Processed!' : `Confirm $${parseFloat(paymentAmount || '0').toFixed(2)}`}
              </button>
            </div>
          </form>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-400">Electronic invoice valid without physical seal.</p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
