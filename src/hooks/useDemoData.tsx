
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { DEMO_PATIENTS, DEMO_SCANS, DEMO_USERS } from "@/lib/demoUsers";
import useAuth from "./useAuth";

export default function useDemoData() {
  const { user } = useAuth();
  
  // Check if user is a demo user
  const isDemoUser = user && Object.values(DEMO_USERS).some(demoUser => demoUser.id === user.id);

  const { data: patients = [], isLoading: patientsLoading } = useQuery({
    queryKey: ["demo-patients"],
    queryFn: async () => {
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
    queryFn: async () => {
      if (!isDemoUser) {
        // For real users, fetch from Supabase
        const { data, error } = await supabase
          .from("mri_scans")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        return data || [];
      }
      
      // For demo users, return demo data
      return DEMO_SCANS;
    },
    enabled: !!user,
  });

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ["demo-appointments"],
    queryFn: async () => {
      if (!isDemoUser) {
        // For real users, fetch from Supabase
        const { data, error } = await supabase
          .from("appointments")
          .select("*")
          .order("appointment_date", { ascending: true });
        
        if (error) throw error;
        return data || [];
      }
      
      // For demo users, return demo appointments
      return [
        {
          id: 'demo-appointment-1',
          patient_id: 'demo-patient-1',
          patient_name: 'John Michael Smith',
          appointment_date: '2024-06-03',
          appointment_time: '09:00',
          type: 'Neurology Consultation',
          status: 'Scheduled',
          notes: 'Post-MRI consultation to discuss brain scan findings and treatment plan'
        },
        {
          id: 'demo-appointment-2',
          patient_id: 'demo-patient-2',
          patient_name: 'Sarah Elizabeth Davis',
          appointment_date: '2024-06-02',
          appointment_time: '14:30',
          type: 'Orthopedic Follow-up',
          status: 'In Progress',
          notes: 'Review lumbar MRI results and discuss treatment options'
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
