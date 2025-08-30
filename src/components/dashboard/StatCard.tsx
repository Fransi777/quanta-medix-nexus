
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, index }) => {
  const item = {
    hidden: { y: 20, opacity: 0, scale: 0.9 },
    show: { y: 0, opacity: 1, scale: 1 },
  };
  
  return (
    <motion.div 
      variants={item}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="medical-card overflow-hidden relative group">
        <div 
          className="absolute inset-0 opacity-5 rounded-xl transition-opacity duration-300 group-hover:opacity-10"
          style={{ 
            background: `linear-gradient(135deg, ${color.split('from-')[1]?.split(' to-')[0] || '#3AB8A5'}, ${color.split('to-')[1] || '#2D6AE3'})` 
          }} 
        />
        <CardHeader className="flex flex-row justify-between items-center pb-3 relative z-10">
          <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center medical-icon animate-float">
            {icon}
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, delay: index * 0.2 }}
            />
          </div>
        </CardContent>
        
        {/* Animated corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
          <div 
            className="w-full h-full rounded-bl-full animate-pulse-glow"
            style={{ 
              background: `linear-gradient(135deg, ${color.split('from-')[1]?.split(' to-')[0] || '#3AB8A5'}, ${color.split('to-')[1] || '#2D6AE3'})` 
            }}
          />
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;
