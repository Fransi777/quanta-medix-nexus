
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import useAuth from '@/hooks/useAuth';
import { User } from '@/context/AuthContext';
import { Activity, BarChart, Calendar, FileText, MessageSquare, Plus, Users } from 'lucide-react';
import { ReactNode } from 'react';

export interface Patient {
  id: string;
  name: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Waiting';
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
  icon: ReactNode;
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
      
      try {
        // Start loading
        setData(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Generate stat cards based on user role
        const statCards = getStatCards(user);
        
        // Fetch data based on user role
        const [patientsData, appointmentsData] = await Promise.all([
          fetchRecentPatients(user),
          fetchUpcomingAppointments(user),
        ]);

        setData(prev => ({
          ...prev,
          recentPatients: patientsData,
          upcomingAppointments: appointmentsData,
          statCards: statCards,
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
    
    // Set up realtime subscription
    const setupRealtimeSubscriptions = () => {
      // Subscribe to patient changes
      const patientsChannel = supabase
        .channel('patients-changes')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'patients' 
        }, () => {
          fetchDashboardData();
        })
        .subscribe();
      
      // Subscribe to appointments changes
      const appointmentsChannel = supabase
        .channel('appointments-changes')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'appointments' 
        }, () => {
          fetchDashboardData();
        })
        .subscribe();
      
      return { patientsChannel, appointmentsChannel };
    };
    
    const channels = setupRealtimeSubscriptions();
    
    return () => {
      // Clean up subscriptions on unmount
      supabase.removeChannel(channels.patientsChannel);
      supabase.removeChannel(channels.appointmentsChannel);
    };
  }, [user, toast]);

  const fetchRecentPatients = async (user: User): Promise<Patient[]> => {
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
      
      if (query.data.length === 0) {
        // If no data from database, return mock data for development
        return getMockRecentPatients(user.role);
      }
      
      return query.data.map(patient => ({
        id: patient.id,
        name: patient.name,
        status: patient.status as 'Scheduled' | 'In Progress' | 'Completed' | 'Waiting',
        date: new Date(patient.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        condition: patient.condition
      }));
    } catch (error) {
      console.error('Error fetching recent patients:', error);
      return getMockRecentPatients(user.role);
    }
  };

  const fetchUpcomingAppointments = async (user: User): Promise<Appointment[]> => {
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
            .gte('appointment_date', new Date().toISOString().split('T')[0])
            .order('appointment_date', { ascending: true })
            .order('appointment_time', { ascending: true })
            .limit(3);
          break;
        case 'patient':
          // For patients, we need to first find their patient record
          const { data: patientRecord } = await supabase
            .from('patients')
            .select('id')
            .eq('profile_id', user.id)
            .single();
            
          if (patientRecord) {
            query = await supabase
              .from('appointments')
              .select('id, doctor_id, appointment_time, appointment_date, type')
              .eq('patient_id', patientRecord.id)
              .gte('appointment_date', new Date().toISOString().split('T')[0])
              .order('appointment_date', { ascending: true })
              .order('appointment_time', { ascending: true })
              .limit(3);
          } else {
            return getMockUpcomingAppointments(user.role);
          }
          break;
        case 'receptionist':
        case 'admin':
          query = await supabase
            .from('appointments')
            .select('id, patient_name, appointment_time, appointment_date, type')
            .gte('appointment_date', new Date().toISOString().split('T')[0])
            .order('appointment_date', { ascending: true })
            .order('appointment_time', { ascending: true })
            .limit(3);
          break;
        default:
          return getMockUpcomingAppointments(user.role);
      }

      if (query.error) throw new Error(query.error.message);
      
      if (query.data.length === 0) {
        // If no data from database, return mock data for development
        return getMockUpcomingAppointments(user.role);
      }
      
      return query.data.map(appt => ({
        id: appt.id,
        name: appt.patient_name || 'Doctor', // For patient view
        time: formatTime(appt.appointment_time),
        date: formatDate(appt.appointment_date),
        type: appt.type
      }));
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      return getMockUpcomingAppointments(user.role);
    }
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
  
  // Generate stat cards based on user role
  const getStatCards = (user: User): StatCard[] => {
    switch (user.role) {
      case "admin":
        return [
          { title: "Total Users", value: "254", icon: <Users className="h-5 w-5" />, color: "from-quantum-cloud to-quantum-mobile" },
          { title: "Active Sessions", value: "42", icon: <Activity className="h-5 w-5" />, color: "from-quantum-iot to-quantum-data-ai" },
          { title: "System Logs", value: "1,245", icon: <FileText className="h-5 w-5" />, color: "from-quantum-vibrant-blue to-quantum-sky-blue" },
          { title: "Analytics Score", value: "98%", icon: <BarChart className="h-5 w-5" />, color: "from-quantum-cybersecurity to-quantum-bright-purple" },
        ];
      case "doctor":
        return [
          { title: "Active Patients", value: "28", icon: <Users className="h-5 w-5" />, color: "from-quantum-cloud to-quantum-mobile" },
          { title: "Today's Appointments", value: "8", icon: <Calendar className="h-5 w-5" />, color: "from-quantum-iot to-quantum-data-ai" },
          { title: "Pending Reports", value: "5", icon: <FileText className="h-5 w-5" />, color: "from-quantum-vibrant-blue to-quantum-sky-blue" },
          { title: "New Messages", value: "12", icon: <MessageSquare className="h-5 w-5" />, color: "from-quantum-cybersecurity to-quantum-bright-purple" },
        ];
      case "specialist":
        return [
          { title: "Referrals", value: "15", icon: <Users className="h-5 w-5" />, color: "from-quantum-cloud to-quantum-mobile" },
          { title: "Consultations", value: "7", icon: <Calendar className="h-5 w-5" />, color: "from-quantum-iot to-quantum-data-ai" },
          { title: "Recommendations", value: "22", icon: <FileText className="h-5 w-5" />, color: "from-quantum-vibrant-blue to-quantum-sky-blue" },
          { title: "New Messages", value: "9", icon: <MessageSquare className="h-5 w-5" />, color: "from-quantum-cybersecurity to-quantum-bright-purple" },
        ];
      case "radiologist":
        return [
          { title: "Pending Scans", value: "8", icon: <FileText className="h-5 w-5" />, color: "from-quantum-cloud to-quantum-mobile" },
          { title: "Completed Analysis", value: "42", icon: <BarChart className="h-5 w-5" />, color: "from-quantum-iot to-quantum-data-ai" },
          { title: "AI Diagnoses", value: "36", icon: <Activity className="h-5 w-5" />, color: "from-quantum-vibrant-blue to-quantum-sky-blue" },
          { title: "New Messages", value: "5", icon: <MessageSquare className="h-5 w-5" />, color: "from-quantum-cybersecurity to-quantum-bright-purple" },
        ];
      case "receptionist":
        return [
          { title: "Appointments Today", value: "24", icon: <Calendar className="h-5 w-5" />, color: "from-quantum-cloud to-quantum-mobile" },
          { title: "Registered Patients", value: "156", icon: <Users className="h-5 w-5" />, color: "from-quantum-iot to-quantum-data-ai" },
          { title: "New Registrations", value: "3", icon: <Plus className="h-5 w-5" />, color: "from-quantum-vibrant-blue to-quantum-sky-blue" },
          { title: "Messages", value: "15", icon: <MessageSquare className="h-5 w-5" />, color: "from-quantum-cybersecurity to-quantum-bright-purple" },
        ];
      case "patient":
        return [
          { title: "Upcoming Appointments", value: "2", icon: <Calendar className="h-5 w-5" />, color: "from-quantum-cloud to-quantum-mobile" },
          { title: "Medical Reports", value: "8", icon: <FileText className="h-5 w-5" />, color: "from-quantum-iot to-quantum-data-ai" },
          { title: "Prescriptions", value: "3", icon: <FileText className="h-5 w-5" />, color: "from-quantum-vibrant-blue to-quantum-sky-blue" },
          { title: "Messages", value: "4", icon: <MessageSquare className="h-5 w-5" />, color: "from-quantum-cybersecurity to-quantum-bright-purple" },
        ];
      default:
        return [];
    }
  };

  // Mock data functions for fallback
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
