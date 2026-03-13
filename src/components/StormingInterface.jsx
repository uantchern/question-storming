import { useState, useEffect, useRef } from 'react';
import { Send, AlertCircle, Clock, Brain, MessageCircle } from 'lucide-react';
import { generateDeepDiveQuestions } from '../questionPool';

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

function StormingInterface({ scenario, isParadoxMode, onTimeUp, initialQuestions, onUpdateQuestions, reasoning, onUpdateReasoning }) {
    const [selectedId, setSelectedId] = useState(null);
    const [isFinished, setIsFinished] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
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


    // Scroll to bottom only when new questions are generated
    useEffect(() => {
        if (initialQuestions.length > 3) {
            endOfListRef.current?.scrollIntoView({ behavior: 'smooth' });
        } else {
            // On fresh start, make sure we are at the top
            const chatWindow = document.querySelector('.chat-window');
            if (chatWindow) chatWindow.scrollTop = 0;
        }
    }, [initialQuestions.length]);

    // Time formatter removed

    const handleYes = async () => {
        const isInitialPhase = initialQuestions.length <= 3;
        if (!selectedId) {
            setWarning(`Please select the most relevant ${isInitialPhase ? 'scenario' : 'question'} above first!`);
            return;
        }

        setWarning('');
        setIsGenerating(true);
        const selectedText = initialQuestions.find(q => q.id === selectedId)?.text || (typeof scenario === 'object' ? scenario.subject : scenario);

        let newQuestionsText = await generateDeepDiveQuestions(selectedText, scenario);
        let newReasoning = "Analyzing selection against static CharityOps heuristic matrix...";

        const newQuestions = newQuestionsText.map((text, idx) => ({
            id: Date.now().toString() + '-' + idx,
            text,
            starred: false,
            paradoxConstraint: isParadoxMode ? PARADOX_CONSTRAINTS[constraintIndex] : null
        }));

        onUpdateQuestions([...initialQuestions, ...newQuestions]);
        if (onUpdateReasoning) onUpdateReasoning(newReasoning);
        setSelectedId(null);
        setIsGenerating(false);
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

        let scenarioText = typeof scenario === 'object' ? `${scenario.subject} • ${scenario.persona} • ${scenario.constraint}` : scenario;
        let text = `*Hi! I just used a Really Useful Thing (RUT) from CharityOps.org to question storm a challenge.*\n\n`;
        text += `*Challenge:* ${scenarioText}\n`;
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

            <div className="questions-list" style={{ marginTop: 0 }}>
                {initialQuestions.slice(-3).map((q, i) => (
                    <div
                        key={q.id}
                        className={`question-card ${selectedId === q.id ? 'selected' : ''}`}
                        onClick={() => { setSelectedId(q.id); window.selectedQuestionId = q.id; }}
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

            {initialQuestions.length > 3 && (
                <div style={{ marginTop: '1.5rem', textAlign: 'center', backgroundColor: 'rgba(210, 180, 140, 0.1)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #D2B48C', animation: 'fadeIn 0.5s ease-out' }}>
                    <p style={{ fontSize: '0.9rem', color: '#5E5A4B', margin: 0 }}>
                        <strong style={{ color: '#8B7355', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em', marginRight: '6px' }}>Tip:</strong>Pick the one that makes you feel the most uncomfortable—that's where the work is.
                    </p>
                </div>
            )}

            {!isFinished ? (
                <div className="storm-again-prompt" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem', width: '100%' }}>

                    {warning && (
                        <div style={{ padding: '0.75rem', backgroundColor: '#FEF2F2', border: '1px solid #F87171', color: '#DC2626', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', animation: 'fadeIn 0.3s' }}>
                            <AlertCircle size={16} /> {warning}
                        </div>
                    )}

                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                        {isGenerating ? (initialQuestions.length <= 3 ? "Generating initial questions..." : "Synthesizing deeper questions...") :
                            (initialQuestions.length <= 3 ? "Pick the scenario that feels the most real to you." : "Select the most relevant question above, then choose to storm again or finish.")}
                    </p>
                    <button onClick={handleYes} disabled={isGenerating} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #D2B48C', backgroundColor: isGenerating ? 'rgba(210, 180, 140, 0.3)' : 'var(--surface-color)', color: 'var(--text-color)', fontWeight: 600, cursor: isGenerating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease' }}>
                        <span style={{ fontSize: '1.2rem' }}>⚡</span> {isGenerating ? "Storming..." : (initialQuestions.length <= 3 ? "Storm Questions" : "Storm Again")}
                    </button>
                    {initialQuestions.length <= 3 && (
                        <button onClick={() => onTimeUp([])} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid transparent', backgroundColor: 'transparent', color: '#5E5A4B', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }} onMouseOver={e => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = '#1B2B28'; }} onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#5E5A4B'; }}>
                            Back to Menu / Regenerate
                        </button>
                    )}
                    {initialQuestions.length > 3 && (
                        <button onClick={handleNo} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#334155', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Finish Session
                        </button>
                    )}
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
