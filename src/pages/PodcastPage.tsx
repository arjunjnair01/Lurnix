import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function PodcastPage() {
  const { sessionId } = useParams();
  const [script, setScript] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioResult, setAudioResult] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8080/api/pdf/podcast-script/${sessionId}`)
      .then(res => {
        if (!res.ok) return res.text().then(t => { throw new Error(t); });
        return res.json();
      })
      .then(data => setScript(data.script))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  const handleConvertToAudio = async () => {
    if (!script) return;
    setAudioLoading(true);
    setAudioResult(null);
    setAudioError(null);
    try {
      const response = await fetch('http://localhost:8080/api/pdf/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script })
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar currentView="upload" setCurrentView={() => navigate('/')} onSearch={handleSearch} />
      <div className="max-w-3xl mx-auto p-8 pt-28">
        <Button variant="ghost" onClick={() => navigate('/upload')} className="mb-4">
          Back to Upload
        </Button>
        <div className="bg-white rounded-xl shadow-lg p-8 border border-green-200">
          <h1 className="text-2xl font-bold mb-4 text-green-800">Podcast Script</h1>
          {loading && <div className="text-green-600">Loading podcast script...</div>}
          {error && <div className="text-red-600">Error: {error}</div>}
          {script && (
            <>
              <pre className="whitespace-pre-wrap bg-green-50 p-4 rounded-lg border border-green-200 text-slate-800">{script}</pre>
              <button
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleConvertToAudio}
                disabled={audioLoading}
              >
                {audioLoading ? 'Converting to Audio...' : 'Convert to Audio'}
              </button>
              {audioResult && <div className="mt-2 text-green-700">{audioResult}</div>}
              {audioError && <div className="mt-2 text-red-700">Error: {audioError}</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 