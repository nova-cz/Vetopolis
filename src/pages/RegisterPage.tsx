import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth } from "@/lib/firebase"; // Ajusta la ruta si tu estructura es diferente
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"; // solo para registro
import { signInWithEmailAndPassword } from "firebase/auth"; // solo para login


const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estado para los errores de validación
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Funciones de validación
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };
  
  const validatePassword = (password) => {
    // Al menos 8 caracteres, una letra mayúscula, una minúscula y un número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };
  
  const validateName = (name) => {
    return name.trim().length >= 3 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name);
  };

  // Manejadores de cambio con validación
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, name: "El nombre es requerido" }));
    } else if (!validateName(value)) {
      setErrors(prev => ({ ...prev, name: "El nombre debe contener solo letras y tener al menos 3 caracteres" }));
    } else {
      setErrors(prev => ({ ...prev, name: "" }));
    }
  };
  
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, email: "El correo es requerido" }));
    } else if (!validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: "Ingresa un correo electrónico válido" }));
    } else {
      setErrors(prev => ({ ...prev, email: "" }));
    }
  };
  
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    if (!value) {
      setErrors(prev => ({ ...prev, password: "La contraseña es requerida" }));
    } else if (!validatePassword(value)) {
      setErrors(prev => ({ 
        ...prev, 
        password: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número" 
      }));
    } else {
      setErrors(prev => ({ ...prev, password: "" }));
    }
    
    // Validar la confirmación de contraseña si ya tiene un valor
    if (confirmPassword) {
      if (value !== confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: "Las contraseñas no coinciden" }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: "" }));
      }
    }
  };
  
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (!value) {
      setErrors(prev => ({ ...prev, confirmPassword: "Confirma tu contraseña" }));
    } else if (value !== password) {
      setErrors(prev => ({ ...prev, confirmPassword: "Las contraseñas no coinciden" }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: !name.trim() 
        ? "El nombre es requerido" 
        : !validateName(name) 
          ? "El nombre debe contener solo letras y tener al menos 3 caracteres" 
          : "",
      email: !email.trim() 
        ? "El correo es requerido" 
        : !validateEmail(email) 
          ? "Ingresa un correo electrónico válido" 
          : "",
      password: !password 
        ? "La contraseña es requerida" 
        : !validatePassword(password) 
          ? "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número" 
          : "",
      confirmPassword: !confirmPassword 
        ? "Confirma tu contraseña" 
        : password !== confirmPassword 
          ? "Las contraseñas no coinciden" 
          : ""
    };
    
    setErrors(newErrors);
    
    // Devuelve true si no hay errores
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
  
    // Validar el formulario completo
    const isValid = validateForm();
    
    if (!isValid) {
      toast({
        title: "Error de validación",
        description: "Por favor corrige los errores en el formulario",
        variant: "destructive",
      });
      return;
    }
  
    if (!agreeTerms) {
      toast({
        title: "Términos y condiciones",
        description: "Debes aceptar los términos y condiciones para registrarte",
        variant: "destructive",
        duration: 5000, // 5 segundos
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
    } catch (error) {
      // Manejo específico para errores comunes de Firebase
      let errorMessage = "No se pudo crear la cuenta.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Este correo electrónico ya está registrado.";
        setErrors(prev => ({ ...prev, email: errorMessage }));
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "El formato del correo electrónico es inválido.";
        setErrors(prev => ({ ...prev, email: errorMessage }));
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "La contraseña es demasiado débil.";
        setErrors(prev => ({ ...prev, password: errorMessage }));
      }
      
      toast({
        title: "Error de registro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Función para estilizar los campos según tengan error o no
  const getInputClassName = (fieldName) => {
    return `pl-10 ${errors[fieldName] ? "border-red-500 focus:ring-red-500" : ""}`;
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
                  className={getInputClassName("name")}
                  value={name}
                  onChange={handleNameChange}
                  onBlur={handleNameChange}
                  disabled={loading}
                  required
                />
                {errors.name && (
                  <div className="flex items-center mt-1 text-red-500 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="tu@correo.com" 
                  className={getInputClassName("email")}
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailChange}
                  disabled={loading}
                  required
                />
                {errors.email && (
                  <div className="flex items-center mt-1 text-red-500 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className={getInputClassName("password")}
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordChange}
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
                {errors.password && (
                  <div className="flex items-center mt-1 text-red-500 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  id="confirmPassword" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className={getInputClassName("confirmPassword")}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  onBlur={handleConfirmPasswordChange}
                  disabled={loading}
                  required
                />
                {errors.confirmPassword && (
                  <div className="flex items-center mt-1 text-red-500 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span>{errors.confirmPassword}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked === true)}
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer">
                Acepto los <Link to="/terms" className="text-primary hover:underline">términos y condiciones</Link>
              </Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || Object.values(errors).some(error => error !== "")}
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