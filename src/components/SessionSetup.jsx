import { useState, useEffect } from 'react';
import { Play, Zap, Brain } from 'lucide-react';

const PRESET_CHALLENGES = [
    "How can we reach out to more donors?",
    "How can we attract more volunteers?",
    "What is the biggest inefficiency in our operations?",
    "How do we diversify our funding sources?",
    "How can we improve board engagement?",
    "How do we effectively measure and report our impact?",
    "How can we retain our staff and prevent burnout?",
    "How do we increase our digital presence and awareness?",
    "How can we build strategic partnerships with corporates?",
    "How do we ensure long-term financial sustainability?"
];

function SessionSetup({ onStart, initialScenario, initialUserName }) {
    const [userName, setUserName] = useState(initialUserName || '');
    const [scenario, setScenario] = useState(initialScenario || '');
    const [isParadox, setIsParadox] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setUserName(initialUserName || '');
    }, [initialUserName]);

    useEffect(() => {
        setScenario(initialScenario || '');
    }, [initialScenario]);

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
            <div className="instructions-pane" style={{
                background: 'var(--surface-color)',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                textAlign: 'left'
            }}>
                <h2 style={{ 
                    fontSize: '1.75rem', 
                    marginBottom: '1.25rem', 
                    fontWeight: 700,
                    color: '#fff' 
                }}>Instructions</h2>
                <ol style={{ 
                    paddingLeft: '1.25rem', 
                    color: 'var(--text-muted)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.875rem', 
                    fontSize: '1rem',
                    margin: 0
                }}>
                    <li>Enter your <strong>Name</strong>.</li>
                    <li>Define your <strong>Challenge Scenario</strong> or select a common challenge below.</li>
                    <li>Ensure your challenge is formulated as a question (starts with Who, What, Where, When, Why, How, etc.).</li>
                    <li>Click <strong>Start Storming</strong> to begin generating questions.</li>
                </ol>
            </div>

            <form onSubmit={handleSubmit} className="input-group">
                <div className="setup-fields">
                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label htmlFor="storm-user-ident" className="field-label">
                            Your Name
                        </label>
                        <input
                            id="storm-user-ident"
                            name="storm-user-ident"
                            type="text"
                            autoComplete="off"
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

                    <div className="input-group" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                        <label className="field-label" style={{ marginBottom: '1rem', display: 'block' }}>
                            Or select from top 10 common challenges:
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                            {PRESET_CHALLENGES.map((challenge, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => {
                                        setScenario(challenge);
                                        setError('');
                                    }}
                                    style={{
                                        background: scenario === challenge ? 'rgba(210, 180, 140, 0.2)' : 'var(--surface-color)',
                                        border: `1px solid ${scenario === challenge ? '#D2B48C' : 'var(--border-color)'}`,
                                        padding: '0.75rem 1rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        color: scenario === challenge ? '#D2B48C' : 'var(--text-secondary)',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <div style={{
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '50%',
                                        border: `2px solid ${scenario === challenge ? '#D2B48C' : 'var(--text-secondary)'}`,
                                        background: scenario === challenge ? '#D2B48C' : 'transparent',
                                        flexShrink: 0
                                    }} />
                                    {challenge}
                                </div>
                            ))}
                        </div>
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

