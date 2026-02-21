import { useState } from 'react';
import { Play, Zap, Brain } from 'lucide-react';

function SessionSetup({ onStart, initialScenario }) {
    const [scenario, setScenario] = useState(initialScenario || '');
    const [isParadox, setIsParadox] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (scenario.trim()) {
            onStart(scenario.trim(), isParadox);
        }
    };

    return (
        <div className="setup-container fade-in">
            <div className="setup-header">
                <h2>What's the challenge?</h2>
                <p>Define your problem statement before the storm begins.</p>
            </div>

            <form onSubmit={handleSubmit} className="input-group">
                <label htmlFor="scenario">Challenge Scenario</label>
                <textarea
                    id="scenario"
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                    placeholder="e.g., Key Word Sign is not widely known"
                    rows={4}
                    autoFocus
                    required
                />

                <div className="toggle-container">
                    <label className="paradox-toggle">
                        <input
                            type="checkbox"
                            checked={isParadox}
                            onChange={(e) => setIsParadox(e.target.checked)}
                        />
                        <span className="toggle-content">
                            <Zap size={16} className={isParadox ? 'active-icon' : ''} />
                            <span>Paradox Mode (Experimental)</span>
                        </span>
                    </label>
                    <p className="toggle-hint">
                        {isParadox
                            ? "Reality-defying constraints will be injected to shatter your assumptions."
                            : "Standard brainstorming session."}
                    </p>
                </div>

                <button
                    type="submit"
                    className={`primary-btn ${isParadox ? 'paradox-btn' : ''}`}
                    disabled={!scenario.trim()}
                    style={{ marginTop: '1rem' }}
                >
                    <Play size={20} />
                    Start {isParadox ? 'Singularity' : 'Storming'}
                </button>
            </form>
        </div>
    );
}

export default SessionSetup;
