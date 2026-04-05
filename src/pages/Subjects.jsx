import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  BookOpen,
  Tag,
  Hash,
  X
} from 'lucide-react';
import { useSubjects } from '../hooks/useSubjects';
import { useStudy } from '../context/StudyContext';
import { format, parseISO } from 'date-fns';
import { Calendar as LucideCalendar } from 'lucide-react';

const Subjects = () => {
  const { subjects, addSubject, deleteSubject, topics, addTopic, updateTopic, deleteTopic } = useSubjects();
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isAddingTopic, setIsAddingTopic] = useState(false);

  const [newSubject, setNewSubject] = useState({ name: '', description: '', color: '#6366f1' });
  const [newTopic, setNewTopic] = useState({ name: '', difficulty: 'Medium', status: 'Not Started', notes: '', revisionDate: '' });

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (newSubject.name.trim()) {
      addSubject(newSubject);
      setNewSubject({ name: '', description: '', color: '#6366f1' });
      setIsAddingSubject(false);
    }
  };

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (newTopic.name.trim() && selectedSubject) {
      addTopic({ ...newTopic, subjectId: selectedSubject.id });
      setNewTopic({ name: '', difficulty: 'Medium', status: 'Not Started', notes: '', revisionDate: '' });
      setIsAddingTopic(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Subjects & Topics</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage your learning domains and drill down into specific topics.</p>
        </div>
        <button 
          onClick={() => setIsAddingSubject(true)} 
          className="btn btn-primary"
          style={{ padding: '12px 24px' }}
        >
          <Plus size={20} /> Add Subject
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <AnimatePresence>
          {subjects.map((subject) => (
            <SubjectCard 
              key={subject.id} 
              subject={subject} 
              onDelete={() => deleteSubject(subject.id)}
              onSelect={() => setSelectedSubject(subject)}
              topicCount={topics.filter(t => t.subjectId === subject.id).length}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Topic Detail View */}
      <AnimatePresence>
        {selectedSubject && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass" 
            style={{ padding: '2rem', marginTop: '1rem', border: `1px solid ${selectedSubject.color}33` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                   <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: selectedSubject.color }}></div>
                   <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{selectedSubject.name}</h3>
                </div>
                <p style={{ color: 'var(--text-muted)' }}>{selectedSubject.description}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setIsAddingTopic(true)} className="btn btn-ghost" style={{ fontSize: '0.85rem' }}>
                  <Plus size={16} /> Add Topic
                </button>
                <button onClick={() => setSelectedSubject(null)} className="btn-ghost" style={{ padding: '8px' }}>
                   <X size={20} />
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {topics.filter(t => t.subjectId === selectedSubject.id).map(topic => (
                <TopicListItem 
                  key={topic.id} 
                  topic={topic} 
                  onUpdate={(updates) => updateTopic({ ...topic, ...updates })}
                  onDelete={() => deleteTopic(topic.id)}
                />
              ))}
              {topics.filter(t => t.subjectId === selectedSubject.id).length === 0 && (
                <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-dim)', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                  No topics added yet. Click "Add Topic" to get started.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Subject Modal */}
      <Modal isOpen={isAddingSubject} onClose={() => setIsAddingSubject(false)} title="New Subject">
        <form onSubmit={handleAddSubject} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Subject Name</label>
            <input 
              autoFocus
              className="glass" 
              style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid var(--surface-border)', color: 'white' }}
              value={newSubject.name}
              onChange={e => setNewSubject({...newSubject, name: e.target.value})}
              placeholder="e.g. Mathematics"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Description</label>
            <textarea 
              className="glass" 
              style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid var(--surface-border)', color: 'white', minHeight: '80px' }}
              value={newSubject.description}
              onChange={e => setNewSubject({...newSubject, description: e.target.value})}
              placeholder="Brief overview of what this subject covers..."
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Label Color</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {['#6366f1', '#a855f7', '#ec4899', '#ef4444', '#f59e0b', '#10b981', '#3b82f6'].map(c => (
                <button 
                  key={c}
                  type="button"
                  onClick={() => setNewSubject({...newSubject, color: c})}
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: c, 
                    border: newSubject.color === c ? '2px solid white' : 'none',
                    cursor: 'pointer',
                    transform: newSubject.color === c ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Create Subject</button>
        </form>
      </Modal>

      {/* Add Topic Modal */}
      <Modal isOpen={isAddingTopic} onClose={() => setIsAddingTopic(false)} title="New Topic">
        <form onSubmit={handleAddTopic} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Topic Name</label>
            <input 
              autoFocus
              className="glass" 
              style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid var(--surface-border)', color: 'white' }}
              value={newTopic.name}
              onChange={e => setNewTopic({...newTopic, name: e.target.value})}
              placeholder="e.g. Binary Search Trees"
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Difficulty</label>
              <select 
                className="glass" 
                style={{ width: '100%', padding: '12px', background: 'rgba(20,20,25,1)', borderRadius: '10px', border: '1px solid var(--surface-border)', color: 'white' }}
                value={newTopic.difficulty}
                onChange={e => setNewTopic({...newTopic, difficulty: e.target.value})}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Initial Status</label>
              <select 
                className="glass" 
                style={{ width: '100%', padding: '12px', background: 'rgba(20,20,25,1)', borderRadius: '10px', border: '1px solid var(--surface-border)', color: 'white' }}
                value={newTopic.status}
                onChange={e => setNewTopic({...newTopic, status: e.target.value})}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Revision Date (Optional)</label>
            <input 
              type="date"
              className="glass" 
              style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid var(--surface-border)', color: 'white' }}
              value={newTopic.revisionDate}
              onChange={e => setNewTopic({...newTopic, revisionDate: e.target.value})}
            />
          </div>
          <button type="submit" className="btn btn-primary">Create Topic</button>
        </form>
      </Modal>
    </div>
  );
};

const SubjectCard = ({ subject, onDelete, onSelect, topicCount }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -5 }}
    className="glass glow-card glass-hover"
    style={{ padding: '1.5rem', position: 'relative' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
      <div 
        style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '12px', 
          background: `${subject.color}22`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${subject.color}44`
        }}
      >
        <BookOpen size={24} color={subject.color} />
      </div>
      <button onClick={onDelete} className="btn-ghost" style={{ padding: '6px', borderRadius: '50%', color: 'var(--accent-red)' }}>
        <Trash2 size={16} />
      </button>
    </div>

    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{subject.name}</h3>
    <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.5rem', height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
      {subject.description || 'No description provided.'}
    </p>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Hash size={14} /> {topicCount} Topics
      </span>
      <button 
        onClick={onSelect}
        className="btn-ghost"
        style={{ padding: '8px 12px', fontSize: '0.8rem', gap: '4px' }}
      >
        View Topics <ChevronRight size={14} />
      </button>
    </div>
    
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: subject.color }}></div>
  </motion.div>
);

const TopicListItem = ({ topic, onUpdate, onDelete }) => {
  const getDifficultyColor = (d) => {
    if (d === 'Easy') return 'var(--accent-green)';
    if (d === 'Medium') return 'var(--accent-orange)';
    return 'var(--accent-red)';
  };

  const getStatusColor = (s) => {
    if (s === 'Completed') return 'var(--accent-green)';
    if (s === 'In Progress') return 'var(--accent-blue)';
    if (s === 'Needs Revision') return 'var(--accent-purple)';
    return 'var(--text-dim)';
  };

  return (
    <div className="glass" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(255,255,255,0.01)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{topic.name}</h4>
        <button onClick={onDelete} className="btn-ghost" style={{ padding: '4px', color: 'var(--accent-red)', opacity: 0.6 }}>
          <Trash2 size={14} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ 
          fontSize: '0.7rem', 
          padding: '2px 8px', 
          borderRadius: '4px', 
          background: `${getDifficultyColor(topic.difficulty)}22`, 
          color: getDifficultyColor(topic.difficulty),
          border: `1px solid ${getDifficultyColor(topic.difficulty)}33`
        }}>
          {topic.difficulty}
        </span>
        <span style={{ 
          fontSize: '0.7rem', 
          padding: '2px 8px', 
          borderRadius: '4px', 
          background: `${getStatusColor(topic.status)}22`, 
          color: getStatusColor(topic.status),
          border: `1px solid ${getStatusColor(topic.status)}33`
        }}>
          {topic.status}
        </span>
        {topic.revisionDate && (
          <span style={{ 
            fontSize: '0.7rem', 
            padding: '2px 8px', 
            borderRadius: '4px', 
            background: 'rgba(99, 102, 241, 0.1)',
            color: 'var(--accent-purple)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <LucideCalendar size={10} /> {format(parseISO(topic.revisionDate), 'MMM dd')}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
        <select 
          style={{ 
            flex: 1,
            padding: '4px', 
            background: 'transparent', 
            color: 'var(--text-muted)', 
            border: '1px solid var(--surface-border)', 
            borderRadius: '6px', 
            fontSize: '0.75rem',
            outline: 'none'
          }}
          value={topic.status}
          onChange={(e) => onUpdate({ status: e.target.value })}
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Needs Revision">Needs Revision</option>
        </select>

        <input 
          type="date"
          className="glass"
          style={{ width: '130px', padding: '4px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.03)', color: 'white', borderRadius: '6px', border: '1px solid var(--surface-border)' }}
          value={topic.revisionDate || ''}
          onChange={e => onUpdate({ revisionDate: e.target.value, status: 'Needs Revision' })}
        />
      </div>
    </div>
  );
};

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

const XIcon = ({ size }) => <X size={size} />;

export default Subjects;
