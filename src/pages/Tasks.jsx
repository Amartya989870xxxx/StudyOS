import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Filter, 
  ArrowUpDown, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle, 
  History,
  Trash2,
  Calendar,
  X
} from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { useStudy } from '../context/StudyContext';
import { format, isBefore, startOfDay, parseISO } from 'date-fns';

const Tasks = () => {
  const { subjects, topics } = useStudy();
  const { tasks, filters, setFilters, sort, setSort, addTask, updateTask, deleteTask } = useTasks();
  
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    subject: '', 
    topic: '', 
    deadline: format(new Date(), 'yyyy-MM-dd'),
    priority: 'Medium',
    status: 'Pending'
  });

  const tabs = [
    { id: 'All', label: 'All Tasks', icon: <Filter size={16} /> },
    { id: 'Pending', label: 'Pending', icon: <Circle size={16} /> },
    { id: 'Completed', label: 'Completed', icon: <CheckCircle2 size={16} /> },
    { id: 'Overdue', label: 'Overdue', icon: <AlertCircle size={16} /> },
    { id: 'Revision', label: 'Revision', icon: <History size={16} /> },
  ];

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.title.trim()) {
      addTask(newTask);
      setNewTask({ 
        title: '', 
        subject: '', 
        topic: '', 
        deadline: format(new Date(), 'yyyy-MM-dd'),
        priority: 'Medium',
        status: 'Pending'
      });
      setIsAddingTask(false);
    }
  };

  const getPriorityColor = (p) => {
    if (p === 'High') return 'var(--accent-red)';
    if (p === 'Medium') return 'var(--accent-orange)';
    return 'var(--accent-blue)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Study Tasks</h2>
          <p style={{ color: 'var(--text-muted)' }}>Stay on top of your study schedule and prioritize key topics.</p>
        </div>
        <button 
          onClick={() => setIsAddingTask(true)} 
          className="btn btn-primary"
          style={{ padding: '12px 24px' }}
        >
          <Plus size={20} /> Create Task
        </button>
      </header>

      {/* Tabs & Filters */}
      <div className="glass" style={{ padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilters({ ...filters, status: tab.id })}
              className={`btn ${filters.status === tab.id ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--text-dim)" />
            <select 
              className="glass" 
              style={{ padding: '6px 12px', fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: '8px', border: '1px solid var(--surface-border)' }}
              value={filters.priority}
              onChange={e => setFilters({ ...filters, priority: e.target.value })}
            >
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={16} color="var(--text-dim)" />
            <select 
              className="glass" 
              style={{ padding: '6px 12px', fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: '8px', border: '1px solid var(--surface-border)' }}
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="deadlineAt">Sort by Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="subject">Sort by Subject</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        <AnimatePresence mode="popLayout">
          {tasks.map(task => (
            <TaskListItem 
              key={task.id} 
              task={task} 
              onToggle={() => updateTask({ ...task, status: task.status === 'Completed' ? 'Pending' : 'Completed' })}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-dim)' }}
          >
            <CheckCircle2 size={48} strokeWidth={1} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>No tasks found for the current filters.</p>
          </motion.div>
        )}
      </div>

      {/* Add Task Modal */}
      <Modal isOpen={isAddingTask} onClose={() => setIsAddingTask(false)} title="New Study Task">
        <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Task Title</label>
            <input 
              autoFocus
              className="glass" 
              style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid var(--surface-border)', color: 'white' }}
              value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})}
              placeholder="e.g. Solve 10 Binary Tree problems"
              required
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Subject</label>
              <select 
                className="glass" 
                style={{ width: '100%', padding: '12px', background: 'rgba(20,20,25,1)', borderRadius: '10px', border: '1px solid var(--surface-border)', color: 'white' }}
                value={newTask.subject}
                onChange={e => setNewTask({...newTask, subject: e.target.value, topic: ''})}
                required
              >
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Topic (Optional)</label>
              <select 
                className="glass" 
                style={{ width: '100%', padding: '12px', background: 'rgba(20,20,25,1)', borderRadius: '10px', border: '1px solid var(--surface-border)', color: 'white' }}
                value={newTask.topic}
                onChange={e => setNewTask({...newTask, topic: e.target.value})}
              >
                <option value="">Select Topic</option>
                {topics.filter(t => t.subjectId === subjects.find(s => s.name === newTask.subject)?.id).map(t => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Deadline</label>
              <input 
                type="date"
                className="glass" 
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid var(--surface-border)', color: 'white' }}
                value={newTask.deadline}
                onChange={e => setNewTask({...newTask, deadline: e.target.value})}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Priority</label>
              <select 
                className="glass" 
                style={{ width: '100%', padding: '12px', background: 'rgba(20,20,25,1)', borderRadius: '10px', border: '1px solid var(--surface-border)', color: 'white' }}
                value={newTask.priority}
                onChange={e => setNewTask({...newTask, priority: e.target.value})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Add Task</button>
        </form>
      </Modal>
    </div>
  );
};

const TaskListItem = ({ task, onToggle, onDelete }) => {
  const isOverdue = task.status !== 'Completed' && isBefore(parseISO(task.deadline), startOfDay(new Date()));
  
  const getPriorityColor = (p) => {
    if (p === 'High') return 'var(--accent-red)';
    if (p === 'Medium') return 'var(--accent-orange)';
    return 'var(--accent-blue)';
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass glass-hover"
      style={{ 
        padding: '1.25rem', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1.5rem',
        borderLeft: `4px solid ${getPriorityColor(task.priority)}`
      }}
    >
      <button 
        onClick={onToggle}
        className="btn-ghost"
        style={{ padding: 0, borderRadius: '50%', color: task.status === 'Completed' ? 'var(--accent-green)' : 'var(--text-dim)' }}
      >
        {task.status === 'Completed' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
      </button>

      <div style={{ flex: 1 }}>
        <h4 style={{ 
          fontSize: '1.1rem', 
          fontWeight: 600, 
          textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
          color: task.status === 'Completed' ? 'var(--text-dim)' : 'var(--text-main)',
          marginBottom: '0.25rem'
        }}>
          {task.title}
        </h4>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-purple)' }}></div>
            {task.subject} {task.topic ? `• ${task.topic}` : ''}
          </span>
          <span style={{ 
            fontSize: '0.8rem', 
            color: isOverdue ? 'var(--accent-red)' : 'var(--text-dim)',
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.4rem' 
          }}>
            <Calendar size={14} /> {format(parseISO(task.deadline), 'MMM dd, yyyy')}
            {isOverdue && <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>(OVERDUE)</span>}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ 
          fontSize: '0.75rem', 
          fontWeight: 600, 
          color: getPriorityColor(task.priority),
          background: `${getPriorityColor(task.priority)}11`,
          padding: '4px 10px',
          borderRadius: '20px',
          border: `1px solid ${getPriorityColor(task.priority)}33`
        }}>
          {task.priority}
        </span>
        <button onClick={onDelete} className="btn-ghost" style={{ padding: '8px', color: 'var(--accent-red)', opacity: 0.6 }}>
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
};

// Reusing Modal from Subjects for simplicity here, in a real app would extract
const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass"
          style={{ 
            width: '100%', 
            maxWidth: '500px', 
            position: 'relative', 
            padding: '2rem',
            background: 'var(--bg-color)',
            border: '1px solid var(--surface-border)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{title}</h3>
            <button onClick={onClose} className="btn-ghost" style={{ padding: '8px', borderRadius: '50%' }}>
              <X size={20} />
            </button>
          </div>
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default Tasks;
