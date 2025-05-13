import { useState, useEffect } from "react";
import {
  Briefcase,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase as ExperienceIcon,
  FileText
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

const InputWithIcon = ({
  label,
  placeholder,
  value,
  onChange,
  icon,
  type = "text"
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  icon: React.ReactNode;
  type?: string;
}) => (
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !uid || !fullName.trim() || !email.trim() || !phone.trim() ||
      !clinicName.trim() || !address.trim() || !city.trim() ||
      specialty.length === 0 || !experience.trim() || !docsLink.trim() || !acceptTerms
    ) {
      toast({
        title: "Campos incompletos",
        description: "Por favor llena todos los campos requeridos y acepta los términos.",
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
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <InputWithIcon label="Nombre completo" placeholder="Dra. Mariana Reyes" value={fullName} onChange={setFullName} icon={<User />} />
                  <InputWithIcon label="Correo electrónico" placeholder="mariana@example.com" value={email} onChange={setEmail} icon={<Mail />} type="email" />
                  <InputWithIcon label="Teléfono" placeholder="+52 55 1234 5678" value={phone} onChange={setPhone} icon={<Phone />} />
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

                  {!uid && (
                    <p className="text-sm text-destructive">
                      Esperando autenticación... intenta en unos segundos.
                    </p>
                  )}

                  <Button type="submit" className="w-full" disabled={loading || !uid}>
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
