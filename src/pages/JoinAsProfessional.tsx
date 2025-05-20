import { useState, useEffect } from "react";
import {
  Briefcase,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase as ExperienceIcon,
  FileText,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/lib/firebase";

const specialties = [
  "Cardiología", "Dermatología", "Neurología", "Oftalmología", "Oncología",
  "Ortopedia y Traumatología", "Odontología", "Gastroenterología", "Nefrología y Urología",
  "Endocrinología", "Reproducción y Obstetricia", "Anestesiología", "Medicina Interna",
  "Medicina de Animales Exóticos", "Etología", "Medicina Preventiva"
];

// Funciones de validación
const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s.'-]+$/;
  return nameRegex.test(name) && name.trim().length >= 5;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  // Formato: +52 55 1234 5678 o 55 1234 5678 o 5512345678
  const phoneRegex = /^(\+?\d{1,3}[\s-]?)?\d{2}[\s-]?\d{4}[\s-]?\d{4}$/;
  return phoneRegex.test(phone);
};

const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

interface InputWithIconProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  icon: React.ReactNode;
  type?: string;
  error?: string;
  required?: boolean;
}

const InputWithIcon = ({
  label,
  placeholder,
  value,
  onChange,
  icon,
  type = "text",
  error,
  required = true
}: InputWithIconProps) => (
  <div className="space-y-2">
    <Label className="flex items-center">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">{icon}</span>
      <Input
        className={`pl-10 ${error ? "border-red-500 focus:ring-red-500" : ""}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
    {error && (
      <p className="text-sm text-red-500 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" /> {error}
      </p>
    )}
  </div>
);

const JoinAsProfessional = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [docsLink, setDocsLink] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Estados para errores de validación
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [clinicNameError, setClinicNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [cityError, setCityError] = useState("");
  const [specialtyError, setSpecialtyError] = useState("");
  const [experienceError, setExperienceError] = useState("");
  const [docsLinkError, setDocsLinkError] = useState("");
  
  const { toast } = useToast();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        setEmail(user.email || "");
        setFullName(user.displayName || "");
      }
    });
    return () => unsubscribe();
  }, []);
  
  // Validaciones
  useEffect(() => {
    if (fullName && !isValidName(fullName)) {
      setNameError("El nombre debe tener al menos 5 caracteres y contener solo letras");
    } else {
      setNameError("");
    }
  }, [fullName]);
  
  useEffect(() => {
    if (email && !isValidEmail(email)) {
      setEmailError("Por favor, ingresa un correo electrónico válido");
    } else {
      setEmailError("");
    }
  }, [email]);
  
  useEffect(() => {
    if (phone && !isValidPhone(phone)) {
      setPhoneError("Ingresa un número de teléfono válido (ej: +52 55 1234 5678)");
    } else {
      setPhoneError("");
    }
  }, [phone]);
  
  useEffect(() => {
    if (clinicName && clinicName.trim().length < 3) {
      setClinicNameError("El nombre de la clínica debe tener al menos 3 caracteres");
    } else {
      setClinicNameError("");
    }
  }, [clinicName]);
  
  useEffect(() => {
    if (address && address.trim().length < 5) {
      setAddressError("La dirección debe tener al menos 5 caracteres");
    } else {
      setAddressError("");
    }
  }, [address]);
  
  useEffect(() => {
    if (city && city.trim().length < 3) {
      setCityError("La ciudad debe tener al menos 3 caracteres");
    } else {
      setCityError("");
    }
  }, [city]);
  
  useEffect(() => {
    if (specialty.length === 0) {
      setSpecialtyError("Debes seleccionar al menos una especialidad");
    } else {
      setSpecialtyError("");
    }
  }, [specialty]);
  
  useEffect(() => {
    if (experience && experience.trim().length < 10) {
      setExperienceError("La experiencia debe tener al menos 10 caracteres");
    } else {
      setExperienceError("");
    }
  }, [experience]);
  
  useEffect(() => {
    if (docsLink && !isValidURL(docsLink)) {
      setDocsLinkError("Ingresa una URL válida");
    } else {
      setDocsLinkError("");
    }
  }, [docsLink]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación completa
    const errors = [];
    
    if (!fullName.trim() || !isValidName(fullName)) {
      errors.push("Nombre completo inválido");
    }
    
    if (!email.trim() || !isValidEmail(email)) {
      errors.push("Correo electrónico inválido");
    }
    
    if (!phone.trim() || !isValidPhone(phone)) {
      errors.push("Número de teléfono inválido");
    }
    
    if (!clinicName.trim() || clinicName.trim().length < 3) {
      errors.push("Nombre de clínica inválido");
    }
    
    if (!address.trim() || address.trim().length < 5) {
      errors.push("Dirección inválida");
    }
    
    if (!city.trim() || city.trim().length < 3) {
      errors.push("Ciudad inválida");
    }
    
    if (specialty.length === 0) {
      errors.push("Debes seleccionar al menos una especialidad");
    }
    
    if (!experience.trim() || experience.trim().length < 10) {
      errors.push("Experiencia inválida");
    }
    
    if (!docsLink.trim() || !isValidURL(docsLink)) {
      errors.push("Enlace a documentos inválido");
    }
    
    if (!acceptTerms) {
      errors.push("Debes aceptar los términos y condiciones");
    }
    
    if (errors.length > 0) {
      toast({
        title: "Campos incompletos o inválidos",
        description: errors.join(". "),
        variant: "destructive"
      });
      return;
    }

    if (!uid) {
      toast({
        title: "Error de autenticación",
        description: "No se pudo verificar tu identidad. Intenta iniciar sesión nuevamente.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const doctorData = {
        uid,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        clinicName: clinicName.trim(),
        address: address.trim(),
        city: city.trim(),
        specialties: specialty,
        experience: experience.trim(),
        docsLink: docsLink.trim(),
        status: "pending",
        rol: "doctor",
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, "doctors", uid), doctorData);

      setSuccessMessage("¡Gracias por tu registro! Tu perfil está en revisión para validar que eres un profesional verificado.");

      setTimeout(() => {
        window.location.href = "/";
      }, 4000);

    } catch (error: any) {
      console.error("Error al registrar doctor:", error);
      toast({
        title: "Error al enviar",
        description: `No se pudo registrar: ${error.message || "Revisa la consola"}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSpecialty = (value: string) => {
    setSpecialty(current => current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="bg-primary/10 py-16 md:py-24">
          <div className="container max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Registra tu perfil profesional</h1>
                <p className="text-lg mb-8 text-muted-foreground">
                  Completa este formulario para aparecer en el directorio y permitir que nuevos pacientes te encuentren.
                </p>
              </div>
              <div className="md:w-1/2">
                <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop" alt="Veterinario con mascota" className="rounded-lg shadow-lg w-full" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle>Formulario de registro profesional</CardTitle>
                <CardDescription>Tu solicitud será revisada antes de publicarse en el sistema.</CardDescription>
                <div className="text-sm text-muted-foreground mt-2">
                  Los campos marcados con <span className="text-red-500">*</span> son obligatorios
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <InputWithIcon 
                    label="Nombre completo" 
                    placeholder="Dra. Mariana Reyes" 
                    value={fullName} 
                    onChange={setFullName} 
                    icon={<User />} 
                    error={nameError}
                  />
                  
                  <InputWithIcon 
                    label="Correo electrónico" 
                    placeholder="mariana@example.com" 
                    value={email} 
                    onChange={setEmail} 
                    icon={<Mail />} 
                    type="email"
                    error={emailError}
                  />
                  
                  <InputWithIcon 
                    label="Teléfono" 
                    placeholder="+52 55 1234 5678" 
                    value={phone} 
                    onChange={setPhone} 
                    icon={<Phone />}
                    error={phoneError}
                  />
                  
                  <InputWithIcon 
                    label="Nombre de la clínica" 
                    placeholder="Clínica Animalia" 
                    value={clinicName} 
                    onChange={setClinicName} 
                    icon={<Briefcase />}
                    error={clinicNameError}
                  />
                  
                  <InputWithIcon 
                    label="Dirección" 
                    placeholder="Av. Central #123, CDMX" 
                    value={address} 
                    onChange={setAddress} 
                    icon={<MapPin />}
                    error={addressError}
                  />
                  
                  <InputWithIcon 
                    label="Ciudad" 
                    placeholder="Ciudad de México" 
                    value={city} 
                    onChange={setCity} 
                    icon={<MapPin />}
                    error={cityError}
                  />
                  
                  <InputWithIcon 
                    label="Experiencia profesional" 
                    placeholder="10 años en UVM, diplomado en cirugía" 
                    value={experience} 
                    onChange={setExperience} 
                    icon={<ExperienceIcon />}
                    error={experienceError}
                  />
                  
                  <InputWithIcon 
                    label="Enlace a documentos oficiales" 
                    placeholder="https://drive.google.com/..." 
                    value={docsLink} 
                    onChange={setDocsLink} 
                    icon={<FileText />}
                    error={docsLinkError}
                  />

                  <div className="space-y-2">
                    <Label className="flex items-center">
                      Especialidades
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {specialties.map(spec => (
                        <div key={spec} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`spec-${spec}`} 
                            checked={specialty.includes(spec)} 
                            onCheckedChange={() => toggleSpecialty(spec)} 
                          />
                          <label htmlFor={`spec-${spec}`} className="text-sm">{spec}</label>
                        </div>
                      ))}
                    </div>
                    {specialtyError && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {specialtyError}
                      </p>
                    )}
                  </div>

                  <Separator />
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={acceptTerms} 
                      onCheckedChange={(c) => setAcceptTerms(c as boolean)} 
                    />
                    <Label htmlFor="terms" className="text-sm flex items-center">
                      Acepto los términos y condiciones
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                  </div>

                  {!uid && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Esperando autenticación... intenta en unos segundos.
                    </p>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || !uid || 
                      !!nameError || !!emailError || !!phoneError || 
                      !!clinicNameError || !!addressError || !!cityError || 
                      !!specialtyError || !!experienceError || !!docsLinkError}
                  >
                    {loading ? "Enviando..." : "Enviar solicitud"}
                  </Button>

                  {successMessage && (
                    <p className="text-sm text-green-600 text-center mt-4 font-medium">
                      {successMessage}
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default JoinAsProfessional;