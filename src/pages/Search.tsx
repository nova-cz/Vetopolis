
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Filter, MapPin, Search as SearchIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VetCard from "@/components/VetCard";

// Lista de especialidades completa
const specialtiesList = [
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
  "Anestesiología y Analgesia",
  "Medicina Interna",
  "Medicina de Animales Exóticos",
  "Etología y Medicina del Comportamiento",
  "Medicina de Fauna Silvestre y Zoológica",
  "Medicina Preventiva y Epidemiología",
  "Toxicología",
  "Patología",
  "Nutrición Animal"
];

// Datos simulados de veterinarios
const vetsData = [
  {
    id: "1",
    name: "Dra. María González",
    specialty: "Cardiología",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 124,
    location: "Madrid, España",
    distance: "2.3 km",
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
    distance: "1.5 km",
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
    distance: "3.8 km",
    availability: "Disponible hoy",
  },
  {
    id: "4",
    name: "Dr. Manuel Pérez",
    specialty: "Oftalmología",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop",
    rating: 4.6,
    reviewCount: 76,
    location: "Sevilla, España",
    distance: "4.2 km",
    availability: "Disponible pasado mañana",
  },
  {
    id: "5",
    name: "Dra. Ana López",
    specialty: "Oncología",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 132,
    location: "Malaga, España",
    distance: "2.1 km",
    availability: "Disponible hoy",
  },
  {
    id: "6",
    name: "Dr. Javier Sánchez",
    specialty: "Ortopedia y Traumatología",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
    rating: 4.7,
    reviewCount: 91,
    location: "Zaragoza, España",
    distance: "5.3 km",
    availability: "Disponible mañana",
  },
];

