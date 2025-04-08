import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { auth, storage } from "@/lib/firebase"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const [user, setUser] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                navigate("/login");
                return;
            }
            setUser(currentUser);
            setPreviewUrl(currentUser.photoURL || null);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast({
                title: "Sesión cerrada",
                description: "Has cerrado sesión correctamente",
            });
            navigate("/login");
        } catch (error) {
            toast({
                title: "Error al cerrar sesión",
                description: "Intenta de nuevo",
                variant: "destructive",
            });
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setUploading(true);
        const storageRef = ref(storage, `profile-pictures/${user.uid}`);
        try {
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            await updateProfile(user, { photoURL: downloadURL });
            setPreviewUrl(downloadURL);
            toast({ title: "Foto de perfil actualizada" });
        } catch (error) {
            toast({
                title: "Error al subir imagen",
                description: "Asegúrate de que el archivo sea válido",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow py-10">
                <div className="container max-w-xl mx-auto space-y-8 px-4">
                    <h1 className="text-3xl font-bold text-center">Mi Perfil</h1>

                    <div className="bg-card shadow-md rounded-2xl p-6 space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <img
                                    src={
                                        previewUrl ||
                                        "https://ui-avatars.com/api/?name=Usuario&background=cccccc&color=000"
                                    }
                                    alt="Foto de perfil"
                                    className="h-20 w-20 rounded-full object-cover border"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    ref={fileInputRef}
                                    className="hidden"
                                />
                            </div>
                            <div>
                                <p className="text-lg font-semibold">{user?.displayName || "Usuario"}</p>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                                <Button
                                    variant="outline"
                                    className="mt-2 text-xs"
                                    onClick={triggerFileInput}
                                    disabled={uploading}
                                >
                                    {uploading ? "Subiendo..." : "Cambiar foto"}
                                </Button>
                            </div>
                        </div>

                        <hr />

                        <div>
                            <h2 className="text-lg font-medium mb-2">Tus citas</h2>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                <li>Consulta con Dr. Ramírez — 10 abril, 2:00 PM</li>
                                <li>Vacunación — 17 abril, 10:30 AM</li>
                                <li>Baño y corte — 25 abril, 11:15 AM</li>
                            </ul>
                        </div>

                        <div className="pt-4 text-right">
                            <Button variant="destructive" onClick={handleLogout}>
                                Cerrar sesión
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProfilePage;