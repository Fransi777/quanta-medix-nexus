
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { MriScan } from "@/types/database";
import useAuth from "@/hooks/useAuth";
import PageTransition from "@/components/shared/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Brain, FileDown, Plus, AlarmCheck } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import UploadScanDialog from "@/components/radiologist/UploadScanDialog";

type MriScanWithPatient = MriScan & {
  patients: {
    name: string;
    condition: string;
    profile_id: string;
  };
};

type AIAnalysisResult = {
  assessment: string;
  abnormalities: string;
  diagnosis: string;
  recommendations: string;
  confidence_score: number;
};

// Demo data for radiologist account
const demoScans: MriScanWithPatient[] = [
  {
    id: "demo-scan-1",
    radiologist_id: "demo-radiologist-4",
    patient_id: "demo-patient-1",
    scan_type: "Brain MRI",
    scan_date: "2024-05-15",
    image_url: "https://via.placeholder.com/800x600/1e293b/64748b?text=Brain+MRI+Scan",
    ai_processed: true,
    notes: "Routine brain scan for headache investigation",
    created_at: "2024-05-15T10:00:00Z",
    updated_at: "2024-05-15T10:00:00Z",
    patients: {
      name: "John Smith",
      condition: "Chronic headaches",
      profile_id: "demo-patient-1"
    }
  },
  {
    id: "demo-scan-2",
    radiologist_id: "demo-radiologist-4",
    patient_id: "demo-patient-2",
    scan_type: "Spine MRI",
    scan_date: "2024-05-20",
    image_url: "https://via.placeholder.com/800x600/1e293b/64748b?text=Spine+MRI+Scan",
    ai_processed: false,
    notes: "Lower back pain assessment",
    created_at: "2024-05-20T14:30:00Z",
    updated_at: "2024-05-20T14:30:00Z",
    patients: {
      name: "Sarah Davis",
      condition: "Lower back pain",
      profile_id: "demo-patient-2"
    }
  },
  {
    id: "demo-scan-3",
    radiologist_id: "demo-radiologist-4",
    patient_id: "demo-patient-3",
    scan_type: "Knee MRI",
    scan_date: "2024-05-25",
    image_url: "https://via.placeholder.com/800x600/1e293b/64748b?text=Knee+MRI+Scan",
    ai_processed: true,
    notes: "Sports injury evaluation",
    created_at: "2024-05-25T09:15:00Z",
    updated_at: "2024-05-25T09:15:00Z",
    patients: {
      name: "Mike Johnson",
      condition: "Sports injury",
      profile_id: "demo-patient-3"
    }
  }
];

// Demo AI analysis results
const demoAnalysisResults: Record<string, AIAnalysisResult> = {
  "demo-scan-1": {
    assessment: "High quality brain MRI scan with excellent contrast and resolution. All major anatomical structures are clearly visualized.",
    abnormalities: "No significant abnormalities detected. Normal brain parenchyma, ventricular system, and vascular structures.",
    diagnosis: "Normal brain MRI study",
    recommendations: "No immediate follow-up required. Consider routine screening in 1-2 years if symptoms persist.",
    confidence_score: 0.92
  },
  "demo-scan-3": {
    assessment: "Detailed knee MRI showing clear visualization of cartilage, ligaments, and bone structures.",
    abnormalities: "Mild signal changes in the anterior cruciate ligament consistent with partial tear. Small joint effusion present.",
    diagnosis: "Partial ACL tear with associated joint effusion",
    recommendations: "Recommend orthopedic consultation for conservative vs. surgical management. Physical therapy may be beneficial.",
    confidence_score: 0.85
  }
};

