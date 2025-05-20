
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/40 text-foreground">
      {/* Main footer content */}
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary">Vetopolis</h3>
            <p className="text-muted-foreground">
              Conectamos mascotas con los mejores veterinarios especializados para un cuidado de calidad.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Enlaces rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/search" className="text-muted-foreground hover:text-primary transition-colors">
                  Buscar veterinarios
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="text-muted-foreground hover:text-primary transition-colors">
                  Mis citas
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-muted-foreground hover:text-primary transition-colors">
                  Veterinarios cercanos
                </Link>
              </li>
              <li>
                <Link to="/join-professional" className="text-muted-foreground hover:text-primary transition-colors">
                  Únete como profesional
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact information */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contacto</h4>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <MapPin size={18} className="text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Avenida Central, Ciudad Universitaria, 72570 Puebla, Pueo</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone size={18} className="text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">+52 222 1256 4958</span>
              </li>
              <li className="flex items-start space-x-2">
                <Mail size={18} className="text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">info@vetopolis.mx</span>
              </li>
            </ul>
          </div>
          
          
        </div>
      </div>
      
      {/* Copyright */}
      <div className="border-t">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PetDoc. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Términos y condiciones
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Política de privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
