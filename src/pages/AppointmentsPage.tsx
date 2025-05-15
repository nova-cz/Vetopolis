import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, MapPin, Search, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  date: Date;
  selectedTime: string;
  vetName: string;
  vetSpecialty: string;
  clinicName: string;
  address: string;
  status: string;
}

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
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) throw new Error("Usuario no autenticado");

        const q = query(collection(db, "citas"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const allAppointments: Appointment[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            date: new Date(data.selectedDate),
            selectedTime: data.selectedTime || "",
            vetName: data.vetName || "",
            vetSpecialty: data.selectedSpecialty || "", // mapea si en Firestore está como selectedSpecialty
            clinicName: data.clinicName || "",
            address: data.address || "",
            status: data.status || "pending",
          };
        });

        const now = new Date();
        const upcoming = allAppointments.filter((appt) => appt.date > now);
        const past = allAppointments.filter((appt) => appt.date <= now);

        setUpcomingAppointments(upcoming);
        setPastAppointments(past);
      } catch (error) {
        console.error("Error al cargar las citas:", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancelAppointment = (appointmentId: string) => {
    const updatedAppointments = upcomingAppointments.filter(appt => appt.id !== appointmentId);
    const cancelledAppt = upcomingAppointments.find(appt => appt.id === appointmentId);

    if (cancelledAppt) {
      const cancelled: Appointment = { ...cancelledAppt, status: "cancelled" };
      setUpcomingAppointments(updatedAppointments);
      setPastAppointments([...pastAppointments, cancelled]);
    }

    toast({
      title: "Cita cancelada",
      description: "Tu cita ha sido cancelada exitosamente",
    });
  };

  const filteredUpcoming = upcomingAppointments.filter((appt) =>
    [appt.vetName, appt.clinicName, appt.vetSpecialty].some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredPast = pastAppointments.filter((appt) =>
    [appt.vetName, appt.clinicName, appt.vetSpecialty].some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-6">Mis Citas</h1>

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

        <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Próximas</TabsTrigger>
            <TabsTrigger value="past">Anteriores</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4">
            {filteredUpcoming.length > 0 ? (
              <div className="space-y-4">
                {filteredUpcoming.map((appt) => (
                  <Card key={appt.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{appt.vetName}</CardTitle>
                          <CardDescription>{appt.vetSpecialty}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(appt.status)}>
                          {getStatusText(appt.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <CalendarIcon className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {format(appt.date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {appt.selectedTime} hrs
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{appt.clinicName}</p>
                            <p className="text-sm text-muted-foreground">{appt.address}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end pt-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelAppointment(appt.id)}
                        className="flex items-center gap-1"
                      >
                        <X className="h-4 w-4" /> Cancelar
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
                {filteredPast.map((appt) => (
                  <Card key={appt.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{appt.vetName}</CardTitle>
                          <CardDescription>{appt.vetSpecialty}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(appt.status)}>
                          {getStatusText(appt.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <CalendarIcon className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {format(appt.date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {appt.selectedTime} hrs
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{appt.clinicName}</p>
                            <p className="text-sm text-muted-foreground">{appt.address}</p>
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
      </main>
      <Footer />
    </div>
  );
};

export default AppointmentsPage;
