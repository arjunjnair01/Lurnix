import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function SummaryPage() {
  const { sessionId } = useParams();
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8080/api/pdf/process/${sessionId}`, {
      headers: { 'Authorization': localStorage.getItem('token') || '' }
    })
      .then(res => {
        if (!res.ok) return res.text().then(t => { throw new Error(t); });
        return res.json();
      })
      .then(data => setSummary(data.analysis))
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
        <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-200">
          <h1 className="text-2xl font-bold mb-4 text-blue-800">Summary</h1>
          {loading && <div className="text-blue-600">Loading summary...</div>}
          {error && <div className="text-red-600">Error: {error}</div>}
          {summary && (
            <pre className="whitespace-pre-wrap bg-blue-50 p-4 rounded-lg border border-blue-200 text-slate-800">{summary}</pre>
          )}
        </div>
      </div>
    </div>
  );
} 