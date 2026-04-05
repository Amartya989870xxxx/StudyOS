import { useMemo } from 'react';
import { useStudy } from '../context/StudyContext';

export const useProgress = () => {
  const { tasks, subjects, topics } = useStudy();

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = total - completed;
    const overdue = tasks.filter(t => t.status !== 'Completed' && new Date(t.deadline) < new Date()).length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    const subjectProgress = subjects.map(s => {
      const subjectTasks = tasks.filter(t => t.subject === s.name || t.subject === s.id);
      const subCompleted = subjectTasks.filter(t => t.status === 'Completed').length;
      const subTotal = subjectTasks.length;
      return {
        name: s.name,
        total: subTotal,
        completed: subCompleted,
        percentage: subTotal > 0 ? (subCompleted / subTotal) * 100 : 0,
        color: s.color
      };
    });

    const topicStats = {
      notStarted: topics.filter(t => t.status === 'Not Started').length,
      inProgress: topics.filter(t => t.status === 'In Progress').length,
      completed: topics.filter(t => t.status === 'Completed').length,
      revision: topics.filter(t => t.status === 'Needs Revision').length,
    };

    return {
      total,
      completed,
      pending,
      overdue,
      completionRate,
      subjectProgress,
      topicStats
    };
  }, [tasks, subjects, topics]);

  return stats;
};
