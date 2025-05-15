import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppointmentForm from "@/pages/AppointmentFormPage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const BookAppointment = () => {
  const { id } = useParams<{ id: string }>();
  const [vet, setVet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVet = async () => {
      setIsLoading(true);
      try {
        const vetRef = doc(db, "doctors", id!);
        const vetSnap = await getDoc(vetRef);
        if (vetSnap.exists()) {
          setVet({ id: vetSnap.id, ...vetSnap.data() });
        } else {
          setVet(null);
        }
      } catch (error) {
        setVet(null);
        console.error("Error al cargar el veterinario:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchVet();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container py-10">
          <div className="animate-pulse space-y-8">
            <div className="h-6 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded w-2/3"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container py-10">
        <Link to="/search" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a la búsqueda
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg overflow-hidden shadow-sm">
              <div className="relative h-48 md:h-64 overflow-hidden">
                <img src={vet.image} alt={vet.fullName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  {vet.specialties?.map((specialty: string) => (
                    <Badge key={specialty} className="mr-2 mb-2 bg-primary text-white">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-background -mt-12 relative z-10">
                    <img src={vet.image} alt={vet.fullName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold">{vet.fullName}</h1>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{vet.city}</span>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="about" className="mt-8">
                  <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="about">Información</TabsTrigger>
                    <TabsTrigger value="location">Ubicación</TabsTrigger>
                  </TabsList>

                  <TabsContent value="about" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Sobre {vet.fullName}</h3>
                      <p className="text-muted-foreground">{vet.experience}</p>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Dirección</div>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{vet.address}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Teléfono</div>
                        <div className="flex items-center text-muted-foreground">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{vet.phone}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Email</div>
                        <div className="flex items-center text-muted-foreground">
                          <Mail className="h-4 w-4 mr-2" />
                          <span>{vet.email}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="location" className="space-y-4">
                    <div className="aspect-video bg-muted rounded-md overflow-hidden relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-muted-foreground">Mapa de ubicación</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Dirección</h3>
                      <p className="text-muted-foreground">{vet.address}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          <div className="lg:row-start-1">
            <div className="sticky top-20">
              <AppointmentForm
                vetId={vet.id}
                vetName={vet.fullName}
                specialties={vet.specialties || []}
                clinicName={vet.clinicName || ""}
                address={vet.address || ""}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookAppointment;
