import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  History, 
  Cpu, 
  Menu, 
  X,
  Search,
  Zap,
  Sun,
  Moon
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Subjects', icon: <BookOpen size={20} />, path: '/subjects' },
    { name: 'Tasks', icon: <CheckSquare size={20} />, path: '/tasks' },
    { name: 'Revision', icon: <History size={20} />, path: '/revision' },
    { name: 'AI Assistant', icon: <Cpu size={20} />, path: '/ai-tools' },
  ];

  return (
    <div className="layout-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
      {/* Sidebar - Desktop */}
      <aside 
        className="glass sidebar" 
        style={{ 
          width: '260px', 
          padding: '2rem 1.5rem', 
          height: '100vh', 
          position: 'sticky', 
          top: 0,
          flexDirection: 'column',
          borderRight: '1px solid var(--surface-border)',
          borderRadius: 0,
          zIndex: 50
        }}
      >
        <SidebarContent navItems={navItems} />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                zIndex: 90
              }}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.8 }}
              className="glass sidebar-mobile"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: '280px',
                padding: '2rem 1.5rem',
                zIndex: 100,
                borderRadius: 0,
                borderRight: '1px solid var(--surface-border)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <button 
                  onClick={() => setSidebarOpen(false)} 
                  className="btn-ghost" 
                  style={{ padding: '8px', borderRadius: '50%' }}
                >
                  <X size={20} />
                </button>
              </div>
              <SidebarContent navItems={navItems} closeSidebar={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
        {/* Mobile Toggle - Floating */}
        <button 
          className="mobile-toggle btn-ghost glass" 
          onClick={() => setSidebarOpen(true)}
          style={{ 
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            padding: '10px', 
            borderRadius: '12px',
            zIndex: 40,
            background: 'var(--surface-color)',
            border: '1px solid var(--surface-border)'
          }}
        >
          <Menu size={20} />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Main Content Area */}
        <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      <style>{`
        @media (min-width: 1024px) {
          .sidebar { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 1023px) {
          .mobile-toggle { display: flex !important; }
        }
        
        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: var(--text-muted);
          text-decoration: none;
          border-radius: 12px;
          margin-bottom: 8px;
          transition: var(--transition-smooth);
        }

        .nav-link:hover {
          background: var(--surface-hover);
          color: var(--text-main);
        }

        .nav-link.active {
          background: var(--primary-glow);
          color: var(--btn-text);
          font-weight: 700;
          box-shadow: 0 4px 15px -5px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

const SidebarContent = ({ navItems, closeSidebar }) => (
  <>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}>
      <Zap color="var(--accent-beige)" fill="var(--accent-beige)" size={28} />
      <span style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-1px', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>StudyOS</span>
    </div>
    <nav style={{ flex: 1 }}>
      {navItems.map((item) => (
        <NavLink 
          key={item.path} 
          to={item.path} 
          className="nav-link"
          onClick={closeSidebar}
        >
          {item.icon}
          <span style={{ fontWeight: 500 }}>{item.name}</span>
        </NavLink>
      ))}
    </nav>
  </>
);

const SearchBar = () => (
  <div style={{ position: 'relative', display: 'none' /* Will enable later */ }}>
    <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
    <input 
      type="text" 
      placeholder="Search anything..." 
      className="glass"
      style={{ 
        padding: '10px 12px 10px 40px', 
        borderRadius: '12px', 
        border: '1px solid var(--surface-border)',
        background: 'rgba(255,255,255,0.05)',
        color: 'var(--text-main)',
        fontSize: '0.9rem',
        width: '250px'
      }}
    />
  </div>
);

export default Layout;
