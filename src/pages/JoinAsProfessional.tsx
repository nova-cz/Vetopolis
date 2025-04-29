import { useState } from "react";
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
  FileText
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
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const goToNextStep = () => {
    if (!fullName || !email || !phone) {
      toast({ title: "Campos incompletos", description: "Por favor completa todos los campos personales", variant: "destructive" });
      return;
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const goToPreviousStep = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim() || !clinicName.trim() || !address.trim() || !city.trim() || specialty.length === 0 || !experience.trim() || !docsLink.trim() || !acceptTerms) {
      toast({ title: "Campos incompletos", description: "Por favor llena todos los campos requeridos y acepta los términos.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "applications"), {
        fullName, email, phone, clinicName, address, city,
        specialty, experience, docsLink, status: "pending",
        createdAt: timestamp(),
      });
      toast({ title: "Solicitud enviada", description: "Hemos recibido tu solicitud. Te contactaremos pronto." });
      window.location.href = "/";
    } catch (error) {
      toast({ title: "Error al enviar", description: "Ocurrió un error al enviar la solicitud. Intenta nuevamente.", variant: "destructive" });
      console.error("Error al registrar doctor:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSpecialty = (value: string) => {
    setSpecialty(current => current.includes(value) ? current.filter(item => item !== value) : [...current, value]);
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
              </CardHeader>
              <CardContent className="space-y-6">
                {step === 1 ? (
                  <>
                    <InputWithIcon label="Nombre completo" placeholder="Dra. Mariana Reyes" value={fullName} onChange={setFullName} icon={<User />} />
                    <InputWithIcon label="Correo electrónico" placeholder="mariana@example.com" value={email} onChange={setEmail} icon={<Mail />} type="email" />
                    <InputWithIcon label="Teléfono" placeholder="+52 55 1234 5678" value={phone} onChange={setPhone} icon={<Phone />} />
                    <Button onClick={goToNextStep} className="w-full">Continuar <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <InputWithIcon label="Nombre de la clínica" placeholder="Clínica Animalia" value={clinicName} onChange={setClinicName} icon={<Briefcase />} />
                    <InputWithIcon label="Dirección" placeholder="Av. Central #123, CDMX" value={address} onChange={setAddress} icon={<MapPin />} />
                    <InputWithIcon label="Ciudad" placeholder="Ciudad de México" value={city} onChange={setCity} icon={<MapPin />} />
                    <InputWithIcon label="Experiencia profesional" placeholder="10 años en UVM, diplomado en cirugía" value={experience} onChange={setExperience} icon={<ExperienceIcon />} />
                    <InputWithIcon label="Enlace a documentos oficiales" placeholder="https://drive.google.com/..." value={docsLink} onChange={setDocsLink} icon={<FileText />} />
                    <div>
                      <Label>Especialidades (selecciona al menos una)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {specialties.map(spec => (
                          <div key={spec} className="flex items-center space-x-2">
                            <Checkbox id={`spec-${spec}`} checked={specialty.includes(spec)} onCheckedChange={() => toggleSpecialty(spec)} />
                            <label htmlFor={`spec-${spec}`} className="text-sm">{spec}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(c) => setAcceptTerms(c as boolean)} />
                      <Label htmlFor="terms" className="text-sm">Acepto los términos y condiciones</Label>
                    </div>
                    <div className="flex gap-4">
                      <Button type="button" variant="outline" className="flex-1" onClick={goToPreviousStep}>Volver</Button>
                      <Button type="submit" className="flex-1" disabled={loading}>{loading ? "Enviando..." : "Enviar solicitud"}</Button>
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

const InputWithIcon = ({ label, placeholder, value, onChange, icon, type = "text" }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">{icon}</span>
      <Input
        className="pl-10"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

export default JoinAsProfessional;
