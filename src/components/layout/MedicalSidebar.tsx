import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Users,
  Calendar,
  FileText,
  Activity,
  Brain,
  Stethoscope,
  UserCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
  User
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  path: string;
  icon: React.ComponentType<any>;
  roles: string[];
  color?: string;
}

const MedicalSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems: NavItem[] = [
    { 
      title: 'Dashboard', 
      path: '/dashboard', 
      icon: Home, 
      roles: ['admin', 'doctor', 'specialist', 'radiologist', 'receptionist', 'patient'],
      color: 'text-medical-teal-500'
    },
    { 
      title: 'My Patients', 
      path: '/doctor/patients', 
      icon: Users, 
      roles: ['doctor'],
      color: 'text-medical-blue-500'
    },
    { 
      title: 'MRI Scans', 
      path: '/radiologist/scans', 
      icon: Brain, 
      roles: ['radiologist'],
      color: 'text-purple-500'
    },
    { 
      title: 'Referrals', 
      path: '/specialist/referrals', 
      icon: FileText, 
      roles: ['specialist'],
      color: 'text-quantum-purple-500'
    },
    { 
      title: 'Patient Registration', 
      path: '/receptionist/patients', 
      icon: UserCheck, 
      roles: ['receptionist'],
      color: 'text-blue-400'
    },
    { 
      title: 'Appointments', 
      path: '/patient/appointments', 
      icon: Calendar, 
      roles: ['patient'],
      color: 'text-medical-teal-500'
    },
    { 
      title: 'Medical Records', 
      path: '/patient/records', 
      icon: Activity, 
      roles: ['patient'],
      color: 'text-green-500'
    },
    { 
      title: 'Consultations', 
      path: '/specialist/consultations', 
      icon: Stethoscope, 
      roles: ['specialist'],
      color: 'text-indigo-500'
    }
  ];

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

  const filteredNavItems = navItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  const isActive = (path: string) => location.pathname === path;

  const sidebarVariants = {
    expanded: { width: '280px' },
    collapsed: { width: '80px' }
  };

  const itemVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 }
  };

  if (!user) return null;

  return (
    <motion.aside
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed left-0 top-0 h-screen z-40 glass-panel border-r border-glass-border",
        getRoleTheme(user.role)
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-glass-border">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-medical-teal-500 to-medical-blue-500 flex items-center justify-center medical-icon">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Quantum Medical</h2>
                  <p className="text-xs text-muted-foreground">Brain Tumor Detection</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="medical-icon"
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-glass-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center medical-icon">
              <User className="w-5 h-5 text-white" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  variants={itemVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="flex-1 min-w-0"
                >
                  <p className="font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredNavItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={item.path}>
                  <div
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group medical-icon",
                      active 
                        ? "medical-card bg-primary/10 text-primary border border-primary/20" 
                        : "hover:bg-muted/50"
                    )}
                  >
                    <Icon 
                      className={cn(
                        "w-5 h-5 transition-colors duration-300",
                        active ? "text-primary" : item.color || "text-muted-foreground"
                      )} 
                    />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          variants={itemVariants}
                          initial="collapsed"
                          animate="expanded"
                          exit="collapsed"
                          className={cn(
                            "font-medium transition-colors duration-300",
                            active ? "text-primary" : "text-foreground group-hover:text-primary"
                          )}
                        >
                          {item.title}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse-glow"
                      />
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-glass-border space-y-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 medical-icon",
              isCollapsed && "justify-center"
            )}
          >
            <Bell className="w-5 h-5" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  variants={itemVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                >
                  Notifications
                </motion.span>
              )}
            </AnimatePresence>
            {!isCollapsed && (
              <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse-glow" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            onClick={logout}
            className={cn(
              "w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 medical-icon",
              isCollapsed && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  variants={itemVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </motion.aside>
  );
};

export default MedicalSidebar;