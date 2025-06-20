import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageBreadcrumb } from "@/components/ui/navigation-breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, ArrowLeft, BarChart3, Clock, Eye, Eye as EyeIcon, FileText, Grid, Headphones, List, Play, Share, Star, TrendingUp, Upload, Video } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Navbar } from "@/components/Navbar";

interface DashboardProps {
  onBack: () => void;
  sessionId?: string | null;
}

export const Dashboard = ({ onBack, sessionId }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoResult, setVideoResult] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [podcastScript, setPodcastScript] = useState<string | null>(null);
  const [podcastScriptError, setPodcastScriptError] = useState<string | null>(null);
  const [podcastScriptLoading, setPodcastScriptLoading] = useState(false);
  const [audioResult, setAudioResult] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [youtubeVideos, setYoutubeVideos] = useState<any[] | null>(null);
  const [youtubeError, setYoutubeError] = useState<string | null>(null);
  const [youtubeLoading, setYoutubeLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const navigate = useNavigate();

  const documents = [
    {
      id: '1',
      name: 'Machine Learning Fundamentals.pdf',
      type: 'pdf',
      uploadDate: '2024-06-07',
      status: 'processed',
      summary: true,
      video: true,
      podcast: true,
      size: '2.5 MB',
      category: 'Technology',
      rating: 4.8,
      views: 1250,
      duration: '15 min read'
    },
    {
      id: '2',
      name: 'Data Science Presentation.pptx',
      type: 'pptx',
      uploadDate: '2024-06-06',
      status: 'processing',
      summary: true,
      video: false,
      podcast: false,
      size: '5.2 MB',
      category: 'Data Science',
      rating: 4.5,
      views: 890,
      duration: '8 min read'
    },
    {
      id: '3',
      name: 'Neural Networks Notebook.ipynb',
      type: 'ipynb',
      uploadDate: '2024-06-05',
      status: 'processed',
      summary: true,
      video: true,
      podcast: true,
      size: '1.8 MB',
      category: 'AI/ML',
      rating: 4.9,
      views: 2100,
      duration: '12 min read'
    },
    {
      id: '4',
      name: 'Web Development Guide.md',
      type: 'md',
      uploadDate: '2024-06-04',
      status: 'processed',
      summary: true,
      video: true,
      podcast: false,
      size: '0.8 MB',
      category: 'Development',
      rating: 4.6,
      views: 1560,
      duration: '10 min read'
    }
  ];

  const analytics = {
    totalDocuments: 24,
    totalVideos: 18,
    totalPodcasts: 12,
    totalTimeSpent: 320,
    weeklyGrowth: 15,
    monthlyGrowth: 28,
    accuracyRate: 98.5,
    userSatisfaction: 4.8
  };

  const recentActivity = [
    {
      id: '1',
      type: 'upload',
      title: 'Uploaded: React Best Practices.pdf',
      timestamp: new Date(Date.now() - 30 * 60000),
      status: 'completed'
    },
    {
      id: '2',
      type: 'video',
      title: 'Generated: Machine Learning Video',
      timestamp: new Date(Date.now() - 2 * 60 * 60000),
      status: 'completed'
    },
    {
      id: '3',
      type: 'podcast',
      title: 'Created: Data Science Podcast',
      timestamp: new Date(Date.now() - 4 * 60 * 60000),
      status: 'completed'
    },
    {
      id: '4',
      type: 'share',
      title: 'Shared: Neural Networks Summary',
      timestamp: new Date(Date.now() - 6 * 60 * 60000),
      status: 'completed'
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'pptx':
        return <FileText className="w-5 h-5 text-orange-500" />;
      case 'ipynb':
        return <FileText className="w-5 h-5 text-purple-500" />;
      case 'md':
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Processed</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">Processing</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      'Technology': 'bg-blue-100 text-blue-800 border-blue-200',
      'Data Science': 'bg-green-100 text-green-800 border-green-200',
      'AI/ML': 'bg-purple-100 text-purple-800 border-purple-200',
      'Development': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return <Badge className={`${colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>{category}</Badge>;
  };

  // Sample API call to backend
  const testChatApi = async () => {
    setLoading(true);
    setApiResult(null);
    setApiError(null);
    try {
      // Replace with a real sessionId and message as needed
      const sessionId = "test-session";
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/pdf/chat/${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": token || '' },
        body: JSON.stringify({ role: "user", content: "Hello, backend!" })
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error: ${response.status}`);
      }
      const data = await response.json();
      setApiResult(JSON.stringify(data));
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchYouTubeVideos = async () => {
    if (!sessionId) return;
    setYoutubeLoading(true);
    setYoutubeVideos(null);
    setYoutubeError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/pdf/youtube-videos/${sessionId}`, {
        headers: { 'Authorization': token || '' }
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error: ${response.status}`);
      }
      const data = await response.json();
      setYoutubeVideos(data.videos);
    } catch (err: any) {
      setYoutubeError(err.message);
    } finally {
      setYoutubeLoading(false);
    }
  };

  const handleGeneratePodcastScript = async () => {
    if (!sessionId) return;
    setPodcastScriptLoading(true);
    setPodcastScript(null);
    setPodcastScriptError(null);
    setAudioResult(null);
    setAudioError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/pdf/podcast-script/${sessionId}`, {
        headers: { 'Authorization': token || '' }
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error: ${response.status}`);
      }
      const data = await response.json();
      setPodcastScript(data.script);
    } catch (err: any) {
      setPodcastScriptError(err.message);
    } finally {
      setPodcastScriptLoading(false);
    }
  };

  const handleConvertToAudio = async () => {
    if (!podcastScript) return;
    setAudioLoading(true);
    setAudioResult(null);
    setAudioError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/pdf/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token || '' },
        body: JSON.stringify({ script: podcastScript })
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error: ${response.status}`);
      }
      const data = await response.json();
      setAudioResult(data.message);
    } catch (err: any) {
      setAudioError(err.message);
    } finally {
      setAudioLoading(false);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setHistoryLoading(true);
      setHistoryError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8080/api/user/history', {
          headers: { 'Authorization': token || '' }
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setHistory(data);
      } catch (err: any) {
        setHistoryError(err.message || 'Failed to fetch history');
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <PageBreadcrumb 
            currentPage="Dashboard" 
            onNavigate={(page, index) => {
              if (page === "Home") {
                onBack();
              }
            }}
          />
          <Button variant="ghost" onClick={onBack} className="mb-4 hover:bg-blue-50 transition-colors duration-200">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Learning Dashboard
          </h1>
          <p className="text-slate-600 text-lg">
            Manage your uploaded documents and track your learning progress
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 rounded-xl transition-all duration-200">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 rounded-xl transition-all duration-200">
              <FileText className="w-4 h-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 rounded-xl transition-all duration-200">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 rounded-xl transition-all duration-200">
              <Activity className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Enhanced Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Total Documents</p>
                      <p className="text-3xl font-bold text-slate-900">{analytics.totalDocuments}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600 font-medium">+{analytics.weeklyGrowth}%</span>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Videos Created</p>
                      <p className="text-3xl font-bold text-slate-900">{analytics.totalVideos}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600 font-medium">+{analytics.monthlyGrowth}%</span>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <Video className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Podcasts Generated</p>
                      <p className="text-3xl font-bold text-slate-900">{analytics.totalPodcasts}</p>
                      <div className="flex items-center mt-2">
                        <Clock className="w-4 h-4 text-blue-500 mr-1" />
                        <span className="text-sm text-blue-600 font-medium">{analytics.totalTimeSpent}h</span>
                      </div>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-xl">
                      <Headphones className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Accuracy Rate</p>
                      <p className="text-3xl font-bold text-slate-900">{analytics.accuracyRate}%</p>
                      <div className="flex items-center mt-2">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-yellow-600 font-medium">{analytics.userSatisfaction}/5</span>
                      </div>
                    </div>
                    <div className="p-3 bg-green-100 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Access your most used features quickly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button className="h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" onClick={() => navigate('/upload')}>
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Document
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                    onClick={handleFetchYouTubeVideos}
                    disabled={!sessionId || youtubeLoading}
                  >
                    <Video className="w-5 h-5 mr-2" />
                    {youtubeLoading ? 'Fetching...' : 'Suggest YouTube Videos'}
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                    onClick={handleGeneratePodcastScript}
                    disabled={!sessionId || podcastScriptLoading}
                  >
                    <Headphones className="w-5 h-5 mr-2" />
                    {podcastScriptLoading ? 'Generating...' : 'Generate Podcast'}
                  </Button>
                </div>
                {youtubeVideos && youtubeVideos.length > 0 && (
                  <div className="mt-4 text-blue-700">
                    <div className="font-semibold mb-2">YouTube Video Suggestions:</div>
                    <ul className="space-y-2">
                      {youtubeVideos.map((video, idx) => (
                        <li key={idx}>
                          <a href={video.url} target="_blank" rel="noopener noreferrer" className="underline font-medium">{video.title}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {youtubeError && (
                  <div className="mt-4 text-red-700">Error: {youtubeError}</div>
                )}
                {podcastScript && (
                  <div className="mt-4 text-blue-700">
                    <div className="font-semibold mb-2">Podcast Script:</div>
                    <pre className="bg-blue-50 p-2 rounded whitespace-pre-wrap max-h-40 overflow-auto">{podcastScript}</pre>
                    <Button
                      className="mt-2"
                      onClick={handleConvertToAudio}
                      disabled={audioLoading}
                    >
                      {audioLoading ? 'Converting to Audio...' : 'Convert to Audio'}
                    </Button>
                  </div>
                )}
                {podcastScriptError && (
                  <div className="mt-4 text-red-700">Error: {podcastScriptError}</div>
                )}
                {audioResult && (
                  <div className="mt-4 text-green-700">{audioResult}</div>
                )}
                {audioError && (
                  <div className="mt-4 text-red-700">Error: {audioError}</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Your Documents</h2>
                <p className="text-slate-600">Manage and organize your uploaded content</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-9"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-9"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc) => (
                  <Card key={doc.id} className="bg-white/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        {getFileIcon(doc.type)}
                        {getStatusBadge(doc.status)}
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{doc.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        {getCategoryBadge(doc.category)}
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                        <span>{doc.size}</span>
                        <span>{doc.duration}</span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{doc.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <EyeIcon className="w-4 h-4 text-slate-500" />
                          <span className="text-sm">{doc.views}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {doc.summary && (
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="w-4 h-4 mr-1" />
                            Summary
                          </Button>
                        )}
                        {doc.video && (
                          <Button size="sm" variant="outline" className="flex-1">
                            <Play className="w-4 h-4 mr-1" />
                            Video
                          </Button>
                        )}
                        {doc.podcast && (
                          <Button size="sm" variant="outline" className="flex-1">
                            <Headphones className="w-4 h-4 mr-1" />
                            Podcast
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50/50 transition-colors duration-200">
                        <div className="flex items-center gap-4 flex-1">
                          {getFileIcon(doc.type)}
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">{doc.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              {getCategoryBadge(doc.category)}
                              <span className="text-sm text-slate-500">{doc.size}</span>
                              <span className="text-sm text-slate-500">{doc.duration}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{doc.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <EyeIcon className="w-4 h-4 text-slate-500" />
                            <span className="text-sm">{doc.views}</span>
                          </div>
                          {getStatusBadge(doc.status)}
                          <div className="flex gap-1">
                            {doc.summary && <Button size="sm" variant="outline"><Eye className="w-4 h-4" /></Button>}
                            {doc.video && <Button size="sm" variant="outline"><Play className="w-4 h-4" /></Button>}
                            {doc.podcast && <Button size="sm" variant="outline"><Headphones className="w-4 h-4" /></Button>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl">
                    <span className="font-medium">Weekly Growth</span>
                    <span className="text-2xl font-bold text-green-600">+{analytics.weeklyGrowth}%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50/50 rounded-xl">
                    <span className="font-medium">Monthly Growth</span>
                    <span className="text-2xl font-bold text-purple-600">+{analytics.monthlyGrowth}%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50/50 rounded-xl">
                    <span className="font-medium">Accuracy Rate</span>
                    <span className="text-2xl font-bold text-green-600">{analytics.accuracyRate}%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-orange-50/50 rounded-xl">
                    <span className="font-medium">User Satisfaction</span>
                    <span className="text-2xl font-bold text-orange-600">{analytics.userSatisfaction}/5</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Time Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl">
                    <span className="font-medium">Total Time Spent</span>
                    <span className="text-2xl font-bold text-blue-600">{analytics.totalTimeSpent}h</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50/50 rounded-xl">
                    <span className="font-medium">Avg Session</span>
                    <span className="text-2xl font-bold text-purple-600">45min</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50/50 rounded-xl">
                    <span className="font-medium">This Week</span>
                    <span className="text-2xl font-bold text-green-600">12h</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-orange-50/50 rounded-xl">
                    <span className="font-medium">This Month</span>
                    <span className="text-2xl font-bold text-orange-600">48h</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Track your latest actions and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50/50 transition-colors duration-200">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {activity.type === 'upload' && <Upload className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'video' && <Video className="w-4 h-4 text-purple-600" />}
                        {activity.type === 'podcast' && <Headphones className="w-4 h-4 text-orange-600" />}
                        {activity.type === 'share' && <Share className="w-4 h-4 text-green-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{activity.title}</p>
                        <p className="text-sm text-slate-500">{activity.timestamp.toLocaleString()}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export const HistoryPage = ({ user }: { currentView?: string, setCurrentView?: (view: string) => void, user?: { name: string; email: string } | null }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8080/api/user/history', {
          headers: { 'Authorization': token }
        });
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        setHistory(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [navigate]);

  // Navigation handler for Navbar and Back to Home
  const handleNav = (view: string) => {
    switch (view) {
      case 'home':
        navigate('/');
        break;
      case 'dashboard':
        navigate('/'); // or navigate('/dashboard') if you have a dashboard route
        break;
      case 'upload':
        navigate('/upload');
        break;
      case 'history':
        navigate('/history');
        break;
      case 'auth':
        navigate('/auth');
        break;
      case 'chat':
        navigate('/'); // or navigate('/chat') if you have a chat route
        break;
      default:
        navigate('/');
    }
  };

  return (
    <>
      <Navbar currentView="history" setCurrentView={handleNav} user={user} />
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-green-50 p-0 pt-24 flex flex-col items-center">
        <Button variant="ghost" onClick={() => handleNav('home')} className="mb-6">
          Back to Home
        </Button>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-10">Your Upload History</h1>
        {loading && <div className="flex flex-col items-center justify-center py-16"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div><div className="text-blue-700 font-semibold">Loading history...</div></div>}
        {error && <div className="text-red-600 font-semibold py-8">{error}</div>}
        {!loading && !error && history.length === 0 && <div className="text-gray-500 text-lg py-8">No uploads yet. Your history will appear here.</div>}
        {!loading && !error && history.length > 0 && (
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 pb-16">
            {history.map((item, idx) => (
              <div key={idx} className="rounded-2xl shadow-xl bg-white/95 p-6 flex flex-col gap-2 border border-blue-100 hover:shadow-2xl transition-shadow duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-6 h-6 text-blue-500" />
                  <span className="font-semibold text-lg text-blue-800">{item.fileName || 'Untitled Document'}</span>
                </div>
                <div className="text-sm text-slate-500 mb-2">Uploaded: {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Unknown'}</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.summary && <Badge className="bg-blue-100 text-blue-700 border-blue-200">Summary</Badge>}
                  {item.podcastScript && <Badge className="bg-green-100 text-green-700 border-green-200">Podcast</Badge>}
                  {item.quiz && <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Quiz</Badge>}
                  {item.videoSuggestions && <Badge className="bg-red-100 text-red-700 border-red-200">Videos</Badge>}
                </div>
                <div className="flex gap-3 mt-4">
                  {item.summary && <Button size="sm" variant="outline" className="text-blue-700 border-blue-300" onClick={() => window.open(`/summary/${item.sessionId}`, '_blank')}>View Summary</Button>}
                  {item.podcastScript && <Button size="sm" variant="outline" className="text-green-700 border-green-300" onClick={() => window.open(`/podcast/${item.sessionId}`, '_blank')}>View Podcast</Button>}
                  {item.quiz && <Button size="sm" variant="outline" className="text-yellow-700 border-yellow-300" onClick={() => window.open(`/quiz/${item.sessionId}`, '_blank')}>View Quiz</Button>}
                  {item.videoSuggestions && <Button size="sm" variant="outline" className="text-red-700 border-red-300" onClick={() => window.open(`/videos/${item.sessionId}`, '_blank')}>View Videos</Button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HistoryPage;
