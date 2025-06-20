import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ChatBotProps {
  sessionId?: string | null;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ChatBot = ({ sessionId }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI learning assistant. I can help you with questions about your uploaded documents, explain concepts, and guide you through the platform. What would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    setError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    if (!sessionId) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          content: 'No session ID found. Please upload a document first.',
          sender: 'bot',
          timestamp: new Date(),
        }]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/pdf/chat/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify({ role: 'user', content: userMessage.content })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error: ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        content: data.content || 'No response from backend.',
        sender: 'bot',
        timestamp: new Date(),
      }]);
    } catch (err: any) {
      setError(err.message);
      setMessages(prev => [...prev, {
        id: (Date.now() + 3).toString(),
        content: 'Error: ' + err.message,
        sender: 'bot',
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Card className="w-full h-full flex flex-col border-none bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-blue-700">
          <Bot className="w-5 h-5 text-blue-600" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 px-6 space-y-4 overflow-y-auto custom-scrollbar">
          <div className="py-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 mb-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.sender === 'bot' && (
                  <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center shadow-md mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] break-words p-3 rounded-xl shadow-md ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-br-none'
                    : 'bg-white text-gray-900 border border-blue-100 rounded-bl-none'
                }`}>
                  <p className="text-base leading-relaxed break-words">{message.content}</p>
                </div>
                {message.sender === 'user' && (
                  <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center shadow-md mt-1">
                    <User className="w-4 h-4 text-gray-700" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center shadow-md">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-blue-100 p-3 rounded-xl shadow-md">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="border-t p-4 bg-gradient-to-r from-blue-100 to-green-100">
          <div className="flex gap-3">
            <Input
              placeholder="Ask me anything about your documents or the platform..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 text-base px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-400 bg-white shadow-sm"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-5 py-3 rounded-xl shadow-lg"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          {error && <div className="mt-2 text-red-700 text-sm">{error}</div>}
        </div>
      </CardContent>
    </Card>
  );
};
