import { useState, useEffect } from 'react';
import SessionSetup from './components/SessionSetup';
import StormingInterface from './components/StormingInterface';
import ReviewMode from './components/ReviewMode';
import { Layout } from 'lucide-react';

const APP_STATE_KEY = 'questionStormingState';

function App() {
    const [session, setSession] = useState(() => {
        const saved = localStorage.getItem(APP_STATE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse saved session", e);
            }
        }
        return {
            phase: 'SETUP', // SETUP, STORMING, REVIEW
            scenario: '',
            questions: [],
        };
    });

    // Persist to local storage
    useEffect(() => {
        localStorage.setItem(APP_STATE_KEY, JSON.stringify(session));
    }, [session]);

    const handleStartStorm = (scenario) => {
        setSession({ phase: 'STORMING', scenario, questions: [] });
    };

    const handleTimerEnd = (questions) => {
        setSession((prev) => ({ ...prev, phase: 'REVIEW', questions }));
    };

    const handleReset = () => {
        if (confirm("Are you sure you want to reset the session? All your questions will be lost.")) {
            setSession({ phase: 'SETUP', scenario: '', questions: [] });
        }
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <div className="brand">
                    <Layout className="brand-icon" />
                    <h1>Question Storming</h1>
                </div>
                {session.phase !== 'SETUP' && (
                    <button className="reset-btn" onClick={handleReset}>New Session</button>
                )}
            </header>

            <main className="main-content">
                {session.phase === 'SETUP' && (
                    <SessionSetup onStart={handleStartStorm} initialScenario={session.scenario} />
                )}

                {session.phase === 'STORMING' && (
                    <StormingInterface
                        scenario={session.scenario}
                        initialQuestions={session.questions}
                        onTimeUp={handleTimerEnd}
                        onUpdateQuestions={(qs) => setSession(prev => ({ ...prev, questions: qs }))}
                    />
                )}

                {session.phase === 'REVIEW' && (
                    <ReviewMode
                        scenario={session.scenario}
                        questions={session.questions}
                    />
                )}
            </main>
        </div>
    );
}

export default App;
