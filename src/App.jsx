import { useState, useEffect } from 'react';
import SessionSetup from './components/SessionSetup';
import StormingInterface from './components/StormingInterface';
import ReviewMode from './components/ReviewMode';
import HistoryView from './components/HistoryView';
import { Layout, History } from 'lucide-react';
import { supabase } from './supabaseClient';

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
            phase: 'SETUP', // SETUP, STORMING, REVIEW, HISTORY
            scenario: '',
            questions: [],
            isParadoxMode: false,
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
            const { error } = await supabase
                .from('storm_sessions')
                .insert([
                    {
                        scenario: sessionData.scenario,
                        is_paradox: sessionData.isParadoxMode,
                        questions: sessionData.questions,
                        created_at: new Date().toISOString()
                    }
                ]);
            if (error) throw error;
            console.log("Session saved to database successfully");
        } catch (error) {
            console.error("Error saving session to database:", error.message);
        }
    };

    const handleStartStorm = (scenario, isParadoxMode) => {
        setSession({ phase: 'STORMING', scenario, questions: [], isParadoxMode });
    };

    const handleTimerEnd = (questions) => {
        const updatedSession = { ...session, phase: 'REVIEW', questions };
        setSession(updatedSession);
        // Async save to DB
        saveSessionToDb(updatedSession);
    };

    const handleReset = () => {
        setSession({ phase: 'SETUP', scenario: '', questions: [], isParadoxMode: false });
    };

    const openHistory = () => {
        setSession(prev => ({ ...prev, phase: 'HISTORY' }));
    };

    return (
        <div className={`app-container ${session.isParadoxMode ? 'paradox-theme' : ''}`}>
            <header className="app-header">
                <div className="brand" style={{ cursor: 'pointer' }} onClick={handleReset}>
                    <Layout className="brand-icon" />
                    <h1>Question Storming {session.isParadoxMode && <span className="paradox-label">PARADOX</span>}</h1>
                </div>
                <div className="header-actions">
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
                    />
                )}

                {session.phase === 'HISTORY' && (
                    <HistoryView onBack={handleReset} />
                )}
            </main>
        </div>
    );
}

export default App;
