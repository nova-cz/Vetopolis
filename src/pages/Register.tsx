import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Funciones de validación
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidName = (name: string): boolean => {
  // Solo letras, espacios y algunos caracteres especiales como acentos
  const nameRegex = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s.'-]+$/;
  return nameRegex.test(name);
};

const isStrongPassword = (password: string): boolean => {
  // Al menos 8 caracteres, una mayúscula, una minúscula, un número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("patient");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para errores de validación
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Validar nombre cuando cambia
  useEffect(() => {
    if (name && !isValidName(name)) {
      setNameError("El nombre solo debe contener letras y espacios");
    } else {
      setNameError("");
    }
  }, [name]);
  
  // Validar email cuando cambia
  useEffect(() => {
    if (email && !isValidEmail(email)) {
      setEmailError("Por favor, ingresa un correo electrónico válido");
    } else {
      setEmailError("");
    }
  }, [email]);
  
  // Validar contraseña cuando cambia
  useEffect(() => {
    if (password && !isStrongPassword(password)) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número");
    } else {
      setPasswordError("");
    }
  }, [password]);
  
  // Validar confirmación de contraseña
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden");
    } else {
      setConfirmPasswordError("");
    }
  }, [confirmPassword, password]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones generales
    if (!name || !email || !password || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error de registro",
        description: "Por favor, completa todos los campos.",
      });
      return;
    }
    
    // Validar formato de nombre
    if (!isValidName(name)) {
      toast({
        variant: "destructive",
        title: "Error de formato",
        description: "El nombre solo debe contener letras y espacios.",
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
    
    // Validar fortaleza de contraseña
    if (!isStrongPassword(password)) {
      toast({
        variant: "destructive",
        title: "Contraseña débil",
        description: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.",
      });
      return;
    }
    
    // Validar coincidencia de contraseñas
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error de registro",
        description: "Las contraseñas no coinciden.",
      });
      return;
    }
    
    // Validar aceptación de términos
    if (!termsAccepted) {
      toast({
        variant: "destructive",
        title: "Error de registro",
        description: "Debes aceptar los términos y condiciones.",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simular una llamada a la API
    setTimeout(() => {
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada correctamente.",
      });
      navigate("/");
      setIsLoading(false);
    }, 1500);
  };
  
  // Manejadores de cambio con restricciones de tipo de datos
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
  };
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };
  
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="container max-w-md px-4">
          <Card className="w-full shadow-lg animate-in">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Crear cuenta</CardTitle>
              <CardDescription className="text-center">
                Regístrate para agendar citas con veterinarios
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={handleNameChange}
                    className={nameError ? "border-red-500" : ""}
                    required
                  />
                  {nameError && (
                    <p className="text-sm text-red-500">{nameError}</p>
                  )}
                </div>
                
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
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Crea una contraseña"
                    value={password}
                    onChange={handlePasswordChange}
                    className={passwordError ? "border-red-500" : ""}
                    required
                  />
                  {passwordError && (
                    <p className="text-sm text-red-500">{passwordError}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirma tu contraseña"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={confirmPasswordError ? "border-red-500" : ""}
                    required
                  />
                  {confirmPasswordError && (
                    <p className="text-sm text-red-500">{confirmPasswordError}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="user-type">Tipo de usuario</Label>
                  <Select value={userType} onValueChange={setUserType}>
                    <SelectTrigger id="user-type">
                      <SelectValue placeholder="Selecciona un tipo de usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">Dueño de mascota</SelectItem>
                      <SelectItem value="vet">Veterinario</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={termsAccepted}
                    onCheckedChange={(checked) => 
                      setTermsAccepted(checked === true)
                    }
                    required
                  />
                  <Label htmlFor="terms" className="text-sm">
                    Acepto los{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      términos y condiciones
                    </Link>
                  </Label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !!nameError || !!emailError || !!passwordError || !!confirmPasswordError}
                >
                  {isLoading ? "Registrando..." : "Registrarse"}
                </Button>
              </form>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-2 text-sm text-muted-foreground">
                    O regístrate con
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
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Inicia sesión
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

export default Register;