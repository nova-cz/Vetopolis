import { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { MapPin, LocateFixed } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const MapPage = () => {
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [clinics, setClinics] = useState<google.maps.places.PlaceResult[]>([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDf9VYZUCeKbo8e-VDOAhKDnt5VyJphNCg",
    libraries: ["places"],
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setUserLocation(loc);
          toast({
            title: "Ubicación obtenida",
            description: "Mostrando veterinarios cerca de ti",
          });
        },
        () => {
          setLocationError("No se pudo acceder a tu ubicación.");
          toast({
            title: "Error de ubicación",
            description: "No se pudo acceder a tu ubicación.",
            variant: "destructive",
          });
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!userLocation || !isLoaded) return;

    const map = new window.google.maps.Map(document.createElement("div"));
    const service = new window.google.maps.places.PlacesService(map);

    const request: google.maps.places.PlaceSearchRequest = {
      location: userLocation,
      radius: 5000,
      keyword: "veterinaria",
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setClinics(results);
      }
    });
  }, [userLocation, isLoaded]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-6">Veterinarios cerca de ti</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista */}
          <div className="space-y-4">
            <div className="p-4 bg-secondary rounded-lg mb-4">
              <p className="text-muted-foreground">
                {locationError ? locationError : "Mostrando veterinarios cerca de tu ubicación actual."}
              </p>
            </div>
            {clinics.map((clinic, i) => (
              <div key={i} className="p-4 border rounded-lg hover:shadow-md">
                <h3 className="font-medium text-lg">{clinic.name}</h3>
                <p className="text-sm text-muted-foreground">{clinic.vicinity}</p>
                <div className="mt-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.name ?? "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm hover:underline"
                  >
                    Ver en Google Maps
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Mapa */}
          <div className="lg:col-span-2 h-[600px] bg-secondary/50 rounded-lg">
            {isLoaded && userLocation ? (
              <GoogleMap mapContainerStyle={containerStyle} center={userLocation} zoom={14}>
                <Marker position={userLocation} />
                {clinics.map((clinic, i) =>
                  clinic.geometry?.location ? (
                    <Marker
                      key={i}
                      position={{
                        lat: clinic.geometry.location.lat(),
                        lng: clinic.geometry.location.lng(),
                      }}
                    />
                  ) : null
                )}
              </GoogleMap>
            ) : (
              <div className="text-center p-6">Cargando mapa...</div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MapPage;
