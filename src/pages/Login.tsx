
import { useState } from "react";
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: "Por favor, completa todos los campos.",
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
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
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
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
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
                
                <Button type="submit" className="w-full" disabled={isLoading}>
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
