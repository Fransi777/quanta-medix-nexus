
import { Link, useLocation } from "react-router-dom";
import { User, LogOut, Bell, Menu, X } from "lucide-react";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Role-specific navigation items
  const roleBasedNavItems = () => {
    if (!user) return [];

    const navItems = [
      { title: "Dashboard", path: "/dashboard", roles: ["admin", "doctor", "specialist", "radiologist", "receptionist", "patient"] },
    ];

    if (user.role === "admin") {
      navItems.push(
        { title: "Users", path: "/admin/users", roles: ["admin"] },
        { title: "Audit Logs", path: "/admin/audit", roles: ["admin"] }
      );
    }

    if (user.role === "doctor") {
      navItems.push(
        { title: "My Patients", path: "/doctor/patients", roles: ["doctor"] },
        { title: "Referrals", path: "/doctor/referrals", roles: ["doctor"] }
      );
    }

    if (user.role === "specialist") {
      navItems.push(
        { title: "Referrals", path: "/specialist/referrals", roles: ["specialist"] },
        { title: "Consultations", path: "/specialist/consultations", roles: ["specialist"] }
      );
    }

    if (user.role === "radiologist") {
      navItems.push(
        { title: "MRI Scans", path: "/radiologist/scans", roles: ["radiologist"] },
        { title: "Analysis", path: "/radiologist/analysis", roles: ["radiologist"] }
      );
    }

    if (user.role === "receptionist") {
      navItems.push(
        { title: "Patients", path: "/receptionist/patients", roles: ["receptionist"] },
        { title: "Appointments", path: "/receptionist/appointments", roles: ["receptionist"] }
      );
    }

    if (user.role === "patient") {
      navItems.push(
        { title: "Medical Records", path: "/patient/records", roles: ["patient"] },
        { title: "Appointments", path: "/patient/appointments", roles: ["patient"] }
      );
    }

    // Add messaging to appropriate roles
    if (["admin", "doctor", "specialist", "radiologist"].includes(user.role)) {
      navItems.push({ title: "Messages", path: "/messages", roles: ["admin", "doctor", "specialist", "radiologist"] });
    }

    return navItems.filter(item => item.roles.includes(user.role));
  };

  const navItems = roleBasedNavItems();

  return (
    <header className="sticky top-0 z-50 w-full bg-quantum-deep-purple/70 backdrop-blur-lg border-b border-white/10 animate-fade-in">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-quantum-vibrant-blue to-quantum-bright-purple flex items-center justify-center shadow-lg quantum-glow">
              <span className="text-white font-bold text-lg">QM</span>
            </div>
            <span className="font-bold text-xl text-white hidden md:block">Quantum Medical</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="text-white"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Desktop Navigation */}
        {user && (
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-white",
                  location.pathname === item.path
                    ? "text-white"
                    : "text-quantum-text-paragraph"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        )}

        {/* User menu and notifications */}
        {user ? (
          <div className="flex items-center gap-4">
            {/* Notification bell */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-quantum-text-paragraph" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-quantum-vibrant-blue"></span>
            </Button>
            
            {/* User menu dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative rounded-full h-9 w-9 bg-gradient-to-r from-quantum-vibrant-blue to-quantum-bright-purple text-white flex items-center justify-center"
                >
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 quantum-panel" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">{user.name}</p>
                    <p className="text-xs leading-none text-quantum-text-secondary">{user.email}</p>
                    <p className="text-xs leading-none text-quantum-sky-blue capitalize">{user.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-quantum-text-paragraph hover:text-white cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline" className="quantum-btn-secondary">Login</Button>
            </Link>
            <Link to="/register">
              <Button className="quantum-btn">Register</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && user && (
        <div className="md:hidden">
          <div className="quantum-panel mx-4 mb-4 p-4 flex flex-col space-y-2 animate-slide-in-right">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors px-3 py-2 rounded-md",
                  location.pathname === item.path
                    ? "bg-quantum-vibrant-blue/20 text-white"
                    : "text-quantum-text-paragraph hover:bg-quantum-vibrant-blue/10"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            <Button 
              variant="ghost" 
              className="flex items-center justify-start text-sm font-medium text-quantum-text-paragraph hover:bg-quantum-vibrant-blue/10 hover:text-white mt-4"
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
