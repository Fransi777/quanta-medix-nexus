
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
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };
  
  return (
    <motion.div variants={item}>
      <Card className="quantum-card overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br opacity-10 rounded-xl" 
          style={{ 
            backgroundImage: `linear-gradient(to bottom right, ${color.split('from-')[1].split(' to-')[0]}, ${color.split('to-')[1]})` 
          }} 
        />
        <CardHeader className="flex flex-row justify-between items-center pb-2">
          <CardTitle className="text-lg font-medium text-white">{title}</CardTitle>
          <div 
            className="w-10 h-10 rounded-full bg-gradient-to-r flex items-center justify-center quantum-glow" 
            style={{ 
              backgroundImage: `linear-gradient(to right, ${color.split('from-')[1].split(' to-')[0]}, ${color.split('to-')[1]})` 
            }}
          >
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-white">{value}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;
