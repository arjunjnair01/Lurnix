import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FileUpload } from "./components/FileUpload";
import { FloatingChatBot } from "./components/FloatingChatBot";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PodcastPage from "./pages/PodcastPage";
import QuizPage from "./pages/QuizPage";
import SummaryPage from "./pages/SummaryPage";
import VideoSuggestionsPage from "./pages/VideoSuggestionsPage";
import HistoryPage from "./components/Dashboard";
import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/summary/:sessionId" element={<SummaryPage />} />
              <Route path="/videos/:sessionId" element={<VideoSuggestionsPage />} />
              <Route path="/podcast/:sessionId" element={<PodcastPage />} />
              <Route path="/quiz/:sessionId" element={<QuizPage />} />
              <Route path="/upload" element={
                <>
                  <FileUpload onBack={() => {}} onSessionId={setSessionId} />
                  <FloatingChatBot sessionId={sessionId} />
                </>
              } />
              <Route path="/" element={<Index />} />
              <Route path="/history" element={<HistoryPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
