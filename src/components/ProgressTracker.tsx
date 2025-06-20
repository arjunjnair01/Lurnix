
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Video, Headphones, Clock, TrendingUp } from "lucide-react";

interface ProgressStats {
  documentsProcessed: number;
  videosCreated: number;
  podcastsGenerated: number;
  totalTimeSpent: number;
  weeklyProgress: number;
}

interface ProgressTrackerProps {
  stats: ProgressStats;
}

export const ProgressTracker = ({ stats }: ProgressTrackerProps) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const progressItems = [
    {
      icon: BookOpen,
      label: "Documents",
      value: stats.documentsProcessed,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Video,
      label: "Videos",
      value: stats.videosCreated,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Headphones,
      label: "Podcasts",
      value: stats.podcastsGenerated,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Learning Progress
          </CardTitle>
          <CardDescription>Your learning journey this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Weekly Goal Progress</span>
              <Badge variant="secondary">{stats.weeklyProgress}%</Badge>
            </div>
            <Progress value={stats.weeklyProgress} className="h-2" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {progressItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className={`p-4 rounded-lg ${item.bgColor}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color} text-white`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                        <p className="text-sm text-slate-600">{item.label}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">Time spent this week:</span>
              </div>
              <Badge variant="outline">{formatTime(stats.totalTimeSpent)}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
