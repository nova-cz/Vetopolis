import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Función para validar el formato del email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para manejar errores de validación
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Validar email cada vez que cambia
  useEffect(() => {
    if (email && !isValidEmail(email)) {
      setEmailError("Por favor, ingresa un correo electrónico válido");
    } else {
      setEmailError("");
    }
  }, [email]);
  
  // Validar contraseña cada vez que cambia
  useEffect(() => {
    if (password && password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
    } else {
      setPasswordError("");
    }
  }, [password]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación final antes de enviar
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: "Por favor, completa todos los campos.",
      });
      return;
    }
    
    if (!isValidEmail(email)) {
      toast({
        variant: "destructive",
        title: "Error de formato",
        description: "Por favor, ingresa un correo electrónico válido.",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Error de formato",
        description: "La contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simular una llamada a la API
    setTimeout(() => {
      // Normalmente, aquí verificaríamos con un backend
      if (email === "usuario@ejemplo.com" && password === "password") {
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido de nuevo a PetDoc.",
        });
        navigate("/");
      } else {
        toast({
          variant: "destructive",
          title: "Error de inicio de sesión",
          description: "El correo electrónico o la contraseña son incorrectos.",
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };
  
  // Manejador de cambios para el correo electrónico con validación
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };
  
  // Manejador de cambios para la contraseña con validación
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="container max-w-md px-4">
          <Card className="w-full shadow-lg animate-in">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Iniciar sesión</CardTitle>
              <CardDescription className="text-center">
                Ingresa tus credenciales para acceder a tu cuenta
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@ejemplo.com"
                    value={email}
                    onChange={handleEmailChange}
                    className={emailError ? "border-red-500" : ""}
                    required
                  />
                  {emailError && (
                    <p className="text-sm text-red-500">{emailError}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Contraseña</Label>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-primary hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={handlePasswordChange}
                    className={passwordError ? "border-red-500" : ""}
                    required
                  />
                  {passwordError && (
                    <p className="text-sm text-red-500">{passwordError}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => 
                      setRememberMe(checked === true)
                    }
                  />
                  <Label htmlFor="remember" className="text-sm">Recordarme</Label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !!emailError || !!passwordError}
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                </Button>
              </form>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-2 text-sm text-muted-foreground">
                    O continúa con
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  Facebook
                </Button>
              </div>
            </CardContent>
            
            <CardFooter>
              <p className="text-center text-sm text-muted-foreground w-full">
                ¿No tienes una cuenta?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Regístrate
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;