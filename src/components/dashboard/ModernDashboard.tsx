import React from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  Users, 
  Calendar, 
  FileText, 
  Activity, 
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import ModernStatCard from "./ModernStatCard";

interface ModernDashboardProps {
  recentPatients: any[];
  upcomingAppointments: any[];
}

const ModernDashboard: React.FC<ModernDashboardProps> = ({ 
  recentPatients = [], 
  upcomingAppointments = [] 
}) => {
  const { user } = useAuth();

  const getStatCards = () => {
    const base = [
      {
        title: "Total Patients",
        value: recentPatients.length.toString(),
        icon: Users,
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        trend: { value: 12, isPositive: true }
      },
      {
        title: "Appointments",
        value: upcomingAppointments.length.toString(),
        icon: Calendar,
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        trend: { value: 8, isPositive: true }
      }
    ];

    switch (user?.role) {
      case 'radiologist':
        return [
          ...base,
          {
            title: "MRI Scans",
            value: "24",
            icon: Brain,
            gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            trend: { value: 15, isPositive: true }
          },
          {
            title: "AI Accuracy",
            value: "94.2%",
            icon: Zap,
            gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
          }
        ];
      
      case 'doctor':
        return [
          ...base,
          {
            title: "Reports",
            value: "18",
            icon: FileText,
            gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
            trend: { value: 5, isPositive: false }
          },
          {
            title: "Recovery Rate",
            value: "87%",
            icon: TrendingUp,
            gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
          }
        ];

      default:
        return [
          ...base,
          {
            title: "Health Score",
            value: "85%",
            icon: Activity,
            gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
          },
          {
            title: "Next Checkup",
            value: "7 days",
            icon: Clock,
            gradient: "linear-gradient(135deg, #a8caba 0%, #5d4e75 100%)"
          }
        ];
    }
  };

  const getRoleSpecificContent = () => {
    switch (user?.role) {
      case 'radiologist':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RadiologistWorkflow />
            <MRIAnalyzer />
          </div>
        );
      
      case 'doctor':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PatientTimeline />
            <TreatmentPlans />
            <FollowUpScheduler />
          </div>
        );
      
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AppointmentScheduler />
            <HealthInsights />
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative"
      >
        <div className="modern-card aurora-bg">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-foreground/70 text-lg">
              {user?.role === 'radiologist' ? 'Ready to analyze new MRI scans' : 
               user?.role === 'doctor' ? 'Your patients are waiting for updates' :
               'Your health journey continues here'}
            </p>
          </div>
          
          {/* Floating particles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 10}%`
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStatCards().map((card, index) => (
          <ModernStatCard
            key={card.title}
            {...card}
            index={index}
          />
        ))}
      </div>

      {/* Role-specific Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {getRoleSpecificContent()}
      </motion.div>
    </div>
  );
};

// Specialized Components
const RadiologistWorkflow = () => (
  <div className="modern-card">
    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <Brain className="w-6 h-6 text-blue-400" />
      MRI Analysis Workflow
    </h3>
    <div className="space-y-4">
      {[
        { status: 'completed', task: 'Upload DICOM files', time: '2 min ago' },
        { status: 'progress', task: 'AI tumor detection', time: 'In progress...' },
        { status: 'waiting', task: 'Manual review', time: 'Pending' },
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/5">
          <div className={`w-2 h-2 rounded-full ${
            item.status === 'completed' ? 'bg-green-400' :
            item.status === 'progress' ? 'bg-blue-400 animate-pulse' : 'bg-gray-400'
          }`} />
          <div className="flex-1">
            <div className="font-medium text-sm">{item.task}</div>
            <div className="text-xs text-foreground/60">{item.time}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MRIAnalyzer = () => (
  <div className="modern-card">
    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <Zap className="w-6 h-6 text-purple-400" />
      AI Analysis Results
    </h3>
    <div className="space-y-4">
      <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-blue-500/10">
        <div className="text-3xl font-bold text-green-400 mb-2">No Tumor Detected</div>
        <div className="text-sm text-foreground/70">Confidence: 94.2%</div>
      </div>
    </div>
  </div>
);

const PatientTimeline = () => (
  <div className="modern-card">
    <h3 className="text-xl font-semibold mb-4">Patient Timeline</h3>
    <div className="modern-timeline space-y-4">
      {[
        { event: 'Initial consultation', time: '2 days ago', type: 'consultation' },
        { event: 'MRI scan ordered', time: '1 day ago', type: 'scan' },
        { event: 'Results available', time: '4 hours ago', type: 'results' },
      ].map((item, i) => (
        <div key={i} className="timeline-item">
          <div className="font-medium text-sm">{item.event}</div>
          <div className="text-xs text-foreground/60">{item.time}</div>
        </div>
      ))}
    </div>
  </div>
);

const TreatmentPlans = () => (
  <div className="modern-card">
    <h3 className="text-xl font-semibold mb-4">Active Treatment Plans</h3>
    <div className="space-y-3">
      {['Monitoring protocol', 'Follow-up imaging', 'Symptom tracking'].map((plan, i) => (
        <div key={i} className="p-3 rounded-lg bg-muted/5 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium">{plan}</span>
        </div>
      ))}
    </div>
  </div>
);

const FollowUpScheduler = () => (
  <div className="modern-card">
    <h3 className="text-xl font-semibold mb-4">Follow-up Schedule</h3>
    <div className="space-y-3">
      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <div className="font-medium text-sm">Next appointment</div>
        <div className="text-xs text-foreground/60">March 15, 2024 - 2:00 PM</div>
      </div>
    </div>
  </div>
);

const AppointmentScheduler = () => (
  <div className="modern-card">
    <h3 className="text-xl font-semibold mb-4">Upcoming Appointments</h3>
    <div className="space-y-3">
      <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10">
        <div className="font-semibold">Dr. Smith - Neurology</div>
        <div className="text-sm text-foreground/70">March 15, 2024 at 2:00 PM</div>
        <div className="text-xs text-foreground/60 mt-2">Follow-up consultation</div>
      </div>
    </div>
  </div>
);

const HealthInsights = () => (
  <div className="modern-card">
    <h3 className="text-xl font-semibold mb-4">Health Insights</h3>
    <div className="space-y-4">
      <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-teal-500/10">
        <div className="text-2xl font-bold text-green-400 mb-1">Stable</div>
        <div className="text-sm text-foreground/70">Overall health status</div>
      </div>
    </div>
  </div>
);

export default ModernDashboard;