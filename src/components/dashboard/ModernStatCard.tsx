import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ModernStatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  gradient: string;
  index: number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const ModernStatCard: React.FC<ModernStatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  gradient, 
  index,
  trend 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.23, 1, 0.32, 1]
      }}
      whileHover={{ 
        scale: 1.02,
        y: -4,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="group"
    >
      <div className="modern-card relative">
        {/* Aurora background effect */}
        <div className="absolute inset-0 opacity-5 rounded-xl">
          <div 
            className="w-full h-full rounded-xl"
            style={{
              background: gradient
            }}
          />
        </div>
        
        {/* Floating orb effect */}
        <motion.div 
          className="absolute -top-2 -right-2 w-16 h-16 rounded-full opacity-10"
          style={{
            background: gradient
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header with icon */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center modern-icon relative overflow-hidden"
                style={{
                  background: gradient + "20"
                }}
              >
                <Icon className="w-6 h-6 text-white" />
                
                {/* Icon glow effect */}
                <motion.div 
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: gradient,
                    opacity: 0
                  }}
                  whileHover={{
                    opacity: 0.3
                  }}
                />
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground/90 text-sm">
                  {title}
                </h3>
                {trend && (
                  <div className={`text-xs flex items-center gap-1 ${
                    trend.isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <span>{trend.isPositive ? '↗' : '↙'}</span>
                    {Math.abs(trend.value)}%
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Value */}
          <div className="mb-4">
            <motion.div
              className="text-3xl font-bold text-foreground mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              {value}
            </motion.div>
          </div>
          
          {/* Progress bar */}
          <div className="relative h-2 bg-muted/20 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: gradient
              }}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ 
                duration: 1.5, 
                delay: index * 0.2 + 0.5,
                ease: [0.23, 1, 0.32, 1]
              }}
            />
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: [-32, 300]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>
        
        {/* Hover glow effect */}
        <motion.div 
          className="absolute inset-0 rounded-xl opacity-0 pointer-events-none"
          style={{
            boxShadow: `0 0 40px ${gradient.replace('linear-gradient(135deg, ', '').split(',')[0]}40`
          }}
          whileHover={{
            opacity: 1
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

export default ModernStatCard;