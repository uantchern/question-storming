import { useState, useEffect } from 'react';
import { Play, Zap, Brain, HelpCircle, Share2 } from 'lucide-react';

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

function SessionSetup({ onStart, initialScenario }) {
    const [scenario, setScenario] = useState(initialScenario || '');
    const [isParadox, setIsParadox] = useState(false);
    const [error, setError] = useState('');

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
        if (trimmed) {
            if (!validateQuestion(trimmed)) {
                setError('Please framework your challenge as a question (must contain "?" or a question word)');
                return; // block submission
            }
            setError('');
            onStart(trimmed, isParadox);
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
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem',
                    marginTop: '0.5rem'
                }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '8px', color: '#3b82f6', flexShrink: 0 }}>
                            <HelpCircle size={24} />
                        </div>
                        <div>
                            <h4 style={{ color: '#fff', margin: '0 0 0.5rem 0', fontWeight: '600', fontSize: '1rem' }}>1. Frame It</h4>
                            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
                                Enter your challenge as a clear question (Who, What, Why, How).
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '0.75rem', borderRadius: '8px', color: '#a855f7', flexShrink: 0 }}>
                            <Brain size={24} />
                        </div>
                        <div>
                            <h4 style={{ color: '#fff', margin: '0 0 0.5rem 0', fontWeight: '600', fontSize: '1rem' }}>2. Generate</h4>
                            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
                                Start Storming to iteratively explore deeper alternative questions.
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '0.75rem', borderRadius: '8px', color: '#22c55e', flexShrink: 0 }}>
                            <Share2 size={24} />
                        </div>
                        <div>
                            <h4 style={{ color: '#fff', margin: '0 0 0.5rem 0', fontWeight: '600', fontSize: '1rem' }}>3. Share</h4>
                            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
                                Select the most useful question and export it to WhatsApp.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="input-group">
                <div className="setup-fields">
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
                    disabled={!scenario.trim()}
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

