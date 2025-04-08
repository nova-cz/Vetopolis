
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Filter, MapPin, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import VetCard from "@/components/VetCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const SearchVets = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("query") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedFilters, setSelectedFilters] = useState({
    availableToday: false,
    onlineConsultation: false,
    acceptsInsurance: false,
    emergencyService: false,
  });
  
  // Example data - in a real app, this would come from an API call
  const veterinarians = [
    {
      id: "1",
      name: "Dra. María González",
      specialty: "Cardiología",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
      rating: 4.9,
      reviewCount: 124,
      location: "Ciudad de México",
      availability: "Disponible hoy",
    },
    {
      id: "2",
      name: "Dr. Carlos Rodríguez",
      specialty: "Dermatología",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
      rating: 4.8,
      reviewCount: 98,
      location: "Ciudad de México",
      availability: "Disponible mañana",
    },
    {
      id: "3",
      name: "Dra. Laura Martínez",
      specialty: "Neurología",
      image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop",
      rating: 4.7,
      reviewCount: 87,
      location: "Ciudad de México",
      availability: "Disponible hoy",
    },
    {
      id: "4",
      name: "Dr. Alejandro Sánchez",
      specialty: "Oftalmología",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop",
      rating: 4.6,
      reviewCount: 76,
      location: "Ciudad de México",
      availability: "Disponible hoy",
    },
  ];
  
  // Filter veterinarians based on search query and selected filters
  const filteredVets = veterinarians.filter(vet => {
    // Filter by search query
    if (searchQuery && !vet.specialty.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !vet.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by availability today
    if (selectedFilters.availableToday && !vet.availability.includes("hoy")) {
      return false;
    }
    
    return true;
  });
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Update URL query parameter for bookmarking/sharing
    navigate(`/search?query=${encodeURIComponent(query)}`, { replace: true });
  };
  
  const toggleFilter = (filterName: keyof typeof selectedFilters) => {
    setSelectedFilters({
      ...selectedFilters,
      [filterName]: !selectedFilters[filterName],
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Buscar Veterinarios</h1>
          <SearchAutocomplete 
            onSearch={handleSearch} 
            placeholder="Buscar por especialidad, síntoma, veterinario..."
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters - Desktop */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-background border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-4">Filtros</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="available-today" 
                    checked={selectedFilters.availableToday}
                    onCheckedChange={() => toggleFilter("availableToday")}
                  />
                  <label htmlFor="available-today" className="text-sm cursor-pointer">
                    Disponible hoy
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="online-consultation" 
                    checked={selectedFilters.onlineConsultation}
                    onCheckedChange={() => toggleFilter("onlineConsultation")}
                  />
                  <label htmlFor="online-consultation" className="text-sm cursor-pointer">
                    Consulta online
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="accepts-insurance" 
                    checked={selectedFilters.acceptsInsurance}
                    onCheckedChange={() => toggleFilter("acceptsInsurance")}
                  />
                  <label htmlFor="accepts-insurance" className="text-sm cursor-pointer">
                    Acepta seguro
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="emergency-service" 
                    checked={selectedFilters.emergencyService}
                    onCheckedChange={() => toggleFilter("emergencyService")}
                  />
                  <label htmlFor="emergency-service" className="text-sm cursor-pointer">
                    Servicio de emergencia
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Filters */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex justify-between">
                  <span className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </span>
                  <span className="bg-primary/10 text-primary text-xs rounded-full px-2 py-1">
                    {Object.values(selectedFilters).filter(Boolean).length}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                  <SheetDescription>
                    Refina tu búsqueda de veterinarios
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-4 mt-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="available-today-mobile" 
                      checked={selectedFilters.availableToday}
                      onCheckedChange={() => toggleFilter("availableToday")}
                    />
                    <label htmlFor="available-today-mobile" className="cursor-pointer">
                      Disponible hoy
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="online-consultation-mobile" 
                      checked={selectedFilters.onlineConsultation}
                      onCheckedChange={() => toggleFilter("onlineConsultation")}
                    />
                    <label htmlFor="online-consultation-mobile" className="cursor-pointer">
                      Consulta online
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="accepts-insurance-mobile" 
                      checked={selectedFilters.acceptsInsurance}
                      onCheckedChange={() => toggleFilter("acceptsInsurance")}
                    />
                    <label htmlFor="accepts-insurance-mobile" className="cursor-pointer">
                      Acepta seguro
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="emergency-service-mobile" 
                      checked={selectedFilters.emergencyService}
                      onCheckedChange={() => toggleFilter("emergencyService")}
                    />
                    <label htmlFor="emergency-service-mobile" className="cursor-pointer">
                      Servicio de emergencia
                    </label>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Search Results */}
          <div className="lg:col-span-3">
            {searchQuery ? (
              <p className="text-muted-foreground mb-4">
                {filteredVets.length} resultados para "{searchQuery}"
              </p>
            ) : null}
            
            <div className="space-y-6">
              {filteredVets.length > 0 ? (
                filteredVets.map(vet => (
                  <VetCard key={vet.id} {...vet} />
                ))
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">No se encontraron resultados</h3>
                  <p className="text-muted-foreground">
                    Intenta con otros términos de búsqueda o filtros
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchVets;
