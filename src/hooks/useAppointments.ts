import { useEffect, useState } from "react";

export interface Appointment {
    id: string;
    date: Date;
    vetName: string;
    vetSpecialty: string;
    clinicName: string;
    address: string;
    status: "confirmed" | "pending" | "cancelled" | "completed";
}

export const useAppointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    // Cargar desde localStorage al iniciar
    useEffect(() => {
        const stored = localStorage.getItem("appointments");
        if (stored) {
            const parsed = JSON.parse(stored);
            parsed.forEach((a: any) => (a.date = new Date(a.date))); // convertir fechas
            setAppointments(parsed);
        }
    }, []);

    // Guardar en localStorage cuando cambien
    useEffect(() => {
        localStorage.setItem("appointments", JSON.stringify(appointments));
    }, [appointments]);

    const addAppointment = (appointment: Appointment) => {
        setAppointments((prev) => [...prev, appointment]);
    };

    const removeAppointment = (id: string) => {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
    };

    return { appointments, addAppointment, removeAppointment };
};
