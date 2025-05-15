
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VetCardProps {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  reviewCount: number;
  location: string;
  distance?: string;
  availability: string;
}

const VetCard = ({
  id,
  name,
  specialty,
  image,
  rating,
  reviewCount,
  location,
  distance,
  availability,
}: VetCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/vet/${id}`} className="block">
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={image}
              alt={name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
              <Badge className="bg-primary text-white">{specialty}</Badge>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-medium">{name}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{location}</span>
                {distance && (
                  <span className="ml-1 text-xs">({distance})</span>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="font-medium">{rating}</span>
                <span className="text-muted-foreground text-sm ml-1">({reviewCount})</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>{availability}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-6 pt-0 flex justify-between gap-4">
        <Link to={`/vet/${id}`} className="flex-1">
          <Button variant="outline" className="w-full">Ver perfil</Button>
        </Link>
        <Link to={`/book/${id}`} className="flex-1">
          <Button className="w-full">Agendar cita</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default VetCard;
