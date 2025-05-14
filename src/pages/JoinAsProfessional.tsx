import { useState, useEffect } from "react";
import {
  Briefcase,
  Heart,
  CheckCircle,
  ArrowRight,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Briefcase as ExperienceIcon,
  FileText,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { collection, addDoc } from "firebase/firestore";
import { db, timestamp } from "@/lib/firebase";

const specialties = [
  "Cardiología", "Dermatología", "Neurología", "Oftalmología", "Oncología",
  "Ortopedia y Traumatología", "Odontología", "Gastroenterología", "Nefrología y Urología",
  "Endocrinología", "Reproducción y Obstetricia", "Anestesiología", "Medicina Interna",
  "Medicina de Animales Exóticos", "Etología", "Medicina Preventiva",
];

const JoinAsProfessional = () => {
  // Estados para los campos del formulario
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState([]);
  const [experience, setExperience] = useState("");
  const [docsLink, setDocsLink] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Estado para errores de validación
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    clinicName: "",
    address: "",
    city: "",
    specialty: "",
    experience: "",
    docsLink: "",
    terms: ""
  });
  
  const { toast } = useToast();

  // Funciones de validación
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Acepta formatos: +52 55 1234 5678, (555) 123-4567, 555-123-4567, 5551234567
    const phoneRegex = /^(\+?\d{1,3})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return phoneRegex.test(phone);
  };

  const validateName = (name) => {
    // Permite nombres con títulos como "Dr." o "Dra."
    return name.trim().length >= 5 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.]+$/.test(name);
  };

  const validateUrl = (url) => {
    // Validación básica de URL
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlRegex.test(url);
  };

  // Manejadores de cambio con validación
  const handleFullNameChange = (value) => {
    setFullName(value);
    
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, fullName: "El nombre es requerido" }));
    } else if (!validateName(value)) {
      setErrors(prev => ({ ...prev, fullName: "Ingrese un nombre válido (solo letras)" }));
    } else {
      setErrors(prev => ({ ...prev, fullName: "" }));
    }
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, email: "El correo es requerido" }));
    } else if (!validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: "Ingrese un correo electrónico válido" }));
    } else {
      setErrors(prev => ({ ...prev, email: "" }));
    }
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
    
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, phone: "El teléfono es requerido" }));
    } else if (!validatePhone(value)) {
      setErrors(prev => ({ ...prev, phone: "Ingrese un número telefónico válido" }));
    } else {
      setErrors(prev => ({ ...prev, phone: "" }));
    }
  };

  const handleClinicNameChange = (value) => {
    setClinicName(value);
    
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, clinicName: "El nombre de la clínica es requerido" }));
    } else if (value.trim().length < 3) {
      setErrors(prev => ({ ...prev, clinicName: "El nombre debe tener al menos 3 caracteres" }));
    } else {
      setErrors(prev => ({ ...prev, clinicName: "" }));
    }
  };

  const handleAddressChange = (value) => {
    setAddress(value);
    
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, address: "La dirección es requerida" }));
    } else if (value.trim().length < 10) {
      setErrors(prev => ({ ...prev, address: "Ingrese una dirección completa" }));
    } else {
      setErrors(prev => ({ ...prev, address: "" }));
    }
  };

  const handleCityChange = (value) => {
    setCity(value);
    
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, city: "La ciudad es requerida" }));
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
      setErrors(prev => ({ ...prev, city: "Ingrese un nombre de ciudad válido" }));
    } else {
      setErrors(prev => ({ ...prev, city: "" }));
    }
  };

  const handleExperienceChange = (value) => {
    setExperience(value);
    
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, experience: "La experiencia es requerida" }));
    } else if (value.trim().length < 10) {
      setErrors(prev => ({ ...prev, experience: "Proporcione más detalles sobre su experiencia" }));
    } else {
      setErrors(prev => ({ ...prev, experience: "" }));
    }
  };

  const handleDocsLinkChange = (value) => {
    setDocsLink(value);
    
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, docsLink: "El enlace a documentos es requerido" }));
    } else if (!validateUrl(value)) {
      setErrors(prev => ({ ...prev, docsLink: "Ingrese una URL válida" }));
    } else {
      setErrors(prev => ({ ...prev, docsLink: "" }));
    }
  };

  const toggleSpecialty = (value) => {
    const updatedSpecialties = specialty.includes(value) 
      ? specialty.filter(item => item !== value) 
      : [...specialty, value];
    
    setSpecialty(updatedSpecialties);
    
    if (updatedSpecialties.length === 0) {
      setErrors(prev => ({ ...prev, specialty: "Seleccione al menos una especialidad" }));
    } else {
      setErrors(prev => ({ ...prev, specialty: "" }));
    }
  };

  // Verificar si hay errores en el paso 1
  const isStep1Valid = () => {
    return !errors.fullName && !errors.email && !errors.phone && 
           fullName.trim() !== "" && email.trim() !== "" && phone.trim() !== "";
  };

  // Verificar si hay errores en el paso 2
  const isStep2Valid = () => {
    return !errors.clinicName && !errors.address && !errors.city && 
           !errors.specialty && !errors.experience && !errors.docsLink &&
           clinicName.trim() !== "" && address.trim() !== "" && city.trim() !== "" &&
           specialty.length > 0 && experience.trim() !== "" && docsLink.trim() !== "" &&
           acceptTerms;
  };

  const goToNextStep = () => {
    // Validar campos del paso 1
    if (!fullName.trim()) {
      setErrors(prev => ({ ...prev, fullName: "El nombre es requerido" }));
    } else if (!validateName(fullName)) {
      setErrors(prev => ({ ...prev, fullName: "Ingrese un nombre válido (solo letras)" }));
    }
    
    if (!email.trim()) {
      setErrors(prev => ({ ...prev, email: "El correo es requerido" }));
    } else if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: "Ingrese un correo electrónico válido" }));
    }
    
    if (!phone.trim()) {
      setErrors(prev => ({ ...prev, phone: "El teléfono es requerido" }));
    } else if (!validatePhone(phone)) {
      setErrors(prev => ({ ...prev, phone: "Ingrese un número telefónico válido" }));
    }
    
    if (isStep1Valid()) {
      setStep(2);
      window.scrollTo(0, 0);
    } else {
      toast({ 
        title: "Campos incompletos o incorrectos", 
        description: "Por favor, corrija los errores antes de continuar", 
        variant: "destructive" 
      });
    }
  };

  const goToPreviousStep = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos del paso 2
    if (!clinicName.trim()) {
      setErrors(prev => ({ ...prev, clinicName: "El nombre de la clínica es requerido" }));
    }
    
    if (!address.trim()) {
      setErrors(prev => ({ ...prev, address: "La dirección es requerida" }));
    }
    
    if (!city.trim()) {
      setErrors(prev => ({ ...prev, city: "La ciudad es requerida" }));
    }
    
    if (specialty.length === 0) {
      setErrors(prev => ({ ...prev, specialty: "Seleccione al menos una especialidad" }));
    }
    
    if (!experience.trim()) {
      setErrors(prev => ({ ...prev, experience: "La experiencia es requerida" }));
    }
    
    if (!docsLink.trim()) {
      setErrors(prev => ({ ...prev, docsLink: "El enlace a documentos es requerido" }));
    } else if (!validateUrl(docsLink)) {
      setErrors(prev => ({ ...prev, docsLink: "Ingrese una URL válida" }));
    }
    
    if (!acceptTerms) {
      setErrors(prev => ({ ...prev, terms: "Debe aceptar los términos y condiciones" }));
      toast({ 
        title: "Términos y condiciones", 
        description: "Debe aceptar los términos y condiciones para continuar", 
        variant: "destructive" 
      });
      return;
    } else {
      setErrors(prev => ({ ...prev, terms: "" }));
    }
    
    if (!isStep2Valid()) {
      toast({ 
        title: "Campos incompletos o incorrectos", 
        description: "Por favor, corrija los errores antes de enviar", 
        variant: "destructive" 
      });
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "applications"), {
        fullName, email, phone, clinicName, address, city,
        specialty, experience, docsLink, status: "pending",
        createdAt: timestamp(),
      });
      toast({ 
        title: "Solicitud enviada", 
        description: "Hemos recibido tu solicitud. Te contactaremos pronto." 
      });
      window.location.href = "/";
    } catch (error) {
      toast({ 
        title: "Error al enviar", 
        description: "Ocurrió un error al enviar la solicitud. Intenta nuevamente.", 
        variant: "destructive" 
      });
      console.error("Error al registrar doctor:", error);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para validar especialidades cuando cambian
  useEffect(() => {
    if (specialty.length === 0 && step === 2) {
      setErrors(prev => ({ ...prev, specialty: "Seleccione al menos una especialidad" }));
    } else {
      setErrors(prev => ({ ...prev, specialty: "" }));
    }
  }, [specialty, step]);

  // Efecto para validar términos y condiciones
  useEffect(() => {
    if (!acceptTerms && step === 2) {
      setErrors(prev => ({ ...prev, terms: "Debe aceptar los términos y condiciones" }));
    } else {
      setErrors(prev => ({ ...prev, terms: "" }));
    }
  }, [acceptTerms, step]);

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
              </CardHeader>
              <CardContent className="space-y-6">
                {step === 1 ? (
                  <>
                    <InputWithValidation 
                      label="Nombre completo" 
                      placeholder="Dra. Mariana Reyes" 
                      value={fullName} 
                      onChange={handleFullNameChange} 
                      icon={<User />} 
                      error={errors.fullName}
                    />
                    <InputWithValidation 
                      label="Correo electrónico" 
                      placeholder="mariana@example.com" 
                      value={email} 
                      onChange={handleEmailChange} 
                      icon={<Mail />} 
                      type="email" 
                      error={errors.email}
                    />
                    <InputWithValidation 
                      label="Teléfono" 
                      placeholder="+52 55 1234 5678" 
                      value={phone} 
                      onChange={handlePhoneChange} 
                      icon={<Phone />} 
                      error={errors.phone}
                    />
                    <Button 
                      onClick={goToNextStep} 
                      className="w-full" 
                      disabled={!isStep1Valid()}
                    >
                      Continuar <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <InputWithValidation 
                      label="Nombre de la clínica" 
                      placeholder="Clínica Animalia" 
                      value={clinicName} 
                      onChange={handleClinicNameChange} 
                      icon={<Briefcase />} 
                      error={errors.clinicName}
                    />
                    <InputWithValidation 
                      label="Dirección" 
                      placeholder="Av. Central #123, CDMX" 
                      value={address} 
                      onChange={handleAddressChange} 
                      icon={<MapPin />} 
                      error={errors.address}
                    />
                    <InputWithValidation 
                      label="Ciudad" 
                      placeholder="Ciudad de México" 
                      value={city} 
                      onChange={handleCityChange} 
                      icon={<MapPin />} 
                      error={errors.city}
                    />
                    <InputWithValidation 
                      label="Experiencia profesional" 
                      placeholder="10 años en UVM, diplomado en cirugía" 
                      value={experience} 
                      onChange={handleExperienceChange} 
                      icon={<ExperienceIcon />} 
                      error={errors.experience}
                    />
                    <InputWithValidation 
                      label="Enlace a documentos oficiales" 
                      placeholder="https://drive.google.com/..." 
                      value={docsLink} 
                      onChange={handleDocsLinkChange} 
                      icon={<FileText />} 
                      error={errors.docsLink}
                    />
                    <div>
                      <Label>Especialidades (selecciona al menos una)</Label>
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
                      {errors.specialty && (
                        <div className="flex items-center mt-1 text-red-500 text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          <span>{errors.specialty}</span>
                        </div>
                      )}
                    </div>
                    <Separator />
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={acceptTerms} 
                        onCheckedChange={(c) => setAcceptTerms(c === true)}
                      />
                      <Label htmlFor="terms" className="text-sm">Acepto los términos y condiciones</Label>
                    </div>
                    {errors.terms && (
                      <div className="flex items-center -mt-4 text-red-500 text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        <span>{errors.terms}</span>
                      </div>
                    )}
                    <div className="flex gap-4">
                      <Button type="button" variant="outline" className="flex-1" onClick={goToPreviousStep}>
                        Volver
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1" 
                        disabled={loading || !isStep2Valid()}
                      >
                        {loading ? "Enviando..." : "Enviar solicitud"}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const InputWithValidation = ({ label, placeholder, value, onChange, icon, type = "text", error }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">{icon}</span>
      <Input
        className={`pl-10 ${error ? "border-red-500 focus:ring-red-500" : ""}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
    {error && (
      <div className="flex items-center mt-1 text-red-500 text-xs">
        <AlertCircle className="h-3 w-3 mr-1" />
        <span>{error}</span>
      </div>
    )}
  </div>
);

export default JoinAsProfessional;