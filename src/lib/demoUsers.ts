
// Demo user configuration
export const DEMO_USERS = {
  radiologist: {
    id: 'demo-radiologist-4',
    email: 'dr.chen@hospital.com',
    name: 'Dr. Emily Chen',
    role: 'radiologist' as const
  },
  doctor: {
    id: 'demo-doctor-1',
    email: 'dr.smith@hospital.com', 
    name: 'Dr. Michael Smith',
    role: 'doctor' as const
  },
  specialist: {
    id: 'demo-specialist-1',
    email: 'dr.wilson@hospital.com',
    name: 'Dr. James Wilson', 
    role: 'specialist' as const
  },
  admin: {
    id: 'demo-admin-1',
    email: 'admin@hospital.com',
    name: 'Admin User',
    role: 'admin' as const
  },
  receptionist: {
    id: 'demo-receptionist-1',
    email: 'reception@hospital.com',
    name: 'Mary Reception',
    role: 'receptionist' as const
  }
};

// Demo patient data
export const DEMO_PATIENTS = [
  {
    id: 'demo-patient-1',
    name: 'John Michael Smith',
    date_of_birth: '1975-03-15',
    gender: 'Male',
    contact_number: '+1-555-0123',
    email: 'john.smith@email.com',
    address: '123 Oak Street, Boston, MA 02115',
    medical_history: 'History of migraines, hypertension managed with medication',
    condition: 'Chronic severe headaches with neurological symptoms',
    status: 'Scheduled',
    appointment_date: '2024-06-03',
    needs_scan: true,
    emergency_contact: 'Sarah Smith (Wife) +1-555-0124',
    insurance_id: 'INS-789456123',
    blood_type: 'O+',
    allergies: 'Penicillin, Shellfish'
  },
  {
    id: 'demo-patient-2', 
    name: 'Sarah Elizabeth Davis',
    date_of_birth: '1982-07-22',
    gender: 'Female',
    contact_number: '+1-555-0234',
    email: 'sarah.davis@email.com',
    address: '456 Pine Avenue, Cambridge, MA 02139',
    medical_history: 'Previous lumbar disc herniation L4-L5, physical therapy 2019',
    condition: 'Chronic lower back pain with radiculopathy',
    status: 'In Progress',
    appointment_date: '2024-06-02',
    needs_scan: true,
    emergency_contact: 'Michael Davis (Husband) +1-555-0235',
    insurance_id: 'INS-456789123',
    blood_type: 'A-',
    allergies: 'None known'
  },
  {
    id: 'demo-patient-3',
    name: 'Michael Robert Johnson',
    date_of_birth: '1990-11-08',
    gender: 'Male',
    contact_number: '+1-555-0345',
    email: 'mike.johnson@email.com',
    address: '789 Elm Drive, Somerville, MA 02144',
    medical_history: 'Former collegiate athlete, multiple sports injuries, ACL repair 2018',
    condition: 'Sports-related knee injury with suspected meniscal tear',
    status: 'Completed',
    appointment_date: '2024-05-28',
    needs_scan: true,
    emergency_contact: 'Jennifer Johnson (Wife) +1-555-0346',
    insurance_id: 'INS-123456789',
    blood_type: 'B+',
    allergies: 'Latex'
  }
];

// Demo MRI scans
export const DEMO_SCANS = [
  {
    id: 'demo-scan-1',
    patient_id: 'demo-patient-1',
    radiologist_id: 'demo-radiologist-4',
    scan_type: 'Brain MRI T1 with Gadolinium',
    scan_date: '2024-06-01',
    image_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600',
    notes: 'Routine brain MRI for chronic headache evaluation. Patient reports worsening symptoms over 6 months.',
    ai_processed: true,
    priority: 'urgent',
    status: 'analyzed'
  },
  {
    id: 'demo-scan-2',
    patient_id: 'demo-patient-2',
    radiologist_id: 'demo-radiologist-4',
    scan_type: 'Lumbar Spine MRI',
    scan_date: '2024-05-30',
    image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600',
    notes: 'MRI lumbar spine without contrast for chronic lower back pain and radicular symptoms.',
    ai_processed: true,
    priority: 'routine',
    status: 'analyzed'
  },
  {
    id: 'demo-scan-3',
    patient_id: 'demo-patient-3',
    radiologist_id: 'demo-radiologist-4',
    scan_type: 'Knee MRI',
    scan_date: '2024-05-28',
    image_url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600',
    notes: 'MRI right knee without contrast for suspected meniscal tear and ligament injury assessment.',
    ai_processed: true,
    priority: 'routine',
    status: 'analyzed'
  }
];
