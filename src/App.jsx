import { useState, useEffect } from 'react';
import SessionSetup from './components/SessionSetup';
import StormingInterface from './components/StormingInterface';
import ReviewMode from './components/ReviewMode';
import SessionAnalysis from './components/SessionAnalysis';
import { Layout, ClipboardCheck, X, ExternalLink } from 'lucide-react';

const APP_STATE_KEY = 'questionStormingState';

function App() {
    const [session, setSession] = useState(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlPrompt = urlParams.get('prompt');

        if (urlParams.has('reset')) {
            localStorage.removeItem(APP_STATE_KEY);
            return {
                phase: 'SETUP',
                scenario: urlPrompt || '',
                questions: [],
                isParadoxMode: false,
                targetCount: 10,
            };
        }

        const saved = localStorage.getItem(APP_STATE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Ensure targetCount is set if old saved state
                if (parsed && parsed.targetCount === undefined) {
                    parsed.targetCount = 10;
                }
                return parsed;
            } catch (e) {
                console.error("Failed to parse saved session", e);
            }
        }
        return {
            phase: 'SETUP', // SETUP, STORMING, REVIEW, HISTORY
            scenario: urlPrompt || '',
            questions: [],
            isParadoxMode: false,
            targetCount: 10,
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

    const handleStartStorm = (scenario, isParadoxMode) => {
        const initialQuestions = [
            { id: Date.now().toString() + '-1', text: "What unspoken truth are we ignoring?", starred: false, paradoxConstraint: null },
            { id: Date.now().toString() + '-2', text: "What if the problem vanished tomorrow?", starred: false, paradoxConstraint: null },
            { id: Date.now().toString() + '-3', text: "Who profits from the status quo?", starred: false, paradoxConstraint: null }
        ];
        setSession({ phase: 'STORMING', scenario, questions: initialQuestions, isParadoxMode });
    };

    const handleTimerEnd = (questions) => {
        setSession({ phase: 'SETUP', scenario: '', questions: [], isParadoxMode: false, targetCount: 10 });
    };

    const handleReset = async () => {
        setSession(prev => ({ phase: 'SETUP', scenario: '', questions: [], isParadoxMode: false, targetCount: 10 }));
    };

    const handleGoToAnalysis = (updatedQuestions) => {
        setSession(prev => ({ ...prev, phase: 'ANALYSIS', questions: updatedQuestions }));
    };

    return (
        <div className={`app-container ${session.isParadoxMode ? 'paradox-theme' : ''}`}>
            <div className={`setup-pane ${session.phase !== 'SETUP' ? 'started' : ''}`} id="debugDrawer">
                <div className="font-serif text-3xl leading-none cursor-default select-none group" style={{ fontFamily: 'Georgia, serif', marginBottom: '1.5rem' }}>
                    <span className="relative inline-block" style={{ position: 'relative', display: 'inline-block' }}>
                        <span className="italic relative z-10" style={{ color: '#103020', fontWeight: 500, paddingRight: '0.25rem', position: 'relative', zIndex: 10, fontStyle: 'italic' }}>Charity</span>
                        <span style={{ position: 'absolute', left: '-0.2em', right: 0, bottom: '12%', height: '2px', background: '#B08968', zIndex: 0, transformOrigin: 'left', transition: 'transform 0.7s ease-out' }}></span>
                    </span><span className="relative z-10 tracking-tight" style={{ color: '#B08968', position: 'relative', zIndex: 10, fontWeight: 400, letterSpacing: '-0.025em', marginLeft: '-0.05em' }}>Ops</span>
                </div>

                <h1 style={{ fontSize: '28px', color: '#1B2B28', fontWeight: 800, marginBottom: '8px', fontFamily: 'Georgia, serif' }}>
                    Question Storming {session.isParadoxMode && <span className="paradox-label" style={{ fontSize: '12px' }}>ROLL THE DICE FOR A 13</span>}
                </h1>
                <p className="tagline" style={{ color: '#8B7355', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '30px' }}>
                    <span style={{ marginRight: '0.5rem' }}>✦</span> A Really Useful Thing
                </p>

                <SessionSetup onStart={handleStartStorm} initialScenario={session.scenario} isStarted={session.phase !== 'SETUP'} />
            </div>

            <div className={`chat-pane ${session.phase !== 'SETUP' ? 'started' : ''}`} id="chatContainer">
                <div className="chat-header" style={{ backgroundColor: '#1B2B28', padding: '20px 24px', display: 'flex', alignItems: 'center', color: 'white', gap: '12px' }}>
                    <button onClick={handleReset} className="mobile-back-btn" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'white' }}>
                        <span style={{ fontSize: '1.25rem' }}>←</span>
                    </button>
                    <div style={{ width: '32px', height: '32px', borderRadius: '9999px', background: '#8B7355', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', border: '1px solid #D2B48C', overflow: 'hidden' }}>
                        <span style={{ color: 'white' }}>QS</span>
                    </div>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0, flexGrow: 1, fontFamily: 'Georgia, serif' }}>Session Viewer</h2>
                </div>

                {session.phase === 'SETUP' ? (
                    <div className="chat-window" style={{ backgroundColor: '#F9F8F6', flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.6, textAlign: 'center', color: '#5E5A4B' }}>
                            <div style={{ fontSize: '3.75rem', marginBottom: '1rem', color: '#D2B48C' }}>📋</div>
                            <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>Ready to storm.</p>
                            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Enter a challenge and click "Start Storming" to begin.</p>
                        </div>
                    </div>
                ) : (
                    <StormingInterface
                        scenario={session.scenario}
                        isParadoxMode={session.isParadoxMode}
                        initialQuestions={session.questions}
                        onTimeUp={handleTimerEnd}
                        onUpdateQuestions={(qs) => setSession(prev => ({ ...prev, questions: qs }))}
                    />
                )}
            </div>
        </div>
    );
}

export default App;

