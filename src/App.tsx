import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TiketPage from "./pages/TiketPage";
import TambahTiketPage from "./pages/TambahTiketPage";
import LiveTrackingPage from "./pages/LiveTrackingPage";
import PenumpangGelapPage from "./pages/PenumpangGelapPage";
import TambahPengemudiPage from "./pages/TambahPengemudiPage";
import TambahArmadaPage from "./pages/TambahArmadaPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tiket" element={<TiketPage />} />
          <Route path="/tambah-tiket" element={<TambahTiketPage />} />
          <Route path="/tambah-pengemudi" element={<TambahPengemudiPage />} />
          <Route path="/tambah-armada" element={<TambahArmadaPage />} />
          <Route path="/live-tracking" element={<LiveTrackingPage />} />
          <Route path="/penumpang-gelap" element={<PenumpangGelapPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
