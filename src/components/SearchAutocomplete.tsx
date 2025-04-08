
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// List of available specialties
const specialties = [
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

interface SearchAutocompleteProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchAutocomplete = ({ 
  onSearch,
  placeholder = "Buscar por especialidad, síntoma, veterinario..." 
}: SearchAutocompleteProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Filter suggestions based on current query
    if (query.length > 1) {
      const filteredSuggestions = specialties.filter(specialty =>
        specialty.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input 
            type="text" 
            placeholder={placeholder} 
            className="pl-10 py-6 rounded-full border-primary/20 focus:border-primary"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 1 && setShowSuggestions(true)}
          />
        </div>
        <Button type="submit" size="lg" className="rounded-full px-8">
          Buscar
        </Button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionRef}
          className="absolute z-10 mt-1 w-full bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-accent cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
