import { useState } from 'react';
import { Star, Download } from 'lucide-react';

function ReviewMode({ scenario, questions }) {
    const [localQuestions, setLocalQuestions] = useState(questions);

    const starredCount = localQuestions.filter(q => q.starred).length;

    const toggleStar = (id) => {
        setLocalQuestions(prev => prev.map(q => {
            if (q.id === id) {
                // Only allow starring if we have < 3, OR if we are un-starring
                if (!q.starred && starredCount >= 3) return q;
                return { ...q, starred: !q.starred };
            }
            return q;
        }));
    };

    const handleDownload = () => {
        const starred = localQuestions.filter(q => q.starred);
        const others = localQuestions.filter(q => !q.starred);

        let content = `Challenge: ${scenario}\n\n`;
        content += `--- TOP 3 QUESTIONS ---\n`;
        starred.forEach((q, i) => content += `${i + 1}. ${q.text}\n`);

        content += `\n--- OTHER QUESTIONS ---\n`;
        others.forEach((q, i) => content += `${i + 1 + starred.length}. ${q.text}\n`);

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `question-storm-${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (questions.length === 0) {
        return (
            <div className="review-header fade-in">
                <h2>Time's Up!</h2>
                <p>You didn't generate any questions this round.</p>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="review-header">
                <h2>Time's Up!</h2>
                <p>Review your brainstormed list and star your <strong>Top 3</strong> questions.</p>
                <div className="review-stats">
                    {starredCount} / 3 Starred
                </div>
            </div>

            <div className="review-list">
                {localQuestions.map((q) => (
                    <div
                        key={q.id}
                        className={`review-card ${q.starred ? 'starred' : ''}`}
                        onClick={() => toggleStar(q.id)}
                    >
                        <div className="question-content">{q.text}</div>
                        <button
                            className={`star-btn ${q.starred ? 'active' : ''}`}
                            title={q.starred ? "Unstar" : "Star"}
                        >
                            <Star fill={q.starred ? "currentColor" : "none"} size={24} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="review-footer">
                <button onClick={handleDownload} className="download-btn">
                    <Download size={18} />
                    Export Results
                </button>
            </div>
        </div>
    );
}

export default ReviewMode;
