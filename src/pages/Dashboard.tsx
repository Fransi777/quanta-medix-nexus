
import { useEffect, useState } from "react";
import PageTransition from "@/components/shared/PageTransition";
import useAuth from "@/hooks/useAuth";
import useDashboardData from "@/hooks/useDashboardData";

// Dashboard Components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCardsSection from "@/components/dashboard/StatCardsSection";
import RecentPatientsPanel from "@/components/dashboard/RecentPatientsPanel";
import AppointmentsPanel from "@/components/dashboard/AppointmentsPanel";
import LoadingState from "@/components/dashboard/LoadingState";

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

  // Determine if the user role should see the recent patients panel
  const shouldShowRecentPatients = ['admin', 'doctor', 'specialist', 'radiologist', 'receptionist'].includes(user?.role || '');

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header section */}
          <DashboardHeader 
            greeting={greeting} 
            username={user?.name?.split(' ')[0]} 
          />

          {/* Stat cards */}
          <StatCardsSection user={user} />

          {/* Role-specific panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent patients/activity panel - visible to medical staff */}
            {shouldShowRecentPatients && (
              <RecentPatientsPanel recentPatients={recentPatients} />
            )}

            {/* Appointments panel - visible to all */}
            <AppointmentsPanel 
              upcomingAppointments={upcomingAppointments} 
              isFullWidth={!shouldShowRecentPatients}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
