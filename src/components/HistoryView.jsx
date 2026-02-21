import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ArrowLeft, Brain, Zap, Trash2, Calendar } from 'lucide-react';

function HistoryView({ onBack }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('storm_sessions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setHistory(data || []);
        } catch (error) {
            console.error('Error fetching history:', error.message);
        } finally {
            setLoading(false);
        }
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
                        <div key={item.id} className={`history-card ${item.is_paradox ? 'paradox-history' : ''}`}>
                            <div className="history-card-header">
                                <div className="history-meta">
                                    <span className="history-date">
                                        <Calendar size={14} />
                                        {formatDate(item.created_at)}
                                    </span>
                                    {item.is_paradox && (
                                        <span className="history-badge paradox">
                                            <Zap size={12} /> Paradox
                                        </span>
                                    )}
                                </div>
                                <div className="history-count">
                                    {item.questions?.length || 0} Questions
                                </div>
                            </div>
                            <h3 className="history-scenario">{item.scenario}</h3>
                            <div className="history-preview">
                                {item.questions?.slice(0, 2).map((q, i) => (
                                    <p key={i} className="preview-item">Q: {q.text}</p>
                                ))}
                                {item.questions?.length > 2 && (
                                    <p className="more-indicator">... and {item.questions.length - 2} more</p>
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
