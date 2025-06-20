import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function VideoSuggestionsPage() {
  const { sessionId } = useParams();
  const [videos, setVideos] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8080/api/pdf/youtube-videos/${sessionId}`)
      .then(res => {
        if (!res.ok) return res.text().then(t => { throw new Error(t); });
        return res.json();
      })
      .then(data => setVideos(data.videos))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar currentView="upload" setCurrentView={() => navigate('/')} onSearch={handleSearch} />
      <div className="max-w-3xl mx-auto p-8 pt-28">
        <Button variant="ghost" onClick={() => navigate('/upload')} className="mb-4">
          Back to Upload
        </Button>
        <div className="bg-white rounded-xl shadow-lg p-8 border border-red-200">
          <h1 className="text-2xl font-bold mb-4 text-red-800">Video Suggestions</h1>
          {loading && <div className="text-red-600">Loading video suggestions...</div>}
          {error && <div className="text-red-600">Error: {error}</div>}
          <ul className="space-y-4">
            {videos && videos.map((video, idx) => (
              <li key={idx} className="flex gap-4 items-start bg-white rounded-lg shadow p-3">
                <img
                  src={video.thumbnailUrl || video.thumbnail || 'https://via.placeholder.com/120x90'}
                  alt={video.title}
                  className="w-32 h-20 object-cover rounded"
                />
                <div>
                  <a
                    href={video.videoUrl || video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-blue-700 hover:underline"
                  >
                    {video.title}
                  </a>
                  <div className="text-sm text-slate-700 mt-1">{video.description}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 