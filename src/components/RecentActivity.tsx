
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, Headphones, Clock, Eye, Download } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'document' | 'video' | 'podcast';
  title: string;
  timestamp: Date;
  status: 'completed' | 'processing' | 'failed';
  duration?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  onViewItem: (id: string) => void;
}

export const RecentActivity = ({ activities, onViewItem }: RecentActivityProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'document': return BookOpen;
      case 'video': return Video;
      case 'podcast': return Headphones;
      default: return BookOpen;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Recent Activity
        </CardTitle>
        <CardDescription>Your latest processed content</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm">Start by uploading a document to see your activity here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                  <div className="relative">
                    <div className="p-2 rounded-lg bg-white shadow-sm">
                      <Icon className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(activity.status)}`}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-900 truncate">{activity.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                      <span className="text-xs text-slate-500">{formatTimeAgo(activity.timestamp)}</span>
                      {activity.duration && (
                        <span className="text-xs text-slate-500">• {activity.duration}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewItem(activity.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {activity.status === 'completed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
