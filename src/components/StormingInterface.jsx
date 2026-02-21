import { useState, useEffect, useRef } from 'react';
import { Send, AlertCircle, Clock } from 'lucide-react';

const PARADOX_CONSTRAINTS = [
    "Casualty Shift: How would this succeed if the effect happened before the cause?",
    "Structural Defiance: Describe this solution in a room with five 90-degree corners.",
    "Biological Anarchy: What if humans could breathe nitrogen instead of oxygen?",
    "Logical Singularity: Formulate a question that is simultaneously true and false.",
    "Static Momentum: Imagine a solution that moves at light speed while standing still.",
    "The Infinite Sieve: How do you solve this using an uncountable number of steps?",
    "Entropy Reversal: What if heat moved from cold to hot in this scenario?",
    "Sisyphus Oasis: Deliver water to a thirst that is exactly P=0. The cup is a lens, the map is a trap."
];

function StormingInterface({ scenario, isParadoxMode, initialDuration, onTimeUp, initialQuestions, onUpdateQuestions }) {
    const [timeLeft, setTimeLeft] = useState(initialDuration || 730);
    const [input, setInput] = useState('');
    const [error, setError] = useState('');
    const [constraintIndex, setConstraintIndex] = useState(0);
    const endOfListRef = useRef(null);

    // Timer logic and Constraint rotation
    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp(initialQuestions);
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        // Rotate constraints every 20 seconds in Paradox Mode
        let constraintId;
        if (isParadoxMode) {
            constraintId = setInterval(() => {
                setConstraintIndex(prev => (prev + 1) % PARADOX_CONSTRAINTS.length);
            }, 20000);
        }

        return () => {
            clearInterval(timerId);
            if (constraintId) clearInterval(constraintId);
        };
    }, [timeLeft, onTimeUp, initialQuestions, isParadoxMode]);

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
        const questionWords = ['who', 'what', 'where', 'when', 'why', 'how', 'if', 'could', 'would', 'should'];
        const lower = trimmed.toLowerCase();

        return questionWords.some(word => lower.startsWith(word));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = input.trim();

        if (!trimmed) return;

        if (!validateQuestion(trimmed)) {
            setError('Must end with "?" or start with a question word (Who, What, If, etc.)');
            return;
        }

        const newQuestion = {
            id: Date.now().toString(),
            text: trimmed,
            starred: false,
            paradoxConstraint: isParadoxMode ? PARADOX_CONSTRAINTS[constraintIndex] : null
        };

        onUpdateQuestions([...initialQuestions, newQuestion]);
        setInput('');
        setError('');
    };

    return (
        <div className={`storming-container fade-in ${isParadoxMode ? 'paradox-active' : ''}`}>
            {isParadoxMode && (
                <div className="paradox-overlay">
                    <div className="paradox-glitch-text">
                        <AlertCircle size={18} />
                        <span>CONSTRAINT: {PARADOX_CONSTRAINTS[constraintIndex]}</span>
                    </div>
                </div>
            )}

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
                            placeholder={isParadoxMode ? "Fracture reality with a question..." : "Type your question..."}
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
