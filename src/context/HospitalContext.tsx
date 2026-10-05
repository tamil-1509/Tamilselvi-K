import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserRole,
  Doctor,
  Patient,
  Department,
  Appointment,
  Bed,
  Medicine,
  LabTest,
  Bill,
  Prescription,
  MedicalRecord,
  HospitalNotification,
  PatientVital,
} from '../types';
import {
  initialDepartments,
  initialDoctors,
  initialPatients,
  initialStaffUsers,
  initialAppointments,
  initialBeds,
  initialMedicines,
  initialLabTests,
  initialBills,
  initialPrescriptions,
  initialMedicalRecords,
  initialNotifications,
} from '../data/mockData';

interface HospitalContextType {
  currentUser: User | null;
  currentRole: UserRole;
  currentDoctor: Doctor | null;
  currentPatient: Patient | null;
  departments: Department[];
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  beds: Bed[];
  medicines: Medicine[];
  labTests: LabTest[];
  bills: Bill[];
  prescriptions: Prescription[];
  medicalRecords: MedicalRecord[];
  notifications: HospitalNotification[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount: number;
  
  // Auth & Role
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole, specificUserId?: string) => void;
  registerPatient: (patientData: Partial<Patient>) => Patient;

  // Appointments
  bookAppointment: (apt: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => { success: boolean; message: string; appointment?: Appointment };
  updateAppointmentStatus: (id: string, status: Appointment['status'], notes?: string, diagnosisSummary?: string) => void;
  cancelAppointment: (id: string, reason?: string) => void;

  // Clinical & Records
  addPrescription: (prescription: Omit<Prescription, 'id'>) => Prescription;
  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => MedicalRecord;
  addPatientVitals: (patientId: string, vitals: Omit<PatientVital, 'id' | 'recordedAt' | 'recordedByNurseId' | 'recordedByNurseName'>) => void;

  // Management (Admin / Staff)
  addDoctor: (doctor: Omit<Doctor, 'id' | 'role'>) => Doctor;
  updateDoctor: (id: string, updates: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;

  addDepartment: (dept: Omit<Department, 'id'>) => Department;

  addPatient: (patient: Omit<Patient, 'id' | 'role' | 'vitalsHistory'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  // Bed Management
  updateBedStatus: (bedId: string, status: Bed['status'], patientId?: string, patientName?: string) => void;
  admitPatient: (patientId: string, bedId: string, reason?: string) => boolean;
  dischargePatient: (patientId: string, bedId?: string) => boolean;

  // Pharmacy
  addMedicine: (med: Omit<Medicine, 'id' | 'stockStatus'>) => Medicine;
  updateMedicineStock: (id: string, newQuantity: number) => void;
  deleteMedicine: (id: string) => void;

  // Laboratory
  orderLabTest: (test: Omit<LabTest, 'id' | 'status'>) => LabTest;
  updateLabTest: (id: string, updates: Partial<LabTest>) => void;

  // Billing
  generateBill: (billData: Omit<Bill, 'id' | 'billNumber' | 'status' | 'pendingAmount'>) => Bill;
  payBill: (billId: string, amount: number, paymentMethod: Bill['paymentMethod']) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<HospitalNotification, 'id' | 'createdAt' | 'isRead'>) => void;

  // Utility
  resetAllToDefaults: () => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'pulsecare_current_user',
  DEPARTMENTS: 'pulsecare_departments',
  DOCTORS: 'pulsecare_doctors',
  PATIENTS: 'pulsecare_patients',
  APPOINTMENTS: 'pulsecare_appointments',
  BEDS: 'pulsecare_beds',
  MEDICINES: 'pulsecare_medicines',
  LAB_TESTS: 'pulsecare_lab_tests',
  BILLS: 'pulsecare_bills',
  PRESCRIPTIONS: 'pulsecare_prescriptions',
  RECORDS: 'pulsecare_records',
  NOTIFICATIONS: 'pulsecare_notifications',
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

export const HospitalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return loadStorage<User | null>(STORAGE_KEYS.CURRENT_USER, initialStaffUsers[0]); // Default to admin
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [departments, setDepartments] = useState<Department[]>(() =>
    loadStorage(STORAGE_KEYS.DEPARTMENTS, initialDepartments)
  );

  const [doctors, setDoctors] = useState<Doctor[]>(() =>
    loadStorage(STORAGE_KEYS.DOCTORS, initialDoctors)
  );

  const [patients, setPatients] = useState<Patient[]>(() =>
    loadStorage(STORAGE_KEYS.PATIENTS, initialPatients)
  );

  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    loadStorage(STORAGE_KEYS.APPOINTMENTS, initialAppointments)
  );

  const [beds, setBeds] = useState<Bed[]>(() =>
    loadStorage(STORAGE_KEYS.BEDS, initialBeds)
  );

  const [medicines, setMedicines] = useState<Medicine[]>(() =>
    loadStorage(STORAGE_KEYS.MEDICINES, initialMedicines)
  );

  const [labTests, setLabTests] = useState<LabTest[]>(() =>
    loadStorage(STORAGE_KEYS.LAB_TESTS, initialLabTests)
  );

  const [bills, setBills] = useState<Bill[]>(() =>
    loadStorage(STORAGE_KEYS.BILLS, initialBills)
  );

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() =>
    loadStorage(STORAGE_KEYS.PRESCRIPTIONS, initialPrescriptions)
  );

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() =>
    loadStorage(STORAGE_KEYS.RECORDS, initialMedicalRecords)
  );

  const [notifications, setNotifications] = useState<HospitalNotification[]>(() =>
    loadStorage(STORAGE_KEYS.NOTIFICATIONS, initialNotifications)
  );

  // Sync state to storage
  useEffect(() => { saveStorage(STORAGE_KEYS.CURRENT_USER, currentUser); }, [currentUser]);
  useEffect(() => { saveStorage(STORAGE_KEYS.DEPARTMENTS, departments); }, [departments]);
  useEffect(() => { saveStorage(STORAGE_KEYS.DOCTORS, doctors); }, [doctors]);
  useEffect(() => { saveStorage(STORAGE_KEYS.PATIENTS, patients); }, [patients]);
  useEffect(() => { saveStorage(STORAGE_KEYS.APPOINTMENTS, appointments); }, [appointments]);
  useEffect(() => { saveStorage(STORAGE_KEYS.BEDS, beds); }, [beds]);
  useEffect(() => { saveStorage(STORAGE_KEYS.MEDICINES, medicines); }, [medicines]);
  useEffect(() => { saveStorage(STORAGE_KEYS.LAB_TESTS, labTests); }, [labTests]);
  useEffect(() => { saveStorage(STORAGE_KEYS.BILLS, bills); }, [bills]);
  useEffect(() => { saveStorage(STORAGE_KEYS.PRESCRIPTIONS, prescriptions); }, [prescriptions]);
  useEffect(() => { saveStorage(STORAGE_KEYS.RECORDS, medicalRecords); }, [medicalRecords]);
  useEffect(() => { saveStorage(STORAGE_KEYS.NOTIFICATIONS, notifications); }, [notifications]);

  const currentRole: UserRole = currentUser?.role || 'admin';

  const currentDoctor: Doctor | null =
    currentRole === 'doctor' ? doctors.find((d) => d.id === currentUser?.id) || doctors[0] : null;

  const currentPatient: Patient | null =
    currentRole === 'patient' ? patients.find((p) => p.id === currentUser?.id) || patients[0] : null;

  const unreadCount = notifications.filter(
    (n) => !n.isRead && (n.targetRole === 'all' || n.targetRole === currentRole || n.targetUserId === currentUser?.id)
  ).length;

  const login = (email: string, explicitRole?: UserRole): boolean => {
    const cleanEmail = email.toLowerCase().trim();
    // Check staff
    const staff = initialStaffUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (staff) {
      setCurrentUser(staff);
      setActiveTab('dashboard');
      return true;
    }
    // Check doctor
    const doc = doctors.find((d) => d.email.toLowerCase() === cleanEmail);
    if (doc) {
      setCurrentUser(doc);
      setActiveTab('dashboard');
      return true;
    }
    // Check patient
    const pat = patients.find((p) => p.email.toLowerCase() === cleanEmail);
    if (pat) {
      setCurrentUser(pat);
      setActiveTab('dashboard');
      return true;
    }

    if (explicitRole) {
      switchRole(explicitRole);
      return true;
    }

    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (role: UserRole, specificUserId?: string) => {
    if (role === 'admin') {
      setCurrentUser(initialStaffUsers[0]);
    } else if (role === 'doctor') {
      const target = specificUserId ? doctors.find((d) => d.id === specificUserId) : doctors[0];
      setCurrentUser(target || doctors[0]);
    } else if (role === 'patient') {
      const target = specificUserId ? patients.find((p) => p.id === specificUserId) : patients[0];
      setCurrentUser(target || patients[0]);
    } else if (role === 'receptionist') {
      setCurrentUser(initialStaffUsers[1]);
    } else if (role === 'nurse') {
      setCurrentUser(initialStaffUsers[2]);
    }
    setActiveTab('dashboard');
  };

  const registerPatient = (patientData: Partial<Patient>): Patient => {
    const newId = `pat-${Date.now()}`;
    const newPatient: Patient = {
      id: newId,
      name: patientData.name || 'Anonymous Patient',
      email: patientData.email || `patient_${Date.now()}@example.com`,
      role: 'patient',
      phone: patientData.phone || '+1 (555) 000-0000',
      gender: patientData.gender || 'Male',
      age: patientData.age || 30,
      bloodGroup: patientData.bloodGroup || 'O+',
      dateOfBirth: patientData.dateOfBirth || '1995-01-01',
      emergencyContact: patientData.emergencyContact || 'Family Member',
      emergencyPhone: patientData.emergencyPhone || '+1 (555) 000-0001',
      allergies: patientData.allergies || [],
      address: patientData.address || 'Metro City',
      admissionStatus: 'Outpatient',
      vitalsHistory: [],
    };

    setPatients((prev) => [newPatient, ...prev]);
    setCurrentUser(newPatient);
    setActiveTab('dashboard');

    addNotification({
      targetRole: 'admin',
      title: 'New Patient Registered',
      message: `${newPatient.name} registered online.`,
      type: 'system',
      linkTab: 'patients',
    });

    return newPatient;
  };

  // Appointment Double Booking Prevention
  const bookAppointment = (
    aptData: Omit<Appointment, 'id' | 'createdAt' | 'status'>
  ): { success: boolean; message: string; appointment?: Appointment } => {
    // Check if doctor is already booked for this date and timeSlot
    const conflictingApt = appointments.find(
      (a) =>
        a.doctorId === aptData.doctorId &&
        a.date === aptData.date &&
        a.timeSlot === aptData.timeSlot &&
        a.status !== 'Cancelled'
    );

    if (conflictingApt) {
      return {
        success: false,
        message: `Conflict: ${aptData.doctorName} is already booked for ${aptData.date} at ${aptData.timeSlot}. Please select another time or doctor.`,
      };
    }

    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newApt, ...prev]);

    // Notify doctor
    addNotification({
      targetRole: 'doctor',
      targetUserId: newApt.doctorId,
      title: 'New Appointment Booked',
      message: `${newApt.patientName} scheduled for ${newApt.date} at ${newApt.timeSlot}`,
      type: 'appointment',
      linkTab: 'appointments',
    });

    // Notify patient
    addNotification({
      targetRole: 'patient',
      targetUserId: newApt.patientId,
      title: 'Appointment Confirmed',
      message: `Your appointment with ${newApt.doctorName} on ${newApt.date} at ${newApt.timeSlot} is confirmed.`,
      type: 'appointment',
      linkTab: 'appointments',
    });

    return {
      success: true,
      message: 'Appointment successfully confirmed!',
      appointment: newApt,
    };
  };

  const updateAppointmentStatus = (
    id: string,
    status: Appointment['status'],
    notes?: string,
    diagnosisSummary?: string
  ) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            status,
            notes: notes !== undefined ? notes : a.notes,
            diagnosisSummary: diagnosisSummary !== undefined ? diagnosisSummary : a.diagnosisSummary,
          };
        }
        return a;
      })
    );

    const apt = appointments.find((a) => a.id === id);
    if (apt) {
      addNotification({
        targetRole: 'patient',
        targetUserId: apt.patientId,
        title: `Appointment ${status}`,
        message: `Your appointment with ${apt.doctorName} on ${apt.date} has been marked as ${status}.`,
        type: 'appointment',
        linkTab: 'appointments',
      });
    }
  };

  const cancelAppointment = (id: string, reason?: string) => {
    updateAppointmentStatus(id, 'Cancelled', reason ? `Cancelled: ${reason}` : 'Cancelled by user');
  };

  const addPrescription = (rxData: Omit<Prescription, 'id'>): Prescription => {
    const newRx: Prescription = {
      ...rxData,
      id: `rx-${Date.now()}`,
    };
    setPrescriptions((prev) => [newRx, ...prev]);

    // Also auto-create a medical record entry
    const newRecord: MedicalRecord = {
      id: `rec-${Date.now()}`,
      patientId: rxData.patientId,
      patientName: rxData.patientName,
      doctorId: rxData.doctorId,
      doctorName: rxData.doctorName,
      date: rxData.date,
      symptoms: ['Clinical Consultation & Prescription Issued'],
      diagnosis: rxData.diagnosis,
      treatmentPlan: rxData.advice,
      doctorNotes: `Prescribed ${rxData.items.map((i) => i.medicineName).join(', ')}`,
      prescriptionId: newRx.id,
    };
    setMedicalRecords((prev) => [newRecord, ...prev]);

    addNotification({
      targetRole: 'patient',
      targetUserId: rxData.patientId,
      title: 'New Prescription Issued',
      message: `${rxData.doctorName} has issued a digital prescription for you.`,
      type: 'prescription',
      linkTab: 'prescriptions',
    });

    return newRx;
  };

  const addMedicalRecord = (recordData: Omit<MedicalRecord, 'id'>): MedicalRecord => {
    const newRecord: MedicalRecord = {
      ...recordData,
      id: `rec-${Date.now()}`,
    };
    setMedicalRecords((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const addPatientVitals = (
    patientId: string,
    vitals: Omit<PatientVital, 'id' | 'recordedAt' | 'recordedByNurseId' | 'recordedByNurseName'>
  ) => {
    const newVital: PatientVital = {
      ...vitals,
      id: `vit-${Date.now()}`,
      recordedAt: new Date().toLocaleString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      recordedByNurseId: currentUser?.id || 'nurse-clara',
      recordedByNurseName: currentUser?.name || 'Nurse Clara Barton, RN',
    };

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            vitalsHistory: [newVital, ...p.vitalsHistory],
          };
        }
        return p;
      })
    );

    addNotification({
      targetRole: 'doctor',
      title: 'Patient Vitals Recorded',
      message: `Updated vitals for patient ${patients.find((p) => p.id === patientId)?.name || patientId}: BP ${newVital.bloodPressure}, Pulse ${newVital.pulseRate} bpm.`,
      type: 'vitals',
      linkTab: 'records',
    });
  };

  const addDoctor = (docData: Omit<Doctor, 'id' | 'role'>): Doctor => {
    const newDoc: Doctor = {
      ...docData,
      id: `doc-${Date.now()}`,
      role: 'doctor',
    };
    setDoctors((prev) => [...prev, newDoc]);
    return newDoc;
  };

  const updateDoctor = (id: string, updates: Partial<Doctor>) => {
    setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDoctor = (id: string) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  const addDepartment = (deptData: Omit<Department, 'id'>): Department => {
    const newDept: Department = {
      ...deptData,
      id: `dept-${Date.now()}`,
    };
    setDepartments((prev) => [...prev, newDept]);
    return newDept;
  };

  const addPatient = (patientData: Omit<Patient, 'id' | 'role' | 'vitalsHistory'>): Patient => {
    const newPatient: Patient = {
      ...patientData,
      id: `pat-${Date.now()}`,
      role: 'patient',
      vitalsHistory: [],
    };
    setPatients((prev) => [newPatient, ...prev]);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePatient = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  const updateBedStatus = (
    bedId: string,
    status: Bed['status'],
    patientId?: string,
    patientName?: string
  ) => {
    setBeds((prev) =>
      prev.map((b) => {
        if (b.id === bedId) {
          return {
            ...b,
            status,
            assignedPatientId: patientId !== undefined ? patientId : b.assignedPatientId,
            assignedPatientName: patientName !== undefined ? patientName : b.assignedPatientName,
            admittedDate: status === 'Occupied' ? b.admittedDate || new Date().toISOString().split('T')[0] : undefined,
          };
        }
        return b;
      })
    );
  };

  const admitPatient = (patientId: string, bedId: string, reason?: string): boolean => {
    const patient = patients.find((p) => p.id === patientId);
    const bed = beds.find((b) => b.id === bedId);
    if (!patient || !bed || bed.status === 'Occupied') return false;

    updateBedStatus(bedId, 'Occupied', patient.id, patient.name);
    updatePatient(patientId, {
      admissionStatus: 'Admitted',
      assignedBedId: bed.id,
      assignedRoomNumber: bed.roomNumber,
      admissionDate: new Date().toISOString().split('T')[0],
    });

    addNotification({
      targetRole: 'nurse',
      title: 'New Inpatient Admission',
      message: `${patient.name} admitted to ${bed.roomNumber} (${bed.wardType}). ${reason || ''}`,
      type: 'vitals',
      linkTab: 'beds',
    });

    return true;
  };

  const dischargePatient = (patientId: string, bedId?: string): boolean => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return false;

    const targetBed = bedId ? beds.find((b) => b.id === bedId) : beds.find((b) => b.assignedPatientId === patientId);
    if (targetBed) {
      updateBedStatus(targetBed.id, 'Available', undefined, undefined);
    }

    updatePatient(patientId, {
      admissionStatus: 'Discharged',
      assignedBedId: undefined,
      assignedRoomNumber: undefined,
      dischargeDate: new Date().toISOString().split('T')[0],
    });

    addNotification({
      targetRole: 'receptionist',
      title: 'Patient Discharged',
      message: `${patient.name} has been discharged. Please review final billing.`,
      type: 'billing',
      linkTab: 'billing',
    });

    return true;
  };

  const addMedicine = (medData: Omit<Medicine, 'id' | 'stockStatus'>): Medicine => {
    let stockStatus: Medicine['stockStatus'] = 'In Stock';
    if (medData.quantity <= 0) stockStatus = 'Out of Stock';
    else if (medData.quantity <= medData.minThreshold) stockStatus = 'Low Stock';

    const newMed: Medicine = {
      ...medData,
      id: `med-${Date.now()}`,
      stockStatus,
    };
    setMedicines((prev) => [newMed, ...prev]);
    return newMed;
  };

  const updateMedicineStock = (id: string, newQuantity: number) => {
    setMedicines((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          let stockStatus: Medicine['stockStatus'] = 'In Stock';
          if (newQuantity <= 0) stockStatus = 'Out of Stock';
          else if (newQuantity <= m.minThreshold) stockStatus = 'Low Stock';
          return { ...m, quantity: newQuantity, stockStatus };
        }
        return m;
      })
    );
  };

  const deleteMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const orderLabTest = (testData: Omit<LabTest, 'id' | 'status'>): LabTest => {
    const newTest: LabTest = {
      ...testData,
      id: `lab-${Date.now()}`,
      status: 'Ordered',
    };
    setLabTests((prev) => [newTest, ...prev]);

    addNotification({
      targetRole: 'patient',
      targetUserId: testData.patientId,
      title: 'Lab Test Ordered',
      message: `Diagnostic test "${testData.testName}" ordered by ${testData.doctorName}.`,
      type: 'lab',
      linkTab: 'laboratory',
    });

    return newTest;
  };

  const updateLabTest = (id: string, updates: Partial<LabTest>) => {
    setLabTests((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          if (updates.status === 'Completed' && !updated.completedDate) {
            updated.completedDate = new Date().toISOString().split('T')[0];
          }
          return updated;
        }
        return t;
      })
    );
  };

  const generateBill = (billData: Omit<Bill, 'id' | 'billNumber' | 'status' | 'pendingAmount'>): Bill => {
    const pendingAmount = Math.max(0, billData.totalAmount - billData.paidAmount);
    const status: Bill['status'] =
      pendingAmount === 0 ? 'Paid' : billData.paidAmount > 0 ? 'Partial' : 'Pending';

    const newBill: Bill = {
      ...billData,
      id: `bill-${Date.now()}`,
      billNumber: `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      pendingAmount,
      status,
    };

    setBills((prev) => [newBill, ...prev]);

    addNotification({
      targetRole: 'patient',
      targetUserId: billData.patientId,
      title: 'New Hospital Invoice Generated',
      message: `Invoice ${newBill.billNumber} for $${newBill.totalAmount.toFixed(2)} has been issued.`,
      type: 'billing',
      linkTab: 'billing',
    });

    return newBill;
  };

  const payBill = (billId: string, amount: number, paymentMethod: Bill['paymentMethod']) => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id === billId) {
          const newPaid = b.paidAmount + amount;
          const newPending = Math.max(0, b.totalAmount - newPaid);
          const newStatus: Bill['status'] = newPending === 0 ? 'Paid' : 'Partial';
          return {
            ...b,
            paidAmount: newPaid,
            pendingAmount: newPending,
            status: newStatus,
            paymentMethod: paymentMethod || b.paymentMethod,
          };
        }
        return b;
      })
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const addNotification = (notifData: Omit<HospitalNotification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: HospitalNotification = {
      ...notifData,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const resetAllToDefaults = () => {
    localStorage.clear();
    setDepartments(initialDepartments);
    setDoctors(initialDoctors);
    setPatients(initialPatients);
    setAppointments(initialAppointments);
    setBeds(initialBeds);
    setMedicines(initialMedicines);
    setLabTests(initialLabTests);
    setBills(initialBills);
    setPrescriptions(initialPrescriptions);
    setMedicalRecords(initialMedicalRecords);
    setNotifications(initialNotifications);
    setCurrentUser(initialStaffUsers[0]);
    setActiveTab('dashboard');
  };

  return (
    <HospitalContext.Provider
      value={{
        currentUser,
        currentRole,
        currentDoctor,
        currentPatient,
        departments,
        doctors,
        patients,
        appointments,
        beds,
        medicines,
        labTests,
        bills,
        prescriptions,
        medicalRecords,
        notifications,
        activeTab,
        setActiveTab,
        unreadCount,
        login,
        logout,
        switchRole,
        registerPatient,
        bookAppointment,
        updateAppointmentStatus,
        cancelAppointment,
        addPrescription,
        addMedicalRecord,
        addPatientVitals,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        addDepartment,
        addPatient,
        updatePatient,
        deletePatient,
        updateBedStatus,
        admitPatient,
        dischargePatient,
        addMedicine,
        updateMedicineStock,
        deleteMedicine,
        orderLabTest,
        updateLabTest,
        generateBill,
        payBill,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        resetAllToDefaults,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
