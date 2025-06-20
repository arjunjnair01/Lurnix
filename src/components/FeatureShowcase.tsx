
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Download, Share, Eye, Clock, Headphones } from "lucide-react";

export const FeatureShowcase = () => {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* AI Summary Preview */}
      <Card className="group relative overflow-hidden border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-indigo-50/40"></div>
        <CardHeader className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
                <Eye className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">AI Summary</CardTitle>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-200 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Ready
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl mb-6 border border-blue-200/50 shadow-inner">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <h4 className="font-bold text-slate-900 text-lg">Machine Learning Basics</h4>
            </div>
            <p className="text-slate-700 leading-relaxed text-sm">
              Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed. It focuses on developing algorithms that can analyze data patterns...
            </p>
            <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              <span>2 min read • 95% accuracy</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Video Preview */}
      <Card className="group relative overflow-hidden border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 to-violet-50/40"></div>
        <CardHeader className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg">
                <Play className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">Generated Video</CardTitle>
            </div>
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 shadow-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
              Processing
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl mb-6 border border-purple-200/50 shadow-inner relative overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-purple-200 to-purple-300 rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-violet-400/20 animate-pulse"></div>
              <Button size="lg" className="relative z-10 bg-white/90 text-purple-700 hover:bg-white shadow-2xl rounded-full w-16 h-16 group-hover:scale-110 transition-all duration-300">
                <Play className="w-8 h-8" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>5:42 min • HD Quality</span>
              </div>
              <div className="bg-purple-100 px-2 py-1 rounded-full text-purple-700 font-medium">
                AI Enhanced
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-md hover:shadow-lg transition-all duration-300">
              <Play className="w-4 h-4 mr-2" />
              Watch
            </Button>
            <Button size="sm" variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Podcast Preview */}
      <Card className="group relative overflow-hidden border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 to-amber-50/40"></div>
        <CardHeader className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg">
                <Headphones className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">Podcast Episode</CardTitle>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-200 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Ready
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl mb-6 border border-orange-200/50 shadow-inner">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-400 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">ML</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Learning Pod</h4>
                <p className="text-sm text-slate-600">Episode #1 • Educational Series</p>
              </div>
            </div>
            
            {/* Audio waveform visualization */}
            <div className="bg-orange-200/50 p-4 rounded-xl mb-4">
              <div className="flex items-center gap-1 h-8 justify-center mb-2">
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i} 
                    className="bg-orange-500 rounded-full w-1 animate-pulse"
                    style={{ 
                      height: `${Math.random() * 100 + 20}%`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  ></div>
                ))}
              </div>
              <div className="bg-orange-300 h-2 rounded-full overflow-hidden">
                <div className="bg-orange-600 h-2 rounded-full w-1/3 animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>8:30 / 25:15</span>
              <div className="bg-orange-100 px-2 py-1 rounded-full text-orange-700 font-medium">
                2 Voices
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button size="sm" className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md hover:shadow-lg transition-all duration-300">
              <Play className="w-4 h-4 mr-2" />
              Listen
            </Button>
            <Button size="sm" variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
