import { useState } from 'react';
import { teachersData } from '../data/mockData';

export default function useTeachersState() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'active', // Default show active accounts
    customized: 'All'
  });
  const [teachers, setTeachers] = useState(teachersData);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'All' || teacher.status === filters.status;
    const matchesCustomized = filters.customized === 'All' || 
      (filters.customized === 'yes' && teacher.hasCustomized) ||
      (filters.customized === 'no' && !teacher.hasCustomized);
    
    return matchesSearch && matchesStatus && matchesCustomized;
  });

  const getStatusBadgeClass = (status) => {
    return `status-badge ${status}`; // Returns 'status-badge active' or 'status-badge inactive'
  };

  const getCustomizedBadgeClass = (hasCustomized) => {
    return `customized-badge ${hasCustomized ? 'yes' : 'no'}`;
  };

  const handleAddTeacher = (formData) => {
    const newId = 'T' + String(teachers.length + 1).padStart(3, '0');
    const newTeacher = {
      id: newId,
      username: formData.username,
      password: formData.password,
      status: 'active',
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
      hasCustomized: false
    };
    setTeachers(prev => [...prev, newTeacher]);
    teachersData.push(newTeacher);
  };

  const handleToggleStatus = (id) => {
    setTeachers(prev => prev.map(teacher => 
      teacher.id === id 
        ? { ...teacher, status: teacher.status === 'active' ? 'inactive' : 'active' } 
        : teacher
    ));
    
    // Update mock data
    const index = teachersData.findIndex(t => t.id === id);
    if (index !== -1) {
      teachersData[index].status = teachersData[index].status === 'active' ? 'inactive' : 'active';
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    teachers,
    filteredTeachers,
    getStatusBadgeClass,
    getCustomizedBadgeClass,
    handleAddTeacher,
    handleToggleStatus,
  };
}