import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  FlaskConical,
  Search,
  Plus,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Printer,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { LabTest } from '../../types';

export const LaboratoryView: React.FC = () => {
  const {
    labTests,
    patients,
    doctors,
    currentUser,
    currentRole,
    orderLabTest,
    updateLabTest,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLabTestForDetail, setSelectedLabTestForDetail] = useState<LabTest | null>(null);

  // Order Lab Test Modal
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [testName, setTestName] = useState('Comprehensive Metabolic & Lipid Panel');
  const [category, setCategory] = useState<LabTest['category']>('Biochemistry');
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || '');
  const [cost, setCost] = useState<number>(110);
  const [summary, setSummary] = useState('');

  // Role filtering
  let roleLabTests = labTests;
  if (currentRole === 'patient') {
    roleLabTests = labTests.filter((t) => t.patientId === currentUser?.id);
  } else if (currentRole === 'doctor') {
    roleLabTests = labTests.filter((t) => t.doctorId === currentUser?.id);
  }

  const filteredTests = roleLabTests.filter((t) => {
    const matchesSearch =
      t.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === patientId);
    const doc = doctors.find((d) => d.id === doctorId);
    if (!pat || !doc) return;

    orderLabTest({
      testName,
      category,
      patientId: pat.id,
      patientName: pat.name,
      doctorId: doc.id,
      doctorName: doc.name,
      orderedDate: new Date().toISOString().split('T')[0],
      cost: Number(cost),
      summary: summary.trim() || undefined,
    });

    setShowOrderModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Clinical Diagnostic Laboratory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pathology, biochemistry, hematology, and advanced imaging telemetry results
          </p>
        </div>

        {currentRole !== 'patient' && (
          <button
            onClick={() => setShowOrderModal(true)}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Order Laboratory Test
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
            placeholder="Search test name, category, or patient..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 text-xs">
          {['All', 'Completed', 'Processing', 'Ordered'].map((st) => (
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

      {/* Lab Tests Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Diagnostic Test</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Ordering Doctor</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTests.map((test) => (
                <tr key={test.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{test.testName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">ID: {test.id}</p>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700">{test.category}</td>

                  <td className="py-3.5 px-4">
                    <p className="font-medium text-slate-800">{test.patientName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{test.patientId}</p>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700">{test.doctorName}</td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    <p>Ordered: {test.orderedDate}</p>
                    {test.completedDate && <p className="text-teal-700">Completed: {test.completedDate}</p>}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        test.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : test.status === 'Processing'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {test.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    {currentRole !== 'patient' && test.status !== 'Completed' && (
                      <button
                        onClick={() =>
                          updateLabTest(test.id, {
                            status: test.status === 'Ordered' ? 'Processing' : 'Completed',
                          })
                        }
                        className="px-2.5 py-1 bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 rounded text-[11px] font-semibold cursor-pointer"
                      >
                        {test.status === 'Ordered' ? 'Start Processing' : 'Mark Completed'}
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedLabTestForDetail(test)}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-semibold cursor-pointer"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lab Report Detail Modal */}
      <Modal
        isOpen={!!selectedLabTestForDetail}
        onClose={() => setSelectedLabTestForDetail(null)}
        title="Official Diagnostic Laboratory Report"
        subtitle={`Test: ${selectedLabTestForDetail?.testName}`}
        maxWidth="max-w-2xl"
      >
        {selectedLabTestForDetail && (
          <div className="space-y-5 text-xs">
            {/* Meta Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-400 block text-[10px]">PATIENT NAME</span>
                <p className="font-bold text-slate-900 mt-0.5">{selectedLabTestForDetail.patientName}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">ORDERING DOCTOR</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedLabTestForDetail.doctorName}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">DISCIPLINE</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedLabTestForDetail.category}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">REPORT STATUS</span>
                <p className="font-bold text-teal-800 mt-0.5">{selectedLabTestForDetail.status}</p>
              </div>
            </div>

            {/* Test Results Table if present */}
            {selectedLabTestForDetail.results && selectedLabTestForDetail.results.length > 0 ? (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
                    <tr>
                      <th className="p-2.5 px-3">Analyte / Parameter</th>
                      <th className="p-2.5 px-3">Measured Value</th>
                      <th className="p-2.5 px-3">Reference Range</th>
                      <th className="p-2.5 px-3 text-right">Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedLabTestForDetail.results.map((r, idx) => (
                      <tr key={idx} className={r.isAbnormal ? 'bg-rose-50/40' : ''}>
                        <td className="p-2.5 px-3 font-medium text-slate-800">{r.parameter}</td>
                        <td className="p-2.5 px-3 font-mono font-bold text-slate-900">
                          {r.value} <span className="text-[10px] font-normal text-slate-500">{r.unit}</span>
                        </td>
                        <td className="p-2.5 px-3 font-mono text-slate-600">{r.referenceRange}</td>
                        <td className="p-2.5 px-3 text-right">
                          {r.isAbnormal ? (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                              ABNORMAL
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-700 font-medium">NORMAL</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg text-center text-slate-500 italic">
                Diagnostic specimen in processing pipeline. Full numerical analyte values will populate upon laboratory technician sign-off.
              </div>
            )}

            {/* Summary / Notes */}
            {selectedLabTestForDetail.summary && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-1">Pathologist / Radiologist Summary:</span>
                <p className="text-slate-700 leading-relaxed">{selectedLabTestForDetail.summary}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t">
              <span className="text-slate-400 font-mono text-[11px]">Lab Specimen Cost: ${selectedLabTestForDetail.cost}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 border rounded-lg hover:bg-slate-50 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Report
                </button>
                <button
                  onClick={() => setSelectedLabTestForDetail(null)}
                  className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-medium cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Order Test Modal */}
      <Modal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        title="Order Diagnostic Laboratory Test"
        subtitle="Clinical pathology and imaging requisition"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Test Name</label>
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white"
              >
                <option value="Biochemistry">Biochemistry</option>
                <option value="Hematology">Hematology</option>
                <option value="Microbiology">Microbiology</option>
                <option value="Radiology / Imaging">Radiology / Imaging</option>
                <option value="Pathology">Pathology</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Test Cost ($)</label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Patient</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.admissionStatus})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Ordering Physician</label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.name} ({d.departmentName})</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={() => setShowOrderModal(false)}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded cursor-pointer"
            >
              Submit Order
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
