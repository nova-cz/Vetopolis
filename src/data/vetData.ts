const vetData = {
    "1": {
        id: "1",
        name: "Dra. María González",
        specialty: "Cardiología",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=2070&auto=format&fit=crop",
        rating: 4.9,
        reviewCount: 124,
        location: "Clínica Veterinaria PetCare, Madrid",
        address: "Calle Principal 123, Madrid, España",
        availability: "Disponible hoy",
        phone: "+34 123 456 789",
        email: "maria.gonzalez@petdoc.com",
        website: "www.petcare-madrid.com",
        bio: "La Dra. María González es especialista en Cardiología Veterinaria con más de 10 años de experiencia en el diagnóstico y tratamiento de enfermedades cardiovasculares en animales de compañía.",
        education: [
            "Doctorado en Medicina Veterinaria, Universidad Complutense de Madrid",
            "Especialidad en Cardiología Veterinaria, European College of Veterinary Internal Medicine",
            "Certificación en Ecocardiografía Avanzada"
        ],
        languages: ["Español", "Inglés", "Francés"],
        services: [
            "Ecocardiografía",
            "Electrocardiograma (ECG)",
            "Holter 24 horas",
            "Medición de presión arterial",
            "Tratamiento de insuficiencia cardíaca",
            "Manejo de cardiopatías congénitas"
        ],
        reviews: [
            {
                id: "r1",
                author: "Carlos Pérez",
                rating: 5,
                date: "15/05/2023",
                content: "Excelente profesional...",
                helpful: 24,
                pet: "Perro - Labrador"
            }
        ],
        prices: [
            { service: "Consulta inicial", price: "60€" },
            { service: "Ecocardiografía", price: "120€" }
        ]
    },

    "2": {
        id: "2",
        name: "Dr. Carlos Rodríguez",
        specialty: "Dermatología",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=2070&auto=format&fit=crop",
        rating: 4.8,
        reviewCount: 98,
        location: "Hospital Veterinario San Martín, Barcelona",
        address: "Av. Central 456, Barcelona, España",
        availability: "Disponible mañana",
        phone: "+34 987 654 321",
        email: "carlos.rodriguez@petdoc.com",
        website: "www.hospitalveterinario-sanmartin.com",
        bio: "Especialista en el diagnóstico y tratamiento de alergias, infecciones cutáneas y enfermedades autoinmunes.",
        education: [
            "Licenciatura en Medicina Veterinaria, Universidad Autónoma de Barcelona",
            "Diplomado en Dermatología Veterinaria, European College of Veterinary Dermatology"
        ],
        languages: ["Español", "Inglés", "Catalán"],
        services: [
            "Diagnóstico y tratamiento de alergias",
            "Biopsias cutáneas"
        ],
        reviews: [],
        prices: [
            { service: "Consulta dermatológica", price: "65€" }
        ]
    },

    "3": {
        id: "3",
        name: "Dra. Laura Martínez",
        specialty: "Neurología",
        image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=2070&auto=format&fit=crop",
        rating: 4.7,
        reviewCount: 87,
        location: "Centro Neurológico Veterinario, Valencia",
        address: "Plaza Mayor 78, Valencia, España",
        availability: "Disponible hoy",
        phone: "+34 555 123 456",
        email: "laura.martinez@petdoc.com",
        website: "www.neuroveterinaria.es",
        bio: "Especializada en el diagnóstico y tratamiento de enfermedades neurológicas en pequeños animales.",
        education: [
            "Doctora en Medicina Veterinaria, Universidad de Valencia"
        ],
        languages: ["Español", "Inglés", "Neerlandés"],
        services: ["Evaluación neurológica completa"],
        reviews: [],
        prices: [
            { service: "Consulta neurológica", price: "75€" }
        ]
    }
};

export default vetData;
