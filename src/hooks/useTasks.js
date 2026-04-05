import { useState, useMemo } from 'react';
import { useStudy } from '../context/StudyContext';
import { isAfter, isBefore, startOfDay, parseISO } from 'date-fns';

export const useTasks = () => {
  const { tasks, addTask, updateTask, deleteTask } = useStudy();
  const [filters, setFilters] = useState({
    status: 'All',
    priority: 'All',
    subject: 'All',
    search: ''
  });
  const [sort, setSort] = useState('deadlineAt'); // 'deadlineAt', 'priority', 'subject'

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Status Filter
    if (filters.status !== 'All') {
      if (filters.status === 'Pending') {
        result = result.filter(t => t.status === 'Pending');
      } else if (filters.status === 'Completed') {
        result = result.filter(t => t.status === 'Completed');
      } else if (filters.status === 'Overdue') {
        const today = startOfDay(new Date());
        result = result.filter(t => t.status !== 'Completed' && isBefore(parseISO(t.deadline), today));
      } else if (filters.status === 'Revision') {
        result = result.filter(t => t.status === 'Revision');
      }
    }

    // Priority Filter
    if (filters.priority !== 'All') {
      result = result.filter(t => t.priority === filters.priority);
    }

    // Subject Filter
    if (filters.subject !== 'All') {
      result = result.filter(t => t.subject === filters.subject);
    }

    // Search Query
    if (filters.search) {
      result = result.filter(t => 
        t.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.topic.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sort === 'deadlineAt') {
        return new Date(a.deadline) - new Date(b.deadline);
      }
      if (sort === 'priority') {
        const priorityScore = { High: 3, Medium: 2, Low: 1 };
        return (priorityScore[b.priority] || 0) - (priorityScore[a.priority] || 0);
      }
      if (sort === 'subject') {
        return a.subject.localeCompare(b.subject);
      }
      return 0;
    });

    return result;
  }, [tasks, filters, sort]);

  return {
    tasks: filteredTasks,
    filters,
    setFilters,
    sort,
    setSort,
    addTask,
    updateTask,
    deleteTask
  };
};
