import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  MapPin, Star, Clock, Calendar, Phone, Mail, ChevronDown, ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const VetProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [vet, setVet] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMoreBio, setShowMoreBio] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVet = async () => {
      if (!id) return;
      const docRef = doc(db, "doctors", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setVet(docSnap.data());
      } else {
        setVet(null);
      }
      setLoading(false);
    };

    fetchVet();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando perfil...</p>
      </div>
    );
  }

  if (!vet) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Perfil no encontrado</h1>
          <p className="text-muted-foreground mb-8">
            Lo sentimos, el perfil de veterinario que buscas no está disponible.
          </p>
          <Button asChild>
            <a href="/search">Buscar otros veterinarios</a>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden">
        <img
          src={vet.coverImage || "https://images.unsplash.com/photo-1607746882042-944635dfe10e"}
          alt="Portada"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:order-1 order-2">
            <div className="sticky top-20 space-y-6">
              <div className="bg-card rounded-lg overflow-hidden border shadow-sm">
                <div className="p-6 space-y-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative -mt-20 mb-4">
                      <img src={vet.image} alt={vet.fullName} className="w-40 h-40 rounded-full border-4 border-primary object-cover shadow-lg" />
                    </div>
                    <h2 className="text-3xl font-bold">{vet.fullName}</h2>
                    <Badge className="mt-2 bg-primary text-white">{vet.specialties?.[0]}</Badge>
                  </div>

                  <hr className="border-border" />

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">{vet.city}</p>
                        <p className="text-sm text-muted-foreground">{vet.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-primary mr-3" />
                      <span>{vet.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-primary mr-3" />
                      <span>{vet.email}</span>
                    </div>
                  </div>

                  <Button className="w-full" onClick={() => navigate(`/appointment/${id}`)}>Solicitar cita</Button>
                </div>
              </div>

              <div className="bg-card rounded-lg overflow-hidden border shadow-sm p-6 space-y-4">
                <h3 className="font-bold flex items-center">
                  <Calendar className="h-5 w-5 mr-2" /> Horario de consulta
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Lunes - Viernes</span>
                    <span>9:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado</span>
                    <span>10:00 - 15:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo</span>
                    <span>Cerrado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 lg:order-2 order-1">
            <Tabs defaultValue="about">
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="about">Sobre mí</TabsTrigger>
                <TabsTrigger value="experience">Especialidades</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Biografía</h3>
                  <div className={`relative ${!showMoreBio && "max-h-32 overflow-hidden"}`}>
                    <p className="text-muted-foreground">{vet.experience}</p>
                    {!showMoreBio && <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent"></div>}
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2" onClick={() => setShowMoreBio(!showMoreBio)}>
                    {showMoreBio ? <>Ver menos <ChevronUp className="h-4 w-4 ml-1" /></> : <>Ver más <ChevronDown className="h-4 w-4 ml-1" /></>}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="experience">
                <h3 className="text-2xl font-bold mb-4">Especialidades</h3>
                <div className="flex flex-wrap gap-2">
                  {vet.specialties?.map((spec: string, index: number) => (
                    <Badge key={index} variant="outline">{spec}</Badge>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <section className="mt-12">
              <h3 className="text-2xl font-bold mb-4">Reseñas recientes</h3>
              <p className="text-muted-foreground">Aún no hay reseñas disponibles para este perfil.</p>
            </section>
          </div>
        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-50">
        <Button size="lg" className="rounded-full shadow-lg" onClick={() => navigate(`/appointment/${id}`)}>
          Reservar cita
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default VetProfile;
