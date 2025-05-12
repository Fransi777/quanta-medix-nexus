
import { createContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

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

  // Simulate checking for user session on app load
  useEffect(() => {
    const checkSession = () => {
      const savedUser = localStorage.getItem("quantum_medical_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Demo user accounts
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
          title: "Login Successful",
          description: `Welcome back, ${userData.name}!`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password.",
        });
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: User["role"]) => {
    try {
      setIsLoading(true);
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
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
        title: "Registration Successful",
        description: `Welcome to Quantum Medical, ${name}!`,
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Could not create account. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("quantum_medical_user");
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
