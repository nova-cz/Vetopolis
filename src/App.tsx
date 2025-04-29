import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MapPage from "./pages/MapPage";
import VetProfile from "./pages/VetProfile";
import SearchVets from "./pages/SearchVets";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import JoinAsProfessional from "./pages/JoinAsProfessional";
import ProfilePage from "@/pages/ProfilePage";
import AppointmentFormPage from "./pages/AppointmentFormPage";
import AdminDashboard from "./pages/AdminDashboard";
import { auth } from "@/lib/firebase";
import { ADMIN_EMAIL } from "@/lib/admin"; // asegúrate de tener este archivo con el correo del admin

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/vet/:id" element={<VetProfile />} />
          <Route path="/search" element={<SearchVets />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/book/:id" element={<AppointmentsPage />} />
          <Route path="/join-professional" element={<JoinAsProfessional />} />
          <Route path="/appointment/:id" element={<AppointmentFormPage />} />
          <Route
            path="/admin"
            element={
              auth.currentUser?.email === ADMIN_EMAIL ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          {/* Ruta de error */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
