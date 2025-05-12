
export interface Profile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: "admin" | "doctor" | "specialist" | "radiologist" | "receptionist" | "patient";
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: string;
  profile_id: string;
  name: string;
  date_of_birth: string;
  gender: string;
  contact_number: string;
  email: string;
  address: string;
  medical_history: string;
  assigned_doctor_id?: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Waiting";
  appointment_date: string;
  condition: string;
  needs_scan: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  type: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface MriScan {
  id: string;
  patient_id: string;
  radiologist_id: string;
  image_url: string;
  scan_date: string;
  scan_type: string;
  notes: string;
  ai_processed: boolean;
  created_at: string;
  updated_at: string;
}

export interface AiResult {
  id: string;
  mri_scan_id: string;
  patient_id: string;
  diagnosis: string;
  confidence_score: number;
  areas_of_concern: string;
  recommendations: string;
  created_at: string;
  updated_at: string;
}

export interface Diagnosis {
  id: string;
  patient_id: string;
  doctor_id: string;
  mri_scan_id?: string;
  diagnosis: string;
  treatment_plan: string;
  medications: string;
  follow_up_date: string;
  created_at: string;
  updated_at: string;
}

export interface Referral {
  id: string;
  patient_id: string;
  referring_doctor_id: string;
  specialist_id: string;
  reason: string;
  status: "Pending" | "Accepted" | "Completed" | "Rejected";
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface PatientHistory {
  id: string;
  patient_id: string;
  event_type: "appointment" | "diagnosis" | "referral" | "scan" | "note";
  event_id: string;
  notes: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  table_name: string;
  record_id: string;
  details: string;
  created_at: string;
}
