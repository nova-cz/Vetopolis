import { useState } from "react";
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

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("patient");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para errores de validación
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Función para validar el correo electrónico
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };
  
  // Función para validar la contraseña
  const validatePassword = (password) => {
    return password.length >= 8;
  };
  
  // Función para validar el nombre
  const validateName = (name) => {
    return name.trim().length >= 3 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name);
  };
  
  // Validación en tiempo real para el email
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value && !validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: "Formato de correo electrónico inválido" }));
    } else {
      setErrors(prev => ({ ...prev, email: "" }));
    }
  };
  
  // Validación en tiempo real para el nombre
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    
    if (value && !validateName(value)) {
      setErrors(prev => ({ ...prev, name: "El nombre debe contener solo letras y tener al menos 3 caracteres" }));
    } else {
      setErrors(prev => ({ ...prev, name: "" }));
    }
  };
  
  // Validación en tiempo real para la contraseña
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    if (value && !validatePassword(value)) {
      setErrors(prev => ({ ...prev, password: "La contraseña debe tener al menos 8 caracteres" }));
    } else {
      setErrors(prev => ({ ...prev, password: "" }));
    }
    
    // Validar confirmación de contraseña si ya tiene valor
    if (confirmPassword && value !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Las contraseñas no coinciden" }));
    } else if (confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "" }));
    }
  };
  
  // Validación en tiempo real para confirmación de contraseña
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (value !== password) {
      setErrors(prev => ({ ...prev, confirmPassword: "Las contraseñas no coinciden" }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: "" }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar todos los campos antes de enviar
    const newErrors = {
      name: !name ? "El nombre es requerido" : !validateName(name) ? "El nombre debe contener solo letras y tener al menos 3 caracteres" : "",
      email: !email ? "El correo es requerido" : !validateEmail(email) ? "Formato de correo electrónico inválido" : "",
      password: !password ? "La contraseña es requerida" : !validatePassword(password) ? "La contraseña debe tener al menos 8 caracteres" : "",
      confirmPassword: !confirmPassword ? "Confirma tu contraseña" : password !== confirmPassword ? "Las contraseñas no coinciden" : ""
    };
    
    setErrors(newErrors);
    
    // Verificar si hay errores
    if (Object.values(newErrors).some(error => error !== "")) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Por favor, corrige los errores en el formulario.",
      });
      return;
    }
    
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
                    required
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
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
                    required
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
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
                    required
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
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
                    required
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
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
                  disabled={isLoading || Object.values(errors).some(error => error !== "")}
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