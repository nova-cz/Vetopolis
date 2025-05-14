import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, ingresa tu correo electrónico.",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simular una llamada a la API
    setTimeout(() => {
      // Normalmente, aquí enviaríamos la solicitud al backend
      toast({
        title: "Solicitud enviada",
        description: "Si existe una cuenta con este correo, recibirás instrucciones para restablecer tu contraseña.",
      });
      
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };
  
  const handleTryAgain = (): void => {
    setEmail("");
    setIsSubmitted(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="container max-w-md px-4">
          <Card className="w-full shadow-lg animate-in">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                {isSubmitted ? "Revisa tu correo" : "Recuperar contraseña"}
              </CardTitle>
              <CardDescription className="text-center">
                {isSubmitted 
                  ? `Hemos enviado instrucciones a ${email}`
                  : "Ingresa tu correo para recibir instrucciones"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {!isSubmitted ? (
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
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Enviando..." : "Enviar instrucciones"}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <p className="text-center text-sm text-muted-foreground">
                    Si no encuentras el correo, revisa tu carpeta de spam o solicita un nuevo enlace.
                  </p>
                  
                  <Button 
                    onClick={handleTryAgain} 
                    className="w-full"
                  >
                    Intentar con otro correo
                  </Button>
                </div>
              )}
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2"
                onClick={() => navigate("/login")}
              >
                <ArrowLeft size={16} />
                Volver a inicio de sesión
              </Button>
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

export default ForgotPassword;