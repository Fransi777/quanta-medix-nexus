
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageTransition from "@/components/shared/PageTransition";
import useAuth from "@/hooks/useAuth";
import useDashboardData from "@/hooks/useDashboardData";
import ModernSidebar from "@/components/layout/ModernSidebar";
import ModernDashboard from "@/components/dashboard/ModernDashboard";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { recentPatients, upcomingAppointments, isLoading, error } = useDashboardData();
  const [greeting, setGreeting] = useState("Good day");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex w-full items-center justify-center">
        <div className="modern-card text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-4 mx-auto w-fit"
          >
            <Loader2 className="w-12 h-12 text-primary" />
          </motion.div>
          <h2 className="text-2xl font-semibold mb-2">Loading Dashboard...</h2>
          <p className="text-foreground/60">Preparing your personalized experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full relative">
      <ModernSidebar />
      
      <main className="flex-1 lg:ml-80 p-6 lg:p-8">
        <PageTransition>
          <ModernDashboard 
            recentPatients={recentPatients}
            upcomingAppointments={upcomingAppointments}
          />
        </PageTransition>
      </main>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        {/* Animated orbs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, hsl(263 70% 50% / 0.3) 0%, transparent 70%)",
            top: "10%",
            right: "10%"
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute w-80 h-80 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, hsl(212 100% 50% / 0.2) 0%, transparent 70%)",
            bottom: "20%",
            left: "5%"
          }}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
    </div>
  );
}
