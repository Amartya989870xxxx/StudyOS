import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { addDays, isAfter, parseISO } from 'date-fns';

const StudyContext = createContext();

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};

export const StudyProvider = ({ children }) => {
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('study_subjects');
    return saved ? JSON.parse(saved) : [];
  });

  const [topics, setTopics] = useState(() => {
    const saved = localStorage.getItem('study_topics');
    return saved ? JSON.parse(saved) : [];
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('study_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('study_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('study_topics', JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem('study_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Revision Logic: Check if completed topics need revision (3 days after completion)
  // For simplicity, we'll store a 'completedAt' date when status becomes 'Completed'
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTopics(prev => prev.map(topic => {
        if (topic.status === 'Completed' && topic.completedAt) {
          const revisionDate = addDays(parseISO(topic.completedAt), 3);
          if (isAfter(now, revisionDate)) {
            return { ...topic, status: 'Needs Revision' };
          }
        }
        return topic;
      }));
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Subject Actions
  const addSubject = (subject) => {
    const newSubject = { ...subject, id: uuidv4() };
    setSubjects([...subjects, newSubject]);
    return newSubject;
  };

  const deleteSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
    setTopics(topics.filter(t => t.subjectId !== id));
    setTasks(tasks.filter(t => t.subject !== id)); // Assuming 'subject' in task is the subject name or ID
  };

  const updateSubject = (updatedSubject) => {
    setSubjects(subjects.map(s => s.id === updatedSubject.id ? updatedSubject : s));
  };

  // Topic Actions
  const addTopic = (topic) => {
    const newTopic = { 
      ...topic, 
      id: uuidv4(), 
      completedAt: topic.status === 'Completed' ? new Date().toISOString() : null,
      revisionDate: topic.revisionDate || null
    };
    setTopics([...topics, newTopic]);
    return newTopic;
  };

  const updateTopic = (updatedTopic) => {
    const newTopic = { ...updatedTopic };
    if (updatedTopic.status === 'Completed' && !updatedTopic.completedAt) {
      newTopic.completedAt = new Date().toISOString();
    } else if (updatedTopic.status === 'Not Started' || updatedTopic.status === 'In Progress') {
      newTopic.completedAt = null;
      newTopic.revisionDate = null; // Clear manual revision if back to square one
    }
    // Maintain revisionDate if manually set
    setTopics(topics.map(t => t.id === updatedTopic.id ? newTopic : t));
  };

  const deleteTopic = (id) => {
    setTopics(topics.filter(t => t.id !== id));
    setTasks(tasks.filter(t => t.topic !== id)); // Assuming 'topic' in task is topic name or ID
  };

  // Task Actions
  const addTask = (task) => {
    const newTask = { 
      ...task, 
      id: uuidv4(),
      completedAt: task.status === 'Completed' ? new Date().toISOString() : null
    };
    setTasks([...tasks, newTask]);
    return newTask;
  };

  const updateTask = (updatedTask) => {
    const newTask = { ...updatedTask };
    if (updatedTask.status === 'Completed' && !updatedTask.completedAt) {
      newTask.completedAt = new Date().toISOString();
    } else if (updatedTask.status !== 'Completed') {
      newTask.completedAt = null;
    }
    setTasks(tasks.map(t => t.id === updatedTask.id ? newTask : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const value = {
    subjects,
    topics,
    tasks,
    addSubject,
    updateSubject,
    deleteSubject,
    addTopic,
    updateTopic,
    deleteTopic,
    addTask,
    updateTask,
    deleteTask
  };

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
};
