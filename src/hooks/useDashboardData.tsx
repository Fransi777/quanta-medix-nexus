
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import useAuth from '@/hooks/useAuth';
import { User } from '@/context/AuthContext';

export interface Patient {
  id: string;
  name: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  date: string;
  condition: string;
}

export interface Appointment {
  id: string;
  name: string;
  time: string;
  date: string;
  type: string;
}

export interface StatCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

interface DashboardData {
  recentPatients: Patient[];
  upcomingAppointments: Appointment[];
  statCards: StatCard[];
  isLoading: boolean;
  error: string | null;
}

const useDashboardData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<DashboardData>({
    recentPatients: [],
    upcomingAppointments: [],
    statCards: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setData(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      // If Supabase is not configured, fall back to mock data
      if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured. Using mock data.');
        setData(prev => ({ 
          ...prev, 
          isLoading: false,
          recentPatients: getMockRecentPatients(user.role),
          upcomingAppointments: getMockUpcomingAppointments(user.role),
        }));
        return;
      }

      try {
        // Start loading
        setData(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Fetch data based on user role
        const [patientsData, appointmentsData] = await Promise.all([
          fetchRecentPatients(user),
          fetchUpcomingAppointments(user),
        ]);

        setData(prev => ({
          ...prev,
          recentPatients: patientsData,
          upcomingAppointments: appointmentsData,
          isLoading: false,
        }));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dashboard data';
        
        setData(prev => ({ 
          ...prev, 
          error: errorMessage, 
          isLoading: false,
          // Fall back to mock data on error
          recentPatients: getMockRecentPatients(user.role),
          upcomingAppointments: getMockUpcomingAppointments(user.role),
        }));
        
        toast({
          variant: 'destructive',
          title: 'Data Fetch Error',
          description: errorMessage,
        });
      }
    };

    fetchDashboardData();
    
    // Set up realtime subscription if Supabase is configured
    if (isSupabaseConfigured() && user) {
      setupRealtimeSubscription(user);
    }
    
    return () => {
      // Clean up subscription on unmount
      if (isSupabaseConfigured()) {
        supabase.removeAllChannels();
      }
    };
  }, [user, toast]);

  const fetchRecentPatients = async (user: User): Promise<Patient[]> => {
    if (!isSupabaseConfigured()) return getMockRecentPatients(user.role);
    
    try {
      // Different queries based on role
      let query;
      
      switch (user.role) {
        case 'doctor':
        case 'specialist':
          query = await supabase
            .from('patients')
            .select('id, name, status, appointment_date, condition')
            .eq('assigned_doctor_id', user.id)
            .order('appointment_date', { ascending: false })
            .limit(3);
          break;
        case 'radiologist':
          query = await supabase
            .from('patients')
            .select('id, name, status, appointment_date, condition')
            .eq('needs_scan', true)
            .order('appointment_date', { ascending: false })
            .limit(3);
          break;
        case 'receptionist':
        case 'admin':
          query = await supabase
            .from('patients')
            .select('id, name, status, appointment_date, condition')
            .order('appointment_date', { ascending: false })
            .limit(3);
          break;
        default:
          return getMockRecentPatients(user.role);
      }

      if (query.error) throw new Error(query.error.message);
      
      return query.data.map(patient => ({
        id: patient.id,
        name: patient.name,
        status: patient.status,
        date: new Date(patient.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        condition: patient.condition
      }));
    } catch (error) {
      console.error('Error fetching recent patients:', error);
      return getMockRecentPatients(user.role);
    }
  };

  const fetchUpcomingAppointments = async (user: User): Promise<Appointment[]> => {
    if (!isSupabaseConfigured()) return getMockUpcomingAppointments(user.role);
    
    try {
      // Different queries based on role
      let query;
      
      switch (user.role) {
        case 'doctor':
        case 'specialist':
          query = await supabase
            .from('appointments')
            .select('id, patient_name, appointment_time, appointment_date, type')
            .eq('doctor_id', user.id)
            .gte('appointment_date', new Date().toISOString())
            .order('appointment_date', { ascending: true })
            .limit(3);
          break;
        case 'patient':
          query = await supabase
            .from('appointments')
            .select('id, doctor:doctor_id(name), appointment_time, appointment_date, type')
            .eq('patient_id', user.id)
            .gte('appointment_date', new Date().toISOString())
            .order('appointment_date', { ascending: true })
            .limit(3);
          break;
        case 'receptionist':
        case 'admin':
          query = await supabase
            .from('appointments')
            .select('id, patient_name, appointment_time, appointment_date, type')
            .gte('appointment_date', new Date().toISOString())
            .order('appointment_date', { ascending: true })
            .limit(3);
          break;
        default:
          return getMockUpcomingAppointments(user.role);
      }

      if (query.error) throw new Error(query.error.message);
      
      return query.data.map(appt => ({
        id: appt.id,
        name: appt.patient_name || (appt.doctor?.name || 'Doctor'),
        time: formatTime(appt.appointment_time),
        date: formatDate(appt.appointment_date),
        type: appt.type
      }));
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      return getMockUpcomingAppointments(user.role);
    }
  };

  const setupRealtimeSubscription = (user: User) => {
    // Subscribe to changes in patients table
    if (['doctor', 'specialist', 'radiologist', 'receptionist', 'admin'].includes(user.role)) {
      supabase
        .channel('patients-changes')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'patients' 
        }, () => {
          fetchDashboardData();
        })
        .subscribe();
    }

    // Subscribe to appointments changes
    supabase
      .channel('appointments-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'appointments' 
      }, () => {
        fetchDashboardData();
      })
      .subscribe();

    // Add more subscriptions as needed
  };

  // Helper function to format time
  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
    } catch {
      return time; // Fallback to the original format
    }
  };

  // Helper function to format date
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr; // Fallback to the original format
    }
  };

  const fetchDashboardData = async () => {
    if (!user) return;
    
    const [patientsData, appointmentsData] = await Promise.all([
      fetchRecentPatients(user),
      fetchUpcomingAppointments(user),
    ]);

    setData(prev => ({
      ...prev,
      recentPatients: patientsData,
      upcomingAppointments: appointmentsData,
      isLoading: false,
    }));
  };

  // Mock data functions
  const getMockRecentPatients = (role: User['role']): Patient[] => {
    return [
      { id: "1", name: "James Wilson", status: "Scheduled", date: "May 15, 2025", condition: "Routine Checkup" },
      { id: "2", name: "Emma Thompson", status: "In Progress", date: "May 12, 2025", condition: "MRI Scan" },
      { id: "3", name: "David Garcia", status: "Completed", date: "May 10, 2025", condition: "Post-Surgery Consultation" },
    ];
  };

  const getMockUpcomingAppointments = (role: User['role']): Appointment[] => {
    return [
      { id: "1", name: "Sarah Johnson", time: "09:00 AM", date: "May 16, 2025", type: "General Checkup" },
      { id: "2", name: "Robert Chen", time: "11:30 AM", date: "May 16, 2025", type: "Specialist Consultation" },
      { id: "3", name: "Lisa Wong", time: "02:15 PM", date: "May 17, 2025", type: "Follow-up" },
    ];
  };

  return data;
};

export default useDashboardData;
