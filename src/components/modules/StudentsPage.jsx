import { useState } from 'react';
import StudentTable from './students/StudentTable';
import StudentFilter from './students/StudentFilter';
import StudentFormModal from './students/StudentFormModal';
import useStudentsPageState from '../../hooks/useStudentsPageState';
import '../../styles/students/StudentsPage.css';

const StudentsPage = ({ onNavigate, teacher = null }) => {
  const {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    filteredStudents,
    students,
    getStatusBadgeClass,
    handleAddStudent,
  } = useStudentsPageState(teacher);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="students-page">
      <div className="students-header-row">
        <div className="header-title">
          <div className="title-wrapper">
            <h2>Students List</h2>
          </div>
          <p className="header-subtitle">Manage and view all enrolled students</p>
        </div>
        
        <div className="students-filters">
          <StudentFilter 
            filters={filters}
            onFilterChange={updateFilter}
            teacher={teacher}
          />
          <button className="add-student-btn" onClick={() => setIsModalOpen(true)}>
            + Add Student
          </button>
        </div>
      </div>
      
      <StudentTable 
        students={filteredStudents}
        getStatusBadgeClass={getStatusBadgeClass}
        onNavigate={onNavigate}
      />

      <div className="students-footer">
        <p>Showing {filteredStudents.length} of {students.length} students</p>
      </div>

      <StudentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(newStudent) => {
          handleAddStudent(newStudent);
          setIsModalOpen(false);
        }}
        student={null}
      />
    </div>
  );
};

export default StudentsPage;