import { SearchBar } from "@/components/SearchBar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BookOpen, Brain, FileText, Headphones, LogOut, Menu, Settings as SettingsIcon, Sparkles, User, Video, X, Clock } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  currentView: 'home' | 'upload' | 'dashboard' | 'chat' | 'auth' | 'history';
  setCurrentView: (view: 'home' | 'upload' | 'dashboard' | 'chat' | 'auth' | 'history') => void;
  user?: { name: string; email: string } | null;
  onLogout?: () => void;
  onSearch?: (query: string) => void;
}

export const Navbar = ({ currentView, setCurrentView, user, onLogout, onSearch }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'dashboard', label: 'Dashboard', icon: BookOpen },
    { id: 'history', label: 'History', icon: Clock },
  ];

  const featuresItems = [
    { id: 'upload', label: 'AI Summaries', icon: FileText, description: 'Transform documents into smart summaries' },
    { id: 'upload', label: 'Video Generation', icon: Video, description: 'Create engaging videos from your content' },
    { id: 'upload', label: 'Podcast Creation', icon: Headphones, description: 'Generate conversational podcasts' },
    { id: 'upload', label: 'Smart Analysis', icon: Brain, description: 'Advanced AI-powered content analysis' },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-200" 
            onClick={() => setCurrentView('home')}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Lurnix
            </span>
          </div>

          {/* Professional Search Bar - Centered and Prominent */}
          {onSearch && (
            <div className="hidden md:block flex-1 max-w-2xl mx-8">
              <SearchBar 
                onSearch={onSearch}
                placeholder="Search documents, videos, podcasts, and more..."
              />
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavigationMenuItem key={item.id}>
                      <NavigationMenuLink
                        className={`group inline-flex h-10 w-max items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none cursor-pointer ${
                          currentView === item.id 
                            ? 'bg-blue-100 text-blue-700 shadow-md' 
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        onClick={() => setCurrentView(item.id as any)}
                      >
                        <Icon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                        {item.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}
                
                {/* Features Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-10 px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-blue-50 hover:text-blue-700 rounded-xl">
                    Features
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {featuresItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <NavigationMenuLink
                            key={item.label}
                            className="group block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 cursor-pointer"
                            onClick={() => setCurrentView(item.id as any)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                                <Icon className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium leading-none">{item.label}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-slate-600 group-hover:text-blue-600">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </NavigationMenuLink>
                        );
                      })}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* User Profile or Auth Button */}
            {user ? (
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all duration-200">
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 shadow-xl">
                    <DropdownMenuItem onClick={() => setCurrentView('dashboard')} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log('Settings clicked')} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                      <SettingsIcon className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => setCurrentView('auth')}
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:bg-blue-50 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200/50 bg-white/95 backdrop-blur-sm">
            {/* Mobile Search */}
            {onSearch && (
              <div className="mb-4">
                <SearchBar 
                  onSearch={onSearch}
                  placeholder="Search..."
                />
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "default" : "ghost"}
                    className="justify-start rounded-xl"
                    onClick={() => {
                      setCurrentView(item.id as any);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
              
              {/* Mobile Features */}
              <div className="mt-2">
                <div className="text-sm font-medium text-slate-600 mb-2 px-3">Features</div>
                {featuresItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.label}
                      variant="ghost"
                      className="justify-start rounded-xl w-full text-left"
                      onClick={() => {
                        setCurrentView(item.id as any);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
              
              {user ? (
                <Button 
                  variant="ghost"
                  className="justify-start text-red-600 hover:bg-red-50 rounded-xl"
                  onClick={() => {
                    onLogout?.();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white mt-2 rounded-xl"
                  onClick={() => {
                    setCurrentView('auth');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
