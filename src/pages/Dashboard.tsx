import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  MessageSquare, 
  FileText, 
  Users, 
  BarChart, 
  Activity, 
  Plus, 
  ChevronRight
} from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";
import useAuth from "@/hooks/useAuth";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useDashboardData from "@/hooks/useDashboardData";
import { isSupabaseConfigured } from "@/lib/supabase";

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

  // Role-specific card data
  const getStatCards = () => {
    switch (user?.role) {
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

  const statCards = getStatCards();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  // Show appropriate message if data is loading or there was an error
  if (isLoading) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center h-[70vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-t-quantum-vibrant-blue border-b-quantum-bright-purple border-r-quantum-glow-purple border-l-quantum-sky-blue rounded-full animate-spin" />
            <p className="text-quantum-text-paragraph text-lg">Loading your dashboard...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header section */}
          <section>
            <h1 className="text-3xl font-bold text-white">
              {greeting}, <span className="text-quantum-vibrant-blue">{user?.name?.split(' ')[0]}</span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-quantum-text-paragraph">
                Welcome to your dashboard. Here's what's happening today.
              </p>
              {!isSupabaseConfigured() && (
                <span className="px-2 py-1 text-xs rounded-full bg-amber-500/20 text-amber-300">
                  Using Mock Data
                </span>
              )}
            </div>
          </section>

          {/* Stat cards */}
          <motion.section
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {statCards.map((stat, index) => (
              <motion.div key={index} variants={item}>
                <Card className="quantum-card overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-10 rounded-xl" style={{ backgroundImage: `linear-gradient(to bottom right, ${stat.color.split('from-')[1].split(' to-')[0]}, ${stat.color.split('to-')[1]})` }} />
                  <CardHeader className="flex flex-row justify-between items-center pb-2">
                    <CardTitle className="text-lg font-medium text-white">{stat.title}</CardTitle>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r flex items-center justify-center quantum-glow" style={{ backgroundImage: `linear-gradient(to right, ${stat.color.split('from-')[1].split(' to-')[0]}, ${stat.color.split('to-')[1]})` }}>
                      {stat.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.section>

          {/* Role-specific panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent patients/activity panel - visible to medical staff */}
            {['admin', 'doctor', 'specialist', 'radiologist', 'receptionist'].includes(user?.role || '') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-2"
              >
                <Card className="quantum-card h-full">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl text-white">Recent Patients</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-transparent border border-quantum-vibrant-blue/30 text-quantum-vibrant-blue hover:bg-quantum-vibrant-blue/10 hover:text-white"
                    >
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {recentPatients.length > 0 ? recentPatients.map((patient) => (
                        <div 
                          key={patient.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-white/5 hover:border-quantum-vibrant-blue/20 transition-all duration-300 group cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-quantum-cloud to-quantum-mobile flex items-center justify-center">
                              <Users className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium text-white group-hover:text-quantum-vibrant-blue transition-colors">{patient.name}</h4>
                              <p className="text-sm text-quantum-text-secondary">{patient.condition}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              patient.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 
                              patient.status === 'In Progress' ? 'bg-quantum-vibrant-blue/20 text-quantum-vibrant-blue' :
                              'bg-quantum-bright-purple/20 text-quantum-bright-purple'
                            }`}>
                              {patient.status}
                            </span>
                            <span className="text-xs text-quantum-text-secondary mt-1">{patient.date}</span>
                          </div>
                        </div>
                      )) : (
                        <div className="flex flex-col items-center justify-center py-8 text-quantum-text-secondary">
                          <FileText className="h-12 w-12 mb-3 opacity-40" />
                          <p>No recent patients to display</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Appointments panel - visible to all */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={['admin', 'doctor', 'specialist', 'radiologist', 'receptionist'].includes(user?.role || '') ? "lg:col-span-1" : "lg:col-span-3"}
            >
              <Card className="quantum-card h-full">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingAppointments.length > 0 ? upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/20 border border-white/5 group hover:border-quantum-vibrant-blue/20 transition-all duration-300"
                    >
                      <div className="w-12 h-12 flex flex-col items-center justify-center bg-quantum-vibrant-blue/10 rounded-lg border border-quantum-vibrant-blue/20 text-quantum-vibrant-blue">
                        <span className="text-xs font-semibold">{appointment.date.split(' ')[0]}</span>
                        <span className="text-lg font-bold">{appointment.date.split(' ')[1].replace(',', '')}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white group-hover:text-quantum-vibrant-blue transition-colors">{appointment.name}</h4>
                        <p className="text-sm text-quantum-text-secondary">{appointment.type}</p>
                      </div>
                      <div className="text-sm text-quantum-text-paragraph">
                        {appointment.time}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-quantum-text-paragraph hover:text-white hover:bg-quantum-vibrant-blue/10"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-8 text-quantum-text-secondary">
                      <Calendar className="h-12 w-12 mb-3 opacity-40" />
                      <p>No upcoming appointments</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="w-full text-quantum-vibrant-blue hover:text-quantum-sky-blue hover:bg-quantum-vibrant-blue/10"
                  >
                    View Calendar
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
