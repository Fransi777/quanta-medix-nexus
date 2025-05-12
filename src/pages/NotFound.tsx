
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/shared/PageTransition";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="absolute inset-0 z-[-1]">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-quantum-glow-purple opacity-10 blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full bg-quantum-vibrant-blue opacity-10 blur-3xl" />
        </div>
        
        <div className="text-center max-w-md quantum-panel p-8 animate-fade-in">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto relative">
              <div className="absolute inset-0 rounded-full bg-quantum-vibrant-blue/30 animate-ping" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-quantum-vibrant-blue to-quantum-bright-purple flex items-center justify-center">
                <span className="text-white font-bold text-5xl">404</span>
              </div>
            </div>
          </motion.div>
          
          <h1 className="text-2xl font-bold text-white mb-4">Page Not Found</h1>
          
          <p className="text-quantum-text-paragraph mb-8">
            The page you're looking for doesn't exist or has been moved to another URL.
          </p>
          
          <Link to="/">
            <Button className="quantum-btn w-full flex items-center justify-center gap-2 group">
              <Home className="h-5 w-5 transition-transform group-hover:-translate-y-1" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFound;
