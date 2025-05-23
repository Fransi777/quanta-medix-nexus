import { createContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export interface User {
  id: string;
  email: string;
  role: "admin" | "doctor" | "specialist" | "radiologist" | "receptionist" | "patient";
  name?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string, role: User["role"]) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for user session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Get session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // If we have a session, get the user profile data
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, email, name, role, avatar_url')
            .eq('id', session.user.id)
            .single();
          
          if (error) throw error;
          
          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              role: profile.role as User['role'],
              name: profile.name,
              avatar: profile.avatar_url || undefined
            });
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
        
        // Fall back to demo user if in development
        if (import.meta.env.DEV) {
          const savedUser = localStorage.getItem("quantum_medical_user");
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
    
    // Set up auth change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Get user profile data
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, email, name, role, avatar_url')
            .eq('id', session.user.id)
            .single();
          
          if (!error && profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              role: profile.role as User['role'],
              name: profile.name,
              avatar: profile.avatar_url || undefined
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Try to authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      // If this is the first time we're seeing this user, let's create a profile
      if (data.user) {
        toast({
          title: "Login Successful",
          description: `Welcome back!`,
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Try demo login in development
      if (import.meta.env.DEV) {
        try {
          // Demo user accounts - Updated with all roles
          const demoUsers = [
            { id: "1", email: "admin@quantum.med", password: "admin123", role: "admin", name: "Admin User", avatar: "" },
            { id: "2", email: "doctor@quantum.med", password: "doctor123", role: "doctor", name: "Dr. Sarah Johnson", avatar: "" },
            { id: "3", email: "specialist@quantum.med", password: "specialist123", role: "specialist", name: "Dr. Robert Chen", avatar: "" },
            { id: "4", email: "radiologist@quantum.med", password: "radiologist123", role: "radiologist", name: "Dr. Emily Wong", avatar: "" },
            { id: "5", email: "receptionist@quantum.med", password: "receptionist123", role: "receptionist", name: "Jessica Miller", avatar: "" },
            { id: "6", email: "patient@quantum.med", password: "patient123", role: "patient", name: "Michael Brown", avatar: "" }
          ];
          
          const user = demoUsers.find(u => u.email === email && u.password === password);
          
          if (user) {
            const { password, ...userData } = user;
            localStorage.setItem("quantum_medical_user", JSON.stringify(userData));
            setUser(userData as User);
            toast({
              title: "Demo Login Successful",
              description: `Welcome back, ${userData.name}! (Demo Mode)`,
            });
            return;
          }
        } catch (demoError) {
          console.error("Demo login error:", demoError);
        }
      }
      
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: User["role"]) => {
    try {
      setIsLoading(true);
      
      // Register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            name,
            role
          }
        }
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Registration Successful",
        description: `Welcome to Quantum Medical, ${name}!`,
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Use mock registration in development
      if (import.meta.env.DEV) {
        try {
          // Create a new user
          const newUser = {
            id: Math.random().toString(36).substring(2, 9),
            email,
            name,
            role,
          };
          
          localStorage.setItem("quantum_medical_user", JSON.stringify(newUser));
          setUser(newUser);
          
          toast({
            title: "Demo Registration Successful",
            description: `Welcome to Quantum Medical, ${name}! (Demo Mode)`,
          });
          return;
        } catch (demoError) {
          console.error("Demo registration error:", demoError);
        }
      }
      
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Could not create account. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Real logout from Supabase
      await supabase.auth.signOut();
      
      // Also clean up local storage for demo mode
      localStorage.removeItem("quantum_medical_user");
      setUser(null);
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      
      // Ensure we clean up local state even if Supabase logout fails
      localStorage.removeItem("quantum_medical_user");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
