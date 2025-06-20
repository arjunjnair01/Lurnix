import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Helper to parse quiz text into structured questions
function parseQuiz(quiz: string) {
  // Remove code block markers if present
  quiz = quiz.trim();
  if (quiz.startsWith('```json')) quiz = quiz.slice(7);
  if (quiz.startsWith('```')) quiz = quiz.slice(3);
  if (quiz.endsWith('```')) quiz = quiz.slice(0, -3);
  quiz = quiz.trim();
  // Try to parse as JSON first
  try {
    const arr = JSON.parse(quiz);
    if (Array.isArray(arr) && arr[0]?.question && arr[0]?.options) {
      // Normalize answer index if needed
      return arr.map((q: any) => ({
        question: q.question,
        options: q.options,
        answerIdx: typeof q.answer === 'number' ? q.answer : parseInt(q.answer),
        answerText: q.options[q.answer] || ''
      }));
    }
  } catch (e) {
    // Not JSON, fall back to text parsing
  }
  // Fallback: old text parser (as before)
  const questionBlocks = quiz.split(/\*\*\d+\./g).filter(Boolean);
  const questions = [];
  let qIdx = 1;
  for (let block of questionBlocks) {
    const qMatch = block.match(/\*\*(.*?)\*\*/);
    const question = qMatch ? qMatch[1].trim() : block.trim();
    const options = [];
    const optionRegex = /([a-d]\)) ([^\n\*]+)/gi;
    let optMatch;
    while ((optMatch = optionRegex.exec(block))) {
      options.push(optMatch[2].trim());
    }
    const ansMatch = block.match(/\*\*Correct Answer:\*\* ([a-d])\)? ?([^\n\*]*)/i);
    let answerIdx = -1;
    if (ansMatch && ansMatch[1]) {
      answerIdx = ansMatch[1].toLowerCase().charCodeAt(0) - 97;
    } else if (ansMatch && ansMatch[2]) {
      answerIdx = ansMatch[2].toLowerCase().includes('true') ? 0 : 1;
    }
    questions.push({
      question: question,
      options: options.length > 0 ? options : null,
      answerIdx,
      answerText: ansMatch ? ansMatch[0].replace('**Correct Answer:**', '').trim() : ''
    });
    qIdx++;
  }
  return questions;
}

export default function QuizPage() {
  const { sessionId } = useParams();
  const [quiz, setQuiz] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [showScore, setShowScore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8080/api/pdf/generate-quiz/${sessionId}`)
      .then(res => {
        if (!res.ok) return res.text().then(t => { throw new Error(t); });
        return res.json();
      })
      .then(data => {
        setQuiz(data.quiz);
        const parsed = parseQuiz(data.quiz);
        setQuestions(parsed);
        setSelected(Array(parsed.length).fill(-1));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleOptionClick = (idx: number) => {
    const updated = [...selected];
    updated[current] = idx;
    setSelected(updated);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowScore(true);
    }
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const score = selected.filter((ans, i) => ans === questions[i]?.answerIdx).length;

  const handleRestart = () => {
    setCurrent(0);
    setSelected(Array(questions.length).fill(-1));
    setShowScore(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
      <Navbar currentView="upload" setCurrentView={() => navigate('/')} onSearch={() => {}} />
      <div className="max-w-3xl mx-auto p-8 pt-28">
        <Button variant="ghost" onClick={() => navigate('/upload')} className="mb-4">
          Back to Upload
        </Button>
        <div className="bg-white rounded-xl shadow-lg p-8 border border-yellow-200">
          <h1 className="text-2xl font-bold mb-4 text-yellow-800">Generated Quiz</h1>
          {loading && <div className="text-yellow-600">Loading quiz...</div>}
          {error && <div className="text-red-600">Error: {error}</div>}
          {!loading && !error && questions.length > 0 && !showScore && (
            <div>
              <div className="mb-4 font-semibold text-lg text-yellow-800">
                Question {current + 1} of {questions.length}
              </div>
              <div className="mb-4 text-lg">{questions[current].question}</div>
              {questions[current].options ? (
                <ul className="mb-4 space-y-2">
                  {questions[current].options.map((opt: string, idx: number) => (
                    <li key={idx}>
                      <Button
                        variant={selected[current] === idx ? "secondary" : "outline"}
                        onClick={() => handleOptionClick(idx)}
                        className="w-full text-left"
                      >
                        {String.fromCharCode(97 + idx)}) {opt}
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mb-4">(Open/True-False question)</div>
              )}
              <div className="flex gap-2">
                <Button onClick={handlePrev} disabled={current === 0}>Previous</Button>
                <Button onClick={handleNext} disabled={selected[current] === -1}>
                  {current === questions.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </div>
          )}
          {showScore && (
            <div>
              <h2 className="text-xl font-bold mb-2">Your Score: {score} / {questions.length}</h2>
              <h3 className="font-semibold mb-2">Analysis:</h3>
              <ul className="space-y-4">
                {questions.map((q, i) => (
                  <li key={i} className="bg-yellow-50 rounded p-3 border border-yellow-200">
                    <div className="font-medium">{q.question}</div>
                    {q.options && (
                      <div>Your answer: {q.options[selected[i]] || "No answer"}</div>
                    )}
                    <div>Correct answer: {q.options ? q.options[q.answerIdx] : q.answerText}</div>
                    <div>{selected[i] === q.answerIdx ? "✅ Correct" : "❌ Incorrect"}</div>
                  </li>
                ))}
              </ul>
              <Button className="mt-6" onClick={handleRestart}>Restart Quiz</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 