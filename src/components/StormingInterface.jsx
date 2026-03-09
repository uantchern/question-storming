import { useState, useEffect, useRef } from 'react';
import { Send, AlertCircle, Clock, Brain } from 'lucide-react';

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
            `If answering "${selectedText}" was strictly illegal, what backdoor approach would we take?`,
            `What is the most painfully obvious solution to "${scenario}" that we are too proud or polite to try?`,
            `How would our fiercest competitor or harshest critic exploit: "${selectedText}"?`,
            `What underlying fear is actually driving us to ask: "${selectedText}" rather than acting?`,
            `If we had unlimited budget but only 24 hours, how would we handle: "${scenario}"?`,
            `Who is the least qualified person we could ask about "${selectedText}", and what brilliant mistake might they suggest?`,
            `How does solving "${selectedText}" actually make "${scenario}" worse in the long run?`,
            `What is the brutal 'Band-Aid' solution to "${scenario}", and why haven't we used it yet?`,
            `If completely solving "${selectedText}" meant making ourselves obsolete, would we still do it?`,
            `What would a lazy but exceptionally brilliant person do about: "${scenario}"?`,
            `How can we completely automate, outsource, or eliminate the need to answer: "${selectedText}"?`,
            `What sacred organizational 'cow' must we slaughter to finally resolve: "${scenario}"?`,
            `If "${selectedText}" was actually just a symptom, what is the fatal underlying disease?`,
            `How would a rebellious teenager radically misunderstand and inadvertently solve: "${scenario}"?`,
            `What happens if we deliberately do absolutely nothing about "${selectedText}" for the next 5 years?`
        ];

        // Shuffle templates
        const shuffled = [...templates].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3).map((text, idx) => ({
            id: Date.now().toString() + '-' + idx,
            text,
            starred: false,
            paradoxConstraint: isParadoxMode ? PARADOX_CONSTRAINTS[constraintIndex] : null
        }));
    };

    const handleYes = () => {
        if (!selectedId) {
            alert("Please select the most relevant question first!");
            return;
        }
        const selectedText = initialQuestions.find(q => q.id === selectedId)?.text || scenario;
        const newQuestions = generateMoreQuestions(selectedText);
        onUpdateQuestions([...initialQuestions, ...newQuestions]);
        setSelectedId(null);
    };

    const handleNo = () => {
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
                    <div className="scenario-text">{scenario}</div>
                </div>
            </div>

            {!isFinished ? (
                <div className="storm-again-prompt" style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '0.5rem', color: 'white', fontSize: '1.2rem' }}>Storm again?</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Select the most relevant question below, then click Yes to build 3 more questions!</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button className="primary-btn" style={{ minWidth: '120px' }} onClick={handleYes}>Yes</button>
                        <button className="secondary-btn" style={{ minWidth: '120px', background: 'transparent', border: '1px solid var(--border-color)', color: 'white' }} onClick={handleNo}>No</button>
                    </div>
                </div>
            ) : (
                <div className="storm-again-prompt" style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '2rem', background: 'var(--surface-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ marginBottom: '0.5rem', color: '#10b981', fontSize: '1.2rem' }}>Ready to Share!</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Click the single best question below that you want to share, then hit the button.</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button className="primary-btn" style={{ minWidth: '200px', background: '#25D366' }} onClick={handleWhatsApp}>
                            Share to WhatsApp
                        </button>
                    </div>
                </div>
            )}

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
                <div ref={endOfListRef} />
            </div>
        </div>
    );
}

export default StormingInterface;
