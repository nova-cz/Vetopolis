import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Search, 
  Calendar, 
  Map, 
  User,
  ChevronDown
} from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const appointments = [];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">Vetopolis</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/search" className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
            <Search className="h-4 w-4" />
            <span>Buscar Veterinarios</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
                <Calendar className="h-4 w-4" />
                <span>Citas</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {appointments.length > 0 ? (
                appointments.map((appointment, index) => (
                  <DropdownMenuItem key={index}>
                    <span>Appointment details would go here</span>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                  No tienes citas pendientes
                </div>
              )}
              <DropdownMenuItem asChild>
                <Link to="/appointments" className="w-full cursor-pointer">
                  Ver todas las citas
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/map" className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
            <Map className="h-4 w-4" />
            <span>Mapa</span>
          </Link>
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <DarkModeToggle />
          {user ? (
            <Link to="/profile">
              <Button variant="outline" className="px-4">
                <User className="h-4 w-4 mr-2" />
                Perfil
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="px-4">Iniciar Sesión</Button>
              </Link>
              <Link to="/register">
                <Button className="px-4">Registrarse</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile nav toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <DarkModeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={toggleMenu}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden animate-in">
          <div className="container py-4 space-y-4">
            <Link 
              to="/search" 
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent"
              onClick={toggleMenu}
            >
              <Search className="h-5 w-5" />
              <span>Buscar Veterinarios</span>
            </Link>
            <Link 
              to="/appointments" 
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent"
              onClick={toggleMenu}
            >
              <Calendar className="h-5 w-5" />
              <span>Citas</span>
              {appointments.length > 0 && (
                <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">
                  {appointments.length}
                </span>
              )}
            </Link>
            <Link 
              to="/map" 
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent"
              onClick={toggleMenu}
            >
              <Map className="h-5 w-5" />
              <span>Mapa</span>
            </Link>
            <div className="flex flex-col space-y-2 pt-2 border-t">
              {user ? (
                <Link to="/profile" onClick={toggleMenu}>
                  <Button variant="outline" className="w-full">
                    Perfil
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={toggleMenu}>
                    <Button variant="outline" className="w-full">Iniciar Sesión</Button>
                  </Link>
                  <Link to="/register" onClick={toggleMenu}>
                    <Button className="w-full">Registrarse</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
