import { useState, useEffect } from 'react';
import { sql } from '../db';
import { ArrowLeft, Brain, Zap, Trash2, Calendar } from 'lucide-react';

function HistoryView({ onBack }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const [expandedIds, setExpandedIds] = useState({});

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const data = await sql`SELECT * FROM storm_sessions ORDER BY created_at DESC LIMIT 50`;
            setHistory(data || []);
        } catch (error) {
            console.error('Error fetching history:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this session?')) return;

        try {
            await sql`DELETE FROM storm_sessions WHERE id = ${id}`;
            setHistory(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting session:', error.message);
            alert('Failed to delete session');
        }
    };

    const toggleExpand = (id) => {
        setExpandedIds(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="history-container fade-in">
            <div className="history-header">
                <button onClick={onBack} className="back-btn">
                    <ArrowLeft size={20} />
                    Back
                </button>
                <h2>Storm History</h2>
            </div>

            {loading ? (
                <div className="loading-state">Loading your past storms...</div>
            ) : history.length === 0 ? (
                <div className="empty-state">
                    <Brain size={48} className="muted-icon" />
                    <p>No brainstorms saved yet. Start your first session!</p>
                </div>
            ) : (
                <div className="history-list">
                    {history.map((item) => (
                        <div
                            key={item.id}
                            className={`history-card ${item.is_paradox ? 'paradox-history' : ''} ${expandedIds[item.id] ? 'expanded' : ''}`}
                            onClick={() => toggleExpand(item.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="history-card-header">
                                <div className="history-meta">
                                    <span className="history-date">
                                        <Calendar size={14} />
                                        {formatDate(item.created_at)}
                                    </span>
                                    {item.is_paradox && (
                                        <span className="history-badge paradox">
                                            <Zap size={12} /> 13-Dice
                                        </span>
                                    )}
                                </div>
                                <div className="history-actions">
                                    <span className="history-count">
                                        {item.questions?.length || 0} Questions
                                    </span>
                                    <button
                                        className="history-delete-btn"
                                        onClick={(e) => handleDelete(item.id, e)}
                                        title="Delete Session"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="history-scenario">{item.scenario}</h3>
                            <div className="history-preview">
                                {(expandedIds[item.id] ? item.questions : item.questions?.slice(0, 2))?.map((q, i) => (
                                    <p key={i} className="preview-item">
                                        <span className="q-num">{String(i + 1).padStart(2, '0')}.</span> {q.text}
                                    </p>
                                ))}
                                {!expandedIds[item.id] && item.questions?.length > 2 && (
                                    <p className="more-indicator">... click to view {item.questions.length - 2} more</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default HistoryView;
