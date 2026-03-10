import { useState, useEffect, useRef } from 'react';
import { Send, AlertCircle, Clock, Brain, MessageCircle } from 'lucide-react';

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

const PRO_TIPS = [
    "Volume first: The more questions you generate, the better the final selection.",
    "Don't pause to answer. Reflection comes during the Review phase.",
    "Short questions are often the most powerful. Keep it punchy.",
    "Try starting with 'If...', 'Why...', or 'How...'",
    "The 12-minute mark (730s) is when your brain starts to break into new patterns.",
    "Roll the dice for a 13 is designed to break logic. Don't fight it—flow with it."
];

function StormingInterface({ scenario, isParadoxMode, onTimeUp, initialQuestions, onUpdateQuestions }) {
    const [selectedId, setSelectedId] = useState(null);
    const [isFinished, setIsFinished] = useState(false);
    const [constraintIndex, setConstraintIndex] = useState(0);
    const [tipIndex, setTipIndex] = useState(0);
    const [warning, setWarning] = useState('');
    const endOfListRef = useRef(null);

    // Constraint rotation (every 20s)
    useEffect(() => {
        if (!isParadoxMode) return;

        const constraintId = setInterval(() => {
            setConstraintIndex(prev => (prev + 1) % PARADOX_CONSTRAINTS.length);
        }, 20000);

        return () => clearInterval(constraintId);
    }, [isParadoxMode]);

    // Tip rotation (every 15s)
    useEffect(() => {
        const tipInterval = setInterval(() => {
            setTipIndex(prev => (prev + 1) % PRO_TIPS.length);
        }, 15000);

        return () => clearInterval(tipInterval);
    }, []);


    // Scroll to bottom on new question
    useEffect(() => {
        endOfListRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [initialQuestions.length]);

    // Time formatter removed

    const generateMoreQuestions = (selectedText) => {
        const templates = [
            `How would our most critical NCSS evaluator view this situation?`,
            `What if our biggest corporate sponsor completely withdrew funding?`,
            `How do we solve this in 30 days relying only on our current volunteer pool?`,
            `What fear holds the Board of Directors back from taking bold action?`,
            `How would a lean tech startup solve this with zero budget?`,
            `If we had to explain this to our beneficiaries, how would they react?`,
            `What sacred cow in our governance blocks the resolution?`,
            `If this challenge was a leak in our operation, where is the water coming from?`,
            `How does solving this make another department's work harder?`,
            `Is this challenge just a symptom of a deeper cultural issue?`,
            `What would the Charity Council say about this?`,
            `How can we fully automate this to free up our social workers?`,
            `What assumption makes us believe we are the only IPC who can solve this?`,
            `Why hasn't this been addressed in our last strategic review?`,
            `If we had to partner with another IPC to solve this, who would it be?`,
            `What is the absolute worst solution we could propose to our donors?`,
            `What is the 'Band-Aid' solution we keep applying instead of fixing the root cause?`,
            `What if answering this honestly meant we needed to change our constitution?`,
            `How does this look from the perspective of a brand new volunteer?`,
            `If our success depended entirely on solving this today, what is step one?`,
            `Who is the 'elephant in the room' when discussing this topic?`,
            `What if we did the exact opposite of what the sector expects us to do?`,
            `What is the hidden opportunity for a new fundraising angle here?`,
            `How would a completely unrelated industry (like F&B) solve this?`,
            `Are we overcomplicating this just to satisfy perceived compliance?`,
            `What unwritten rule of the Singapore charity sector are we blindly following?`,
            `How would we explain this challenge to a five-year-old?`,
            `If our Executive Director resigned tomorrow, how would this problem change?`,
            `What is the most expensive way we currently fail at this?`,
            `Could this problem actually be a blessing in disguise?`
        ];

        // Filter out templates that have already been generated to ensure uniqueness
        const existingTexts = new Set(initialQuestions.map(q => q.text));
        const availableTemplates = templates.filter(t => !existingTexts.has(t));

        // Fallback to full pool if we somehow run out of unique templates
        const pool = availableTemplates.length >= 3 ? availableTemplates : templates;

        // Shuffle templates
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3).map((text, idx) => ({
            id: Date.now().toString() + '-' + idx,
            text,
            starred: false,
            paradoxConstraint: isParadoxMode ? PARADOX_CONSTRAINTS[constraintIndex] : null
        }));
    };

    const handleYes = () => {
        if (!selectedId) {
            setWarning("Please select the most relevant question above first!");
            return;
        }
        setWarning('');
        const selectedText = initialQuestions.find(q => q.id === selectedId)?.text || scenario;
        const newQuestions = generateMoreQuestions(selectedText);
        onUpdateQuestions([...initialQuestions, ...newQuestions]);
        setSelectedId(null);
    };

    const handleNo = () => {
        if (!selectedId) {
            setWarning("Please select your favorite question before finishing.");
            return;
        }
        setWarning('');
        setIsFinished(true);
    };

    const handleWhatsApp = () => {
        if (!selectedId) {
            alert("Please select the question you want to WhatsApp!");
            return;
        }
        const winningQuestion = initialQuestions.find(q => q.id === selectedId);

        let text = `*Hi! I just used a Really Useful Thing from CharityOps.org to question storm a challenge.*\n\n`;
        text += `*Challenge:* ${scenario}\n`;
        if (isParadoxMode) text += `*Mode:* (Roll the dice for a 13)\n`;
        text += `\n*Winning Question:*\n${winningQuestion.text}\n`;
        text += `\n_Generated by Question Storming App_`;

        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/?text=${encodedText}`, '_blank');
        onTimeUp(initialQuestions);
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
                    <div className="scenario-text" style={{ color: 'var(--text-color)' }}>{scenario}</div>
                </div>
            </div>

            <div className="questions-list">
                {initialQuestions.slice(-3).map((q, i) => (
                    <div
                        key={q.id}
                        className={`question-card ${selectedId === q.id ? 'selected' : ''}`}
                        onClick={() => setSelectedId(q.id)}
                        style={{
                            cursor: 'pointer',
                            border: selectedId === q.id ? '2px solid #D2B48C' : '',
                            backgroundColor: selectedId === q.id ? 'rgba(210, 180, 140, 0.1)' : '',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <div className="question-number">{String(i + 1).padStart(2, '0')}</div>
                        <div className="question-content">{q.text}</div>
                    </div>
                ))}
            </div>

            {!isFinished ? (
                <div className="storm-again-prompt" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem', width: '100%' }}>

                    {warning && (
                        <div style={{ padding: '0.75rem', backgroundColor: '#FEF2F2', border: '1px solid #F87171', color: '#DC2626', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', animation: 'fadeIn 0.3s' }}>
                            <AlertCircle size={16} /> {warning}
                        </div>
                    )}

                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                        Select the most relevant question above, then choose to storm again or finish.
                    </p>
                    <button onClick={handleYes} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #D2B48C', backgroundColor: 'var(--surface-color)', color: 'var(--text-color)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease' }}>
                        <span style={{ fontSize: '1.2rem' }}>⚡</span> Storm Again
                    </button>
                    <button onClick={handleNo} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#334155', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Finish Session
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px', marginBottom: '16px', width: '100%' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '0px', fontSize: '15px', textAlign: 'center' }}>
                        Your session has concluded. Select the best question above.
                    </p>
                    <button onClick={handleWhatsApp} style={{ backgroundColor: '#25D366', color: 'white', fontWeight: 600, padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', transition: 'background-color 0.2s', border: 'none', cursor: 'pointer', width: '100%' }}>
                        <MessageCircle size={20} /> Share Details via WhatsApp
                    </button>
                    <button onClick={() => onTimeUp(initialQuestions)} style={{ backgroundColor: '#334155', color: 'white', fontWeight: 600, padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', width: '100%' }}>
                        Back to Menu
                    </button>
                </div>
            )}

            <div ref={endOfListRef} />
        </div>
    );
}

export default StormingInterface;
