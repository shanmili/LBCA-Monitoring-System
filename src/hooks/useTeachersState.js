import { useEffect, useMemo, useState } from 'react';
import { teachersData } from '../data/mockData';
import {
  createTeacher,
  deleteTeacher,
  listTeachers,
  mapTeacherToUi,
  reactivateTeacher,
} from '../api/teachersApi';

export default function useTeachersState() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'active', // Default show active accounts
    customized: 'All'
  });
  const [teachers, setTeachers] = useState(teachersData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadTeachers = async () => {
      setLoading(true);
      setError('');
      try {
        const rows = await listTeachers();
        if (isMounted) {
          setTeachers((rows || []).map(mapTeacherToUi));
        }
      } catch (requestError) {
        if (!isMounted) {
          return;
        }
        setTeachers(teachersData);
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load teachers from API.'
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTeachers();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredTeachers = useMemo(() => teachers.filter(teacher => {
    const matchesSearch = teacher.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'All' || teacher.status === filters.status;
    const matchesCustomized = filters.customized === 'All' || 
      (filters.customized === 'yes' && teacher.hasCustomized) ||
      (filters.customized === 'no' && !teacher.hasCustomized);
    
    return matchesSearch && matchesStatus && matchesCustomized;
  }), [teachers, searchTerm, filters]);

  const getStatusBadgeClass = (status) => {
    return `status-badge ${status}`; // Returns 'status-badge active' or 'status-badge inactive'
  };

  const getCustomizedBadgeClass = (hasCustomized) => {
    return `customized-badge ${hasCustomized ? 'yes' : 'no'}`;
  };

  const handleAddTeacher = async (formData) => {
    try {
      const created = await createTeacher({
        username: formData.username,
        password: formData.password,
      });

      const newTeacher = {
        id: String(created.teacher_id || ''),
        username: created.username || formData.username,
        status: 'active',
        lastLogin: 'Never',
        createdAt: new Date().toISOString().split('T')[0],
        hasCustomized: false,
      };

      setTeachers((prev) => [...prev, newTeacher]);
      setError('');
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to create teacher account.'
      );
      throw requestError;
    }
  };

  const handleToggleStatus = async (id) => {
    const teacher = teachers.find((item) => item.id === id);
    if (!teacher) {
      return;
    }

    try {
      if (teacher.status === 'active') {
        await deleteTeacher(id);
        setTeachers((prev) => prev.map((item) => (
          item.id === id ? { ...item, status: 'inactive' } : item
        )));
        setError('');
        return;
      }

      await reactivateTeacher(id);
      setTeachers((prev) => prev.map((item) => (
        item.id === id ? { ...item, status: 'active' } : item
      )));
      setError('');
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to update teacher status.'
      );
      throw requestError;
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    teachers,
    filteredTeachers,
    loading,
    error,
    getStatusBadgeClass,
    getCustomizedBadgeClass,
    handleAddTeacher,
    handleToggleStatus,
  };
}