export type UserRole = 'admin' | 'doctor' | 'patient' | 'receptionist' | 'nurse';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  departmentId?: string;
  specialization?: string;
  qualification?: string;
  gender?: 'Male' | 'Female' | 'Other';
  age?: number;
  bloodGroup?: string;
  address?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headDoctorId: string;
  headDoctorName: string;
  description: string;
  floor: string;
  bedCapacity: number;
  iconName: string;
}

export interface Doctor extends User {
  role: 'doctor';
  departmentId: string;
  departmentName: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
  availableDays: string[]; // e.g. ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  availableHours: string; // e.g. '09:00 - 14:00'
  rating: number;
  roomNumber: string;
  status: 'Available' | 'In Consultation' | 'Off Duty' | 'On Leave';
}

export interface PatientVital {
  id: string;
  recordedAt: string;
  recordedByNurseId: string;
  recordedByNurseName: string;
  bloodPressure: string; // e.g. "120/80"
  pulseRate: number; // bpm
  temperature: number; // °F or °C
  spO2: number; // %
  respiratoryRate: number; // breaths/min
  notes?: string;
}

export interface Patient extends User {
  role: 'patient';
  dateOfBirth: string;
  bloodGroup: string;
  emergencyContact: string;
  emergencyPhone: string;
  allergies: string[];
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  assignedBedId?: string;
  assignedRoomNumber?: string;
  admissionStatus: 'Outpatient' | 'Admitted' | 'Discharged';
  admissionDate?: string;
  dischargeDate?: string;
  vitalsHistory: PatientVital[];
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientAge?: number;
  patientGender?: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  departmentId: string;
  departmentName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM"
  reason: string;
  status: AppointmentStatus;
  type: 'General Consultation' | 'Follow-up' | 'Emergency' | 'Routine Checkup';
  notes?: string;
  diagnosisSummary?: string;
  createdAt: string;
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  dosage: string; // e.g. "500mg"
  frequency: string; // e.g. "Twice daily after meals"
  duration: string; // e.g. "5 days"
  instructions: string;
}

export interface Prescription {
  id: string;
  appointmentId?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  diagnosis: string;
  items: PrescriptionItem[];
  advice: string;
  followUpDate?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  symptoms: string[];
  diagnosis: string;
  treatmentPlan: string;
  doctorNotes: string;
  labTestIds?: string[];
  prescriptionId?: string;
}

export type BedStatus = 'Available' | 'Occupied' | 'Reserved' | 'Maintenance';
export type WardType = 'ICU' | 'General Ward' | 'Private Suite' | 'Semi-Private' | 'Emergency Care';

export interface Bed {
  id: string;
  bedNumber: string;
  roomNumber: string;
  wardType: WardType;
  floor: string;
  status: BedStatus;
  dailyRate: number;
  assignedPatientId?: string;
  assignedPatientName?: string;
  admittedDate?: string;
  nurseInCharge?: string;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: 'Antibiotic' | 'Analgesic' | 'Cardiovascular' | 'Antidiabetic' | 'Antiviral' | 'Respiratory' | 'Vitamins' | 'Gastrointestinal';
  quantity: number;
  minThreshold: number;
  pricePerUnit: number;
  expiryDate: string;
  manufacturer: string;
  batchNumber: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export type LabTestStatus = 'Ordered' | 'Sample Collected' | 'Processing' | 'Completed' | 'Cancelled';

export interface LabTest {
  id: string;
  testName: string;
  category: 'Biochemistry' | 'Hematology' | 'Microbiology' | 'Radiology / Imaging' | 'Pathology';
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  orderedDate: string;
  completedDate?: string;
  status: LabTestStatus;
  cost: number;
  results?: {
    parameter: string;
    value: string;
    unit: string;
    referenceRange: string;
    isAbnormal: boolean;
  }[];
  summary?: string;
  technicianNotes?: string;
}

export interface BillItem {
  id: string;
  description: string;
  category: 'Consultation' | 'Laboratory' | 'Pharmacy' | 'Room & Bed' | 'Nursing & Service';
  amount: number;
  quantity?: number;
}

export type BillStatus = 'Paid' | 'Pending' | 'Partial' | 'Overdue';

export interface Bill {
  id: string;
  billNumber: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientAddress?: string;
  date: string;
  dueDate: string;
  consultationFee: number;
  laboratoryCharges: number;
  medicineCharges: number;
  roomCharges: number;
  otherCharges: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: BillStatus;
  paymentMethod?: 'Cash' | 'Credit Card' | 'Insurance' | 'Online Banking';
  items: BillItem[];
}

export type NotificationType = 'appointment' | 'prescription' | 'lab' | 'billing' | 'vitals' | 'system';

export interface HospitalNotification {
  id: string;
  targetRole?: UserRole | 'all';
  targetUserId?: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  isRead: boolean;
  linkTab?: string;
}
