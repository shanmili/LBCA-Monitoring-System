import { useEffect, useState } from 'react';
import { Users, UserPlus, CheckCircle, XCircle, UserCheck } from 'lucide-react';
import TeacherTable from './teachers/TeacherTable';
import TeacherFilter from './teachers/TeacherFilter';
import TeacherFormModal from './teachers/TeacherFormModal';
import useTeachersState from '../../hooks/useTeachersState.js';
import '../../styles/teachers/TeachersPage.css';

const TeachersPage = ({ onNavigate, searchQuery = '' }) => {
  const {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    filteredTeachers,
    teachers,
    loading,
    error,
    getStatusBadgeClass,
    getCustomizedBadgeClass,
    handleAddTeacher,
    handleToggleStatus,
  } = useTeachersState();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setSearchTerm(searchQuery || '');
  }, [searchQuery, setSearchTerm]);

  const stats = {
    total: teachers.length,
    active: teachers.filter(t => t.status === 'active').length,
    inactive: teachers.filter(t => t.status === 'inactive').length,
    customized: teachers.filter(t => t.hasCustomized).length
  };

  return (
    <div className="teachers-page">
      <div className="teachers-header-row">
        <div className="header-title">
          <div className="title-wrapper">
            <Users size={24} />
            <h2>Teacher Accounts</h2>
          </div>
          <p className="header-subtitle">Create and manage teacher login accounts</p>
        </div>
        
        <div className="teachers-filters">
          <TeacherFilter 
            filters={filters}
            onFilterChange={updateFilter}
          />
          <button className="add-teacher-btn" onClick={() => setIsModalOpen(true)}>
            <UserPlus size={16} />
            <span>Create Account</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - No border colors, just icons */}
      <div className="teacher-stats">
        <div className="stat-card">
          <Users size={24} className="stat-icon total" />
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Accounts</span>
          </div>
        </div>
        <div className="stat-card">
          <CheckCircle size={24} className="stat-icon active" />
          <div className="stat-content">
            <span className="stat-value">{stats.active}</span>
            <span className="stat-label">Active</span>
          </div>
        </div>
        <div className="stat-card">
          <XCircle size={24} className="stat-icon inactive" />
          <div className="stat-content">
            <span className="stat-value">{stats.inactive}</span>
            <span className="stat-label">Inactive</span>
          </div>
        </div>
        <div className="stat-card">
          <UserCheck size={24} className="stat-icon customized" />
          <div className="stat-content">
            <span className="stat-value">{stats.customized}</span>
            <span className="stat-label">Customized</span>
          </div>
        </div>
      </div>
      
      <TeacherTable 
        teachers={loading ? [] : filteredTeachers}
        onToggleStatus={handleToggleStatus}
        getStatusBadgeClass={getStatusBadgeClass}
        getCustomizedBadgeClass={getCustomizedBadgeClass}
      />

      {loading && <p>Loading teachers...</p>}
      {error && <p style={{ color: '#991B1B' }}>API warning: {error}</p>}

      <div className="teachers-footer">
        <p>Showing {filteredTeachers.length} of {teachers.length} teacher accounts</p>
      </div>

      <TeacherFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={async (data) => {
          try {
            await handleAddTeacher(data);
            setIsModalOpen(false);
          } catch (requestError) {
            alert(requestError?.message || 'Failed to create teacher account.');
          }
        }}
      />
    </div>
  );
};

export default TeachersPage;