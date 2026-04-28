import { useState, useCallback } from 'react';
import { subjectApi } from '../services/api.js';

const useSubjectState = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchSubjects = useCallback(async (gradeLevelId = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await subjectApi.list(gradeLevelId);
      setSubjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id) => {
    const target = subjects.find(s => s.subject_id === id);
    if (!window.confirm(`Delete "${target?.subject_name}" subject?`)) return;

    setSaving(true);
    try {
      await subjectApi.delete(id);
      setSubjects(prev => prev.filter(s => s.subject_id !== id));
    } catch (err) {
      alert(`Failed to delete subject: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editingItem) {
        await subjectApi.update(editingItem.subject_id, data);
      } else {
        await subjectApi.create(data);
      }
      setModalOpen(false);
      setEditingItem(null);
      await fetchSubjects();
    } catch (err) {
      const errorMessage = err.message || 'Failed to save subject';
      throw new Error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  return {
    subjects,
    loading,
    error,
    modalOpen,
    editingItem,
    saving,
    fetchSubjects,
    handleDelete,
    handleSave,
    openModal,
    setModalOpen,
  };
};

export default useSubjectState;
