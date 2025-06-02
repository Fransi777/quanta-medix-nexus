
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PageTransition from "@/components/shared/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Eye, Brain, Clock, AlertTriangle } from "lucide-react";
import UploadScanDialog from "@/components/radiologist/UploadScanDialog";
import useDemoData from "@/hooks/useDemoData";
import useAuth from "@/hooks/useAuth";

export default function MriScansDemo() {
  const { user } = useAuth();
  const { scans, isLoading, isDemoUser } = useDemoData();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  console.log("MriScansDemo: user =", user);
  console.log("MriScansDemo: scans =", scans);
  console.log("MriScansDemo: isDemoUser =", isDemoUser);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'secondary';
      case 'routine': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzed': return 'default';
      case 'pending': return 'secondary';
      case 'processing': return 'outline';
      default: return 'outline';
    }
  };

  const handleUploadSuccess = () => {
    setUploadDialogOpen(false);
    // In demo mode, we don't need to refetch as data is static
    if (!isDemoUser) {
      // For real users, you might want to invalidate queries here
    }
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">MRI Scans</h1>
              <p className="text-muted-foreground">
                {isDemoUser ? "Demo data - " : ""}Manage and analyze MRI scans
              </p>
            </div>
            <Button 
              onClick={() => setUploadDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload New Scan
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{scans.length}</div>
                <p className="text-xs text-muted-foreground">All MRI scans</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Analyzed</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {scans.filter(scan => scan.ai_processed).length}
                </div>
                <p className="text-xs text-muted-foreground">AI processed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {scans.filter(scan => !scan.ai_processed).length}
                </div>
                <p className="text-xs text-muted-foreground">Awaiting analysis</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Urgent</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {scans.filter(scan => scan.priority === 'urgent').length}
                </div>
                <p className="text-xs text-muted-foreground">High priority</p>
              </CardContent>
            </Card>
          </div>

          {/* Scans Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent MRI Scans</CardTitle>
              <CardDescription>
                All MRI scans ordered by most recent
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scans.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No scans found</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload your first MRI scan to get started
                  </p>
                  <Button onClick={() => setUploadDialogOpen(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Scan
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Scan Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scans.map((scan) => (
                      <TableRow key={scan.id}>
                        <TableCell className="font-medium">
                          {scan.patient_id || 'Unknown Patient'}
                        </TableCell>
                        <TableCell>{scan.scan_type}</TableCell>
                        <TableCell>{scan.scan_date}</TableCell>
                        <TableCell>
                          <Badge variant={getPriorityColor(scan.priority)}>
                            {scan.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(scan.status)}>
                            {scan.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <UploadScanDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          onSuccess={handleUploadSuccess}
        />
      </div>
    </PageTransition>
  );
}
