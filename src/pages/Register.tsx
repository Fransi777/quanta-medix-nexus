
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import PageTransition from "@/components/shared/PageTransition";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User as UserType } from "@/context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserType["role"]>("patient");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await register(email, password, name, role);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-quantum-dark-indigo-from to-quantum-dark-indigo-to z-[-1]" />
        <div className="absolute inset-0 z-[-1]">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-quantum-glow-purple opacity-10 blur-3xl" />
          <div className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-quantum-vibrant-blue opacity-10 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="quantum-panel w-full max-w-md p-8 quantum-glow"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-r from-quantum-vibrant-blue to-quantum-bright-purple flex items-center justify-center shadow-lg quantum-glow">
              <span className="text-white font-bold text-2xl">QM</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Create an Account</h1>
            <p className="text-quantum-text-paragraph">Join the Quantum Medical Platform</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-quantum-text-secondary" />
                <Input
                  type="text"
                  placeholder="Full Name"
                  className="pl-10 quantum-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-quantum-text-secondary" />
                <Input
                  type="email"
                  placeholder="Email"
                  className="pl-10 quantum-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-quantum-text-secondary" />
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-10 quantum-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-quantum-text-secondary" />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  className="pl-10 quantum-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-quantum-text-secondary">Register as</label>
              <Select value={role} onValueChange={(value) => setRole(value as UserType["role"])}>
                <SelectTrigger className="quantum-input">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="quantum-panel">
                  <SelectItem value="patient" className="text-quantum-text-paragraph">Patient</SelectItem>
                  <SelectItem value="doctor" className="text-quantum-text-paragraph">Doctor</SelectItem>
                  <SelectItem value="specialist" className="text-quantum-text-paragraph">Specialist</SelectItem>
                  <SelectItem value="radiologist" className="text-quantum-text-paragraph">Radiologist</SelectItem>
                  <SelectItem value="receptionist" className="text-quantum-text-paragraph">Receptionist</SelectItem>
                  <SelectItem value="admin" className="text-quantum-text-paragraph">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full quantum-btn flex items-center justify-center gap-2 group"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-quantum-text-secondary">
              Already have an account?{" "}
              <Link to="/login" className="text-quantum-vibrant-blue hover:text-quantum-sky-blue">
                Login here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
