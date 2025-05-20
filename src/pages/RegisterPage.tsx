import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth } from "@/lib/firebase"; // Ajusta la ruta si tu estructura es diferente
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"; // solo para registro

// Funciones de validación
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidName = (name: string): boolean => {
  // Solo letras, espacios y algunos caracteres especiales como acentos
  const nameRegex = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s.'-]+$/;
  return nameRegex.test(name) && name.length >= 3;
};

const isStrongPassword = (password: string): boolean => {
  // Al menos 8 caracteres, una mayúscula, una minúscula, un número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estados para errores de validación
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Validar nombre cuando cambia
  useEffect(() => {
    if (name && !isValidName(name)) {
      setNameError("El nombre debe tener al menos 3 caracteres y contener solo letras y espacios");
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validaciones completas
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }
    
    // Validar formato de nombre
    if (!isValidName(name)) {
      toast({
        title: "Formato inválido",
        description: "El nombre debe tener al menos 3 caracteres y contener solo letras y espacios",
        variant: "destructive",
      });
      return;
    }
    
    // Validar formato de email
    if (!isValidEmail(email)) {
      toast({
        title: "Formato inválido",
        description: "Por favor, ingresa un correo electrónico válido",
        variant: "destructive",
      });
      return;
    }
    
    // Validar fortaleza de contraseña
    if (!isStrongPassword(password)) {
      toast({
        title: "Contraseña débil",
        description: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
        variant: "destructive",
      });
      return;
    }
  
    if (password !== confirmPassword) {
      toast({
        title: "Las contraseñas no coinciden",
        description: "Por favor verifica que ambas contraseñas sean iguales",
        variant: "destructive",
      });
      return;
    }
  
    if (!agreeTerms) {
      toast({
        title: "Términos y condiciones",
        description: "Debes aceptar los términos y condiciones para registrarte",
        variant: "destructive",
      });
      return;
    }
  
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
  
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada correctamente",
      });
  
      navigate("/login");
    } catch (error: any) {
      let description = "No se pudo crear la cuenta.";
      
      switch (error.code) {
        case "auth/email-already-in-use":
          description = "Este correo electrónico ya está registrado.";
          break;
        case "auth/invalid-email":
          description = "El formato del correo electrónico es inválido.";
          break;
        case "auth/weak-password":
          description = "La contraseña es demasiado débil.";
          break;
      }
      
      toast({
        title: "Error de registro",
        description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="container max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Crear Cuenta</h1>
            <p className="text-muted-foreground mt-2">
              Regístrate para acceder a todas las funcionalidades
            </p>
          </div>
          
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Juan Pérez" 
                  className={`pl-10 ${nameError ? "border-red-500 focus:ring-red-500" : ""}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              {nameError && (
                <p className="text-sm text-red-500">{nameError}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="tu@correo.com" 
                  className={`pl-10 ${emailError ? "border-red-500 focus:ring-red-500" : ""}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              {emailError && (
                <p className="text-sm text-red-500">{emailError}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className={`pl-10 ${passwordError ? "border-red-500 focus:ring-red-500" : ""}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  id="confirmPassword" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className={`pl-10 ${confirmPasswordError ? "border-red-500 focus:ring-red-500" : ""}`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              {confirmPasswordError && (
                <p className="text-sm text-red-500">{confirmPasswordError}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer">
                Acepto los <Link to="/terms" className="text-primary hover:underline">términos y condiciones</Link>
              </Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !!nameError || !!emailError || !!passwordError || !!confirmPasswordError}
            >
              {loading ? "Creando cuenta..." : "Registrarse"}
            </Button>
            
            <div className="text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Iniciar sesión
              </Link>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;