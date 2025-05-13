import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Filter } from "lucide-react";
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
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  const [vets, setVets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVets = async () => {
      try {
        const q = query(collection(db, "doctors"), where("status", "==", "approved"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => {
          const vet = doc.data();
          return {
            id: doc.id,
            name: vet.fullName,
            specialty: vet.specialties?.[0] || "General",
            image: vet.image || "https://placekitten.com/400/300",
            rating: vet.rating || 4.8,
            reviewCount: vet.reviewCount || 12,
            location: vet.city || "Ubicación no especificada",
            distance: vet.distance || "1.2 km",
            availability: vet.availability || "Lunes a Viernes",
          };
        });
        setVets(data);
      } catch (error) {
        console.error("Error fetching approved doctors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVets();
  }, []);

  const filteredVets = vets.filter((vet) => {
    if (
      searchQuery &&
      !vet.specialty.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !vet.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (selectedFilters.availableToday && !vet.availability?.toLowerCase().includes("hoy")) {
      return false;
    }

    return true;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
              </div>
            </div>
          </div>

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
                  <SheetDescription>Refina tu búsqueda de veterinarios</SheetDescription>
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
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="lg:col-span-3">
            {searchQuery ? (
              <p className="text-muted-foreground mb-4">
                {filteredVets.length} resultados para "{searchQuery}"
              </p>
            ) : null}

            <div className="space-y-6">
              {loading ? (
                <p>Cargando...</p>
              ) : filteredVets.length > 0 ? (
                filteredVets.map((vet) => (
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
