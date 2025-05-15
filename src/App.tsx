import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import BookAppointment from "./pages/BookAppointment";

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
          <Route path="/book/:id" element={<BookAppointment />} />
          <Route path="/join-professional" element={<JoinAsProfessional />} />
          <Route path="/appointment/:id" element={<AppointmentFormPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
