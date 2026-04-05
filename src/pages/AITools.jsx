import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Sparkles, 
  FileText, 
  HelpCircle, 
  Layers, 
  Send, 
  Loader2,
  Copy,
  Check,
  Download
} from 'lucide-react';
import { generateStudyContent } from '../services/aiService';
import { toast } from 'react-toastify';
import { marked } from 'marked';

const AITools = () => {
  const [topic, setTopic] = useState('');
  const [activeTool, setActiveTool] = useState('summary'); // 'summary', 'questions', 'flashcards'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [flashcardCount, setFlashcardCount] = useState(5);

  const tools = [
    { id: 'summary', name: 'Topic Summary', icon: <FileText size={20} />, description: 'Generate a concise summary of key concepts.' },
    { id: 'questions', name: 'Practice Quiz', icon: <HelpCircle size={20} />, description: 'Create multiple choice or open-ended questions.' },
    { id: 'flashcards', name: 'Flashcards', icon: <Layers size={20} />, description: 'Build active recall cards for rapid revision.' },
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error('Please enter a topic name.');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const data = await generateStudyContent(activeTool, topic, activeTool === 'flashcards' ? flashcardCount : 4);
      setResult(data);
      toast.success(`${activeTool.charAt(0).toUpperCase() + activeTool.slice(1)} generated!`);
    } catch (err) {
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const text = typeof result.content === 'string' 
      ? result.content 
      : JSON.stringify(result.content, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.info('Copied to clipboard');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: '16px', background: 'var(--primary-glow)', boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)' }}>
            <Cpu size={32} color="white" />
          </div>
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-1px' }}>AI Study Assistant</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Leverage artificial intelligence to accelerate your learning process.</p>
      </header>

      {/* Tool Selection */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => { setActiveTool(tool.id); setResult(null); }}
            className={`glass glass-hover ${activeTool === tool.id ? 'active-tool' : ''}`}
            style={{ 
              padding: '1.5rem', 
              textAlign: 'left', 
              cursor: 'pointer',
              border: activeTool === tool.id ? '1px solid var(--accent-purple)' : '1px solid var(--surface-border)',
              background: activeTool === tool.id ? 'rgba(139, 92, 246, 0.05)' : 'rgba(255, 255, 255, 0.02)'
            }}
          >
            <div style={{ color: activeTool === tool.id ? 'var(--accent-purple)' : 'var(--text-dim)', marginBottom: '0.75rem' }}>
              {tool.icon}
            </div>
            <h4 style={{ fontWeight: 700, marginBottom: '0.25rem', color: activeTool === tool.id ? 'var(--text-main)' : 'var(--text-muted)' }}>{tool.name}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{tool.description}</p>
          </button>
        ))}
      </div>

      {/* Generation Form */}
      <motion.form 
        layout
        onSubmit={handleGenerate} 
        className="glass" 
        style={{ padding: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}
      >
        <div style={{ flex: 1, position: 'relative' }}>
          <Sparkles size={18} color="var(--accent-purple)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder={`Enter a topic for ${activeTool}...`} 
            value={topic}
            onChange={e => setTopic(e.target.value)}
            className="glass"
            style={{ 
              width: '100%', 
              padding: '16px 20px 16px 48px', 
              borderRadius: '16px', 
              border: '1px solid var(--surface-border)',
              background: 'rgba(255,255,255,0.02)',
              fontSize: '1rem',
              color: 'var(--text-main)',
              outline: 'none'
            }}
          />
        </div>
        {activeTool === 'flashcards' && (
          <div style={{ position: 'relative', width: '100px' }}>
             <select 
              value={flashcardCount}
              onChange={e => setFlashcardCount(Number(e.target.value))}
              className="glass"
              style={{ padding: '16px 12px', background: 'rgba(20,20,25,1)', color: 'white', borderRadius: '12px', width: '100%', fontSize: '0.9rem', outline: 'none' }}
             >
                {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map(n => (
                  <option key={n} value={n}>{n} Cards</option>
                ))}
             </select>
          </div>
        )}
        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary" 
          style={{ padding: '16px 30px', borderRadius: '16px', minWidth: '160px' }}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={20} /> Generate</>}
        </button>
      </motion.form>

      {/* Results Area */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass"
            style={{ padding: '2.5rem', minHeight: '400px', position: 'relative' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{result.title}</h3>
            </div>

            <div style={{ lineHeight: 1.7, color: 'var(--text-muted)' }}>
              {activeTool === 'flashcards' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {result.content.map((card, i) => (
                    <Flashcard key={i} front={card.front} back={card.back} index={i} />
                  ))}
                </div>
              ) : (
                <div 
                  className="markdown-content"
                  dangerouslySetInnerHTML={{ __html: marked.parse(String(result.content || '')) }}
                />
              )}
            </div>
            
            <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--surface-border)', display: 'center', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
               <p style={{ fontSize: '0.9rem' }}>Was this generation helpful? Let us know to improve future results.</p>
               <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                  <button className="btn-ghost" style={{ padding: '6px 20px', borderRadius: '30px' }}>Yes</button>
                  <button className="btn-ghost" style={{ padding: '6px 20px', borderRadius: '30px' }}>No</button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .active-tool {
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .markdown-content b, .markdown-content strong {
          color: var(--text-main);
          font-weight: 700;
        }
        .markdown-content h3 {
          margin: 1.5rem 0 0.5rem 0;
          color: var(--text-main);
        }
      `}</style>
    </div>
  );
};

const Flashcard = ({ front, back, index }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div 
      onClick={() => setFlipped(!flipped)}
      style={{ 
        perspective: '1000px', 
        height: '200px', 
        cursor: 'pointer'
      }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '100%', 
          transformStyle: 'preserve-3d' 
        }}
      >
        {/* Front */}
        <div style={{ 
          position: 'absolute', 
          width: '100%', 
          height: '100%', 
          backfaceVisibility: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          textAlign: 'center',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--surface-border)',
          borderRadius: '16px',
          zIndex: 2
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', position: 'absolute', top: '12px', left: '16px' }}>Card #{index + 1}</span>
          <h5 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>{front}</h5>
          <p style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', marginTop: '1rem', fontWeight: 700 }}>FLIP TO REVEAL</p>
        </div>

        {/* Back */}
        <div style={{ 
          position: 'absolute', 
          width: '100%', 
          height: '100%', 
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          textAlign: 'center',
          background: 'var(--primary-glow)',
          borderRadius: '16px',
          color: 'white'
        }}>
          <p style={{ fontSize: '1rem', fontWeight: 500, lineHeight: 1.5 }}>{back}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AITools;
