import { useStudy } from '../context/StudyContext';

export const useSubjects = () => {
  const { subjects, topics, addSubject, updateSubject, deleteSubject, addTopic, updateTopic, deleteTopic } = useStudy();

  const getTopicsBySubject = (subjectId) => {
    return topics.filter(t => t.subjectId === subjectId);
  };

  const getSubjectById = (id) => {
    return subjects.find(s => s.id === id);
  };

  return {
    subjects,
    topics,
    addSubject,
    updateSubject,
    deleteSubject,
    addTopic,
    updateTopic,
    deleteTopic,
    getTopicsBySubject,
    getSubjectById
  };
};
