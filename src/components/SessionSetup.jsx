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
        <div className="setup-container fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ul className="instructions-list" style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0' }}>
                <li style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '16px', fontSize: '15px', color: '#5E5A4B', lineHeight: '1.5' }}>
                    <div style={{ color: '#D2B48C', marginTop: '2px', width: '24px', textAlign: 'center' }}>
                        <HelpCircle size={22} />
                    </div>
                    <div><strong>Frame It</strong> as a clear question (Who, What, Why, How).</div>
                </li>
                <li style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '16px', fontSize: '15px', color: '#5E5A4B', lineHeight: '1.5' }}>
                    <div style={{ color: '#D2B48C', marginTop: '2px', width: '24px', textAlign: 'center' }}>
                        <Brain size={22} />
                    </div>
                    <div><strong>Generate</strong> iterative, deeper alternative questions.</div>
                </li>
                <li style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '16px', fontSize: '15px', color: '#5E5A4B', lineHeight: '1.5' }}>
                    <div style={{ color: '#D2B48C', marginTop: '2px', width: '24px', textAlign: 'center' }}>
                        <Share2 size={22} />
                    </div>
                    <div><strong>Share</strong> the most useful question to WhatsApp.</div>
                </li>
            </ul>

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
                    className={`primary-btn`}
                    disabled={!scenario.trim()}
                    style={{ marginTop: 'auto', backgroundColor: '#1B2B28', color: 'white', border: 'none', padding: '16px', fontSize: '16px', fontWeight: 600, borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', boxShadow: '0 4px 12px rgba(27, 43, 40, 0.2)' }}
                >
                    <Play size={20} />
                    Start Storming
                </button>
            </form>
        </div>
    );
}

export default SessionSetup;

