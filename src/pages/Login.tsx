import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import PageTransition from "@/components/shared/PageTransition";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      // Toast is already displayed in the login function
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-quantum-dark-indigo-from to-quantum-dark-indigo-to z-[-1]" />
        <div className="absolute inset-0 z-[-1]">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-quantum-glow-purple opacity-10 blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-quantum-vibrant-blue opacity-10 blur-3xl" />
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
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to Quantum Medical</h1>
            <p className="text-quantum-text-paragraph">Sign in to continue to your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-quantum-vibrant-blue hover:text-quantum-sky-blue">
                  Forgot password?
                </Link>
              </div>
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
                  Sign In
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-quantum-text-secondary">
              Don't have an account?{" "}
              <Link to="/register" className="text-quantum-vibrant-blue hover:text-quantum-sky-blue">
                Register here
              </Link>
            </p>
          </div>

          {/* Updated demo account information with all roles */}
          <div className="mt-8 p-4 rounded-lg bg-muted/30 border border-white/5">
            <h3 className="text-sm font-medium text-white mb-2">Demo Accounts</h3>
            <div className="space-y-2 text-xs text-quantum-text-paragraph">
              <p><span className="text-quantum-sky-blue">Admin:</span> admin@quantum.med / admin123</p>
              <p><span className="text-quantum-sky-blue">Doctor:</span> doctor@quantum.med / doctor123</p>
              <p><span className="text-quantum-sky-blue">Specialist:</span> specialist@quantum.med / specialist123</p>
              <p><span className="text-quantum-sky-blue">Radiologist:</span> radiologist@quantum.med / radiologist123</p>
              <p><span className="text-quantum-sky-blue">Receptionist:</span> receptionist@quantum.med / receptionist123</p>
              <p><span className="text-quantum-sky-blue">Patient:</span> patient@quantum.med / patient123</p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
