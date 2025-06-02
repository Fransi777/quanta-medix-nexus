
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import useDemoData from "./useDemoData";
import useAuth from "./useAuth";

export default function useDashboardData() {
  const { user } = useAuth();
  const { patients: demoPatients, appointments: demoAppointments, isDemoUser } = useDemoData();

  // Recent patients query
  const { data: recentPatients = [], isLoading: patientsLoading } = useQuery({
    queryKey: ["recent-patients"],
    queryFn: async () => {
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
      return data || [];
    },
    enabled: !!user,
  });

  // Upcoming appointments query
  const { data: upcomingAppointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ["upcoming-appointments"],
    queryFn: async () => {
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
      return data || [];
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
