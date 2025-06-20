import { Auth } from "@/components/Auth";
import { ChatBot } from "@/components/ChatBot";
import { Dashboard } from "@/components/Dashboard";
import { FeatureShowcase } from "@/components/FeatureShowcase";
import { FileUpload } from "@/components/FileUpload";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { commonShortcuts, useKeyboardShortcuts } from "@/components/ui/keyboard-shortcuts";
import { ArrowRight, BookOpen, Brain, Headphones, MessageCircle, Target, Upload, Video, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { HistoryPage } from "@/components/Dashboard";
import { FloatingChatBot } from "@/components/FloatingChatBot";

type ViewType = 'home' | 'upload' | 'dashboard' | 'chat' | 'auth' | 'history';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Keyboard shortcuts
  const shortcuts = commonShortcuts({
    onSearch: () => {
      // Focus search bar or open search modal
      console.log('Search shortcut triggered');
    },
    onUpload: () => {
      if (user) {
        setCurrentView('upload');
      } else {
        setCurrentView('auth');
      }
    },
    onDashboard: () => {
      if (user) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('auth');
      }
    },
    onChat: () => {
      setCurrentView('chat');
    },
    onSettings: () => {
      console.log('Settings shortcut triggered');
    },
    onHelp: () => {
      console.log('Help shortcut triggered');
    }
  });

  useKeyboardShortcuts(shortcuts);

  // Mock data for progress and activity
  const mockProgressStats = {
    documentsProcessed: 15,
    videosCreated: 8,
    podcastsGenerated: 12,
    totalTimeSpent: 240, // minutes
    weeklyProgress: 75
  };

  const mockActivities = [
    {
      id: '1',
      type: 'document' as const,
      title: 'Machine Learning Fundamentals.pdf',
      timestamp: new Date(Date.now() - 30 * 60000), // 30 mins ago
      status: 'completed' as const,
      duration: '15 min read'
    },
    {
      id: '2', 
      type: 'video' as const,
      title: 'Introduction to Neural Networks',
      timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
      status: 'completed' as const,
      duration: '8 min video'
    },
    {
      id: '3',
      type: 'podcast' as const,
      title: 'Deep Learning Explained',
      timestamp: new Date(Date.now() - 6 * 60 * 60000), // 6 hours ago
      status: 'processing' as const,
      duration: '12 min audio'
    }
  ];

  const handleLogin = (userData: { email: string; name: string }) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Searching for:', query);
  };

  const handleViewActivity = (id: string) => {
    console.log('Viewing activity:', id);
  };

  const handleSetCurrentView = (view: ViewType) => {
    setCurrentView(view);
    if (view === 'history') navigate('/history');
    // Add other navigation logic as needed
  };

  const renderView = () => {
    switch (currentView) {
      case 'auth':
        return <Auth onBack={() => setCurrentView('home')} onLogin={handleLogin} />;
      case 'upload':
        return <FileUpload onBack={() => setCurrentView('home')} onSessionId={setSessionId} />;
      case 'dashboard':
        return (
          <Dashboard onBack={() => setCurrentView('home')} sessionId={sessionId} />
        );
      case 'chat':
        return <ChatBot onBack={() => setCurrentView('home')} sessionId={sessionId} />;
      case 'history':
        return <HistoryPage currentView={currentView} setCurrentView={setCurrentView} user={user} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative overflow-hidden pt-16">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-green-400/20 to-blue-400/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-indigo-400/10 to-purple-400/10 blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Hero Section */}
            <div className="relative">
              <div className="container mx-auto px-4 pt-16 pb-20">
                <div className="text-center max-w-5xl mx-auto">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/90 backdrop-blur-xl border border-blue-200 shadow-xl mb-8 hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                    <Zap className="w-5 h-5 text-blue-600 animate-pulse" />
                    <span className="text-sm font-semibold text-slate-800">AI-Powered Learning Platform</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>

                  {/* Main heading with enhanced glassmorphism effect */}
                  <div className="relative mb-8">
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6">
                      <span className="bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg">
                        Learn
                      </span>
                      <br />
                      <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent drop-shadow-lg">
                        Smarter
                      </span>
                    </h1>
                    <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-bounce opacity-80 shadow-2xl"></div>
                    <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse opacity-60 shadow-xl" style={{ animationDelay: '1s' }}></div>
                  </div>

                  <p className="text-xl md:text-2xl text-slate-700 mb-12 leading-relaxed max-w-4xl mx-auto font-light">
                    Transform your documents into 
                    <span className="font-bold bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent">interactive summaries</span>,
                    <span className="font-bold bg-gradient-to-r from-purple-700 to-purple-400 bg-clip-text text-transparent"> engaging videos</span>, and
                    <span className="font-bold bg-gradient-to-r from-green-700 to-green-400 bg-clip-text text-transparent"> conversational podcasts</span>
                  </p>

                  {/* CTA buttons with enhanced modern styling */}
                  <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                    <Button 
                      size="lg" 
                      className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 transform hover:scale-105 h-16 px-10 rounded-2xl text-lg font-semibold backdrop-blur-sm"
                      onClick={() => user ? setCurrentView('upload') : setCurrentView('auth')}
                    >
                      <Upload className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                      {user ? 'Start Learning Now' : 'Get Started'}
                      <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="group border-2 border-slate-300 hover:border-blue-400 hover:bg-blue-50/80 backdrop-blur-xl h-16 px-10 rounded-2xl text-lg font-semibold transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      onClick={() => user ? setCurrentView('dashboard') : setCurrentView('auth')}
                    >
                      <BookOpen className="mr-3 h-6 w-6 group-hover:rotate-6 transition-transform duration-300" />
                      {user ? 'Go to Dashboard' : 'Explore Dashboard'}
                    </Button>
                  </div>

                  {/* Enhanced Stats section with glassmorphism */}
                  <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
                    <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <div className="text-4xl font-bold text-slate-900 mb-2">10K+</div>
                      <div className="text-sm text-slate-600 font-medium">Documents Processed</div>
                    </div>
                    <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <div className="text-4xl font-bold text-slate-900 mb-2">98%</div>
                      <div className="text-sm text-slate-600 font-medium">Accuracy Rate</div>
                    </div>
                    <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <div className="text-4xl font-bold text-slate-900 mb-2">5min</div>
                      <div className="text-sm text-slate-600 font-medium">Avg Processing Time</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 py-20">
              <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/90 backdrop-blur-xl border border-purple-200 shadow-xl mb-8 hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                  <Brain className="w-5 h-5 text-purple-600 animate-pulse" />
                  <span className="text-sm font-semibold text-slate-800">Powerful Features</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                  Everything you need to
                  <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">
                    accelerate learning
                  </span>
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  Harness the power of AI to transform how you consume and understand content
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                <ModernFeatureCard
                  icon={<Upload className="w-8 h-8" />}
                  title="Smart Upload"
                  description="Drag & drop any document format with intelligent parsing and automatic content detection"
                  gradient="from-blue-500 to-cyan-500"
                  delay="0"
                />
                <ModernFeatureCard
                  icon={<BookOpen className="w-8 h-8" />}
                  title="AI Summaries"
                  description="Extract key insights with advanced language models and contextual understanding"
                  gradient="from-green-500 to-emerald-500"
                  delay="100"
                />
                <ModernFeatureCard
                  icon={<Video className="w-8 h-8" />}
                  title="Video Creation"
                  description="Generate engaging visual content automatically with professional animations"
                  gradient="from-purple-500 to-violet-500"
                  delay="200"
                />
                <ModernFeatureCard
                  icon={<Headphones className="w-8 h-8" />}
                  title="Podcast Generation"
                  description="Convert content to conversational audio format with natural voice synthesis"
                  gradient="from-orange-500 to-red-500"
                  delay="300"
                />
                <ModernFeatureCard
                  icon={<Brain className="w-8 h-8" />}
                  title="Quiz Generation"
                  description="Automatically create quizzes from your uploaded documents to test your knowledge and reinforce learning."
                  gradient="from-yellow-400 to-yellow-600"
                  delay="400"
                />
              </div>

              <FeatureShowcase />
            </div>

            {/* Enhanced CTA Section */}
            <div className="relative py-20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/95 via-purple-600/95 to-indigo-600/95 backdrop-blur-xl"></div>
              
              <div className="relative container mx-auto px-4 text-center">
                <div className="max-w-4xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl mb-8 hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                    <Target className="w-5 h-5 text-white animate-pulse" />
                    <span className="text-sm font-semibold text-white">Ready to Transform?</span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
                    Join thousands of learners
                    <span className="block">using our platform</span>
                  </h2>
                  <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Start your journey to smarter learning with AI-powered content transformation
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Button 
                      size="lg" 
                      className="group bg-white text-blue-600 hover:bg-white/90 shadow-2xl hover:shadow-white/25 transition-all duration-500 transform hover:scale-105 h-16 px-10 rounded-2xl text-lg font-semibold"
                      onClick={() => user ? setCurrentView('upload') : setCurrentView('auth')}
                    >
                      <Upload className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                      {user ? 'Upload Your Next Document' : 'Upload Your First Document'}
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="group border-2 border-white/50 text-blue-600 hover:bg-white/10 backdrop-blur-xl h-16 px-10 rounded-2xl text-lg font-semibold transition-all duration-500 transform hover:scale-105"
                      onClick={() => setCurrentView('chat')}
                    >
                      <MessageCircle className="mr-3 h-6 w-6 group-hover:rotate-6 transition-transform duration-300" />
                      Try AI Assistant
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Navbar 
        currentView={currentView} 
        setCurrentView={handleSetCurrentView}
        user={user}
        onLogout={handleLogout}
        onSearch={handleSearch}
      />
      {renderView()}
      <FloatingChatBot sessionId={sessionId} />
    </>
  );
};

const ModernFeatureCard = ({ icon, title, description, gradient, delay }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay: string;
}) => (
  <Card className="group relative overflow-hidden border-0 shadow-2xl bg-white/90 backdrop-blur-xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-3 rounded-3xl" 
        style={{ animationDelay: `${delay}ms` }}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <CardHeader className="relative text-center pb-6">
      <div className={`mx-auto p-5 rounded-3xl bg-gradient-to-r ${gradient} text-white w-fit mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl group-hover:shadow-2xl`}>
        {icon}
      </div>
      <CardTitle className="text-xl mb-4 font-bold text-slate-900 group-hover:text-slate-800 transition-colors duration-300">{title}</CardTitle>
      <CardDescription className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
        {description}
      </CardDescription>
    </CardHeader>
    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out`}></div>
    <div className="absolute inset-0 rounded-3xl border border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
  </Card>
);

export default Index;
