import { useState, useEffect } from 'react';
import SessionSetup from './components/SessionSetup';
import StormingInterface from './components/StormingInterface';
import ReviewMode from './components/ReviewMode';
import HistoryView from './components/HistoryView';
import SessionAnalysis from './components/SessionAnalysis';
import { Layout, History, ClipboardCheck, HelpCircle, X, ExternalLink } from 'lucide-react';
import { sql } from './db';

const APP_STATE_KEY = 'questionStormingState';

const HelpModal = ({ onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content help-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                <h2>Question Storming Guide</h2>
                <button className="close-btn" onClick={onClose}><X size={20} /></button>
            </div>
            <div className="modal-body">
                <section>
                    <h3><div className="help-step">1</div> Setup</h3>
                    <p>Enter a challenge or problem statement. The clearer the challenge, the better the questions will be. You can adjust the timer if you need more or less pressure.</p>
                </section>
                <section>
                    <h3><div className="help-step">2</div> Question Storming</h3>
                    <p>When the storm begins, focus entries on <strong>Questions Only</strong>. Don't answer them yet. The goal is volume and speed. Use "?" to trigger the engine.</p>
                </section>
                <section>
                    <h3><div className="help-step">3</div> Paradox Mode</h3>
                    <p>Feeling stuck? This mode injects reality-defying constraints that force you to view your challenge from impossible angles, shattering stagnant assumptions.</p>
                </section>
                <section>
                    <h3><div className="help-step">4</div> Review & Audit</h3>
                    <p>After the session, star the most impactful questions. Use the Audit Report to see statistical insights and export your session trail.</p>
                </section>
                <div className="help-footer">
                    <p>Question Storming (or Q-Storming) is based on the philosophy that often the right question is more valuable than the first answer.</p>
                </div>
            </div>
        </div>
    </div>
);

function App() {
    const [showHelp, setShowHelp] = useState(false);
    const [session, setSession] = useState(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('reset')) {
            localStorage.removeItem(APP_STATE_KEY);
            return {
                phase: 'SETUP',
                scenario: '',
                questions: [],
                isParadoxMode: false,
                duration: 730,
            };
        }

        const saved = localStorage.getItem(APP_STATE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Ensure duration is set if it was missing from old saved state
                if (parsed && parsed.duration === undefined) {
                    parsed.duration = 730;
                }
                return parsed;
            } catch (e) {
                console.error("Failed to parse saved session", e);
            }
        }
        return {
            phase: 'SETUP', // SETUP, STORMING, REVIEW, HISTORY
            scenario: '',
            questions: [],
            isParadoxMode: false,
            duration: 730,
        };
    });

    // Apply theme to body
    useEffect(() => {
        if (session.isParadoxMode) {
            document.body.classList.add('paradox-theme');
        } else {
            document.body.classList.remove('paradox-theme');
        }
    }, [session.isParadoxMode]);

    // Persist to local storage
    useEffect(() => {
        localStorage.setItem(APP_STATE_KEY, JSON.stringify(session));
    }, [session]);

    const saveSessionToDb = async (sessionData) => {
        try {
            await sql`
                INSERT INTO storm_sessions (scenario, is_paradox, questions, created_at)
                VALUES (${sessionData.scenario}, ${sessionData.isParadoxMode}, ${JSON.stringify(sessionData.questions)}, ${new Date().toISOString()})
            `;
            console.log("Session saved to Neon successfully");
        } catch (error) {
            console.error("Error saving session to Neon:", error.message);
        }
    };

    const handleStartStorm = (scenario, isParadoxMode, duration) => {
        setSession({ phase: 'STORMING', scenario, questions: [], isParadoxMode, duration });
    };

    const handleTimerEnd = (questions) => {
        const updatedSession = { ...session, phase: 'REVIEW', questions };
        setSession(updatedSession);
        // Async save to DB
        saveSessionToDb(updatedSession);
    };

    const handleReset = () => {
        setSession({ phase: 'SETUP', scenario: '', questions: [], isParadoxMode: false, duration: 730 });
    };

    const openHistory = () => {
        setSession(prev => ({ ...prev, phase: 'HISTORY' }));
    };

    const handleGoToAnalysis = (updatedQuestions) => {
        setSession(prev => ({ ...prev, phase: 'ANALYSIS', questions: updatedQuestions }));
    };

    return (
        <div className={`app-container ${session.isParadoxMode ? 'paradox-theme' : ''}`}>
            <header className="app-header">
                <div className="brand" style={{ cursor: 'pointer' }} onClick={handleReset}>
                    <Layout className="brand-icon" />
                    <h1>Question Storming {session.isParadoxMode && <span className="paradox-label">PARADOX</span>}</h1>
                </div>
                <div className="header-actions">
                    <button className="icon-btn" onClick={() => setShowHelp(true)} title="Information Guide">
                        <HelpCircle size={20} />
                    </button>
                    {session.phase === 'SETUP' && (
                        <button className="icon-btn" onClick={openHistory} title="View History">
                            <History size={20} />
                        </button>
                    )}
                    {session.phase !== 'SETUP' && session.phase !== 'STORMING' && (
                        <button className="reset-btn" onClick={handleReset}>New Session</button>
                    )}
                </div>
            </header>

            <main className="main-content">
                {session.phase === 'SETUP' && (
                    <SessionSetup onStart={handleStartStorm} initialScenario={session.scenario} />
                )}

                {session.phase === 'STORMING' && (
                    <StormingInterface
                        scenario={session.scenario}
                        isParadoxMode={session.isParadoxMode}
                        initialDuration={session.duration}
                        initialQuestions={session.questions}
                        onTimeUp={handleTimerEnd}
                        onUpdateQuestions={(qs) => setSession(prev => ({ ...prev, questions: qs }))}
                    />
                )}

                {session.phase === 'REVIEW' && (
                    <ReviewMode
                        scenario={session.scenario}
                        questions={session.questions}
                        isParadoxMode={session.isParadoxMode}
                        onGoToAnalysis={handleGoToAnalysis}
                    />
                )}

                {session.phase === 'ANALYSIS' && (
                    <SessionAnalysis
                        session={session}
                        onBack={() => setSession(prev => ({ ...prev, phase: 'REVIEW' }))}
                    />
                )}

                {session.phase === 'HISTORY' && (
                    <HistoryView onBack={handleReset} />
                )}
            </main>

            {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
        </div>
    );
}

export default App;

