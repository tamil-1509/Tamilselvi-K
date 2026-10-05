import React, { useState, useEffect } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Modal } from './Modal';
import { Calendar, Clock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDoctorId?: string;
}

const TIME_SLOTS = [
  '08:30 AM',
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
];

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  preselectedDoctorId,
}) => {
  const {
    departments,
    doctors,
    patients,
    currentUser,
    currentRole,
    bookAppointment,
    appointments,
  } = useHospital();

  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState<string>('09:30 AM');
  const [visitType, setVisitType] = useState<
    'General Consultation' | 'Follow-up' | 'Emergency' | 'Routine Checkup'
  >('General Consultation');
  const [reason, setReason] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Default patient
  useEffect(() => {
    if (currentUser?.role === 'patient') {
      setSelectedPatientId(currentUser.id);
    } else if (patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].id);
    }
  }, [currentUser, patients, selectedPatientId]);

  // Handle preselected doctor
  useEffect(() => {
    if (preselectedDoctorId) {
      const doc = doctors.find((d) => d.id === preselectedDoctorId);
      if (doc) {
        setSelectedDoctorId(doc.id);
        setSelectedDeptId(doc.departmentId);
      }
    } else if (doctors.length > 0 && !selectedDoctorId) {
      setSelectedDoctorId(doctors[0].id);
      setSelectedDeptId(doctors[0].departmentId);
    }
  }, [preselectedDoctorId, doctors]);

  // Filter doctors by selected department
  const filteredDoctors = selectedDeptId
    ? doctors.filter((d) => d.departmentId === selectedDeptId)
    : doctors;

  const currentDoctor = doctors.find((d) => d.id === selectedDoctorId);
  const currentSelectedPatient = patients.find((p) => p.id === selectedPatientId);

  // Check if slot is already occupied in real-time
  const isSlotBooked = appointments.some(
    (a) =>
      a.doctorId === selectedDoctorId &&
      a.date === date &&
      a.timeSlot === timeSlot &&
      a.status !== 'Cancelled'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!selectedDoctorId) {
      setErrorMsg('Please select a doctor.');
      return;
    }
    if (!selectedPatientId) {
      setErrorMsg('Please select a patient.');
      return;
    }
    if (!reason.trim()) {
      setErrorMsg('Please specify the reason for consultation.');
      return;
    }

    const patientObj = patients.find((p) => p.id === selectedPatientId);
    const doctorObj = doctors.find((d) => d.id === selectedDoctorId);

    if (!patientObj || !doctorObj) {
      setErrorMsg('Invalid patient or doctor selection.');
      return;
    }

    const result = bookAppointment({
      patientId: patientObj.id,
      patientName: patientObj.name,
      patientPhone: patientObj.phone,
      patientAge: patientObj.age,
      patientGender: patientObj.gender,
      doctorId: doctorObj.id,
      doctorName: doctorObj.name,
      doctorSpecialization: doctorObj.specialization,
      departmentId: doctorObj.departmentId,
      departmentName: doctorObj.departmentName,
      date,
      timeSlot,
      reason: reason.trim(),
      type: visitType,
    });

    if (!result.success) {
      setErrorMsg(result.message);
    } else {
      setSuccessMsg('Appointment booked and confirmed successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1400);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Clinical Appointment"
      subtitle="Select department, physician, and preferred consultation schedule"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Patient Selection (For staff/admin/receptionist) */}
        {currentRole !== 'patient' ? (
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Patient</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
              required
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.phone} ({p.gender}, {p.age}y, Blood: {p.bloodGroup})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-slate-400 block text-[11px] font-medium">BOOKING FOR</span>
            <p className="font-semibold text-slate-900 mt-0.5 text-xs">
              {currentSelectedPatient?.name} · {currentSelectedPatient?.phone}
            </p>
          </div>
        )}

        {/* Department & Doctor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Department</label>
            <select
              value={selectedDeptId}
              onChange={(e) => {
                setSelectedDeptId(e.target.value);
                const firstDoc = doctors.find((d) => d.departmentId === e.target.value);
                if (firstDoc) setSelectedDoctorId(firstDoc.id);
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
            >
              <option value="">All Clinical Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Doctor / Specialist</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
              required
            >
              {filteredDoctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} ({doc.departmentName} - ${doc.consultationFee})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctor Information Card */}
        {currentDoctor && (
          <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-lg text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-teal-900">{currentDoctor.name}</span>
              <span className="font-mono text-teal-800 font-semibold">${currentDoctor.consultationFee} Consultation</span>
            </div>
            <p className="text-teal-700">{currentDoctor.specialization} · {currentDoctor.qualification}</p>
            <div className="flex items-center gap-3 text-[11px] text-teal-600 pt-1">
              <span>Days: {currentDoctor.availableDays.join(', ')}</span>
              <span>·</span>
              <span>Hours: {currentDoctor.availableHours}</span>
              <span>·</span>
              <span>{currentDoctor.roomNumber}</span>
            </div>
          </div>
        )}

        {/* Date & Time Slot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Appointment Date</label>
            <div className="relative">
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Appointment Type</label>
            <select
              value={visitType}
              onChange={(e) => setVisitType(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
            >
              <option value="General Consultation">General Consultation</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Routine Checkup">Routine Checkup</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
        </div>

        {/* Time Slot Selector */}
        <div>
          <label className="font-semibold text-slate-700 block mb-1.5">
            Select Time Slot {isSlotBooked && <span className="text-rose-600 ml-2 font-normal">(Slot Already Booked)</span>}
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {TIME_SLOTS.map((slot) => {
              const booked = appointments.some(
                (a) =>
                  a.doctorId === selectedDoctorId &&
                  a.date === date &&
                  a.timeSlot === slot &&
                  a.status !== 'Cancelled'
              );
              const isSelected = timeSlot === slot;

              return (
                <button
                  type="button"
                  key={slot}
                  disabled={booked}
                  onClick={() => setTimeSlot(slot)}
                  className={`py-1.5 px-2 rounded-md text-xs font-mono text-center transition-colors cursor-pointer ${
                    booked
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed line-through'
                      : isSelected
                      ? 'bg-teal-700 text-white font-medium shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reason for Visit */}
        <div>
          <label className="font-semibold text-slate-700 block mb-1">
            Reason for Visit & Symptoms Description
          </label>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Briefly describe the health issue, symptoms, or purpose of visit..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
            required
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
            disabled={isSlotBooked}
            className={`px-5 py-2 rounded-lg text-white font-semibold transition-colors cursor-pointer ${
              isSlotBooked
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-teal-700 hover:bg-teal-800 shadow-xs'
            }`}
          >
            Confirm Appointment
          </button>
        </div>
      </form>
    </Modal>
  );
};
