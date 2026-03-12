import { useState, useEffect } from 'react';
import SessionSetup from './components/SessionSetup';
import StormingInterface from './components/StormingInterface';
import ReviewMode from './components/ReviewMode';
import SessionAnalysis from './components/SessionAnalysis';
import { getRandomQuestions } from './questionPool';
import { generateGeminiQuestions } from './geminiApi';
import { Layout, ClipboardCheck, X, ExternalLink } from 'lucide-react';

const APP_STATE_KEY = 'questionStormingState_v2';

function App() {
    const [isStarting, setIsStarting] = useState(false);
    const [session, setSession] = useState(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlPrompt = urlParams.get('prompt');

        if (urlParams.has('reset')) {
            localStorage.removeItem(APP_STATE_KEY);
            return {
                phase: 'SETUP',
                scenario: { subject: urlPrompt || '', persona: '', constraint: '' },
                questions: [],
                isParadoxMode: false,
                targetCount: 10,
            };
        }

        const saved = localStorage.getItem(APP_STATE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Invalidate old state if it uses the legacy string scenario format
                if (parsed && typeof parsed.scenario === 'string' && parsed.scenario !== '') {
                    localStorage.removeItem(APP_STATE_KEY);
                    console.warn("Invalidated legacy string-based scenario state.");
                    return {
                        phase: 'SETUP',
                        scenario: { subject: '', persona: '', constraint: '' },
                        questions: [],
                        isParadoxMode: false,
                        targetCount: 10,
                        apiKey: ''
                    };
                }

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
            scenario: { subject: '', persona: '', constraint: '' },
            questions: [],
            isParadoxMode: false,
            targetCount: 10,
            apiKey: '',
            reasoning: ''
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

    const handleStartStorm = async (scenario, isParadoxMode, apiKey = '') => {
        setIsStarting(true);
        const activeApiKey = apiKey || (import.meta.env ? import.meta.env.VITE_GEMINI_API_KEY : '');
        let randomQuestions = [];
        let generatedReasoning = '';

        if (activeApiKey) {
            const geminiQs = await generateGeminiQuestions(scenario, scenario, activeApiKey, isParadoxMode, null);
            if (geminiQs && geminiQs.items) {
                 randomQuestions = geminiQs.items;
                 generatedReasoning = geminiQs.reasoning;
            } else if (geminiQs) {
                 randomQuestions = geminiQs;
            }
        }
        if (randomQuestions.length === 0) {
            randomQuestions = getRandomQuestions(3, [], scenario);
            generatedReasoning = "Used static offline fallbacks, no live AI reasoning available.";
        }

        const initialQuestions = randomQuestions.map((text, index) => ({
            id: Date.now().toString() + '-' + index,
            text: text,
            starred: false,
            paradoxConstraint: null
        }));

        setSession({ phase: 'STORMING', scenario, questions: initialQuestions, isParadoxMode, apiKey: activeApiKey, targetCount: 10, reasoning: generatedReasoning });
        setIsStarting(false);
    };

    const handleTimerEnd = (questions) => {
        setSession({ phase: 'SETUP', scenario: { subject: '', persona: '', constraint: '' }, questions: [], isParadoxMode: false, targetCount: 10 });
    };

    const handleReset = async () => {
        setSession(prev => ({ phase: 'SETUP', scenario: { subject: '', persona: '', constraint: '' }, questions: [], isParadoxMode: false, targetCount: 10 }));
    };

    const handleGoToAnalysis = (updatedQuestions) => {
        setSession(prev => ({ ...prev, phase: 'ANALYSIS', questions: updatedQuestions }));
    };

    return (
        <div className={`app-container ${session.isParadoxMode ? 'paradox-theme' : ''}`}>
            <div className={`setup-pane ${session.phase !== 'SETUP' ? 'started' : ''}`} id="debugDrawer">
                <div className="font-serif text-3xl leading-none cursor-default select-none group" style={{ fontFamily: 'Georgia, serif', marginBottom: '1rem' }}>
                    <span className="relative inline-block" style={{ position: 'relative', display: 'inline-block' }}>
                        <span className="italic relative z-10" style={{ color: '#103020', fontWeight: 500, paddingRight: '0.25rem', position: 'relative', zIndex: 10, fontStyle: 'italic' }}>Charity</span>
                        <span style={{ position: 'absolute', left: '-0.2em', right: 0, bottom: '12%', height: '2px', background: '#B08968', zIndex: 0, transformOrigin: 'left', transition: 'transform 0.7s ease-out' }}></span>
                    </span><span className="relative z-10 tracking-tight" style={{ color: '#B08968', position: 'relative', zIndex: 10, fontWeight: 400, letterSpacing: '-0.025em', marginLeft: '-0.05em' }}>Ops</span>
                </div>
                <SessionSetup onStart={handleStartStorm} initialScenario={session.scenario} isStarted={session.phase !== 'SETUP'} />
                {isStarting && <div style={{ marginTop: '16px', color: '#B08968', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>Connecting to AI Model...</div>}
            </div>

            <div className={`chat-pane ${session.phase !== 'SETUP' ? 'started' : ''}`} id="chatContainer">
                {session.phase === 'SETUP' ? (
                    <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.7, margin: 'auto' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#F2EFE9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#8B7355' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontFamily: 'Georgia, serif', color: '#1B2B28', marginBottom: '8px', fontWeight: 600 }}>Ready to storm questions</h3>
                            <p style={{ color: '#5E5A4B', fontSize: '0.875rem', maxWidth: '320px', lineHeight: 1.5 }}>Fill out the details on the left and click Start Storming to see your scenario generation here.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="chat-header" style={{ backgroundColor: '#1B2B28', padding: '20px 24px', display: 'flex', alignItems: 'center', color: 'white', gap: '12px' }}>
                            <button onClick={handleReset} className="mobile-back-btn" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'white' }}>
                                <span style={{ fontSize: '1.25rem' }}>←</span>
                            </button>
                            <div style={{ width: '32px', height: '32px', borderRadius: '9999px', background: '#8B7355', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', border: '1px solid #D2B48C', overflow: 'hidden' }}>
                                <span style={{ color: 'white' }}>QS</span>
                            </div>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0, flexGrow: 1, fontFamily: 'Georgia, serif' }}>Session Viewer</h2>
                        </div>

                        <div className="chat-window" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', flex: 1, overflowY: 'auto', padding: '24px', paddingBottom: '40px', position: 'relative' }}>
                            <StormingInterface
                                scenario={session.scenario}
                                isParadoxMode={session.isParadoxMode}
                                initialQuestions={session.questions}
                                apiKey={session.apiKey}
                                reasoning={session.reasoning}
                                onTimeUp={handleTimerEnd}
                                onUpdateQuestions={(qs) => setSession(prev => ({ ...prev, questions: qs }))}
                                onUpdateReasoning={(r) => setSession(prev => ({ ...prev, reasoning: r }))}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
