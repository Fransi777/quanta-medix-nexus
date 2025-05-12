
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Shield, Users, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/shared/PageTransition";

export default function HomePage() {
  const navigate = useNavigate();

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const featureVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.6
      }
    }
  };

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Role-Based Access",
      description: "Specialized dashboards for doctors, specialists, radiologists, receptionists, and patients.",
      color: "from-quantum-cloud to-quantum-mobile"
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Real-time Analysis",
      description: "Instant AI-powered diagnosis and medical data interpretation.",
      color: "from-quantum-vibrant-blue to-quantum-sky-blue"
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Advanced Imaging",
      description: "Upload, view and analyze MRI scans with AI-assistance.",
      color: "from-quantum-iot to-quantum-data-ai"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Communication",
      description: "End-to-end encrypted real-time messaging between medical professionals.",
      color: "from-quantum-cybersecurity to-quantum-bright-purple"
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-quantum-dark-indigo-from to-quantum-dark-indigo-to z-[-1]" />
          
          {/* Background glow elements */}
          <div className="absolute inset-0 z-[-1]">
            <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-quantum-glow-purple opacity-20 blur-3xl" />
            <div className="absolute bottom-1/2 right-1/4 w-80 h-80 rounded-full bg-quantum-vibrant-blue opacity-15 blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4">
            <motion.div 
              className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20"
              variants={heroVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Text content */}
              <div className="flex-1 text-center lg:text-left">
                <motion.div variants={itemVariant} className="mb-8">
                  <span className="inline-block px-4 py-2 rounded-full bg-quantum-glow-purple/10 border border-quantum-glow-purple/20 text-quantum-vibrant-blue text-sm font-medium mb-6">
                    The Future of Healthcare
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                    Quantum Medical <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-quantum-vibrant-blue to-quantum-bright-purple">
                      AI-Powered Platform
                    </span>
                  </h1>
                  <p className="text-lg text-quantum-text-paragraph max-w-2xl mx-auto lg:mx-0">
                    Advanced medical management with role-specific experiences for doctors, specialists, radiologists, receptionists, patients, and administrators.
                  </p>
                </motion.div>
                
                <motion.div variants={itemVariant} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button 
                    className="quantum-btn px-6 py-6 text-lg"
                    onClick={() => navigate("/login")}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="px-6 py-6 text-lg bg-transparent border border-quantum-vibrant-blue/30 text-quantum-vibrant-blue hover:bg-quantum-vibrant-blue/10 hover:text-white"
                    onClick={() => navigate("/register")}
                  >
                    Create Account
                  </Button>
                </motion.div>
              </div>
              
              {/* Hero image/graphic */}
              <motion.div 
                variants={itemVariant} 
                className="flex-1 relative"
              >
                <div className="relative w-full h-[400px] lg:h-[500px] quantum-panel p-6 rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-quantum-glow-purple/20 to-quantum-vibrant-blue/10 z-[-1]" />
                  
                  {/* Medical interface elements */}
                  <div className="absolute top-6 left-6 right-6 h-16 bg-quantum-deep-purple/60 rounded-xl border border-white/10 p-4 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-quantum-vibrant-blue to-quantum-sky-blue flex items-center justify-center mr-4">
                      <Activity className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-white/20 rounded-full w-3/4 mb-2" />
                      <div className="h-2 bg-white/10 rounded-full w-1/2" />
                    </div>
                  </div>
                  
                  {/* Patient card */}
                  <div className="absolute top-32 left-6 w-2/3 bg-quantum-deep-purple/70 rounded-xl border border-white/10 p-4">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-quantum-cloud to-quantum-mobile flex items-center justify-center mr-3">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="h-3 bg-white/20 rounded-full w-24 mb-1" />
                        <div className="h-2 bg-white/10 rounded-full w-16" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-white/20 rounded-full" />
                      <div className="h-2 bg-white/10 rounded-full w-5/6" />
                      <div className="h-2 bg-white/10 rounded-full w-4/6" />
                    </div>
                  </div>
                  
                  {/* Chart element */}
                  <div className="absolute bottom-6 left-6 right-6 h-32 bg-quantum-deep-purple/70 rounded-xl border border-white/10 p-4">
                    <div className="h-3 bg-white/20 rounded-full w-24 mb-4" />
                    <div className="flex items-end justify-between h-16 px-2">
                      <div className="h-6 w-3 bg-quantum-vibrant-blue/60 rounded-t-sm" />
                      <div className="h-12 w-3 bg-quantum-vibrant-blue/90 rounded-t-sm" />
                      <div className="h-8 w-3 bg-quantum-vibrant-blue/60 rounded-t-sm" />
                      <div className="h-16 w-3 bg-quantum-vibrant-blue/90 rounded-t-sm" />
                      <div className="h-10 w-3 bg-quantum-vibrant-blue/60 rounded-t-sm" />
                      <div className="h-14 w-3 bg-quantum-vibrant-blue/90 rounded-t-sm" />
                      <div className="h-7 w-3 bg-quantum-vibrant-blue/60 rounded-t-sm" />
                    </div>
                  </div>
                  
                  {/* Status indicator */}
                  <div className="absolute top-28 right-6 w-1/4 p-3 bg-gradient-to-r from-quantum-bright-purple/30 to-quantum-bright-purple/10 rounded-lg border border-quantum-bright-purple/20">
                    <div className="h-2 bg-white/20 rounded-full w-full mb-2" />
                    <div className="h-6 bg-white/5 rounded-md w-full" />
                  </div>
                  
                  {/* Floating elements */}
                  <motion.div 
                    className="absolute top-1/3 right-1/4 w-10 h-10 rounded-full bg-gradient-to-r from-quantum-cloud to-quantum-mobile flex items-center justify-center shadow-lg shadow-quantum-cloud/20"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Brain className="h-5 w-5 text-white" />
                  </motion.div>
                  
                  <motion.div 
                    className="absolute bottom-1/4 right-1/3 w-8 h-8 rounded-full bg-gradient-to-r from-quantum-iot to-quantum-data-ai flex items-center justify-center shadow-lg shadow-quantum-iot/20"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    <Activity className="h-4 w-4 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-quantum-vibrant-blue to-quantum-bright-purple">
                  Quantum UI
                </span> Features
              </h2>
              <p className="text-lg text-quantum-text-paragraph max-w-3xl mx-auto">
                Our advanced medical platform combines cutting-edge technology with intuitive design to transform healthcare management.
              </p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={featureVariants}
              initial="hidden"
              animate="visible"
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  variants={itemVariant}
                  className="quantum-card group"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 transition-all duration-300 group-hover:shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-quantum-text-paragraph">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 mb-8">
          <div className="container mx-auto px-4">
            <motion.div 
              className="quantum-panel py-16 px-8 rounded-2xl relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-quantum-glow-purple/10 to-quantum-vibrant-blue/5 z-0" />
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl font-bold text-white mb-4">Join the Quantum Medical Platform</h2>
                  <p className="text-quantum-text-paragraph max-w-xl">
                    Experience the future of healthcare management with our AI-powered platform. Register today to get started.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="quantum-btn px-6 py-6 text-lg"
                    onClick={() => navigate("/register")}
                  >
                    <span>Create Account</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="px-6 py-6 text-lg bg-transparent border border-quantum-vibrant-blue/30 text-quantum-vibrant-blue hover:bg-quantum-vibrant-blue/10 hover:text-white"
                    onClick={() => navigate("/login")}
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-8 border-t border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-quantum-vibrant-blue to-quantum-bright-purple flex items-center justify-center">
                  <span className="text-white font-bold text-sm">QM</span>
                </div>
                <span className="font-bold text-lg text-white">Quantum Medical</span>
              </div>
              
              <div className="text-quantum-text-secondary text-sm">
                &copy; 2025 Quantum Medical Platform. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
