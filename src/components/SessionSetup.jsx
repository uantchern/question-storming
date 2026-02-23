import { useState } from 'react';
import { Play, Zap, Brain, HelpCircle } from 'lucide-react';

function SessionSetup({ onStart, initialScenario, initialUserName }) {
    const [userName, setUserName] = useState(initialUserName || '');
    const [scenario, setScenario] = useState(initialScenario || '');
    const [isParadox, setIsParadox] = useState(false);
    const [duration, setDuration] = useState(730);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (scenario.trim() && userName.trim()) {
            onStart(scenario.trim(), isParadox, duration, userName.trim());
        }
    };

    return (
        <div className="setup-container fade-in">
            <div className="setup-header">
                <h2>What's the challenge?</h2>
                <p>Define your problem statement before the storm begins.</p>
            </div>

            <form onSubmit={handleSubmit} className="input-group">
                <div className="setup-fields">
                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label htmlFor="userName" className="field-label">
                            Your Name
                            <span className="tooltip-container" data-tooltip="Enter your name to log this session.">
                                <HelpCircle size={14} className="info-icon" />
                            </span>
                        </label>
                        <input
                            id="userName"
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="e.g., Alice"
                            style={{
                                padding: '1rem',
                                background: 'var(--surface-color)',
                                border: '2px solid var(--border-color)',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '1rem',
                                width: '100%'
                            }}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="scenario" className="field-label">
                            Challenge Scenario
                            <span className="tooltip-container" data-tooltip="Clearly describe the problem or goal you want to explore with questions.">
                                <HelpCircle size={14} className="info-icon" />
                            </span>
                        </label>
                        <textarea
                            id="scenario"
                            value={scenario}
                            onChange={(e) => setScenario(e.target.value)}
                            placeholder="e.g., Key Word Sign is not widely known"
                            rows={4}
                            autoFocus
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="duration" className="field-label">
                            Timer (s)
                            <span className="tooltip-container" data-tooltip="Set the duration for your storming session. Standard is 730s (approx 12 mins).">
                                <HelpCircle size={14} className="info-icon" />
                            </span>
                        </label>
                        <input
                            id="duration"
                            type="number"
                            className="duration-input"
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                            min="10"
                            max="3600"
                        />
                    </div>
                </div>

                <div className="toggle-container">
                    <label className="paradox-toggle">
                        <input
                            type="checkbox"
                            checked={isParadox}
                            onChange={(e) => setIsParadox(e.target.checked)}
                        />
                        <span className="toggle-content">
                            <Zap size={16} className={isParadox ? 'active-icon' : ''} />
                            <span>Roll the dice for a 13</span>
                        </span>
                    </label>
                    <p className="toggle-hint">
                        {isParadox
                            ? "Injects 'Impossible Constraints' (like reversed time or broken physics) every 20 seconds to force extreme lateral thinking and bypass obvious logic."
                            : "Standard brainstorming session."}
                    </p>
                </div>

                <button
                    type="submit"
                    className={`primary-btn ${isParadox ? 'paradox-btn' : ''}`}
                    disabled={!scenario.trim() || !userName.trim()}
                    style={{ marginTop: '1rem' }}
                >
                    <Play size={20} />
                    Start {isParadox ? "Let's Q-Storm!" : 'Storming'}
                </button>
            </form>
        </div>
    );
}

export default SessionSetup;

