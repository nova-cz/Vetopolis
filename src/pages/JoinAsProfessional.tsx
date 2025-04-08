
import { useState } from "react";
import { Briefcase, Heart, CheckCircle, ArrowRight, User, Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Benefits of joining as a professional
const benefits = [
  {
    title: "Mayor visibilidad",
    description: "Aumenta la exposición de tu clínica veterinaria con nuestro directorio de profesionales especialistas.",
    icon: <Heart className="h-10 w-10 text-primary" />,
  },
  {
    title: "Gestión de citas",
    description: "Administra fácilmente tu calendario y citas con nuestro sistema automatizado.",
    icon: <Clock className="h-10 w-10 text-primary" />,
  },
  {
    title: "Reseñas verificadas",
    description: "Construye credibilidad con reseñas genuinas de clientes que han usado nuestros servicios.",
    icon: <CheckCircle className="h-10 w-10 text-primary" />,
  },
];

// Available specialties
const specialties = [
  "Cardiología",
  "Dermatología",
  "Neurología",
  "Oftalmología",
  "Oncología",
  "Ortopedia y Traumatología",
  "Odontología",
  "Gastroenterología",
  "Nefrología y Urología",
  "Endocrinología",
  "Reproducción y Obstetricia",
  "Anestesiología",
  "Medicina Interna",
  "Medicina de Animales Exóticos",
  "Etología",
  "Medicina Preventiva",
];

const JoinAsProfessional = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const goToNextStep = () => {
    // Validate first step
    if (step === 1) {
      if (!fullName || !email || !phone) {
        toast({
          title: "Campos incompletos",
          description: "Por favor completa todos los campos personales",
          variant: "destructive",
        });
        return;
      }
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousStep = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate second step
    if (!clinicName || !address || !city || specialty.length === 0 || !experience || !acceptTerms) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos del formulario",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate API call
    setLoading(true);
    try {
      // In a real app, this would be an API call to register the professional
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Solicitud enviada",
        description: "Hemos recibido tu solicitud. Te contactaremos pronto.",
      });
      
      // Redirect to home
      window.location.href = "/";
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu solicitud. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSpecialty = (value: string) => {
    setSpecialty(current => 
      current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-primary/10 py-16 md:py-24">
          <div className="container max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Únete a la red de veterinarios especialistas
                </h1>
                <p className="text-lg mb-8 text-muted-foreground">
                  Expande tu práctica, consigue nuevos clientes y disfruta de las ventajas
                  de formar parte de la plataforma líder en cuidado veterinario.
                </p>
                <Button size="lg" className="px-8">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Regístrate ahora
                </Button>
              </div>
              
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop" 
                  alt="Veterinario con mascota" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits section */}
        <section className="py-16">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              ¿Por qué unirte a PetDoc?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="mb-4">{benefit.icon}</div>
                    <CardTitle>{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Registration form */}
        <section className="bg-secondary/30 py-16">
          <div className="container max-w-4xl mx-auto">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">Regístrate como veterinario profesional</CardTitle>
                <CardDescription>
                  Complete el formulario a continuación para comenzar el proceso de registro
                </CardDescription>
              </CardHeader>
              <CardContent>
                {step === 1 ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nombre completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                          id="fullName" 
                          className="pl-10" 
                          placeholder="Dr. Juan Pérez"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                          id="email" 
                          type="email" 
                          className="pl-10" 
                          placeholder="doctor@ejemplo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                          id="phone" 
                          className="pl-10" 
                          placeholder="+52 55 1234 5678"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <Button onClick={goToNextStep} className="w-full">
                      Continuar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="clinicName">Nombre de la clínica</Label>
                      <Input 
                        id="clinicName" 
                        placeholder="Clínica Veterinaria"
                        value={clinicName}
                        onChange={(e) => setClinicName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                          id="address" 
                          className="pl-10" 
                          placeholder="Calle, número, colonia"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad</Label>
                      <Input 
                        id="city" 
                        placeholder="Ciudad de México"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Especialidades (selecciona al menos una)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {specialties.map((spec) => (
                          <div key={spec} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`specialty-${spec}`}
                              checked={specialty.includes(spec)}
                              onCheckedChange={() => toggleSpecialty(spec)}
                            />
                            <label 
                              htmlFor={`specialty-${spec}`}
                              className="text-sm cursor-pointer"
                            >
                              {spec}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experiencia profesional</Label>
                      <Textarea 
                        id="experience"
                        placeholder="Describe brevemente tu experiencia, educación y cualquier certificación relevante"
                        className="min-h-[120px]"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                      />
                      <Label htmlFor="terms" className="text-sm">
                        Acepto los términos y condiciones y la política de privacidad
                      </Label>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1"
                        onClick={goToPreviousStep}
                      >
                        Volver
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1"
                        disabled={loading}
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

export default JoinAsProfessional;
