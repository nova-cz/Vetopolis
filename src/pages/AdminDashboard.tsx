import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Application {
    id: string;
    fullName: string;
    clinicName: string;
    email: string;
    phone: string;
    city: string;
    specialty: string[];
    experience: string;
    docsLink: string;
    status: string;
}

const AdminDashboard = () => {
    const [applications, setApplications] = useState<Application[]>([]);

    useEffect(() => {
        const fetchApplications = async () => {
            const snapshot = await getDocs(collection(db, "applications"));
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Application[];
            setApplications(data);
        };
        fetchApplications();
    }, []);

    return (
        <div className="container py-12">
            <h1 className="text-3xl font-bold mb-8">Solicitudes de Profesionales</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applications.map(app => (
                    <Card key={app.id}>
                        <CardHeader>
                            <CardTitle>{app.fullName}</CardTitle>
                            <p className="text-sm text-muted-foreground">{app.clinicName} - {app.city}</p>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p><strong>Email:</strong> {app.email}</p>
                            <p><strong>Teléfono:</strong> {app.phone}</p>
                            <p><strong>Especialidades:</strong></p>
                            <div className="flex flex-wrap gap-2">
                                {app.specialty.map((s, i) => (
                                    <Badge key={i} variant="outline">{s}</Badge>
                                ))}
                            </div>
                            <p><strong>Experiencia:</strong> {app.experience}</p>
                            <a href={app.docsLink} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                                Ver documentos
                            </a>
                            <p><strong>Estado:</strong> {app.status}</p>
                            <Button variant="outline" className="mt-2">Aprobar</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
