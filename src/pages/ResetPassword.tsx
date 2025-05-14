import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ToastProps {
  variant?: "default" | "destructive";
  title: string;
  description: string;
}

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(true);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    // Extraer el token de los parámetros de la URL
    const searchParams = new URLSearchParams(location.search);
    const tokenFromUrl = searchParams.get("token");
    
    if (!tokenFromUrl) {
      setIsTokenValid(false);
      toast({
        variant: "destructive",
        title: "Enlace inválido",
        description: "El enlace de restablecimiento no es válido o ha expirado.",
      });
      return;
    }
    
    setToken(tokenFromUrl);
    
    // Aquí normalmente verificaríamos si el token es válido con el backend
    // Simulación para demostración
    const isValidToken = tokenFromUrl.length > 8;
    setIsTokenValid(isValidToken);
    
    if (!isValidToken) {
      toast({
        variant: "destructive",
        title: "Enlace expirado",
        description: "El enlace de restablecimiento ha expirado o ya fue utilizado.",
      });
    }
  }, [location, toast]);
  
  const validatePassword = (): boolean => {
    if (password.length < 8) {
      toast({
        variant: "destructive",
        title: "Contraseña débil",
        description: "La contraseña debe tener al menos 8 caracteres.",
      });
      return false;
    }
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Las contraseñas no coinciden",
        description: "Por favor verifica que ambas contraseñas sean iguales.",
      });
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validatePassword()) return;
    
    setIsLoading(true);
    
    // Simular una llamada a la API
    setTimeout(() => {
      // Normalmente, aquí se enviaría el token y la nueva contraseña al backend
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido restablecida correctamente.",
      });
      
      setIsLoading(false);
      setIsSuccess(true);
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }, 1500);
  };
  
  // Indicador de fortaleza de contraseña
  const getPasswordStrength = (): number => {
    if (password.length === 0) return 0;
    if (password.length < 8) return 1;
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };
  
  const strengthColor = (): string => {
    const strength = getPasswordStrength();
    if (strength <= 1) return "bg-red-500";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-blue-500";
    return "bg-green-500";
  };
  
  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow flex items-center justify-center py-12">
          <div className="container max-w-md px-4">
            <Card className="w-full shadow-lg animate-in">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Enlace inválido</CardTitle>
                <CardDescription className="text-center">
                  El enlace de restablecimiento no es válido o ha expirado.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-center text-red-500">
                  <AlertCircle size={48} />
                </div>
                
                <p className="text-center text-muted-foreground">
                  Por favor solicita un nuevo enlace de restablecimiento.
                </p>
                
                <Button 
                  className="w-full"
                  onClick={() => navigate("/forgot-password")}
                >
                  Solicitar nuevo enlace
                </Button>
              </CardContent>
              
              <CardFooter>
                <p className="text-center text-sm text-muted-foreground w-full">
                  <Link to="/login" className="text-primary hover:underline">
                    Volver a inicio de sesión
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow flex items-center justify-center py-12">
          <div className="container max-w-md px-4">
            <Card className="w-full shadow-lg animate-in">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">¡Contraseña restablecida!</CardTitle>
                <CardDescription className="text-center">
                  Tu contraseña ha sido actualizada correctamente.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-center text-green-500">
                  <Check size={48} />
                </div>
                
                <p className="text-center text-muted-foreground">
                  Serás redirigido a la página de inicio de sesión en unos segundos...
                </p>
                
                <Button 
                  className="w-full"
                  onClick={() => navigate("/login")}
                >
                  Ir a iniciar sesión
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="container max-w-md px-4">
          <Card className="w-full shadow-lg animate-in">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Restablecer contraseña</CardTitle>
              <CardDescription className="text-center">
                Crea una nueva contraseña para tu cuenta
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nueva contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  
                  {password && (
                    <div className="mt-1">
                      <div className="h-1 flex rounded-full overflow-hidden">
                        <div className={`flex-1 ${password ? strengthColor() : 'bg-gray-200'}`}></div>
                        <div className={`flex-1 ${getPasswordStrength() >= 2 ? strengthColor() : 'bg-gray-200'}`}></div>
                        <div className={`flex-1 ${getPasswordStrength() >= 3 ? strengthColor() : 'bg-gray-200'}`}></div>
                        <div className={`flex-1 ${getPasswordStrength() >= 4 ? strengthColor() : 'bg-gray-200'}`}></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getPasswordStrength() === 0 && "Ingresa una contraseña"}
                        {getPasswordStrength() === 1 && "Contraseña débil"}
                        {getPasswordStrength() === 2 && "Contraseña aceptable"}
                        {getPasswordStrength() === 3 && "Contraseña fuerte"}
                        {getPasswordStrength() === 4 && "Contraseña muy fuerte"}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  
                  {password && confirmPassword && (
                    <p className={`text-xs ${password === confirmPassword ? 'text-green-500' : 'text-red-500'} mt-1`}>
                      {password === confirmPassword ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
                    </p>
                  )}
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Actualizando..." : "Actualizar contraseña"}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter>
              <p className="text-center text-sm text-muted-foreground w-full">
                <Link to="/login" className="text-primary hover:underline">
                  Volver a inicio de sesión
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

export default ResetPassword;