
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Globe, Clock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppointmentForm from "@/components/AppointmentForm";

// Datos de ejemplo para un veterinario
const vetData = {
  id: "1",
  name: "Dra. María González",
  specialties: ["Cardiología", "Medicina Interna"],
  image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
  profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop",
  rating: 4.9,
  reviewCount: 124,
  location: "Clínica Veterinaria PetCare, Madrid",
  address: "Calle Gran Vía 123, 28013 Madrid",
  phone: "+34 91 123 45 67",
  email: "maria.gonzalez@petcare.com",
  website: "www.petcare-madrid.com",
  hours: "Lun-Vie: 9:00-20:00, Sáb: 10:00-14:00",
  languages: ["Español", "Inglés"],
  education: [
    "Doctorado en Medicina Veterinaria, Universidad Complutense de Madrid",
    "Especialización en Cardiología Veterinaria, Universidad de Barcelona"
  ],
  experience: "15 años de experiencia en cardiología veterinaria",
  about: "La Dra. María González es una veterinaria especializada en cardiología con amplia experiencia en el diagnóstico y tratamiento de enfermedades cardíacas en animales de compañía. Su enfoque se centra en proporcionar atención compasiva y de calidad, utilizando las últimas tecnologías y técnicas disponibles.",
  services: [
    "Consultas de cardiología",
    "Electrocardiogramas",
    "Ecocardiografías",
    "Radiografías torácicas",
    "Monitorización Holter",
    "Tratamientos médicos para enfermedades cardíacas",
    "Seguimiento de casos crónicos"
  ],
  reviews: [
    {
      id: "r1",
      author: "Carlos Pérez",
      date: "15/05/2023",
      rating: 5,
      comment: "Excelente profesional. Diagnosticó a mi perro con precisión y nos explicó todo el tratamiento con claridad. Muy recomendable."
    },
    {
      id: "r2",
      author: "Ana Martínez",
      date: "03/04/2023",
      rating: 4,
      comment: "Muy buena atención. La clínica está bien equipada y la doctora es muy amable con las mascotas."
    },
    {
      id: "r3",
      author: "Roberto Sánchez",
      date: "27/02/2023",
      rating: 5,
      comment: "La Dra. González salvó a mi gato que tenía una condición cardíaca grave. No podría estar más agradecido por su profesionalidad y dedicación."
    }
  ]
};

const BookAppointment = () => {
  const { id } = useParams<{ id: string }>();
  const [vet, setVet] = useState(vetData);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // En una aplicación real, aquí cargaríamos los datos del veterinario desde una API
    setIsLoading(false);
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
          {/* Información del veterinario */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg overflow-hidden shadow-sm">
              <div className="relative h-48 md:h-64 overflow-hidden">
                <img 
                  src={vet.image} 
                  alt={vet.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  {vet.specialties.map((specialty) => (
                    <Badge key={specialty} className="mr-2 mb-2 bg-primary text-white">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-background -mt-12 relative z-10">
                    <img 
                      src={vet.profileImage} 
                      alt={vet.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold">{vet.name}</h1>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{vet.location}</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="font-medium">{vet.rating}</span>
                        <span className="text-muted-foreground text-sm ml-1">({vet.reviewCount} reseñas)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Tabs defaultValue="about" className="mt-8">
                  <TabsList className="grid grid-cols-4 mb-6">
                    <TabsTrigger value="about">Información</TabsTrigger>
                    <TabsTrigger value="services">Servicios</TabsTrigger>
                    <TabsTrigger value="reviews">Reseñas</TabsTrigger>
                    <TabsTrigger value="location">Ubicación</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="about" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Sobre {vet.name}</h3>
                      <p className="text-muted-foreground">{vet.about}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Experiencia</h3>
                      <p className="text-muted-foreground">{vet.experience}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Formación</h3>
                      <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                        {vet.education.map((edu, index) => (
                          <li key={index}>{edu}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Idiomas</h3>
                      <div className="flex flex-wrap gap-2">
                        {vet.languages.map((language) => (
                          <Badge key={language} variant="secondary">
                            {language}
                          </Badge>
                        ))}
                      </div>
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
                      
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Sitio web</div>
                        <div className="flex items-center text-muted-foreground">
                          <Globe className="h-4 w-4 mr-2" />
                          <span>{vet.website}</span>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2 space-y-1">
                        <div className="text-sm font-medium">Horario</div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{vet.hours}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="services" className="space-y-6">
                    <h3 className="text-lg font-medium mb-3">Servicios ofrecidos</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 pl-5 text-muted-foreground list-disc">
                      {vet.services.map((service, index) => (
                        <li key={index}>{service}</li>
                      ))}
                    </ul>
                  </TabsContent>
                  
                  <TabsContent value="reviews" className="space-y-6">
                    <div className="flex items-center mb-6">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{vet.rating}</div>
                          <div className="text-xs">/ 5</div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-5 w-5 ${i < Math.floor(vet.rating) ? 'text-yellow-500' : 'text-gray-300'}`} 
                              fill={i < Math.floor(vet.rating) ? 'currentColor' : 'none'} 
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground mt-1">
                          Basado en {vet.reviewCount} reseñas
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {vet.reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-0">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">{review.author}</h4>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`} 
                                fill={i < review.rating ? 'currentColor' : 'none'} 
                              />
                            ))}
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      Ver todas las reseñas ({vet.reviewCount})
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="location" className="space-y-4">
                    <div className="aspect-video bg-muted rounded-md overflow-hidden relative">
                      {/* Aquí iría un mapa real con la ubicación */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-muted-foreground">Mapa de ubicación</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Dirección</h3>
                      <p className="text-muted-foreground">{vet.address}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          Cómo llegar
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
          
          {/* Formulario de cita */}
          <div className="lg:row-start-1">
            <div className="sticky top-20">
              <AppointmentForm 
                vetId={vet.id} 
                vetName={vet.name} 
                specialties={vet.specialties} 
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
