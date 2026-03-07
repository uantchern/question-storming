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
                userName: '',
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
            userName: '',
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

    const handleStartStorm = (scenario, isParadoxMode, userName) => {
        const initialQuestions = [
            { id: Date.now().toString() + '-1', text: "Why is this challenge the most critical one to solve right now?", starred: false, paradoxConstraint: null },
            { id: Date.now().toString() + '-2', text: "Who currently benefits from the situation remaining exactly as it is?", starred: false, paradoxConstraint: null },
            { id: Date.now().toString() + '-3', text: "If we could completely reverse the assumptions about this challenge, what would the solution look like?", starred: false, paradoxConstraint: null }
        ];
        setSession({ phase: 'STORMING', scenario, userName, questions: initialQuestions, isParadoxMode });
    };

    const handleTimerEnd = (questions) => {
        setSession({ phase: 'SETUP', scenario: '', userName: '', questions: [], isParadoxMode: false, targetCount: 10 });
    };

    const handleReset = async () => {
        setSession(prev => ({ phase: 'SETUP', scenario: '', userName: '', questions: [], isParadoxMode: false, targetCount: 10 }));
    };

    const handleGoToAnalysis = (updatedQuestions) => {
        setSession(prev => ({ ...prev, phase: 'ANALYSIS', questions: updatedQuestions }));
    };

    return (
        <div className={`app-container ${session.isParadoxMode ? 'paradox-theme' : ''}`}>
            <header className="app-header">
                <div className="brand" style={{ cursor: 'pointer' }} onClick={handleReset}>
                    <Layout className="brand-icon" />
                    <h1>Question Storming {session.isParadoxMode && <span className="paradox-label">ROLL THE DICE FOR A 13</span>}</h1>
                </div>
                <div className="header-actions">
                    {session.phase !== 'SETUP' && session.phase !== 'STORMING' && (
                        <button className="reset-btn" onClick={handleReset}>New Session</button>
                    )}
                </div>
            </header>

            <main className="main-content">
                {session.phase === 'SETUP' && (
                    <SessionSetup onStart={handleStartStorm} initialScenario={session.scenario} initialUserName={session.userName} />
                )}

                {session.phase === 'STORMING' && (
                    <StormingInterface
                        scenario={session.scenario}
                        isParadoxMode={session.isParadoxMode}
                        initialQuestions={session.questions}
                        onTimeUp={handleTimerEnd}
                        onUpdateQuestions={(qs) => setSession(prev => ({ ...prev, questions: qs }))}
                    />
                )}
            </main>
        </div>
    );
}

export default App;