export default function MriScansPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedScan, setSelectedScan] = useState<MriScanWithPatient | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [viewMode, setViewMode] = useState<"image" | "analysis">("image");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Check if user is demo radiologist
  const isDemoUser = user?.id === "demo-radiologist-4";

  // Fetch MRI scans
  const { data: scans, isLoading, refetch } = useQuery({
    queryKey: ["mriScans", user?.id],
    queryFn: async () => {
      // Return demo data for demo user
      if (isDemoUser) {
        return demoScans;
      }

      // Fetch real data from Supabase
      const { data, error } = await supabase
        .from("mri_scans")
        .select("*, patients(name, condition, profile_id)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as MriScanWithPatient[];
    },
    enabled: !!user
  });

  // AI analysis mutation
  const analyzeMutation = useMutation({
    mutationFn: async (scanId: string) => {
      setIsAnalyzing(true);
      
      // For demo users, simulate analysis
      if (isDemoUser) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Return mock analysis
        return {
          analysis: {
            assessment: "AI analysis completed successfully. High quality scan with good contrast resolution.",
            abnormalities: "Minor degenerative changes consistent with normal aging process.",
            diagnosis: "No significant pathology detected",
            recommendations: "Routine follow-up in 6-12 months if symptoms persist.",
            confidence_score: 0.78
          }
        };
      }

      // Real Supabase function call
      const response = await supabase.functions.invoke('analyze-mri-scan', {
        body: { scanId }
      });
      
      if (response.error) {
        throw new Error(response.error.message || "Failed to analyze scan");
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      setAnalysisResult(data.analysis);
      setViewMode("analysis");
      
      // Update demo data if needed
      if (isDemoUser && selectedScan) {
        const scanIndex = demoScans.findIndex(s => s.id === selectedScan.id);
        if (scanIndex !== -1) {
          demoScans[scanIndex].ai_processed = true;
        }
      }
      
      refetch();
      toast({
        title: "Analysis Complete",
        description: "The MRI scan has been successfully analyzed",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
    onSettled: () => {
      setIsAnalyzing(false);
    },
  });

  // Handle analyze scan
  const handleAnalyzeScan = (scan: MriScanWithPatient) => {
    setSelectedScan(scan);
    
    // For demo users, check if we have existing analysis
    if (isDemoUser && demoAnalysisResults[scan.id]) {
      setAnalysisResult(demoAnalysisResults[scan.id]);
      setViewMode("analysis");
      toast({
        title: "Analysis Available",
        description: "This scan has already been analyzed. Viewing existing analysis.",
      });
      return;
    }
    
    if (scan.ai_processed) {
      // If already processed, show message that analysis exists
      toast({
        title: "Analysis Available",
        description: "This scan has already been analyzed. View the analysis in the Analysis tab.",
      });
      setViewMode("analysis");
    } else {
      // If not processed, perform new analysis
      analyzeMutation.mutate(scan.id);
    }
  };

  // View MRI scan
  const handleViewScan = (scan: MriScanWithPatient) => {
    setSelectedScan(scan);
    setViewMode("image");
    
    // Load existing analysis if available
    if (isDemoUser && demoAnalysisResults[scan.id]) {
      setAnalysisResult(demoAnalysisResults[scan.id]);
    } else {
      setAnalysisResult(null);
    }
  };

  // Get confidence level
  const getConfidenceLevel = (score: number) => {
    if (score >= 0.7) return { label: "High", color: "bg-green-500" };
    if (score >= 0.4) return { label: "Medium", color: "bg-yellow-500" };
    return { label: "Low", color: "bg-red-500" };
  };

  // Handle successful upload
  const handleUploadSuccess = () => {
    refetch();
    setShowUploadDialog(false);
    toast({
      title: "Upload Successful",
      description: "MRI scan has been uploaded successfully",
    });
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="container mx-auto p-6 flex justify-center items-center min-h-[calc(100vh-6rem)]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading MRI scans...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">MRI Scans Management</h1>
            {isDemoUser && (
              <p className="text-sm text-muted-foreground mt-1">Demo Mode - Sample data displayed</p>
            )}
          </div>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setShowUploadDialog(true)}
          >
            <Plus className="h-4 w-4" />
            Upload New Scan
          </Button>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Available Scans</span>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  Total: {scans?.length || 0}
                </Badge>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Analyzed: {scans?.filter(scan => scan.ai_processed).length || 0}
                </Badge>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  Pending: {scans?.filter(scan => !scan.ai_processed).length || 0}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Scan Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scans && scans.length > 0 ? (
                  scans.map((scan) => (
                    <TableRow key={scan.id}>
                      <TableCell>{scan.patients?.name || "Unknown"}</TableCell>
                      <TableCell>{scan.scan_type}</TableCell>
                      <TableCell>{format(new Date(scan.scan_date), "MMM d, yyyy")}</TableCell>
                      <TableCell>{scan.patients?.condition || "Not specified"}</TableCell>
                      <TableCell>
                        {scan.ai_processed ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Analyzed
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                            Pending Analysis
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewScan(scan)}
                          >
                            View
                          </Button>
                          <Button
                            variant={scan.ai_processed ? "outline" : "default"}
                            size="sm"
                            onClick={() => handleAnalyzeScan(scan)}
                          >
                            {scan.ai_processed ? "View Analysis" : "Analyze"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No MRI scans available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* MRI Scan Viewer Dialog */}
        <Dialog open={!!selectedScan} onOpenChange={(open) => !open && setSelectedScan(null)}>
          <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>
                {selectedScan?.patients?.name}'s {selectedScan?.scan_type} Scan
              </DialogTitle>
              <DialogDescription>
                Scan Date: {selectedScan?.scan_date && format(new Date(selectedScan.scan_date), "MMMM d, yyyy")}
                {isDemoUser && " (Demo Data)"}
              </DialogDescription>
            </DialogHeader>

            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value as "image" | "analysis")}
              className="flex-grow flex flex-col"
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="image">Scan Image</TabsTrigger>
                <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="image" className="flex-grow flex flex-col">
                <div className="flex-grow bg-black rounded-md flex items-center justify-center overflow-hidden">
                  {selectedScan?.image_url ? (
                    <img
                      src={selectedScan.image_url}
                      alt="MRI Scan"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <p className="text-gray-400">No image available</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="flex-grow">
                {isAnalyzing ? (
                  <div className="flex-grow flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <Brain className="h-12 w-12 animate-pulse text-primary" />
                      <p className="text-lg font-medium">Analyzing MRI Scan...</p>
                      <p className="text-sm text-muted-foreground">
                        {isDemoUser ? "Simulating AI analysis..." : "Please wait while AI processes the image"}
                      </p>
                    </div>
                  </div>
                ) : analysisResult ? (
                  <div className="space-y-6 overflow-y-auto h-full p-4">
                    {analysisResult.assessment && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Assessment</h3>
                        <p className="text-gray-700">{analysisResult.assessment}</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Abnormalities</h3>
                      <p className="text-gray-700">
                        {analysisResult.abnormalities || "None identified"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Diagnosis</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-gray-700">{analysisResult.diagnosis}</p>
                        {analysisResult.confidence_score && (
                          <Badge className={`${getConfidenceLevel(analysisResult.confidence_score).color} text-white`}>
                            {getConfidenceLevel(analysisResult.confidence_score).label} Confidence
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Recommendations</h3>
                      <p className="text-gray-700">
                        {analysisResult.recommendations || "No specific recommendations"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center">
                    <p className="text-muted-foreground">No analysis available</p>
                    {selectedScan && !selectedScan.ai_processed && (
                      <Button
                        className="mt-4"
                        onClick={() => selectedScan && handleAnalyzeScan(selectedScan)}
                      >
                        <AlarmCheck className="mr-2 h-4 w-4" />
                        Run Analysis Now
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter className="flex justify-between">
              <div className="flex items-center">
                {selectedScan?.notes && (
                  <Badge variant="outline" className="mr-4">
                    {selectedScan.notes}
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedScan(null)}>
                  Close
                </Button>
                <Button variant="outline">
                  <FileDown className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Upload Dialog */}
        <UploadScanDialog 
          open={showUploadDialog}
          onOpenChange={setShowUploadDialog}
          onSuccess={handleUploadSuccess}
        />
      </div>
    </PageTransition>
  );
}
