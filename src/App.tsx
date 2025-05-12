
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Context Providers
import { AuthProvider } from "@/context/AuthContext";

// Layout Components
import AuthGuard from "@/components/layout/AuthGuard";
import NavBar from "@/components/shared/NavBar";

// Page Components
import HomePage from "@/pages/HomePage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <NavBar />
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <AuthGuard>
                    <Dashboard />
                  </AuthGuard>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/*" 
                element={
                  <AuthGuard allowedRoles={["admin"]}>
                    <Routes>
                      <Route path="/users" element={<div className="container mx-auto p-8 text-white">Admin Users Page - Coming Soon</div>} />
                      <Route path="/audit" element={<div className="container mx-auto p-8 text-white">Admin Audit Page - Coming Soon</div>} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </AuthGuard>
                }
              />
              
              {/* Doctor Routes */}
              <Route 
                path="/doctor/*" 
                element={
                  <AuthGuard allowedRoles={["doctor"]}>
                    <Routes>
                      <Route path="/patients" element={<div className="container mx-auto p-8 text-white">Doctor Patients Page - Coming Soon</div>} />
                      <Route path="/referrals" element={<div className="container mx-auto p-8 text-white">Doctor Referrals Page - Coming Soon</div>} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </AuthGuard>
                }
              />
              
              {/* Specialist Routes */}
              <Route 
                path="/specialist/*" 
                element={
                  <AuthGuard allowedRoles={["specialist"]}>
                    <Routes>
                      <Route path="/referrals" element={<div className="container mx-auto p-8 text-white">Specialist Referrals Page - Coming Soon</div>} />
                      <Route path="/consultations" element={<div className="container mx-auto p-8 text-white">Specialist Consultations Page - Coming Soon</div>} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </AuthGuard>
                }
              />
              
              {/* Radiologist Routes */}
              <Route 
                path="/radiologist/*" 
                element={
                  <AuthGuard allowedRoles={["radiologist"]}>
                    <Routes>
                      <Route path="/scans" element={<div className="container mx-auto p-8 text-white">Radiologist Scans Page - Coming Soon</div>} />
                      <Route path="/analysis" element={<div className="container mx-auto p-8 text-white">Radiologist Analysis Page - Coming Soon</div>} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </AuthGuard>
                }
              />
              
              {/* Receptionist Routes */}
              <Route 
                path="/receptionist/*" 
                element={
                  <AuthGuard allowedRoles={["receptionist"]}>
                    <Routes>
                      <Route path="/patients" element={<div className="container mx-auto p-8 text-white">Receptionist Patients Page - Coming Soon</div>} />
                      <Route path="/appointments" element={<div className="container mx-auto p-8 text-white">Receptionist Appointments Page - Coming Soon</div>} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </AuthGuard>
                }
              />
              
              {/* Patient Routes */}
              <Route 
                path="/patient/*" 
                element={
                  <AuthGuard allowedRoles={["patient"]}>
                    <Routes>
                      <Route path="/records" element={<div className="container mx-auto p-8 text-white">Patient Records Page - Coming Soon</div>} />
                      <Route path="/appointments" element={<div className="container mx-auto p-8 text-white">Patient Appointments Page - Coming Soon</div>} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </AuthGuard>
                }
              />
              
              {/* Messaging Routes - Available to medical staff */}
              <Route 
                path="/messages" 
                element={
                  <AuthGuard allowedRoles={["admin", "doctor", "specialist", "radiologist"]}>
                    <div className="container mx-auto p-8 text-white">Messages Page - Coming Soon</div>
                  </AuthGuard>
                }
              />
              
              {/* Catch-all route for 404 pages */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
