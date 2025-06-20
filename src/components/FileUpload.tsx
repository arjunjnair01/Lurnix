import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle, File, FileImage, FileText, Upload } from "lucide-react";
import { useCallback, useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

interface FileUploadProps {
  onBack: () => void;
  onSessionId?: (sessionId: string) => void;
}

export const FileUpload = ({ onBack, onSessionId }: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [videoSuggestions, setVideoSuggestions] = useState<any[] | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [podcastScript, setPodcastScript] = useState<string | null>(null);
  const [podcastLoading, setPodcastLoading] = useState(false);
  const [podcastError, setPodcastError] = useState<string | null>(null);
  const [audioResult, setAudioResult] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [autoSummary, setAutoSummary] = useState<string | null>(null);
  const [autoVideoSuggestions, setAutoVideoSuggestions] = useState<any[] | null>(null);
  const [autoPodcastScript, setAutoPodcastScript] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<any[] | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = [
        'application/pdf',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'application/json'
      ];
      return validTypes.includes(file.type) || file.name.endsWith('.ipynb');
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid file type",
        description: "Please upload only PDF, PPT, or notebook files.",
        variant: "destructive",
      });
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
    if (validFiles.length > 0) {
      uploadFiles(validFiles);
    }
  };

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);
    setSessionId(null);
    setUploadError(null);
    setProcessing(true);
    setAutoSummary(null);
    setAutoVideoSuggestions(null);
    setAutoPodcastScript(null);
    setQuiz(null);
    setAudioUrl(null);
    try {
      const formData = new FormData();
      formData.append('file', files[0]);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/pdf/upload', {
        method: 'POST',
        headers: { 'Authorization': token || '' },
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error: ${response.status}`);
      }
      const data = await response.json();
      setSessionId(data.sessionId);
      if (onSessionId) onSessionId(data.sessionId);
      setUploadProgress(100);
      setAutoSummary(data.summary);
      setAutoVideoSuggestions(data.videoSuggestions);
      setAutoPodcastScript(data.podcastScript);
      setSummary(null); setVideoSuggestions(null); setPodcastScript(null); // clear manual fetches
      toast({ title: 'Upload successful!', description: data.message });
    } catch (err: any) {
      setUploadError(err.message);
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
      setProcessing(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) return <FileText className="w-6 h-6 text-red-500" />;
    if (fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) return <FileImage className="w-6 h-6 text-orange-500" />;
    if (fileName.endsWith('.ipynb')) return <File className="w-6 h-6 text-purple-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const fetchVideoSuggestions = async (sessionId: string) => {
    setVideoLoading(true);
    setVideoError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/pdf/youtube-videos/${sessionId}`, {
        headers: { 'Authorization': token || '' }
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setVideoSuggestions(data.videos);
    } catch (err: any) {
      setVideoError(err.message);
    } finally {
      setVideoLoading(false);
    }
  };

  const fetchPodcastScript = async (sessionId: string) => {
    setPodcastLoading(true);
    setPodcastError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/pdf/podcast-script/${sessionId}`, {
        headers: { 'Authorization': token || '' }
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setPodcastScript(data.script);
    } catch (err: any) {
      setPodcastError(err.message);
    } finally {
      setPodcastLoading(false);
    }
  };

  // Generate Podcast Audio
  const handleGeneratePodcastAudio = async () => {
    if (!autoPodcastScript) return;
    setAudioLoading(true);
    setAudioResult(null);
    setAudioError(null);
    setAudioUrl(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/pdf/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token || '' },
        body: JSON.stringify({ script: autoPodcastScript })
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      // Assume backend returns a file path or URL
      setAudioResult(data.message);
      // If backend returns a URL, setAudioUrl(data.audioUrl)
      // For now, try to extract path from message
      const match = data.message.match(/Output: (.+\.mp3)/);
      if (match) setAudioUrl(`http://localhost:8080/${match[1]}`);
    } catch (err: any) {
      setAudioError(err.message);
    } finally {
      setAudioLoading(false);
    }
  };

  // Generate Quiz
  const handleGenerateQuiz = async () => {
    if (!sessionId) return;
    setQuizLoading(true);
    setQuizError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/pdf/generate-quiz/${sessionId}`, {
        headers: { 'Authorization': token || '' }
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      let quizStr = data.quiz;
      // Remove code block markers if present
      if (typeof quizStr === 'string') {
        quizStr = quizStr.trim();
        if (quizStr.startsWith('```json')) quizStr = quizStr.slice(7);
        if (quizStr.startsWith('```')) quizStr = quizStr.slice(3);
        if (quizStr.endsWith('```')) quizStr = quizStr.slice(0, -3);
        quizStr = quizStr.trim();
      }
      let parsed = [];
      try { parsed = JSON.parse(quizStr); } catch { parsed = []; }
      setQuiz(parsed);
    } catch (err: any) {
      setQuizError(err.message);
    } finally {
      setQuizLoading(false);
    }
  };

  // Loader animation (simple spinner)
  const Loader = () => (
    <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-6"></div>
      <div className="text-xl font-semibold text-blue-700">Processing your file...</div>
      <div className="text-muted-foreground mt-2">This may take a few moments.</div>
    </div>
  );

  // Quiz loading skeleton
  const QuizSkeleton = () => (
    <div className="w-full flex flex-col items-center justify-center py-8">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-yellow-400 mb-4"></div>
      <div className="text-yellow-700 font-semibold">Generating your quiz...</div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-green-50 p-0">
      {/* Upload area stays at the top */}
      <div className="w-full flex flex-col items-center py-8">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
          Upload Your Documents
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Upload PPT, PDF, or notebook files to transform them into summaries, videos, and podcasts.
        </p>
        <div className="w-full max-w-2xl">
          <div className="border-2 border-dashed rounded-2xl p-8 bg-white/80 shadow-xl flex flex-col items-center">
            <div
              className={`text-center transition-all duration-300 ${isDragOver ? 'scale-105 bg-blue-50' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-blue-600 to-green-600 rounded-full w-fit">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Drop your files here</h3>
              <div className="text-muted-foreground mb-4">or click to browse and select files</div>
              <input
                type="file"
                multiple
                accept=".pdf,.ppt,.pptx,.ipynb,.txt,.json"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                ref={fileInputRef}
              />
              <Button
                type="button"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                Choose Files
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Supported formats: PDF, PPT, PPTX, Jupyter Notebooks
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Loader while processing */}
      {processing && <Loader />}
      {/* Results area: two-column layout for summary and podcast, video suggestions below, buttons below that */}
      {!processing && (autoSummary || autoVideoSuggestions || autoPodcastScript) ? (
        <div className="w-full px-2 md:px-8 py-10 flex flex-col gap-16 items-center">
          {/* Two-column summary + podcast, much larger cards */}
          <div className="w-full max-w-[1800px] grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Summary Card */}
            <div className="rounded-3xl shadow-2xl bg-white/95 p-10 flex flex-col min-h-[600px] max-h-[900px] min-w-[350px] max-w-full overflow-auto">
              <h2 className="text-3xl font-bold text-blue-700 mb-6">Summary</h2>
              {autoSummary ? (
                <pre className="whitespace-pre-wrap text-slate-800 text-lg bg-blue-50 rounded-xl p-6 border border-blue-100 max-h-[700px] overflow-auto">{autoSummary}</pre>
              ) : (
                <div className="text-gray-400">No summary available.</div>
              )}
            </div>
            {/* Podcast Script Card */}
            <div className="rounded-3xl shadow-2xl bg-white/95 p-10 flex flex-col min-h-[600px] max-h-[900px] min-w-[350px] max-w-full overflow-auto">
              <h2 className="text-3xl font-bold text-green-700 mb-6">Podcast Script</h2>
              {autoPodcastScript ? (
                <pre className="whitespace-pre-wrap text-slate-800 text-lg bg-green-50 rounded-xl p-6 border border-green-100 max-h-[700px] overflow-auto">{autoPodcastScript}</pre>
              ) : (
                <div className="text-gray-400">No podcast script available.</div>
              )}
            </div>
          </div>
          {/* Video Suggestions - much wider and taller */}
          <div className="w-full max-w-[1600px] rounded-3xl shadow-2xl bg-white/95 p-10 flex flex-col">
            <h2 className="text-3xl font-bold text-red-700 mb-8">Video Suggestions</h2>
            {autoVideoSuggestions && autoVideoSuggestions.length > 0 ? (
              <ul className="flex flex-row gap-10 overflow-x-auto pb-2">
                {autoVideoSuggestions.map((video, idx) => (
                  <li key={idx} className="flex flex-col items-center min-w-[320px] max-w-[320px] bg-white rounded-xl shadow p-4">
                    <img
                      src={video.thumbnailUrl || video.thumbnail || 'https://via.placeholder.com/120x90'}
                      alt={video.title}
                      className="w-56 h-32 object-cover rounded mb-3"
                    />
                    <a
                      href={video.videoUrl || video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-blue-700 hover:underline text-center"
                    >
                      {video.title}
                    </a>
                    <div className="text-sm text-slate-700 mt-2 line-clamp-4 text-center">{video.description}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400">No video suggestions available.</div>
            )}
          </div>
          {/* Action Buttons */}
          <div className="w-full max-w-3xl flex flex-col md:flex-row gap-8 justify-center items-center mt-4">
            <Button
              className="flex-1 min-w-[260px] bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-xl font-semibold py-5 rounded-2xl shadow-xl"
              onClick={handleGeneratePodcastAudio}
              disabled={audioLoading || !autoPodcastScript}
            >
              {audioLoading ? 'Generating Podcast Audio...' : 'Generate Podcast Audio'}
            </Button>
            <Button
              className="flex-1 min-w-[260px] bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white text-xl font-semibold py-5 rounded-2xl shadow-xl"
              onClick={handleGenerateQuiz}
              disabled={quizLoading || !sessionId}
            >
              {quizLoading ? 'Generating Quiz...' : 'Generate Quiz'}
            </Button>
          </div>
          {/* Podcast Audio Result */}
          {audioResult && (
            <div className="w-full max-w-2xl mt-2 text-green-700 text-center">{audioResult}</div>
          )}
          {audioError && (
            <div className="w-full max-w-2xl mt-2 text-red-700 text-center">Error: {audioError}</div>
          )}
          {audioUrl && (
            <div className="w-full max-w-2xl mt-4 flex flex-col items-center">
              <audio controls src={audioUrl} className="w-full rounded-lg">
                Your browser does not support the audio element.
              </audio>
              <a href={audioUrl} download className="block mt-2 text-blue-700 hover:underline">Download Podcast Audio</a>
            </div>
          )}
          {/* Quiz Result - show skeleton while loading, show quiz or friendly message */}
          {quizLoading && <QuizSkeleton />}
          {quizError && !quizLoading && (
            <div className="w-full max-w-2xl mt-2 text-red-700 text-center">Error: {quizError}</div>
          )}
          {!quizLoading && quiz && quiz.length > 0 && (
            <div className="w-full max-w-2xl mt-8">
              <h3 className="text-2xl font-bold mb-4 text-yellow-700 text-center">Quiz</h3>
              <ul className="space-y-6">
                {quiz.map((q, idx) => (
                  <li key={idx} className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                    <div className="font-semibold mb-2">Q{idx + 1}: {q.question}</div>
                    <ul className="space-y-1 ml-4">
                      {q.options.map((opt: string, oidx: number) => (
                        <li key={oidx} className="flex items-center">
                          <span className="mr-2">{String.fromCharCode(65 + oidx)}.</span> {opt}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 text-green-700 text-sm">Answer: {String.fromCharCode(65 + (q.answer ?? q.answerIdx ?? 0))}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!quizLoading && quiz && quiz.length === 0 && (
            <div className="w-full max-w-2xl mt-8 text-center text-gray-500 text-lg">No quiz could be generated for this document.</div>
          )}
        </div>
      ) : null}
    </div>
  );
};
