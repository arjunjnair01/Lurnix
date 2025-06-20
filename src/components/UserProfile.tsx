
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Settings, LogOut, Crown } from "lucide-react";

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    joinDate: Date;
    plan: 'free' | 'pro' | 'enterprise';
  };
  onLogout: () => void;
  onSettings: () => void;
}

export const UserProfile = ({ user, onLogout, onSettings }: UserProfileProps) => {
  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'pro': return <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"><Crown className="w-3 h-3 mr-1" />Pro</Badge>;
      case 'enterprise': return <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"><Crown className="w-3 h-3 mr-1" />Enterprise</Badge>;
      default: return <Badge variant="secondary">Free</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Profile
        </CardTitle>
        <CardDescription>Account information and settings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-slate-900">{user.name}</h3>
              <p className="text-slate-600">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                {getPlanBadge(user.plan)}
                <span className="text-xs text-slate-500">
                  Member since {user.joinDate.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={onSettings}
              className="justify-start"
            >
              <Settings className="w-4 h-4 mr-2" />
              Account Settings
            </Button>
            <Button
              variant="outline"
              onClick={onLogout}
              className="justify-start text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
