import { useState, useEffect } from 'react';
import { Play, Zap, Brain, HelpCircle, Share2 } from 'lucide-react';

const TOP_TOPICS = [
    {
        label: "1. Impact: Are programs making a real impact on beneficiaries?",
        subject: "Making a real impact on our beneficiaries",
        persona: "Beneficiaries",
        constraint: "Difficulty proving tangible long-term impact"
    },
    {
        label: "2. Reserves: How do we build reserves & how much do we need?",
        subject: "Building up financial reserves",
        persona: "Board / Donors",
        constraint: "Uncertainty on quantum and optics of holding cash"
    },
    {
        label: "3. Fundraising: Same events every year, can we change & why?",
        subject: "Changing successful but stale fundraising events",
        persona: "Donors",
        constraint: "Fear of losing revenue if we pivot to something new"
    },
    {
        label: "4. Purpose: Are we serving our purpose & do we agree on it?",
        subject: "Aligning collectively on our true purpose",
        persona: "Board / Staff",
        constraint: "Legacy mindsets and mission drift"
    },
    {
        label: "5. Talent: Can't attract staff - low pay or poor branding?",
        subject: "Failing to attract staff",
        persona: "Prospective Staff",
        constraint: "Low pay / Unattractive employer branding"
    }
];

function SessionSetup({ onStart, initialScenario, isStarted }) {
    const [subject, setSubject] = useState(initialScenario?.subject || '');
    const [persona, setPersona] = useState(initialScenario?.persona || '');
    const [constraint, setConstraint] = useState(initialScenario?.constraint || '');
    const [selectedPreset, setSelectedPreset] = useState('');
    const [isParadox, setIsParadox] = useState(false);
    const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
    const [error, setError] = useState('');

    const handleTopicSelect = (e) => {
        const idx = e.target.value;
        setSelectedPreset(idx);

        if (idx === '') {
            setSubject('');
            setPersona('');
            setConstraint('');
            return;
        }

        const topic = TOP_TOPICS[idx];
        setSubject(topic.subject);
        setPersona(topic.persona);
        setConstraint(topic.constraint);
    };

    useEffect(() => {
        if (initialScenario && typeof initialScenario === 'object') {
            setSubject(initialScenario.subject || '');
            setPersona(initialScenario.persona || '');
            setConstraint(initialScenario.constraint || '');
        }
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
        if (!apiKey.trim()) {
            setError('Please provide a Gemini API Key to use the generative features.');
            return;
        }
        if (subject.trim() && persona.trim() && constraint.trim()) {
            setError('');
            localStorage.setItem('gemini_api_key', apiKey.trim());
            onStart({ subject: subject.trim(), persona: persona.trim(), constraint: constraint.trim() }, isParadox, apiKey.trim());
        } else {
            setError('Please fill in Subject, Persona, and Constraint.');
        }
    };

    return (
        <div className="setup-container fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#8B7355', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Zap size={14} /> RUT: A Really Useful Thing
                </div>
                <h1 style={{ fontSize: '28px', fontFamily: 'Georgia, serif', fontWeight: 900, color: '#1B2B28', margin: '0 0 16px 0', lineHeight: 1.2 }}>
                    The Question Stormer
                </h1>
                <p style={{ fontSize: '14px', color: '#5E5A4B', lineHeight: '1.6', margin: 0 }}>
                    Challenge entrenched mindsets and spark new ideas. Enter your core subject, target persona, and a constraint, and our AI will force a breakthrough.
                </p>
            </div>

            {!isStarted && (
                <form onSubmit={handleSubmit} className="input-group setup-form">
                    <div className="setup-fields" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                        <label htmlFor="preset" className="field-label" style={{ display: 'block', fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em', color: '#8B7355', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Quick Start: Top 5 Sector Issues
                        </label>
                        <select
                            id="preset"
                            value={selectedPreset}
                            onChange={handleTopicSelect}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #D2B48C', fontSize: '14px', color: '#1B2B28', backgroundColor: '#F9F8F6', marginBottom: '24px', cursor: 'pointer', outline: 'none' }}
                        >
                            <option value="">✍️ Custom / Enter my own...</option>
                            {TOP_TOPICS.map((t, idx) => (
                                <option key={idx} value={idx}>{t.label}</option>
                            ))}
                        </select>

                        <label htmlFor="subject" className="field-label" style={{ display: 'block', fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em', color: '#8B7355', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Core Subject
                        </label>
                        <input
                            type="text"
                            id="subject"
                            value={subject}
                            onChange={(e) => { setSubject(e.target.value); setSelectedPreset(''); }}
                            placeholder="e.g., Retention, Technology, Fundraising"
                            autoFocus
                            required
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #D2B48C', fontSize: '15px', color: '#1B2B28', backgroundColor: 'white', marginBottom: '20px' }}
                        />

                        <label htmlFor="persona" className="field-label" style={{ display: 'block', fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em', color: '#8B7355', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Target Persona
                        </label>
                        <input
                            type="text"
                            id="persona"
                            value={persona}
                            onChange={(e) => { setPersona(e.target.value); setSelectedPreset(''); }}
                            placeholder="e.g., Staff, Donors, Volunteers"
                            required
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #D2B48C', fontSize: '15px', color: '#1B2B28', backgroundColor: 'white', marginBottom: '20px' }}
                        />

                        <label htmlFor="constraint" className="field-label" style={{ display: 'block', fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em', color: '#8B7355', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Limitation / Constraint
                        </label>
                        <input
                            type="text"
                            id="constraint"
                            value={constraint}
                            onChange={(e) => { setConstraint(e.target.value); setSelectedPreset(''); }}
                            placeholder="e.g., Budget, Bureaucracy, Time"
                            required
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #D2B48C', fontSize: '15px', color: '#1B2B28', backgroundColor: 'white', marginBottom: '20px' }}
                        />

                        <label htmlFor="apiKey" className="field-label" style={{ display: 'block', fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em', color: '#8B7355', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Gemini API Key (Required)
                        </label>
                        <input
                            type="password"
                            id="apiKey"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="AIzaSy..."
                            required
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #D2B48C', fontSize: '15px', color: '#1B2B28', backgroundColor: 'white' }}
                        />

                        {error && (
                            <div className="validation-msg" style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.875rem' }}>
                                <HelpCircle size={14} />
                                {error}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="primary-btn"
                        disabled={!subject.trim() || !persona.trim() || !constraint.trim()}
                        style={{ backgroundColor: '#1B2B28', color: 'white', border: 'none', padding: '16px', fontSize: '16px', fontWeight: 600, borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', boxShadow: '0 4px 12px rgba(27, 43, 40, 0.2)', transition: 'transform 0.2s ease, background-color 0.2s ease' }}
                    >
                        <Play size={20} />
                        Start Storming
                    </button>
                </form>
            )}
        </div>
    );
}

export default SessionSetup;

