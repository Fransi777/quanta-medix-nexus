import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Brain,
  Calendar,
  FileText,
  Heart,
  Stethoscope,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Zap,
  Shield,
  Eye
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface RoleSpecificDashboardProps {
  recentPatients?: any[];
  upcomingAppointments?: any[];
}

const RoleSpecificDashboard: React.FC<RoleSpecificDashboardProps> = ({
  recentPatients = [],
  upcomingAppointments = []
}) => {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const PatientDashboard = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="theme-patient space-y-6"
    >
      {/* Case Timeline */}
      <motion.div variants={itemVariants} className="medical-card">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-medical-teal-500 medical-icon" />
          <h3 className="text-xl font-semibold">My Case Timeline</h3>
        </div>
        <div className="space-y-4">
          {[
            { status: 'Upload Complete', date: '2024-01-15', icon: CheckCircle, color: 'text-green-500' },
            { status: 'AI Processing', date: '2024-01-16', icon: Brain, color: 'text-blue-500' },
            { status: 'Radiologist Review', date: 'Pending', icon: Eye, color: 'text-amber-500' },
            { status: 'Doctor Consultation', date: 'Scheduled', icon: Stethoscope, color: 'text-purple-500' }
          ].map((item, index) => (
            <div key={index} className="timeline-item">
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5 medical-icon", item.color)} />
                <span className="font-medium">{item.status}</span>
                <span className="text-sm text-muted-foreground ml-auto">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Report Downloads */}
      <motion.div variants={itemVariants} className="medical-card">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-medical-teal-500 medical-icon" />
          <h3 className="text-xl font-semibold">Available Reports</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['MRI Analysis Report', 'Treatment Plan', 'Lab Results'].map((report, index) => (
            <div key={index} className="glass-panel p-4 hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-medical-blue-500 medical-icon" />
                <div>
                  <p className="font-medium">{report}</p>
                  <p className="text-sm text-muted-foreground">Ready for download</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  const RadiologistDashboard = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="theme-radiologist theme-dark space-y-6"
    >
      {/* MRI Upload */}
      <motion.div variants={itemVariants} className="medical-card">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-purple-400 medical-icon" />
          <h3 className="text-xl font-semibold text-white">MRI Scan Upload</h3>
        </div>
        <div className="border-2 border-dashed border-purple-400/30 rounded-lg p-8 text-center hover:border-purple-400/50 transition-colors duration-300">
          <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-float medical-icon" />
          <p className="text-lg font-medium text-white mb-2">Drop DICOM files here</p>
          <p className="text-sm text-gray-400">or click to browse</p>
        </div>
      </motion.div>

      {/* AI Inference Panel */}
      <motion.div variants={itemVariants} className="medical-card">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6 text-blue-400 medical-icon" />
          <h3 className="text-xl font-semibold text-white">AI Analysis Progress</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-blue-400 border-t-transparent animate-spin"></div>
            <div>
              <p className="text-white font-medium">Processing MRI Scan...</p>
              <p className="text-sm text-gray-400">Tumor segmentation in progress</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Approval Queue */}
      <motion.div variants={itemVariants} className="medical-card">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-6 h-6 text-green-400 medical-icon" />
          <h3 className="text-xl font-semibold text-white">Pending Approvals</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="glass-panel p-4 hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Patient #{item}23{item}</p>
                  <p className="text-sm text-gray-400">MRI Analysis Complete</p>
                </div>
                <div className="flex gap-2">
                  <button className="medical-btn px-3 py-1 text-sm">Approve</button>
                  <button className="glass-panel px-3 py-1 text-sm text-amber-400 border border-amber-400/30">Review</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  const DoctorDashboard = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="theme-doctor space-y-6"
    >
      {/* Patient History */}
      <motion.div variants={itemVariants} className="medical-card">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-medical-blue-500 medical-icon" />
          <h3 className="text-xl font-semibold">Recent Patients</h3>
        </div>
        <div className="space-y-3">
          {recentPatients.slice(0, 5).map((patient, index) => (
            <div key={index} className="glass-panel p-4 hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{patient.full_name}</p>
                  <p className="text-sm text-muted-foreground">{patient.condition}</p>
                </div>
                <span className={cn("status-indicator", {
                  'status-completed': patient.status === 'Completed',
                  'status-progress': patient.status === 'In Progress',
                  'status-scheduled': patient.status === 'Scheduled',
                  'status-waiting': patient.status === 'Waiting'
                })}>
                  {patient.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Treatment Notes */}
      <motion.div variants={itemVariants} className="medical-card">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-medical-blue-500 medical-icon" />
          <h3 className="text-xl font-semibold">Treatment Notes</h3>
        </div>
        <textarea 
          className="medical-input w-full h-32 resize-none" 
          placeholder="Add treatment notes..."
        />
        <div className="flex justify-end mt-4">
          <button className="medical-btn">Save Notes</button>
        </div>
      </motion.div>
    </motion.div>
  );

  const SpecialistDashboard = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="theme-specialist space-y-6"
    >
      {/* Referral Queue */}
      <motion.div variants={itemVariants} className="medical-card">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-quantum-purple-500 medical-icon" />
          <h3 className="text-xl font-semibold">Referral Queue</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <motion.div
              key={item}
              className="glass-panel p-4 hover:scale-105 transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-quantum-purple-500">REF-00{item}</span>
                <span className="status-indicator status-scheduled">New</span>
              </div>
              <p className="font-medium">Patient Case #{item}</p>
              <p className="text-sm text-muted-foreground">Brain tumor assessment</p>
              <div className="flex justify-end mt-3">
                <button className="medical-btn text-sm px-3 py-1">Review</button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Collaborative Notes */}
      <motion.div variants={itemVariants} className="medical-card">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-quantum-purple-500 medical-icon" />
          <h3 className="text-xl font-semibold">Collaborative Notes</h3>
        </div>
        <div className="space-y-3">
          {[
            { author: 'Dr. Smith', note: 'MRI shows significant improvement', time: '2 hours ago' },
            { author: 'Dr. Johnson', note: 'Recommend follow-up in 3 months', time: '1 day ago' }
          ].map((note, index) => (
            <div key={index} className="glass-panel p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-quantum-purple-500 to-medical-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">{note.author.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{note.author}</p>
                  <p className="text-xs text-muted-foreground">{note.time}</p>
                </div>
              </div>
              <p className="text-sm">{note.note}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  const ReceptionistDashboard = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="theme-receptionist space-y-6"
    >
      {/* Appointment Calendar */}
      <motion.div variants={itemVariants} className="medical-card">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-blue-400 medical-icon" />
          <h3 className="text-xl font-semibold">Today's Appointments</h3>
        </div>
        <div className="space-y-3">
          {upcomingAppointments.slice(0, 6).map((appointment, index) => (
            <div key={index} className="glass-panel p-4 hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{appointment.patient_name}</p>
                  <p className="text-sm text-muted-foreground">{appointment.appointment_time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">{appointment.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Case Tracking */}
      <motion.div variants={itemVariants} className="medical-card">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-blue-400 medical-icon" />
          <h3 className="text-xl font-semibold">Case Status Tracking</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'New Cases', count: 12, color: 'text-blue-500' },
            { label: 'In Progress', count: 8, color: 'text-amber-500' },
            { label: 'Under Review', count: 5, color: 'text-purple-500' },
            { label: 'Completed', count: 23, color: 'text-green-500' }
          ].map((stat, index) => (
            <div key={index} className="glass-panel p-4 text-center">
              <p className={cn("text-2xl font-bold mb-1", stat.color)}>{stat.count}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  // Render role-specific dashboard
  switch (user?.role) {
    case 'patient':
      return <PatientDashboard />;
    case 'radiologist':
      return <RadiologistDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'specialist':
      return <SpecialistDashboard />;
    case 'receptionist':
      return <ReceptionistDashboard />;
    default:
      return <PatientDashboard />;
  }
};

export default RoleSpecificDashboard;