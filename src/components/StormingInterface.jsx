import { useState, useEffect, useRef } from 'react';
import { Send, AlertCircle, Clock } from 'lucide-react';

const DURATION = 4 * 60; // 4 minutes in seconds

function StormingInterface({ scenario, onTimeUp, initialQuestions, onUpdateQuestions }) {
    const [timeLeft, setTimeLeft] = useState(DURATION);
    const [input, setInput] = useState('');
    const [error, setError] = useState('');
    const endOfListRef = useRef(null);

    // Timer logic
    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp(initialQuestions);
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, onTimeUp, initialQuestions]);

    // Scroll to bottom on new question
    useEffect(() => {
        endOfListRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [initialQuestions.length]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const validateQuestion = (text) => {
        const trimmed = text.trim();
        if (!trimmed) return false;

        // Must end with a question mark
        if (trimmed.endsWith('?')) return true;

        // OR start with Wh- word or How
        const questionWords = ['who', 'what', 'where', 'when', 'why', 'how'];
        const lower = trimmed.toLowerCase();

        return questionWords.some(word => lower.startsWith(word));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = input.trim();

        if (!trimmed) return;

        if (!validateQuestion(trimmed)) {
            setError('Must end with "?" or start with a question word (Who, What, Where, etc.)');
            return;
        }

        const newQuestion = {
            id: Date.now().toString(),
            text: trimmed,
            starred: false
        };

        onUpdateQuestions([...initialQuestions, newQuestion]);
        setInput('');
        setError('');
    };

    return (
        <div className="storming-container fade-in">
            <div className="storming-header">
                <div className="scenario-display">
                    <div className="scenario-label">Challenge</div>
                    <div className="scenario-text">{scenario}</div>
                </div>
                <div className={`timer-display ${timeLeft < 30 ? 'low-time' : ''}`}>
                    <Clock size={24} />
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="input-section">
                <form onSubmit={handleSubmit} className="question-form">
                    <div className="question-input-wrapper">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="Type your question..."
                            autoFocus
                            autoComplete="off"
                        />
                        {error && (
                            <div className="validation-msg">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}
                    </div>
                    <button type="submit" className="submit-btn" disabled={!input.trim()} title="Fire question">
                        <Send size={20} />
                    </button>
                </form>
            </div>

            <div className="questions-list">
                {initialQuestions.map((q, i) => (
                    <div key={q.id} className="question-card">
                        <div className="question-number">{String(i + 1).padStart(2, '0')}</div>
                        <div className="question-content">{q.text}</div>
                    </div>
                ))}
                <div ref={endOfListRef} />
            </div>
        </div>
    );
}

export default StormingInterface;