// Componente principal
const Search = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSpecialty = queryParams.get("specialty") || "";
  const initialQuery = queryParams.get("query") || "";
  
  // Estados
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty);
  const [distance, setDistance] = useState([10]);
  const [isAvailableToday, setIsAvailableToday] = useState(false);
  const [minRating, setMinRating] = useState("0");
  const [sortBy, setSortBy] = useState("relevance");
  const [results, setResults] = useState(vetsData);
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Efecto para filtrar veterinarios cuando cambian los criterios
  useEffect(() => {
    setIsFiltering(true);
    
    // Simulando una llamada a API con un tiempo de carga
    const timer = setTimeout(() => {
      // Filtrar los resultados (en una app real esto sería una llamada a API)
      let filteredResults = [...vetsData];
      
      // Filtrar por búsqueda de texto
      if (searchQuery) {
        filteredResults = filteredResults.filter(vet => 
          vet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vet.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vet.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Filtrar por especialidad
      if (selectedSpecialty) {
        filteredResults = filteredResults.filter(vet => 
          vet.specialty === selectedSpecialty
        );
      }
      
      // Filtrar por disponibilidad hoy
      if (isAvailableToday) {
        filteredResults = filteredResults.filter(vet => 
          vet.availability.includes("hoy")
        );
      }
      
      // Filtrar por rating mínimo
      if (minRating && minRating !== "0") {
        filteredResults = filteredResults.filter(vet => 
          vet.rating >= Number(minRating)
        );
      }
      
      // Ordenar resultados
      if (sortBy === "distance") {
        filteredResults.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      } else if (sortBy === "rating") {
        filteredResults.sort((a, b) => b.rating - a.rating);
      }
      
      setResults(filteredResults);
      setIsFiltering(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, selectedSpecialty, distance, isAvailableToday, minRating, sortBy]);
  
  // Manejar la búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // La búsqueda ya se maneja en el useEffect
  };
  
  // Limpiar filtros
  const clearFilters = () => {
    setSelectedSpecialty("");
    setDistance([10]);
    setIsAvailableToday(false);
    setMinRating("0");
    setSortBy("relevance");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container py-10">
        {/* Cabecera de búsqueda */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-6">Buscar veterinarios</h1>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                type="text" 
                placeholder="Buscar por nombre, especialidad, ubicación..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Buscar</Button>
          </form>
        </div>
        
        {/* Filtros activos */}
        {(selectedSpecialty || isAvailableToday || minRating !== "0") && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Filtros:</span>
            
            {selectedSpecialty && (
              <Badge variant="outline" className="flex items-center gap-1">
                {selectedSpecialty}
                <button onClick={() => setSelectedSpecialty("")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {isAvailableToday && (
              <Badge variant="outline" className="flex items-center gap-1">
                Disponible hoy
                <button onClick={() => setIsAvailableToday(false)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {minRating !== "0" && (
              <Badge variant="outline" className="flex items-center gap-1">
                {`Valoración ≥ ${minRating}`}
                <button onClick={() => setMinRating("0")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            <Button 
              variant="link" 
              size="sm" 
              className="text-muted-foreground" 
              onClick={clearFilters}
            >
              Limpiar todos
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtros de escritorio */}
          <aside className="hidden lg:block space-y-8">
            <div>
              <h3 className="font-medium mb-4">Especialidad</h3>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las especialidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las especialidades</SelectItem>
                  {specialtiesList.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-4">Distancia máxima</h3>
              <div className="space-y-4">
                <Slider 
                  value={distance} 
                  onValueChange={setDistance} 
                  max={50} 
                  step={1}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0 km</span>
                  <span>{distance[0]} km</span>
                  <span>50 km</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-4">Disponibilidad</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="available-today" 
                    checked={isAvailableToday}
                    onCheckedChange={(checked) => 
                      setIsAvailableToday(checked === true)
                    }
                  />
                  <Label htmlFor="available-today">Disponible hoy</Label>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-4">Valoración mínima</h3>
              <Select value={minRating} onValueChange={setMinRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Cualquier valoración" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Cualquier valoración</SelectItem>
                  <SelectItem value="3">3+ estrellas</SelectItem>
                  <SelectItem value="4">4+ estrellas</SelectItem>
                  <SelectItem value="4.5">4.5+ estrellas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </aside>
          
          {/* Filtros móviles */}
          <div className="lg:hidden mb-6">
            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div>
                      <h3 className="font-medium mb-4">Especialidad</h3>
                      <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todas las especialidades" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todas las especialidades</SelectItem>
                          {specialtiesList.map(specialty => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-4">Distancia máxima</h3>
                      <div className="space-y-4">
                        <Slider 
                          value={distance} 
                          onValueChange={setDistance} 
                          max={50} 
                          step={1}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>0 km</span>
                          <span>{distance[0]} km</span>
                          <span>50 km</span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-4">Disponibilidad</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="mobile-available-today" 
                            checked={isAvailableToday}
                            onCheckedChange={(checked) => 
                              setIsAvailableToday(checked === true)
                            }
                          />
                          <Label htmlFor="mobile-available-today">Disponible hoy</Label>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-4">Valoración mínima</h3>
                      <Select value={minRating} onValueChange={setMinRating}>
                        <SelectTrigger>
                          <SelectValue placeholder="Cualquier valoración" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Cualquier valoración</SelectItem>
                          <SelectItem value="3">3+ estrellas</SelectItem>
                          <SelectItem value="4">4+ estrellas</SelectItem>
                          <SelectItem value="4.5">4.5+ estrellas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4" 
                      onClick={clearFilters}
                    >
                      Limpiar filtros
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevancia</SelectItem>
                  <SelectItem value="rating">Mejor valorados</SelectItem>
                  <SelectItem value="distance">Cercanía</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Contenido principal y resultados */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-muted-foreground">
                  {isFiltering ? "Buscando..." : `${results.length} veterinarios encontrados`}
                </p>
              </div>
              
              {/* Selector de ordenamiento (solo desktop) */}
              <div className="hidden lg:block">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevancia</SelectItem>
                    <SelectItem value="rating">Mejor valorados</SelectItem>
                    <SelectItem value="distance">Cercanía</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isFiltering ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="bg-muted rounded-lg h-96"></div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((vet) => (
                  <VetCard key={vet.id} {...vet} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 space-y-4">
                <div className="text-3xl">🔍</div>
                <h3 className="text-xl font-medium">No se encontraron resultados</h3>
                <p className="text-muted-foreground">
                  Intenta cambiar los filtros o modifica tu búsqueda.
                </p>
                <Button onClick={clearFilters} className="mt-4">
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;
