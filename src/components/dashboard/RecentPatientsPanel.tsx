
import React from "react";
import { motion } from "framer-motion";
import { FileText, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Patient } from "@/types/database";

interface RecentPatientsPanelProps {
  recentPatients: Patient[];
}

const RecentPatientsPanel: React.FC<RecentPatientsPanelProps> = ({ recentPatients }) => {
  return (
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
                  <span className="text-xs text-quantum-text-secondary mt-1">{patient.appointment_date}</span>
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
  );
};

export default RecentPatientsPanel;
