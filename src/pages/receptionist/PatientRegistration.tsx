
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, Calendar, FileText } from "lucide-react";
import PatientRegistrationDialog from "@/components/receptionist/PatientRegistrationDialog";
import { Badge } from "@/components/ui/badge";
import useAuth from "@/hooks/useAuth";

export default function PatientRegistration() {
  const { user } = useAuth();
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);

  // Fetch all patients
  const { data: patients, refetch: refetchPatients } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select(`
          *,
          patient_registrations (
            id,
            registered_by,
            registration_date,
            notes,
            profiles (name)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch registration statistics
  const { data: stats } = useQuery({
    queryKey: ["registration_stats"],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const [
        { count: totalPatients },
        { count: todayRegistrations },
        { count: needingScans },
        { count: scheduledToday }
      ] = await Promise.all([
        supabase.from("patients").select("*", { count: "exact", head: true }),
        supabase.from("patients").select("*", { count: "exact", head: true })
          .gte("created_at", `${today}T00:00:00.000Z`),
        supabase.from("patients").select("*", { count: "exact", head: true })
          .eq("needs_scan", true),
        supabase.from("patients").select("*", { count: "exact", head: true })
          .eq("appointment_date", today),
      ]);

      return {
        totalPatients: totalPatients || 0,
        todayRegistrations: todayRegistrations || 0,
        needingScans: needingScans || 0,
        scheduledToday: scheduledToday || 0,
      };
    },
  });

  const handleRegistrationSuccess = () => {
    setShowRegistrationDialog(false);
    refetchPatients();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Patient Registration</h1>
          <p className="text-quantum-text-secondary">Manage patient registrations and information</p>
        </div>
        <Button 
          onClick={() => setShowRegistrationDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Register New Patient
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="quantum-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-quantum-vibrant-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.totalPatients || 0}</div>
          </CardContent>
        </Card>

        <Card className="quantum-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Today's Registrations</CardTitle>
            <Plus className="h-4 w-4 text-quantum-glow-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.todayRegistrations || 0}</div>
          </CardContent>
        </Card>

        <Card className="quantum-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Need MRI Scan</CardTitle>
            <FileText className="h-4 w-4 text-quantum-bright-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.needingScans || 0}</div>
          </CardContent>
        </Card>

        <Card className="quantum-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Scheduled Today</CardTitle>
            <Calendar className="h-4 w-4 text-quantum-sky-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.scheduledToday || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Patients List */}
      <Card className="quantum-card">
        <CardHeader>
          <CardTitle className="text-white">Recent Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patients && patients.length > 0 ? (
              patients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-white/5 hover:border-quantum-vibrant-blue/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-quantum-cloud to-quantum-mobile flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{patient.name}</h4>
                      <p className="text-sm text-quantum-text-secondary">{patient.condition}</p>
                      <p className="text-xs text-quantum-text-secondary">
                        Appointment: {new Date(patient.appointment_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      variant={
                        patient.status === 'Completed' ? 'default' : 
                        patient.status === 'In Progress' ? 'secondary' : 
                        'outline'
                      }
                    >
                      {patient.status}
                    </Badge>
                    {patient.needs_scan && (
                      <Badge variant="outline" className="text-quantum-bright-purple border-quantum-bright-purple">
                        Needs MRI
                      </Badge>
                    )}
                    <span className="text-xs text-quantum-text-secondary">
                      Registered: {new Date(patient.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-quantum-text-secondary">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>No patients registered yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <PatientRegistrationDialog
        open={showRegistrationDialog}
        onOpenChange={setShowRegistrationDialog}
        onSuccess={handleRegistrationSuccess}
      />
    </div>
  );
}
