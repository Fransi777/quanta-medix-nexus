
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { DEMO_PATIENTS, DEMO_SCANS, DEMO_USERS } from "@/lib/demoUsers";
import { Patient, Appointment, MriScan } from "@/types/database";
import useAuth from "./useAuth";

export default function useDemoData() {
  const { user } = useAuth();
  
  // Check if user is a demo user
  const isDemoUser = user && Object.values(DEMO_USERS).some(demoUser => demoUser.id === user.id);

  const { data: patients = [], isLoading: patientsLoading } = useQuery({
    queryKey: ["demo-patients"],
    queryFn: async (): Promise<Patient[]> => {
      if (!isDemoUser) {
        // For real users, fetch from Supabase
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        return data || [];
      }
      
      // For demo users, return demo data
      return DEMO_PATIENTS;
    },
    enabled: !!user,
  });

  const { data: scans = [], isLoading: scansLoading } = useQuery({
    queryKey: ["demo-scans"],
    queryFn: async (): Promise<MriScan[]> => {
      if (!isDemoUser) {
        // For real users, fetch from Supabase
        const { data, error } = await supabase
          .from("mri_scans")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        // Add default values for missing fields
        return (data || []).map(scan => ({
          ...scan,
          priority: undefined,
          status: undefined
        }));
      }
      
      // For demo users, return demo data
      return DEMO_SCANS;
    },
    enabled: !!user,
  });

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ["demo-appointments"],
    queryFn: async (): Promise<Appointment[]> => {
      if (!isDemoUser) {
        // For real users, fetch from Supabase
        const { data, error } = await supabase
          .from("appointments")
          .select("*")
          .order("appointment_date", { ascending: true });
        
        if (error) throw error;
        return data || [];
      }
      
      // For demo users, return demo appointments with all required fields
      return [
        {
          id: 'demo-appointment-1',
          patient_id: 'demo-patient-1',
          doctor_id: 'demo-doctor-1',
          patient_name: 'John Michael Smith',
          appointment_date: '2024-06-03',
          appointment_time: '09:00',
          type: 'Neurology Consultation',
          status: 'Scheduled' as const,
          notes: 'Post-MRI consultation to discuss brain scan findings and treatment plan',
          created_at: '2024-06-01T10:00:00Z',
          updated_at: '2024-06-01T10:00:00Z'
        },
        {
          id: 'demo-appointment-2',
          patient_id: 'demo-patient-2',
          doctor_id: 'demo-doctor-1',
          patient_name: 'Sarah Elizabeth Davis',
          appointment_date: '2024-06-02',
          appointment_time: '14:30',
          type: 'Orthopedic Follow-up',
          status: 'In Progress' as const,
          notes: 'Review lumbar MRI results and discuss treatment options',
          created_at: '2024-06-01T10:00:00Z',
          updated_at: '2024-06-01T10:00:00Z'
        }
      ];
    },
    enabled: !!user,
  });

  return {
    patients,
    scans,
    appointments,
    isLoading: patientsLoading || scansLoading || appointmentsLoading,
    isDemoUser,
  };
}
