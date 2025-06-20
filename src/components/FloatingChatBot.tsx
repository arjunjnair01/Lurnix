import { useState } from "react";
import { ChatBot } from "./ChatBot";
import { MessageCircle, X, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingChatBotProps {
  sessionId?: string | null;
}

export const FloatingChatBot = ({ sessionId }: FloatingChatBotProps) => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <Button
          className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl z-[9999] group transform hover:scale-110 backdrop-blur-sm"
          onClick={() => {
            setOpen(true);
            setMinimized(false);
          }}
        >
          <MessageCircle className="h-7 w-7 text-white group-hover:rotate-12 transition-transform duration-300" />
        </Button>
      )}

      {/* Chat Modal/Popup */}
      {open && (
        <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-200 w-[480px] h-[760px] max-w-full overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-3 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-green-50 rounded-t-2xl">
              <span className="font-semibold text-blue-700 text-lg">AI Assistant</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => setMinimized(true)}>
                  <Minus className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            {!minimized ? (
              <div className="flex-1 overflow-hidden">
                <ChatBot sessionId={sessionId} />
              </div>
            ) : (
              <div className="flex items-center justify-center py-6">
                <Button variant="outline" onClick={() => setMinimized(false)}>
                  Open Chat
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
