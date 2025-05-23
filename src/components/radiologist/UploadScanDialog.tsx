
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { Loader2, Upload } from "lucide-react";
import useAuth from "@/hooks/useAuth";

interface UploadScanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function UploadScanDialog({ open, onOpenChange, onSuccess }: UploadScanDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    patient_id: "",
    scan_type: "",
    scan_date: "",
    notes: "",
  });

  // Fetch patients for dropdown
  const { data: patients } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("id, name, condition")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile || !formData.patient_id || !formData.scan_type || !formData.scan_date) {
        throw new Error("Please fill in all required fields and select a file");
      }

      // Create a unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // For demo purposes, we'll use a placeholder URL
      // In a real implementation, you would upload to storage
      const imageUrl = `https://via.placeholder.com/800x600?text=MRI+Scan+${fileName}`;

      // Insert scan record
      const { data, error } = await supabase
        .from("mri_scans")
        .insert({
          patient_id: formData.patient_id,
          radiologist_id: user?.id,
          scan_type: formData.scan_type,
          scan_date: formData.scan_date,
          notes: formData.notes,
          image_url: imageUrl,
          ai_processed: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      onSuccess();
      resetForm();
      toast({
        title: "Upload Successful",
        description: "MRI scan has been uploaded successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  const resetForm = () => {
    setSelectedFile(null);
    setFormData({
      patient_id: "",
      scan_type: "",
      scan_date: "",
      notes: "",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/dicom', 'application/dicom'];
      if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.dcm')) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a JPEG, PNG, or DICOM file",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    uploadMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload New MRI Scan</DialogTitle>
          <DialogDescription>
            Upload a new MRI scan and associate it with a patient.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Patient *</Label>
            <Select
              value={formData.patient_id}
              onValueChange={(value) => setFormData({ ...formData, patient_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients?.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name} - {patient.condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scan_type">Scan Type *</Label>
            <Select
              value={formData.scan_type}
              onValueChange={(value) => setFormData({ ...formData, scan_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select scan type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Brain MRI">Brain MRI</SelectItem>
                <SelectItem value="Spine MRI">Spine MRI</SelectItem>
                <SelectItem value="Knee MRI">Knee MRI</SelectItem>
                <SelectItem value="Shoulder MRI">Shoulder MRI</SelectItem>
                <SelectItem value="Cardiac MRI">Cardiac MRI</SelectItem>
                <SelectItem value="Abdominal MRI">Abdominal MRI</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scan_date">Scan Date *</Label>
            <Input
              id="scan_date"
              type="date"
              value={formData.scan_date}
              onChange={(e) => setFormData({ ...formData, scan_date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">MRI Image File *</Label>
            <Input
              id="file"
              type="file"
              accept=".jpg,.jpeg,.png,.dcm,.dicom"
              onChange={handleFileChange}
              required
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about the scan..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
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
            disabled={uploadMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={uploadMutation.isPending}
            className="flex items-center gap-2"
          >
            {uploadMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploadMutation.isPending ? "Uploading..." : "Upload Scan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
