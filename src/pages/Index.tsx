import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Heart, Calendar, Star, ChevronRight, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SpecialtyCard from "@/components/SpecialtyCard";
import VetCard from "@/components/VetCard";
import SearchAutocomplete from "@/components/SearchAutocomplete";

// Datos de ejemplo para las especialidades
const specialties = [
  {
    name: "Cardiología",
    description: "Enfermedades del corazón y sistema circulatorio",
    icon: <Heart className="h-8 w-8" />,
  },
  {
    name: "Dermatología",
    description: "Problemas de piel, pelo y alergias",
    icon: <Search className="h-8 w-8" />,
  },
  {
    name: "Neurología",
    description: "Trastornos del sistema nervioso",
    icon: <Search className="h-8 w-8" />,
  },
  {
    name: "Oftalmología",
    description: "Enfermedades de los ojos",
    icon: <Search className="h-8 w-8" />,
  },
  {
    name: "Oncología",
    description: "Diagnóstico y tratamiento del cáncer",
    icon: <Search className="h-8 w-8" />,
  },
  {
    name: "Ortopedia",
    description: "Lesiones óseas, musculares y articulares",
    icon: <Search className="h-8 w-8" />,
  },
];

// Datos de ejemplo para los veterinarios destacados
const featuredVets = [
  {
    id: "1",
    name: "Dra. María González",
    specialty: "Cardiología",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 124,
    location: "Madrid, España",
    availability: "Disponible hoy",
  },
  {
    id: "2",
    name: "Dr. Carlos Rodríguez",
    specialty: "Dermatología",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 98,
    location: "Barcelona, España",
    availability: "Disponible mañana",
  },
  {
    id: "3",
    name: "Dra. Laura Martínez",
    specialty: "Neurología",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop",
    rating: 4.7,
    reviewCount: 87,
    location: "Valencia, España",
    availability: "Disponible hoy",
  },
];

const Index = () => {
  const [isHeroVisible, setIsHeroVisible] = useState(false);

  useEffect(() => {
    // Animación para la sección hero
    setIsHeroVisible(true);
  }, []);

  const handleSearch = (query: string) => {
    // Redireccionar a la página de búsqueda con el query
    window.location.href = `/search?query=${encodeURIComponent(query)}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/20 to-secondary/40 py-20 md:py-32 overflow-hidden">
        <div 
          className={`container max-w-5xl mx-auto px-4 md:px-6 relative z-10 transition-all duration-1000 ${
            isHeroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center space-y-6 md:space-y-8">
            <Badge className="py-1 px-3 bg-primary/20 text-primary border-primary/30 mb-4">
              Encuentra veterinarios especialistas para tu mascota
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter">
              Cuidado veterinario <span className="text-primary">de calidad</span> para tus mascotas
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Encuentra a los mejores veterinarios especialistas, lee opiniones, compara precios y agenda citas al instante.
            </p>
            
            <div className="max-w-2xl mx-auto mt-8">
              <SearchAutocomplete onSearch={handleSearch} />
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-muted-foreground">
              <span className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" /> 
                <span>Más de 2000 veterinarios verificados</span>
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 text-primary mr-1" /> 
                <span>Agenda citas 24/7</span>
              </span>
              <span className="flex items-center">
                <MapPin className="h-4 w-4 text-primary mr-1" /> 
                <span>Encuentra veterinarios cercanos</span>
              </span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Especialidades */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Busca por especialidad</h2>
            <p className="text-muted-foreground">
              Nuestros veterinarios están altamente cualificados en diversas especialidades para proporcionar la mejor atención a tu mascota.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {specialties.map((specialty) => (
              <SpecialtyCard
                key={specialty.name}
                name={specialty.name}
                description={specialty.description}
                icon={specialty.icon}
              />
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/search">
              <Button variant="outline" className="group">
                Ver todas las especialidades
                <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Veterinarios destacados */}
      <section className="py-20 bg-secondary/50">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">Veterinarios destacados</h2>
              <p className="text-muted-foreground">
                Los veterinarios mejor valorados por nuestros usuarios, con amplia experiencia y excelentes reseñas.
              </p>
            </div>
            <Link to="/search" className="mt-4 md:mt-0">
              <Button variant="link" className="group text-primary">
                Ver todos
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVets.map((vet) => (
              <VetCard key={vet.id} {...vet} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Cómo funciona */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Cómo funciona Vetopolis</h2>
            <p className="text-muted-foreground">
              Agendar una cita con el veterinario adecuado nunca fue tan fácil. Sigue estos sencillos pasos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center space-y-4 p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium">Busca</h3>
              <p className="text-muted-foreground">
                Encuentra veterinarios por especialidad, ubicación o disponibilidad.
              </p>
            </div>
            
            <div className="text-center space-y-4 p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium">Elige</h3>
              <p className="text-muted-foreground">
                Compara perfiles, lee opiniones y selecciona al veterinario ideal.
              </p>
            </div>
            
            <div className="text-center space-y-4 p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium">Agenda</h3>
              <p className="text-muted-foreground">
                Reserva tu cita en línea al instante, sin llamadas ni esperas.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">¿Eres veterinario?</h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a nuestra red de profesionales y aumenta la visibilidad de tu clínica.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/join-professional">
              <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10 w-full">
                Únete como profesional
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
