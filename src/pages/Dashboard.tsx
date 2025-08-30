
import { useEffect, useState } from "react";
import PageTransition from "@/components/shared/PageTransition";
import useAuth from "@/hooks/useAuth";
import useDashboardData from "@/hooks/useDashboardData";

// Dashboard Components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCardsSection from "@/components/dashboard/StatCardsSection";
import LoadingState from "@/components/dashboard/LoadingState";
import RoleSpecificDashboard from "@/components/dashboard/RoleSpecificDashboard";
import MedicalSidebar from "@/components/layout/MedicalSidebar";

export default function Dashboard() {
  const { user } = useAuth();
  const { recentPatients, upcomingAppointments, isLoading, error } = useDashboardData();
  const [greeting, setGreeting] = useState("Good day");

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  // Show appropriate message if data is loading or there was an error
  if (isLoading) {
    return <LoadingState />;
  }

  const getRoleTheme = (role: string) => {
    switch (role) {
      case 'patient': return 'theme-patient';
      case 'radiologist': return 'theme-radiologist theme-dark';
      case 'doctor': return 'theme-doctor';
      case 'specialist': return 'theme-specialist';
      case 'receptionist': return 'theme-receptionist';
      default: return 'theme-patient';
    }
  };

  return (
    <div className={`min-h-screen flex w-full ${getRoleTheme(user?.role || 'patient')}`}>
      <MedicalSidebar />
      
      <main className="flex-1 ml-[280px] transition-all duration-300">
        <PageTransition>
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col gap-8">
              {/* Header section */}
              <DashboardHeader 
                greeting={greeting} 
                username={user?.name?.split(' ')[0]} 
              />

              {/* Stat cards */}
              <StatCardsSection user={user} />

              {/* Role-specific dashboard content */}
              <RoleSpecificDashboard 
                recentPatients={recentPatients}
                upcomingAppointments={upcomingAppointments}
              />
            </div>
          </div>
        </PageTransition>
      </main>
    </div>
  );
}
