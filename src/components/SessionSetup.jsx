import { useState } from 'react';
import { Play } from 'lucide-react';

function SessionSetup({ onStart, initialScenario }) {
    const [scenario, setScenario] = useState(initialScenario || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (scenario.trim()) {
            onStart(scenario.trim());
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
                <button
                    type="submit"
                    className="primary-btn"
                    disabled={!scenario.trim()}
                    style={{ marginTop: '1rem' }}
                >
                    <Play size={20} />
                    Start Storming (4 min)
                </button>
            </form>
        </div>
    );
}

export default SessionSetup;
