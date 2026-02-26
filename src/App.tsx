import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TiketPage from "./pages/TiketPage";
import LiveTrackingPage from "./pages/LiveTrackingPage";
import PenumpangGelapPage from "./pages/PenumpangGelapPage";
import PengemudiPage from "./pages/PengemudiPage";
import ArmadaPage from "./pages/ArmadaPage";
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
          <Route path="/pengemudi" element={<PengemudiPage />} />
          <Route path="/armada" element={<ArmadaPage />} />
          <Route path="/live-tracking" element={<LiveTrackingPage />} />
          <Route path="/penumpang-gelap" element={<PenumpangGelapPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
