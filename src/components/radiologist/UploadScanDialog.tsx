
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
    scan_type: "",
    scan_date: "",
    notes: "",
  });

  // Check if user is demo radiologist
  const isDemoUser = user?.id === "demo-radiologist-4";

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile || !formData.scan_type || !formData.scan_date) {
        throw new Error("Please fill in all required fields and select a file");
      }

      console.log("Starting upload with user:", user);

      // Handle demo user uploads
      if (isDemoUser) {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Create mock scan data
        const mockScan = {
          id: `demo-scan-${Date.now()}`,
          radiologist_id: user.id,
          patient_id: "demo-patient-new",
          scan_type: formData.scan_type,
          scan_date: formData.scan_date,
          notes: formData.notes,
          image_url: `https://via.placeholder.com/800x600/1e293b/64748b?text=${encodeURIComponent(formData.scan_type)}+Demo+Scan`,
          ai_processed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        console.log("Demo upload successful:", mockScan);
        return mockScan;
      }

      // Real Supabase upload for non-demo users
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", user?.email)
        .single();

      if (profileError || !profile) {
        console.error("Profile error:", profileError);
        throw new Error("Unable to find user profile. Please ensure you are logged in.");
      }

      console.log("Found profile:", profile);

      // Create a unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // For demo purposes, we'll use a placeholder URL
      // In a real implementation, you would upload to storage
      const imageUrl = `https://via.placeholder.com/800x600?text=MRI+Scan+${fileName}`;

      console.log("Inserting scan with radiologist_id:", profile.id);

      // Insert scan record with proper UUID
      const { data, error } = await supabase
        .from("mri_scans")
        .insert({
          radiologist_id: profile.id, // Use the profile UUID instead of user.id
          scan_type: formData.scan_type,
          scan_date: formData.scan_date,
          notes: formData.notes,
          image_url: imageUrl,
          ai_processed: false,
        })
        .select()
        .single();

      if (error) {
        console.error("Insert error:", error);
        throw error;
      }

      console.log("Successfully inserted scan:", data);
      return data;
    },
    onSuccess: () => {
      onSuccess();
      resetForm();
      toast({
        title: "Upload Successful",
        description: isDemoUser 
          ? "Demo MRI scan has been uploaded successfully" 
          : "MRI scan has been uploaded successfully",
      });
    },
    onError: (error) => {
      console.error("Upload mutation error:", error);
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
            Upload a new MRI scan to the system.
            {isDemoUser && " (Demo Mode - Upload will be simulated)"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            {isDemoUser && (
              <p className="text-xs text-blue-600">
                Note: In demo mode, file content is not actually processed
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
            {uploadMutation.isPending ? 
              (isDemoUser ? "Simulating Upload..." : "Uploading...") : 
              "Upload Scan"
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
