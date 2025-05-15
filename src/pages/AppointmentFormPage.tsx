import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

interface AppointmentFormProps {
    vetId: string;
    vetName: string;
    specialties: string[];
    clinicName: string;
    address: string;
}

const AppointmentForm = ({
    vetId,
    vetName,
    specialties,
    clinicName,
    address
}: AppointmentFormProps) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
    const [selectedSpecialty, setSelectedSpecialty] = useState<string | undefined>(undefined);
    const [petName, setPetName] = useState("");
    const [petType, setPetType] = useState("");
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const { toast } = useToast();

    const availableTimes = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "15:00", "15:30", "16:00", "16:30", "17:00"
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) throw new Error("Usuario no autenticado");

            const userId = user.uid;

            await addDoc(collection(db, "citas"), {
                vetId,
                vetName,
                userId,
                clinicName,
                address,
                status: "pendiente",
                selectedDate: selectedDate?.toISOString() || null,
                selectedTime: selectedTime || null,
                selectedSpecialty: selectedSpecialty || null,
                petName,
                petType,
                reason,
                createdAt: new Date().toISOString(),
            });

            toast({
                title: "Cita agendada correctamente",
                description: `Se ha agendado tu cita con ${vetName} para el ${selectedDate ? format(selectedDate, "PPPP", { locale: es }) : ""} a las ${selectedTime}`,
            });

            navigate("/appointments");
        } catch (error) {
            console.error("Error al guardar la cita:", error);
            toast({
                title: "Error",
                description: "Ocurrió un error al agendar la cita. Intenta nuevamente.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
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
                    {/* Especialidad */}
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

                    {/* Fecha */}
                    <div className="space-y-2">
                        <Label>Fecha</Label>
                        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsPopoverOpen((prev) => !prev)}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !selectedDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate
                                        ? format(selectedDate, "PPP", { locale: es })
                                        : "Selecciona una fecha"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => {
                                        setSelectedDate(date);
                                        requestAnimationFrame(() => setIsPopoverOpen(false)); // cierre seguro
                                    }}
                                    initialFocus
                                    disabled={(date) =>
                                        date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) ||
                                        date.getDay() === 0 || date.getDay() === 6
                                    }
                                />

                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Hora */}
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

                    {/* Nombre mascota */}
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

                    {/* Tipo mascota */}
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

                    {/* Motivo */}
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
                    disabled={
                        isSubmitting ||
                        !selectedDate ||
                        !selectedTime ||
                        !selectedSpecialty ||
                        !petName ||
                        !petType
                    }
                    onClick={handleSubmit}
                >
                    {isSubmitting ? "Procesando..." : "Confirmar cita"}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default AppointmentForm;
