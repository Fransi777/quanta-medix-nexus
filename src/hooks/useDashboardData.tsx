
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import useDemoData from "./useDemoData";
import useAuth from "./useAuth";
import { Patient, Appointment } from "@/types/database";

export default function useDashboardData() {
  const { user } = useAuth();
  const { patients: demoPatients, appointments: demoAppointments, isDemoUser } = useDemoData();

  // Recent patients query
  const { data: recentPatients = [], isLoading: patientsLoading } = useQuery({
    queryKey: ["recent-patients"],
    queryFn: async (): Promise<Patient[]> => {
      if (isDemoUser) {
        // Return demo data for demo users
        return demoPatients.slice(0, 5);
      }

      // Real query for authenticated users
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      // Cast the status to the correct type
      return (data || []).map(patient => ({
        ...patient,
        status: patient.status as Patient['status']
      }));
    },
    enabled: !!user,
  });

  // Upcoming appointments query
  const { data: upcomingAppointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ["upcoming-appointments"],
    queryFn: async (): Promise<Appointment[]> => {
      if (isDemoUser) {
        // Return demo data for demo users
        return demoAppointments.slice(0, 5);
      }

      // Real query for authenticated users
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .gte("appointment_date", new Date().toISOString().split('T')[0])
        .order("appointment_date", { ascending: true })
        .limit(5);

      if (error) throw error;
      // Cast the status to the correct type
      return (data || []).map(appointment => ({
        ...appointment,
        status: appointment.status as Appointment['status']
      }));
    },
    enabled: !!user,
  });

  return {
    recentPatients,
    upcomingAppointments,
    isLoading: patientsLoading || appointmentsLoading,
    error: null,
  };
}
