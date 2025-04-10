// src/pages/AppointmentFormPage.tsx
import { useParams, Navigate } from "react-router-dom";
import AppointmentForm from "@/components/AppointmentForm";
import vetData from "@/data/vetData";

const AppointmentFormPage = () => {
    const { id } = useParams<{ id: string }>();
    const vet = id ? vetData[id] : null;

    if (!vet) return <Navigate to="/not-found" />;

    return (
        <AppointmentForm
            vetId={vet.id}
            vetName={vet.name}
            specialties={[vet.specialty]}
        />
    );
};

export default AppointmentFormPage;
