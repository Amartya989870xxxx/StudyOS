import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { format, addDays, parseISO, isSameDay } from 'date-fns';

const Revision = () => {
  const { topics, updateTopic } = useStudy();
  const [date, setDate] = useState(new Date());

  const revisionTopics = topics.filter(t => t.status === 'Needs Revision');
  const upcomingRevisions = topics
    .filter(t => t.status === 'Completed' && t.completedAt)
    .map(t => ({
      ...t,
      revisionDate: addDays(parseISO(t.completedAt), 3)
    }));

  const getRevisionStatusForDate = (d) => {
    const dueToday = topics.filter(t => {
      // Prioritize manual revision date
      if (t.revisionDate && isSameDay(parseISO(t.revisionDate), d)) return true;
      // Fallback to 3-day automation
      if (t.completedAt && isSameDay(addDays(parseISO(t.completedAt), 3), d)) return true;
      return false;
    }).length;

    const upcomingToday = upcomingRevisions.filter(t => isSameDay(t.revisionDate, d)).length;
    return { dueToday, upcomingToday };
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const { dueToday, upcomingToday } = getRevisionStatusForDate(date);
      if (dueToday > 0) return <div style={{ height: '4px', width: '4px', background: 'var(--accent-red)', borderRadius: '50%', margin: '2px auto' }}></div>;
      if (upcomingToday > 0) return <div style={{ height: '4px', width: '4px', background: 'var(--accent-beige)', borderRadius: '50%', margin: '2px auto' }}></div>;
    }
    return null;
  };

  const topicsOnSelectedDate = topics.filter(t => {
    const isToday = isSameDay(date, new Date());
    
    // 1. Manual Revision Date check
    if (t.revisionDate && isSameDay(parseISO(t.revisionDate), date)) {
      return true;
    }

    // 2. Immediate Revision logic for today if flagged
    if (t.status === 'Needs Revision' && isToday) {
      return true;
    }

    // 3. Standard 3-day spaced repetition fallback
    if (t.completedAt) {
      return isSameDay(addDays(parseISO(t.completedAt), 3), date);
    }
    
    return false;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'var(--font-heading)', letterSpacing: '-1px' }}>Revision <i style={{ fontWeight: 400 }}>Planner</i></h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Strategically schedule your revisions to maximize long-term retention.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {/* Calendar View */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass" 
          style={{ padding: '1.5rem', height: 'fit-content' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <CalendarIcon color="var(--accent-beige)" size={20} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>Revision Calendar</h3>
          </div>
          
          <div className="custom-calendar-wrapper">
            <Calendar 
              onChange={setDate} 
              value={date} 
              tileContent={tileContent}
              className="study-calendar"
            />
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-red)' }}></div>
              <span style={{ color: 'var(--text-muted)' }}>Due for Revision</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)' }}></div>
              <span style={{ color: 'var(--text-muted)' }}>Upcoming</span>
            </div>
          </div>
        </motion.div>

        {/* Selected Date Topics */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass" 
          style={{ padding: '1.5rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Revisions for {format(date, 'MMM dd')}</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{topicsOnSelectedDate.length} topics</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topicsOnSelectedDate.length > 0 ? (
              topicsOnSelectedDate.map((topic, i) => (
                <div key={i} className="glass" style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{topic.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      {topic.revisionDate 
                        ? `Scheduled: ${format(parseISO(topic.revisionDate), 'MMM dd')}`
                        : topic.completedAt 
                          ? `Completed: ${format(parseISO(topic.completedAt), 'MMM dd')}`
                          : 'Manual Revision Entry'}
                    </p>
                  </div>
                  {topic.status === 'Needs Revision' ? (
                    <button 
                      onClick={() => updateTopic({ ...topic, status: 'Completed', completedAt: new Date().toISOString() })}
                      className="btn btn-primary" 
                      style={{ padding: '6px 14px', fontSize: '0.75rem', borderRadius: '8px' }}
                    >
                      Mark Done
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-green)', fontSize: '0.75rem', fontWeight: 600 }}>
                      <CheckCircle2 size={14} /> Ready
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                <Clock size={40} opacity={0.3} />
                <p>No revision sessions scheduled for this day.</p>
              </div>
            )}
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: '3px solid var(--accent-beige)' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <HelpCircle size={18} color="var(--accent-beige)" style={{ marginTop: '2px' }} />
              <div>
                <h5 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem', fontFamily: 'var(--font-heading)' }}>Spaced Repetition Tip</h5>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  StudyOS automatically marks topics for revision 3 days after completion. This helps moving knowledge from short-term to long-term memory.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .study-calendar {
          background: transparent !important;
          border: none !important;
          color: var(--text-main) !important;
          width: 100% !important;
          font-family: var(--font-body) !important;
        }
        .react-calendar__tile {
          color: var(--text-muted) !important;
          padding: 1.5em 0.5em !important;
          border-radius: 12px;
        }
        .react-calendar__tile:hover {
          background: var(--surface-hover) !important;
          color: var(--text-main) !important;
        }
        .react-calendar__tile--now {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid var(--surface-border) !important;
        }
        .react-calendar__tile--active {
          background: var(--primary-glow) !important;
          color: #1a1a1a !important;
          box-shadow: 0 4px 15px -5px rgba(212, 163, 115, 0.4);
        }
        .react-calendar__navigation button {
          color: var(--text-main) !important;
          font-size: 1.1rem;
          font-weight: 700;
        }
        .react-calendar__month-view__weekdays {
          color: var(--text-dim) !important;
          text-transform: uppercase;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 1px;
        }
        .react-calendar__month-view__days__day--neighboringMonth {
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
};

export default Revision;
