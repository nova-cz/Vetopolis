import { useState } from "react";
import { Calendar as CalendarIcon, Clock, User, MapPin, Search, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Mock appointment data
const upcomingAppointments = [
  {
    id: "1",
    date: new Date(2023, 7, 25, 10, 30),
    vetName: "Dra. María González",
    vetSpecialty: "Cardiología",
    clinicName: "Clínica Veterinaria PetCare",
    address: "Calle Principal 123, Ciudad de México",
    status: "confirmed",
  },
  {
    id: "2",
    date: new Date(2023, 8, 5, 15, 0),
    vetName: "Dr. Carlos Rodríguez",
    vetSpecialty: "Dermatología",
    clinicName: "Hospital Veterinario San Martín",
    address: "Av. Central 456, Ciudad de México",
    status: "pending",
  },
];

const pastAppointments = [
  {
    id: "3",
    date: new Date(2023, 6, 12, 9, 0),
    vetName: "Dra. Laura Martínez",
    vetSpecialty: "Neurología",
    clinicName: "Centro Veterinario 24h",
    address: "Plaza Mayor 78, Ciudad de México",
    status: "completed",
  },
  {
    id: "4",
    date: new Date(2023, 5, 20, 11, 30),
    vetName: "Dr. Alejandro Sánchez",
    vetSpecialty: "Oftalmología",
    clinicName: "Clínica Veterinaria Animal Health",
    address: "Av. Libertad 234, Ciudad de México",
    status: "cancelled",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "completed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "confirmed":
      return "Confirmada";
    case "pending":
      return "Pendiente";
    case "completed":
      return "Completada";
    case "cancelled":
      return "Cancelada";
    default:
      return status;
  }
};

const AppointmentsPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleCancelAppointment = (appointmentId: string) => {
    toast({
      title: "Cita cancelada",
      description: "Tu cita ha sido cancelada exitosamente",
    });
    
    // In a real app, this would call an API to cancel the appointment
    // and then refresh the appointment list
  };

  // Filter appointments based on search query
  const filteredUpcoming = upcomingAppointments.filter(appointment => 
    appointment.vetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.clinicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.vetSpecialty.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPast = pastAppointments.filter(appointment => 
    appointment.vetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.clinicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.vetSpecialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-6">Mis Citas</h1>
        
        <div>
          {/* List of appointments */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  type="text"
                  placeholder="Buscar por veterinario, clínica o especialidad"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Tabs defaultValue="upcoming" onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">Próximas</TabsTrigger>
                <TabsTrigger value="past">Anteriores</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="mt-4">
                {filteredUpcoming.length > 0 ? (
                  <div className="space-y-4">
                    {filteredUpcoming.map((appointment) => (
                      <Card key={appointment.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{appointment.vetName}</CardTitle>
                              <CardDescription>{appointment.vetSpecialty}</CardDescription>
                            </div>
                            <Badge className={getStatusColor(appointment.status)}>
                              {getStatusText(appointment.status)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2">
                            <div className="flex items-start">
                              <CalendarIcon className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">
                                  {format(appointment.date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {format(appointment.date, "HH:mm", { locale: es })} hrs
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{appointment.clinicName}</p>
                                <p className="text-sm text-muted-foreground">{appointment.address}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end pt-2">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="flex items-center gap-1"
                          >
                            <X className="h-4 w-4" />
                            Cancelar
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">No tienes citas próximas</h3>
                    <p className="text-muted-foreground">
                      Puedes agendar una cita desde el perfil de un veterinario
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past" className="mt-4">
                {filteredPast.length > 0 ? (
                  <div className="space-y-4">
                    {filteredPast.map((appointment) => (
                      <Card key={appointment.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{appointment.vetName}</CardTitle>
                              <CardDescription>{appointment.vetSpecialty}</CardDescription>
                            </div>
                            <Badge className={getStatusColor(appointment.status)}>
                              {getStatusText(appointment.status)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2">
                            <div className="flex items-start">
                              <CalendarIcon className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">
                                  {format(appointment.date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {format(appointment.date, "HH:mm", { locale: es })} hrs
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{appointment.clinicName}</p>
                                <p className="text-sm text-muted-foreground">{appointment.address}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">No tienes citas anteriores</h3>
                    <p className="text-muted-foreground">
                      Aquí aparecerán tus citas completadas o canceladas
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AppointmentsPage;
