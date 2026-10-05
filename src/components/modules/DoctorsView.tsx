import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Doctor } from '../../types';
import {
  UserRound,
  Search,
  Star,
  Clock,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle,
  Building,
} from 'lucide-react';
import { NewAppointmentModal } from '../common/NewAppointmentModal';
import { Modal } from '../common/Modal';

export const DoctorsView: React.FC = () => {
  const {
    doctors,
    departments,
    currentRole,
    addDoctor,
    deleteDoctor,
    updateDoctor,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState('All');
  const [bookingDocId, setBookingDocId] = useState<string | undefined>(undefined);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Add Doctor Modal (Admin)
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '');
  const [specialization, setSpecialization] = useState('');
  const [qualification, setQualification] = useState('');
  const [experienceYears, setExperienceYears] = useState(10);
  const [consultationFee, setConsultationFee] = useState(140);
  const [availableHours, setAvailableHours] = useState('09:00 - 16:00');
  const [roomNumber, setRoomNumber] = useState('Suite 201');

  // Doctor Details Modal
  const [detailDoctor, setDetailDoctor] = useState<Doctor | null>(null);

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.departmentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDeptId === 'All' || doc.departmentId === selectedDeptId;

    return matchesSearch && matchesDept;
  });

  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = departments.find((d) => d.id === departmentId);

    addDoctor({
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}_${Date.now()}@pulsecare.com`,
      phone: phone.trim(),
      departmentId,
      departmentName: dept?.name || 'General Medicine',
      specialization: specialization.trim(),
      qualification: qualification.trim(),
      experienceYears: Number(experienceYears),
      consultationFee: Number(consultationFee),
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      availableHours,
      rating: 4.9,
      roomNumber,
      status: 'Available',
    });

    setShowAddDoctorModal(false);
  };

  const handleBookWithDoctor = (docId: string) => {
    setBookingDocId(docId);
    setShowBookingModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Specialist Medical Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Board-certified physicians, clinical department chiefs, and consultation schedules
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            onClick={() => setShowAddDoctorModal(true)}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Specialist Doctor
          </button>
        )}
      </div>

      {/* Search & Department Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctor by name, specialty, or clinic..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Department:</span>
          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none"
          >
            <option value="All">All Departments ({departments.length})</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm shrink-0 border border-teal-200">
                    {doc.name.split(' ').map((n) => n[0]).slice(1, 3).join('') || 'DR'}
                  </div>
                  <div>
                    <h3
                      onClick={() => setDetailDoctor(doc)}
                      className="font-bold text-slate-900 text-sm hover:text-teal-700 transition-colors cursor-pointer"
                    >
                      {doc.name}
                    </h3>
                    <p className="text-xs text-teal-700 font-medium">{doc.specialization}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{doc.departmentName} · {doc.qualification}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    doc.status === 'Available'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : doc.status === 'In Consultation'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {doc.status}
                </span>
              </div>

              {/* Consultation Details */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg text-xs border border-slate-100 font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px] font-sans">CONSULTATION</span>
                  <span className="font-bold text-slate-900">${doc.consultationFee}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-sans">CLINIC SUITE</span>
                  <span className="text-slate-800">{doc.roomNumber}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px] font-sans">HOURS / DAYS</span>
                  <span className="text-slate-700 text-[11px]">
                    {doc.availableDays.join(', ')} ({doc.availableHours})
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-mono text-slate-700">{doc.rating}</span>
                <span className="text-[10px] text-slate-400">({doc.experienceYears}y exp)</span>
              </div>

              <div className="flex items-center gap-2">
                {currentRole === 'admin' && (
                  <button
                    onClick={() => deleteDoctor(doc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                    title="Remove doctor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => handleBookWithDoctor(doc.id)}
                  className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Book Visit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Profile Details Modal */}
      <Modal
        isOpen={!!detailDoctor}
        onClose={() => setDetailDoctor(null)}
        title={detailDoctor?.name || 'Physician Profile'}
        subtitle={detailDoctor?.specialization}
        maxWidth="max-w-xl"
      >
        {detailDoctor && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block text-[10px]">DEPARTMENT</span>
                <span className="font-semibold text-slate-900">{detailDoctor.departmentName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">CONSULTATION FEE</span>
                <span className="font-mono font-bold text-slate-900">${detailDoctor.consultationFee}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">QUALIFICATION</span>
                <span className="text-slate-800">{detailDoctor.qualification}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">EXPERIENCE</span>
                <span className="text-slate-800">{detailDoctor.experienceYears} years clinical practice</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">CONSULTATION HOURS</span>
                <span className="font-mono text-slate-800">{detailDoctor.availableHours}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">DAYS AVAILABLE</span>
                <span className="text-slate-800">{detailDoctor.availableDays.join(', ')}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDetailDoctor(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = detailDoctor.id;
                  setDetailDoctor(null);
                  handleBookWithDoctor(id);
                }}
                className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
              >
                Book Appointment
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Doctor Modal (Admin) */}
      <Modal
        isOpen={showAddDoctorModal}
        onClose={() => setShowAddDoctorModal(false)}
        title="Add Hospital Medical Specialist"
        subtitle="Register licensed physician credentials and clinic allocation"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateDoctor} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Doctor Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Alexander Wright, MD"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Department</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                required
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Specialization</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g. Pediatric Cardiology"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Qualifications & Degrees</label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="MD, Johns Hopkins Medicine"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Consultation Fee ($)</label>
              <input
                type="number"
                value={consultationFee}
                onChange={(e) => setConsultationFee(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Experience (Years)</label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Clinic Room / Suite</label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="Suite 305"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddDoctorModal(false)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
            >
              Save Doctor
            </button>
          </div>
        </form>
      </Modal>

      {/* Appointment Booking Modal */}
      <NewAppointmentModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        preselectedDoctorId={bookingDocId}
      />
    </div>
  );
};
