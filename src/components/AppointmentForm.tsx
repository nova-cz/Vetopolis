
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AppointmentFormProps {
  vetId: string;
  vetName: string;
  specialties: string[];
}

const AppointmentForm = ({ vetId, vetName, specialties }: AppointmentFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | undefined>(undefined);
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Horarios disponibles (esto debería venir de una API real)
  const availableTimes = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulando el envío a una API
    setTimeout(() => {
      toast({
        title: "Cita agendada correctamente",
        description: `Se ha agendado tu cita con ${vetName} para el ${selectedDate ? format(selectedDate, "PPPP", { locale: es }) : ""} a las ${selectedTime}`,
      });
      setIsSubmitting(false);
      navigate("/appointments");
    }, 1500);
  };

  return (
    <Card className="max-w-md w-full mx-auto">
      <CardHeader>
        <CardTitle>Agendar cita</CardTitle>
        <CardDescription>
          Completa el formulario para agendar una cita con {vetName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="specialty">Especialidad</Label>
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty} required>
              <SelectTrigger id="specialty">
                <SelectValue placeholder="Selecciona una especialidad" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fecha</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP", { locale: es })
                  ) : (
                    <span>Selecciona una fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  disabled={(date) => 
                    date < new Date() || 
                    date.getDay() === 0 || 
                    date.getDay() === 6
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Hora</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime} required>
              <SelectTrigger id="time">
                <SelectValue placeholder="Selecciona una hora" />
              </SelectTrigger>
              <SelectContent>
                {availableTimes.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pet-name">Nombre de la mascota</Label>
            <Input
              id="pet-name"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="Ingresa el nombre de tu mascota"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pet-type">Tipo de mascota</Label>
            <Select value={petType} onValueChange={setPetType} required>
              <SelectTrigger id="pet-type">
                <SelectValue placeholder="Selecciona el tipo de mascota" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="perro">Perro</SelectItem>
                <SelectItem value="gato">Gato</SelectItem>
                <SelectItem value="ave">Ave</SelectItem>
                <SelectItem value="roedor">Roedor</SelectItem>
                <SelectItem value="reptil">Reptil</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo de la consulta</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe brevemente el motivo de la consulta"
              required
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || !selectedDate || !selectedTime || !selectedSpecialty || !petName || !petType}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Procesando..." : "Confirmar cita"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppointmentForm;
