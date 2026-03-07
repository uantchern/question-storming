import { useState } from 'react';
import { Play, Zap, Brain, HelpCircle } from 'lucide-react';

function SessionSetup({ onStart, initialScenario, initialUserName }) {
    const [userName, setUserName] = useState(initialUserName || '');
    const [scenario, setScenario] = useState(initialScenario || '');
    const [isParadox, setIsParadox] = useState(false);
    const [error, setError] = useState('');

    const validateQuestion = (text) => {
        const trimmed = text.trim();
        if (!trimmed) return false;

        if (trimmed.endsWith('?')) return true;

        const questionWords = ['who', 'what', 'where', 'when', 'why', 'how', 'if', 'could', 'would', 'should', 'is', 'are', 'do', 'does', 'can'];
        const lower = trimmed.toLowerCase();

        // Check if starts with question word
        return questionWords.some(word => lower.startsWith(word) || lower.indexOf('\n' + word) !== -1 || lower.match(new RegExp('\\b' + word + '\\b')));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = scenario.trim();
        if (trimmed && userName.trim()) {
            if (!validateQuestion(trimmed)) {
                setError('Please framework your challenge as a question (must contain "?" or a question word)');
                return; // block submission
            }
            setError('');
            onStart(trimmed, isParadox, userName.trim());
        }
    };

    return (
        <div className="setup-container fade-in">
            <div className="setup-header">
                <h2>What's the challenge?</h2>
                <p>Define your problem statement before the storm begins.</p>
            </div>

            <form onSubmit={handleSubmit} className="input-group">
                <div className="setup-fields">
                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label htmlFor="userName" className="field-label">
                            Your Name
                            <span className="tooltip-container" data-tooltip="Enter your name to log this session.">
                                <HelpCircle size={14} className="info-icon" />
                            </span>
                        </label>
                        <input
                            id="userName"
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="e.g., Alice"
                            style={{
                                padding: '1rem',
                                background: 'var(--surface-color)',
                                border: '2px solid var(--border-color)',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '1rem',
                                width: '100%'
                            }}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="scenario" className="field-label">
                            Challenge Scenario
                            <span className="tooltip-container" data-tooltip="Clearly describe the problem or goal you want to explore with questions.">
                                <HelpCircle size={14} className="info-icon" />
                            </span>
                        </label>
                        <textarea
                            id="scenario"
                            value={scenario}
                            onChange={(e) => {
                                setScenario(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="e.g., Why is Key Word Sign not widely known?"
                            rows={4}
                            autoFocus
                            required
                        />
                        {error && (
                            <div className="validation-msg" style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ff4d4f', fontSize: '0.9rem' }}>
                                <HelpCircle size={14} />
                                {error}
                            </div>
                        )}
                    </div>

                </div>



                <button
                    type="submit"
                    className={`primary-btn ${isParadox ? 'paradox-btn' : ''}`}
                    disabled={!scenario.trim() || !userName.trim()}
                    style={{ marginTop: '1rem' }}
                >
                    <Play size={20} />
                    Start {isParadox ? "Let's Q-Storm!" : 'Storming'}
                </button>
            </form>
        </div>
    );
}

export default SessionSetup;

