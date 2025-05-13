import React from "react";
import { motion } from "framer-motion";
import StatCard from "./StatCard";
import { User } from "@/context/AuthContext";
import { Calendar, MessageSquare, FileText, Users, BarChart, Activity, Plus } from "lucide-react";

interface StatCardType {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

interface StatCardsSectionProps {
  user: User | null;
}

const StatCardsSection: React.FC<StatCardsSectionProps> = ({ user }) => {
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
  
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {statCards.map((stat, index) => (
        <StatCard 
          key={index} 
          index={index}
          title={stat.title} 
          value={stat.value} 
          icon={stat.icon} 
          color={stat.color}
        />
      ))}
    </motion.section>
  );
};

export default StatCardsSection;
