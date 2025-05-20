import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

// Función de validación de email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  
  // Validar email cuando cambia
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value && !isValidEmail(value)) {
      setEmailError("Por favor, ingresa un correo electrónico válido");
    } else {
      setEmailError("");
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones generales
    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: "Campo requerido",
        description: "Por favor, ingresa tu correo electrónico.",
      });
      return;
    }
    
    // Validar formato de email
    if (!isValidEmail(email)) {
      toast({
        variant: "destructive",
        title: "Error de formato",
        description: "Por favor, ingresa un correo electrónico válido.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Enviar correo de restablecimiento de contraseña con Firebase
      await sendPasswordResetEmail(auth, email);
      
      toast({
        title: "Correo enviado",
        description: "Se ha enviado un enlace de restablecimiento a tu correo electrónico.",
      });
      
      // Opcional: redirigir a la página de inicio de sesión después de un breve retraso
      setTimeout(() => {
        // Descomenta esta línea si quieres redirigir automáticamente
        // window.location.href = "/login";
      }, 3000);
      
    } catch (error: any) {
      console.error("Error al enviar correo de restablecimiento:", error);
      
      // Mensajes de error personalizados según el código de error de Firebase
      let errorMessage = "No se pudo enviar el correo de restablecimiento.";
      
      if (error.code === "auth/user-not-found") {
        errorMessage = "No existe una cuenta con este correo electrónico.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Demasiados intentos. Por favor, inténtalo más tarde.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "El formato del correo electrónico no es válido.";
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="container max-w-md px-4">
          <Card className="w-full shadow-lg animate-in">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Recuperar contraseña</CardTitle>
              <CardDescription className="text-center">
                Ingresa tu correo electrónico para recibir un enlace de restablecimiento
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
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {emailError}
                    </p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !!emailError}
                >
                  {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
                </Button>
              </form>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-2 text-sm text-muted-foreground">
                    O regresa a
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login">Iniciar sesión</Link>
                </Button>
              </div>
            </CardContent>
            
            <CardFooter>
              <p className="text-center text-sm text-muted-foreground w-full">
                ¿No tienes una cuenta?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Regístrate aquí
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

export default ForgotPassword;