
import { useState } from "react";
import { useParams } from "react-router-dom";
import { 
  MapPin, 
  Star, 
  Clock, 
  Calendar, 
  Phone, 
  Mail, 
  Globe, 
  Heart, 
  Award,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Mock data - in a real app, this would come from an API
const vetData = {
  "1": {
    id: "1",
    name: "Dra. María González",
    specialty: "Cardiología",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=2070&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 124,
    location: "Clínica Veterinaria PetCare, Madrid",
    address: "Calle Principal 123, Madrid, España",
    availability: "Disponible hoy",
    phone: "+34 123 456 789",
    email: "maria.gonzalez@petdoc.com",
    website: "www.petcare-madrid.com",
    bio: "La Dra. María González es especialista en Cardiología Veterinaria con más de 10 años de experiencia en el diagnóstico y tratamiento de enfermedades cardiovasculares en animales de compañía. Se graduó con honores de la Universidad Complutense de Madrid y completó su residencia en el Hospital Clínico Veterinario de la misma universidad.",
    education: [
      "Doctorado en Medicina Veterinaria, Universidad Complutense de Madrid",
      "Especialidad en Cardiología Veterinaria, European College of Veterinary Internal Medicine",
      "Certificación en Ecocardiografía Avanzada"
    ],
    languages: ["Español", "Inglés", "Francés"],
    services: [
      "Ecocardiografía",
      "Electrocardiograma (ECG)",
      "Holter 24 horas",
      "Medición de presión arterial",
      "Tratamiento de insuficiencia cardíaca",
      "Manejo de cardiopatías congénitas"
    ],
    reviews: [
      {
        id: "r1",
        author: "Carlos Pérez",
        rating: 5,
        date: "15/05/2023",
        content: "Excelente profesional. Diagnosticó un problema cardíaco en mi perro que otros veterinarios no habían detectado. El tratamiento fue efectivo y mi mascota ha mejorado notablemente.",
        helpful: 24,
        pet: "Perro - Labrador"
      },
      {
        id: "r2",
        author: "Ana García",
        rating: 5,
        date: "03/04/2023",
        content: "La Dra. González ha tratado a mi gato con mucho cariño y profesionalidad. Las explicaciones sobre su condición fueron muy claras y el seguimiento ha sido excelente.",
        helpful: 18,
        pet: "Gato - Persa"
      },
      {
        id: "r3",
        author: "Javier Martínez",
        rating: 4,
        date: "27/02/2023",
        content: "Muy buena atención, aunque tuve que esperar un poco más de lo esperado. El diagnóstico fue acertado y mi mascota está respondiendo bien al tratamiento.",
        helpful: 10,
        pet: "Perro - Bulldog"
      }
    ],
    prices: [
      { service: "Consulta inicial", price: "60€" },
      { service: "Ecocardiografía", price: "120€" },
      { service: "Electrocardiograma", price: "80€" },
      { service: "Control rutinario", price: "50€" },
      { service: "Holter 24 horas", price: "150€" }
    ]
  },
  "2": {
    id: "2",
    name: "Dr. Carlos Rodríguez",
    specialty: "Dermatología",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=2070&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 98,
    location: "Hospital Veterinario San Martín, Barcelona",
    address: "Av. Central 456, Barcelona, España",
    availability: "Disponible mañana",
    phone: "+34 987 654 321",
    email: "carlos.rodriguez@petdoc.com",
    website: "www.hospitalveterinario-sanmartin.com",
    bio: "El Dr. Carlos Rodríguez es especialista en Dermatología Veterinaria, con particular experiencia en el diagnóstico y tratamiento de alergias, infecciones cutáneas y enfermedades autoinmunes en animales de compañía. Obtuvo su título en la Universidad Autónoma de Barcelona y ha realizado múltiples cursos de especialización en Europa y Estados Unidos.",
    education: [
      "Licenciatura en Medicina Veterinaria, Universidad Autónoma de Barcelona",
      "Diplomado en Dermatología Veterinaria, European College of Veterinary Dermatology",
      "Máster en Alergología Veterinaria"
    ],
    languages: ["Español", "Inglés", "Catalán"],
    services: [
      "Diagnóstico y tratamiento de alergias",
      "Biopsias cutáneas",
      "Citologías",
      "Cultivos fúngicos y bacterianos",
      "Tratamiento de enfermedades parasitarias",
      "Manejo de enfermedades autoinmunes cutáneas"
    ],
    reviews: [
      {
        id: "r1",
        author: "Elena Sánchez",
        rating: 5,
        date: "20/06/2023",
        content: "Mi perro sufría de una alergia crónica que le causaba mucha picazón. El Dr. Rodríguez dio en el clavo con el diagnóstico y ahora está mucho mejor. Muy recomendable.",
        helpful: 15,
        pet: "Perro - Yorkshire"
      },
      {
        id: "r2",
        author: "Roberto López",
        rating: 4,
        date: "12/05/2023",
        content: "Buena atención, aunque el tratamiento tomó algo de tiempo en hacer efecto. El doctor es muy paciente explicando los procesos y opciones de tratamiento.",
        helpful: 8,
        pet: "Gato - Siamés"
      }
    ],
    prices: [
      { service: "Consulta dermatológica", price: "65€" },
      { service: "Biopsia cutánea", price: "110€" },
      { service: "Pruebas de alergia", price: "180€" },
      { service: "Citología", price: "70€" },
      { service: "Revisión de seguimiento", price: "55€" }
    ]
  },
  "3": {
    id: "3",
    name: "Dra. Laura Martínez",
    specialty: "Neurología",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=2070&auto=format&fit=crop",
    rating: 4.7,
    reviewCount: 87,
    location: "Centro Neurológico Veterinario, Valencia",
    address: "Plaza Mayor 78, Valencia, España",
    availability: "Disponible hoy",
    phone: "+34 555 123 456",
    email: "laura.martinez@petdoc.com",
    website: "www.neuroveterinaria.es",
    bio: "La Dra. Laura Martínez es neuróloga veterinaria especializada en el diagnóstico y tratamiento de enfermedades neurológicas en pequeños animales. Con especial interés en epilepsia, enfermedades de la médula espinal y rehabilitación neurológica. Graduada de la Universidad de Valencia, completó su residencia en Neurología en la Universidad de Utrecht, Países Bajos.",
    education: [
      "Doctora en Medicina Veterinaria, Universidad de Valencia",
      "Residencia en Neurología Veterinaria, Universidad de Utrecht",
      "Certificación en Neurocirugía Veterinaria Avanzada"
    ],
    languages: ["Español", "Inglés", "Neerlandés"],
    services: [
      "Evaluación neurológica completa",
      "Electroencefalograma (EEG)",
      "Resonancia magnética",
      "Análisis de líquido cefalorraquídeo",
      "Manejo de epilepsia",
      "Rehabilitación neurológica",
      "Neurocirugía"
    ],
    reviews: [
      {
        id: "r1",
        author: "María Torres",
        rating: 5,
        date: "10/07/2023",
        content: "Mi perro fue diagnosticado con epilepsia y gracias a la Dra. Martínez, hemos logrado controlar sus crisis. Su enfoque es muy completo y profesional.",
        helpful: 22,
        pet: "Perro - Border Collie"
      },
      {
        id: "r2",
        author: "Pedro Ramírez",
        rating: 4,
        date: "02/06/2023",
        content: "Excelente diagnóstico y tratamiento para mi gato con problemas de coordinación. La rehabilitación neurológica ha sido clave en su recuperación.",
        helpful: 14,
        pet: "Gato - Europeo"
      },
      {
        id: "r3",
        author: "Lucía Fernández",
        rating: 5,
        date: "15/05/2023",
        content: "Profesional excepcional. Detectó un problema neurológico complejo en mi mascota que otros veterinarios no pudieron diagnosticar. Totalmente recomendable.",
        helpful: 19,
        pet: "Perro - Beagle"
      }
    ],
    prices: [
      { service: "Consulta neurológica", price: "75€" },
      { service: "Electroencefalograma", price: "140€" },
      { service: "Análisis de LCR", price: "180€" },
      { service: "Sesión de rehabilitación", price: "60€" },
      { service: "Consulta de seguimiento", price: "55€" }
    ]
  }
};

const VetProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [showMoreBio, setShowMoreBio] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  if (!id || !vetData[id as keyof typeof vetData]) {
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

  const vet = vetData[id as keyof typeof vetData];
  const displayedReviews = showAllReviews ? vet.reviews : vet.reviews.slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Cover image */}
      <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden">
        <img
          src={vet.coverImage}
          alt="Portada"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
      </div>
      
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Professional info */}
          <div className="lg:order-1 order-2">
            <div className="sticky top-20 space-y-6">
              {/* Profile card */}
              <div className="bg-card rounded-lg overflow-hidden border shadow-sm">
                <div className="p-6 space-y-4">
                  {/* Profile image and name */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative -mt-20 mb-4">
                      <img
                        src={vet.image}
                        alt={vet.name}
                        className="w-32 h-32 rounded-full border-4 border-background object-cover"
                      />
                    </div>
                    <h2 className="text-2xl font-bold">{vet.name}</h2>
                    <Badge className="mt-2 bg-primary text-white">{vet.specialty}</Badge>
                    
                    <div className="flex items-center justify-center mt-4">
                      <Star className="h-5 w-5 text-yellow-500 mr-1" />
                      <span className="font-medium">{vet.rating}</span>
                      <span className="text-muted-foreground text-sm ml-1">({vet.reviewCount} opiniones)</span>
                    </div>
                  </div>
                  
                  <hr className="border-border" />
                  
                  {/* Contact details */}
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">{vet.location}</p>
                        <p className="text-sm text-muted-foreground">{vet.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-primary mr-3" />
                      <span>{vet.availability}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-primary mr-3" />
                      <span>{vet.phone}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-primary mr-3" />
                      <span>{vet.email}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 text-primary mr-3" />
                      <a href={`https://${vet.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {vet.website}
                      </a>
                    </div>
                  </div>
                  
                  <hr className="border-border" />
                  
                  {/* Languages */}
                  <div>
                    <h3 className="font-medium mb-2">Idiomas</h3>
                    <div className="flex flex-wrap gap-2">
                      {vet.languages.map((language, index) => (
                        <Badge key={index} variant="outline">{language}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full">Solicitar cita</Button>
                </div>
              </div>
              
              {/* Schedule card */}
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
          
          {/* Main content */}
          <div className="lg:col-span-2 lg:order-2 order-1">
            <Tabs defaultValue="about">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="about">Sobre mí</TabsTrigger>
                <TabsTrigger value="services">Servicios</TabsTrigger>
                <TabsTrigger value="reviews">Opiniones</TabsTrigger>
                <TabsTrigger value="prices">Precios</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Biografía</h3>
                  <div className={`relative ${!showMoreBio && "max-h-32 overflow-hidden"}`}>
                    <p className="text-muted-foreground">{vet.bio}</p>
                    {!showMoreBio && (
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent"></div>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2" 
                    onClick={() => setShowMoreBio(!showMoreBio)}
                  >
                    {showMoreBio ? (
                      <>Ver menos <ChevronUp className="h-4 w-4 ml-1" /></>
                    ) : (
                      <>Ver más <ChevronDown className="h-4 w-4 ml-1" /></>
                    )}
                  </Button>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-4">Formación</h3>
                  <ul className="space-y-3">
                    {vet.education.map((edu, index) => (
                      <li key={index} className="flex">
                        <Award className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        <span>{edu}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="services">
                <h3 className="text-2xl font-bold mb-6">Servicios</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vet.services.map((service, index) => (
                    <div key={index} className="flex items-center p-3 border rounded-lg">
                      <Heart className="h-5 w-5 text-primary mr-3" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Opiniones</h3>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-1" />
                    <span className="font-medium text-lg">{vet.rating}</span>
                    <span className="text-muted-foreground text-sm ml-1">({vet.reviewCount})</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {displayedReviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{review.author}</h4>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      
                      <div className="flex items-center mb-2">
                        {Array(5).fill(0).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? "text-yellow-500" : "text-gray-300"}`} 
                          />
                        ))}
                        <span className="text-xs ml-2 bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {review.pet}
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground text-sm">{review.content}</p>
                      
                      <div className="flex items-center mt-3 text-xs text-muted-foreground">
                        <div className="flex items-center mr-4">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          <span>Útil ({review.helpful})</span>
                        </div>
                        <div className="flex items-center">
                          <ThumbsDown className="h-3 w-3 mr-1" />
                          <span>No útil</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {vet.reviews.length > 2 && (
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="w-full"
                  >
                    {showAllReviews ? "Ver menos opiniones" : `Ver todas las opiniones (${vet.reviews.length})`}
                  </Button>
                )}
              </TabsContent>
              
              <TabsContent value="prices">
                <h3 className="text-2xl font-bold mb-6">Precios</h3>
                <div className="border rounded-lg divide-y">
                  {vet.prices.map((price, index) => (
                    <div key={index} className="flex justify-between p-4">
                      <span>{price.service}</span>
                      <span className="font-medium">{price.price}</span>
                    </div>
                  ))}
                </div>
                
                <p className="mt-4 text-sm text-muted-foreground">
                  * Los precios son orientativos y pueden variar según la complejidad del caso.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VetProfile;
