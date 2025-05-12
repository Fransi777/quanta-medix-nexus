
import React from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/hooks/useDashboardData";

interface AppointmentsPanelProps {
  upcomingAppointments: Appointment[];
  isFullWidth: boolean;
}

const AppointmentsPanel: React.FC<AppointmentsPanelProps> = ({ upcomingAppointments, isFullWidth }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className={isFullWidth ? "lg:col-span-3" : "lg:col-span-1"}
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
  );
};

export default AppointmentsPanel;
