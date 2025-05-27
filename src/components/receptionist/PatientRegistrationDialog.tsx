
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserPlus } from "lucide-react";
import useAuth from "@/hooks/useAuth";

interface PatientRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function PatientRegistrationDialog({ 
  open, 
  onOpenChange, 
  onSuccess 
}: PatientRegistrationDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date_of_birth: "",
    gender: "",
    contact_number: "",
    address: "",
    condition: "",
    medical_history: "",
    appointment_date: "",
    status: "Scheduled",
    needs_scan: false,
    registration_notes: "",
  });

  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: async () => {
      if (!formData.name || !formData.email || !formData.date_of_birth || 
          !formData.gender || !formData.contact_number || !formData.address || 
          !formData.condition || !formData.appointment_date) {
        throw new Error("Please fill in all required fields");
      }

      // Insert patient record
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .insert({
          name: formData.name,
          email: formData.email,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          contact_number: formData.contact_number,
          address: formData.address,
          condition: formData.condition,
          medical_history: formData.medical_history,
          appointment_date: formData.appointment_date,
          status: formData.status,
          needs_scan: formData.needs_scan,
        })
        .select()
        .single();

      if (patientError) throw patientError;

      // Insert patient registration record
      const { error: registrationError } = await supabase
        .from("patient_registrations")
        .insert({
          patient_id: patientData.id,
          registered_by: user?.id,
          notes: formData.registration_notes,
        });

      if (registrationError) throw registrationError;

      return patientData;
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patient_registrations"] });
      
      onSuccess();
      resetForm();
      toast({
        title: "Registration Successful",
        description: "Patient has been registered successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      date_of_birth: "",
      gender: "",
      contact_number: "",
      address: "",
      condition: "",
      medical_history: "",
      appointment_date: "",
      status: "Scheduled",
      needs_scan: false,
      registration_notes: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New Patient</DialogTitle>
          <DialogDescription>
            Register a new patient in the system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth *</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_number">Contact Number *</Label>
              <Input
                id="contact_number"
                value={formData.contact_number}
                onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointment_date">Appointment Date *</Label>
              <Input
                id="appointment_date"
                type="date"
                value={formData.appointment_date}
                onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Medical Condition *</Label>
            <Input
              id="condition"
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              placeholder="e.g., Routine Checkup, Brain Injury, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medical_history">Medical History</Label>
            <Textarea
              id="medical_history"
              value={formData.medical_history}
              onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
              placeholder="Previous medical conditions, surgeries, medications..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Waiting">Waiting</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex items-center">
              <input
                id="needs_scan"
                type="checkbox"
                checked={formData.needs_scan}
                onChange={(e) => setFormData({ ...formData, needs_scan: e.target.checked })}
                className="mr-2"
              />
              <Label htmlFor="needs_scan">Patient needs MRI scan</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="registration_notes">Registration Notes</Label>
            <Textarea
              id="registration_notes"
              value={formData.registration_notes}
              onChange={(e) => setFormData({ ...formData, registration_notes: e.target.value })}
              placeholder="Additional notes about the registration..."
              rows={2}
            />
          </div>
        </form>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              onOpenChange(false);
              resetForm();
            }}
            disabled={registerMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={registerMutation.isPending}
            className="flex items-center gap-2"
          >
            {registerMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            {registerMutation.isPending ? "Registering..." : "Register Patient"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
