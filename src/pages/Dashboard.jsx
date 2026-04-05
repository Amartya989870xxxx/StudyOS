import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  BookOpen,
  History,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { useProgress } from '../hooks/useProgress';
import { useStudy } from '../context/StudyContext';
import { useNavigate } from 'react-router-dom';
import { format, isAfter, parseISO, subDays, isSameDay } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const stats = useProgress();
  const { subjects, tasks, topics } = useStudy();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Dynamic weekly data calculation
  const weeklyData = React.useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayLabel = format(date, 'EEE');

      const count = [...topics, ...tasks].filter(item =>
        item.completedAt && isSameDay(parseISO(item.completedAt), date)
      ).length;

      return {
        name: dayLabel,
        count: count
      };
    });
  }, [tasks, topics]);

  const pieData = stats.subjectProgress.map(s => ({
    name: s.name,
    value: s.completed,
    color: s.color || 'var(--accent-blue)'
  })).filter(s => s.value > 0);

  const upcomingRevisions = topics
    .filter(t => t.status === 'Needs Revision')
    .slice(0, 4);

  // Daily Quote Logic
  const fallbacks = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
  ];

  const [quote, setQuote] = React.useState(fallbacks[Math.floor(Math.random() * fallbacks.length)]);

  React.useEffect(() => {
    const fetchQuote = async () => {
      try {
        const stored = localStorage.getItem('study_daily_quote');
        const today = new Date().toDateString();
        const apiKey = import.meta.env.VITE_NINJA_API_KEY;

        if (stored) {
          const { quote: savedQuote, date } = JSON.parse(stored);
          // If it's a new day, we ignore the old quote and fetch fresh
          if (date === today && savedQuote.text) {
            setQuote(savedQuote);
            return;
          }
        }

        // Fetch from API Ninjas with the secure key
        const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=success', {
          headers: { 'X-Api-Key': apiKey }
        });

        if (response.ok) {
          const data = await response.json();
          // API Ninjas returns an array, so we take the first item
          if (data && data.length > 0) {
            const newQuote = { text: data[0].quote, author: data[0].author };
            setQuote(newQuote);
            localStorage.setItem('study_daily_quote', JSON.stringify({ quote: newQuote, date: today }));
          }
        } else {
          throw new Error('Ninja API failed');
        }
      } catch (err) {
        console.error('Quote fetch failed, using fallback:', err);
      }
    };

    fetchQuote();
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      <header style={{ marginBottom: '1rem' }}>
        <motion.h2
          className="animate-title"
          style={{
            fontSize: '3.5rem',
            fontWeight: 900,
            marginBottom: '0.25rem',
            letterSpacing: '-2px',
            color: 'white',
            lineHeight: 1
          }}
        >
          Welcome Back,Champ
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', fontStyle: 'italic', marginTop: '0.5rem' }}>
            "{quote.text}" — <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{quote.author}</span>
          </p>
        </motion.div>
      </header>

      {/* Main Stats */}
      <div className="stats-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem'
      }}>
        <StatCard
          icon={<CheckCircle2 color="var(--accent-green)" />}
          title="Completed"
          value={stats.completed}
          subtitle="Tasks finished"
          variants={itemVariants}
        />
        <StatCard
          icon={<Clock color="var(--accent-orange)" />}
          title="Pending"
          value={stats.pending}
          subtitle="Ongoing tasks"
          variants={itemVariants}
        />
        <StatCard
          icon={<AlertCircle color="var(--accent-red)" />}
          title="Overdue"
          value={stats.overdue}
          subtitle="Requires attention"
          variants={itemVariants}
        />
        <StatCard
          icon={<History color="var(--accent-purple)" />}
          title="Revision"
          value={stats.topicStats.revision}
          subtitle="Topics to revisit"
          variants={itemVariants}
        />
      </div>

      <div className="charts-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Productivity Line Chart */}
        <motion.div variants={itemVariants} className="glass" style={{ padding: '1.5rem', minHeight: '350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} color="var(--accent-blue)" /> Weekly Productivity
            </h3>
          </div>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="var(--text-dim)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--text-dim)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(20, 20, 25, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--surface-border)',
                    borderRadius: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--accent-blue)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'var(--accent-blue)', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Subject Progress Pie Chart */}
        <motion.div variants={itemVariants} className="glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} color="var(--accent-purple)" /> Subject Distribution
          </h3>
          <div style={{ display: 'flex', height: '260px', alignItems: 'center' }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(20, 20, 25, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid var(--surface-border)',
                      borderRadius: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
                <BookOpen size={48} strokeWidth={1} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                <p>No data available yet</p>
              </div>
            )}
            {pieData.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1rem' }}>
                {pieData.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}></div>
                    <span style={{ color: 'var(--text-muted)' }}>{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Revision Reminders */}
        <motion.div variants={itemVariants} className="glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem', fontSize: '1.1rem' }}>Revision Reminders</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {upcomingRevisions.length > 0 ? (
              upcomingRevisions.map((topic, i) => (
                <div key={i} className="glass-hover" style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{topic.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Completion: {topic.completedAt ? format(parseISO(topic.completedAt), 'MMM dd') : 'N/A'}</p>
                  </div>
                  <button
                    onClick={() => navigate('/revision')}
                    className="btn-ghost"
                    style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }}
                  >
                    Revise Now
                  </button>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '1rem' }}>No topics due for revision.</p>
            )}
          </div>
        </motion.div>

        {/* Completion Progress */}
        <motion.div variants={itemVariants} className="glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem', fontSize: '1.1rem' }}>Total Progress</h3>
          <div style={{ position: 'relative', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
              <motion.circle
                cx="60" cy="60" r="54" fill="none"
                stroke="var(--accent-blue)" strokeWidth="12"
                strokeDasharray="339.292"
                initial={{ strokeDashoffset: 339.292 }}
                animate={{ strokeDashoffset: 339.292 - (339.292 * stats.completionRate / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{Math.round(stats.completionRate)}%</span>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Done</p>
            </div>
          </div>
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>You've finished {stats.completed} out of {stats.total} sessions.</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ icon, title, value, subtitle, variants }) => (
  <motion.div
    variants={variants}
    className="glass glow-card stat-card"
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ pading: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'center', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }}>
        {icon}
      </div>
      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>{title}</span>
    </div>
    <div style={{ marginTop: '0.5rem' }}>
      <h3 style={{ fontSize: '2rem', fontWeight: 700 }}>{value}</h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{subtitle}</p>
    </div>
  </motion.div>
);

export default Dashboard;
