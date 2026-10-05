import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Building,
  Plus,
  BedDouble,
  User,
  Heart,
  Brain,
  Bone,
  Baby,
  Sparkles,
  Stethoscope,
  Smile,
  Shield,
  Layers,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const DepartmentsView: React.FC = () => {
  const {
    departments,
    doctors,
    currentRole,
    addDepartment,
    setActiveTab,
  } = useHospital();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [headDoctorName, setHeadDoctorName] = useState('');
  const [description, setDescription] = useState('');
  const [floor, setFloor] = useState('Building A, 2nd Floor');
  const [bedCapacity, setBedCapacity] = useState(20);

  const getDeptIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart':
        return <Heart className="w-5 h-5 text-rose-600" />;
      case 'Brain':
        return <Brain className="w-5 h-5 text-indigo-600" />;
      case 'Bone':
        return <Bone className="w-5 h-5 text-sky-600" />;
      case 'Baby':
        return <Baby className="w-5 h-5 text-amber-600" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-teal-600" />;
      case 'Smile':
        return <Smile className="w-5 h-5 text-emerald-600" />;
      default:
        return <Stethoscope className="w-5 h-5 text-teal-600" />;
    }
  };

  const handleCreateDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addDepartment({
      name: name.trim(),
      code: code.trim().toUpperCase() || name.slice(0, 4).toUpperCase(),
      headDoctorId: 'doc-elena',
      headDoctorName: headDoctorName.trim() || 'Dr. Arthur Vance',
      description: description.trim() || 'Specialized clinical hospital division providing acute and outpatient medical services.',
      floor: floor.trim(),
      bedCapacity: Number(bedCapacity),
      iconName: 'Stethoscope',
    });

    setShowAddModal(false);
    setName('');
    setCode('');
    setHeadDoctorName('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Hospital Clinical Departments</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Specialized medical divisions, inpatient bed quotas, and departmental heads
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Department
          </button>
        )}
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => {
          const deptDocs = doctors.filter((d) => d.departmentId === dept.id || d.departmentName === dept.name);

          return (
            <div
              key={dept.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                      {getDeptIcon(dept.iconName)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{dept.name}</h3>
                      <span className="font-mono text-[10px] text-teal-700 font-bold bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                        {dept.code}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    {dept.bedCapacity} Beds
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{dept.description}</p>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Head of Department:</span>
                    <strong className="text-slate-800">{dept.headDoctorName}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Facility Location:</span>
                    <span className="text-slate-700">{dept.floor}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Active Staff Physicians:</span>
                    <span className="font-mono font-semibold text-slate-800">{deptDocs.length || 3} Doctors</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">24/7 Clinical Coverage</span>
                <button
                  onClick={() => setActiveTab('doctors')}
                  className="text-teal-700 font-semibold hover:underline cursor-pointer"
                >
                  View Specialists &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Department Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create Hospital Medical Department"
        subtitle="Provision clinical ward wing and head of department"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateDept} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Department Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Oncology & Hematology"
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. ONCO"
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono uppercase"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Bed Allocation</label>
              <input
                type="number"
                value={bedCapacity}
                onChange={(e) => setBedCapacity(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Head Doctor Name</label>
            <input
              type="text"
              value={headDoctorName}
              onChange={(e) => setHeadDoctorName(e.target.value)}
              placeholder="Dr. Samantha Reed, MD"
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Floor & Building Location</label>
            <input
              type="text"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              placeholder="Building B, 5th Floor"
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Department Clinical Scope</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description of clinical therapies and diagnostic procedures..."
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded cursor-pointer"
            >
              Establish Department
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
