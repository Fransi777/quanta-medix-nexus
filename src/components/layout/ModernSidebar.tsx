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
  Bell,
  LogOut,
  User,
  Menu,
  X,
  Zap
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  path: string;
  icon: React.ComponentType<any>;
  roles: string[];
  gradient?: string;
}

const ModernSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems: NavItem[] = [
    { 
      title: 'Dashboard', 
      path: '/dashboard', 
      icon: Home, 
      roles: ['admin', 'doctor', 'specialist', 'radiologist', 'receptionist', 'patient'],
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    { 
      title: 'My Patients', 
      path: '/doctor/patients', 
      icon: Users, 
      roles: ['doctor'],
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    { 
      title: 'MRI Scans', 
      path: '/radiologist/scans', 
      icon: Brain, 
      roles: ['radiologist'],
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    { 
      title: 'Referrals', 
      path: '/specialist/referrals', 
      icon: FileText, 
      roles: ['specialist'],
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    { 
      title: 'Patient Registration', 
      path: '/receptionist/patients', 
      icon: UserCheck, 
      roles: ['receptionist'],
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    { 
      title: 'Appointments', 
      path: '/patient/appointments', 
      icon: Calendar, 
      roles: ['patient'],
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    { 
      title: 'Medical Records', 
      path: '/patient/records', 
      icon: Activity, 
      roles: ['patient'],
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    },
    { 
      title: 'Consultations', 
      path: '/specialist/consultations', 
      icon: Stethoscope, 
      roles: ['specialist'],
      gradient: 'linear-gradient(135deg, #a8caba 0%, #5d4e75 100%)'
    }
  ];

  const filteredNavItems = navItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-4 left-4 z-50 lg:hidden modern-btn"
      >
        {isCollapsed ? <Menu /> : <X />}
      </Button>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsCollapsed(true)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isCollapsed ? -300 : 0 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="floating-nav fixed left-6 top-1/2 -translate-y-1/2 z-50 lg:translate-x-0 lg:relative lg:left-0 lg:top-0 lg:translate-y-0 h-fit max-h-[90vh] overflow-y-auto"
      >
        <div className="flex flex-col gap-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center modern-icon">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h2 className="font-bold text-lg bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Quantum Medical
            </h2>
            <p className="text-xs text-foreground/60 mt-1">
              Brain Tumor Detection
            </p>
          </motion.div>

          {/* User Profile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="modern-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center modern-icon">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate text-foreground">
                  {user.name}
                </p>
                <p className="text-xs text-foreground/60 capitalize truncate">
                  {user.role}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="space-y-2">
            {filteredNavItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link to={item.path}>
                    <motion.div
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl transition-all duration-300 relative overflow-hidden group",
                        active 
                          ? "bg-white/10 text-white" 
                          : "hover:bg-white/5 text-foreground/80 hover:text-white"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Active indicator */}
                      {active && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: item.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            opacity: 0.2
                          }}
                        />
                      )}
                      
                      {/* Icon container */}
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                        active ? "bg-white/20" : "bg-white/10 group-hover:bg-white/20"
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      
                      {/* Label */}
                      <span className="font-medium text-sm">
                        {item.title}
                      </span>
                      
                      {/* Glow effect on hover */}
                      <motion.div
                        className="absolute inset-0 rounded-xl opacity-0 pointer-events-none"
                        style={{
                          boxShadow: `0 0 30px ${item.gradient?.split(',')[0]?.split('(')[1] || '#667eea'}40`
                        }}
                        whileHover={{ opacity: 1 }}
                      />
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-2 pt-4 border-t border-white/10"
          >
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-foreground/80 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Notifications</span>
              <motion.div
                className="ml-auto w-2 h-2 rounded-full bg-red-500"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </Button>
            
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Logout</span>
            </Button>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500/30 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-500/30 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </motion.aside>
    </>
  );
};

export default ModernSidebar;