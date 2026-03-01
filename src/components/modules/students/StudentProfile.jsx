import { useParams } from 'react-router-dom';
import { ArrowLeft, User, BookOpen, Calendar, AlertTriangle, Printer, Pencil } from 'lucide-react';
import useStudentProfileState from '../../../hooks/useStudentProfileState';
import RiskBadge from '../../common/RiskBadge';
import StudentFormModal from './StudentFormModal';
import ProfileOverviewTab from './profile/ProfileOverviewTab';
import ProfilePaceTab from './profile/ProfilePaceTab';
import ProfileAttendanceTab from './profile/ProfileAttendanceTab';
import ProfileRiskTab from './profile/ProfileRiskTab';
import '../../../styles/students/StudentProfile.css';

const TAB_ICONS = { 
  overview: User, 
  pace: BookOpen, 
  attendance: Calendar, 
  risk: AlertTriangle 
};

const StudentProfile = ({ onNavigate }) => {
  const { studentId } = useParams();

  const {
    TABS,
    activeTab, setActiveTab,
    showEditModal, setShowEditModal,
    student,
    handleSaveEdit,
    handlePrint,
  } = useStudentProfileState(studentId);

  if (!student) {
    return (
      <div className="student-profile">
        <header className="profile-header">
          <button className="back-button" onClick={() => onNavigate('students')}>
            <ArrowLeft size={20} />
            <span>Back to Students</span>
          </button>
        </header>
        <div className="profile-card">
          <div className="no-data-message">
            Student not found. (ID: {studentId})
          </div>
        </div>
      </div>
    );
  }

  // Helper function to get full name
  const getFullName = () => {
    const middleInitial = student.middleName ? ` ${student.middleName.charAt(0)}.` : '';
    return `${student.lastName}, ${student.firstName}${middleInitial}`;
  };

  // Helper function to get guardian full name
  const getGuardianFullName = () => {
    const middleInitial = student.guardianMiddleName ? ` ${student.guardianMiddleName.charAt(0)}.` : '';
    return `${student.guardianLastName}, ${student.guardianFirstName}${middleInitial}`;
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':    return <ProfileOverviewTab student={student} />;
      case 'pace':        return <ProfilePaceTab student={student} />;
      case 'attendance':  return <ProfileAttendanceTab student={student} />;
      case 'risk':        return <ProfileRiskTab student={student} />;
      default:            return null;
    }
  };

  return (
    <div className="student-profile">
      <header className="profile-header">
        <button className="back-button" onClick={() => onNavigate('students')}>
          <ArrowLeft size={20} />
          <span>Back to Students</span>
        </button>
        <div className="profile-header-actions">
          <button 
            className="profile-edit-btn" 
            onClick={() => setShowEditModal(true)} 
            title="Edit Student Profile"
          >
            <Pencil size={16} />
            <span>Edit</span>
          </button>
          <button 
            className="profile-print-btn" 
            onClick={handlePrint} 
            title="Print Student Overview"
          >
            <Printer size={16} />
            <span>Print</span>
          </button>
        </div>
      </header>

      <div className="profile-card">
        <div className="profile-info">
          <div className="student-profile-icon">
            <User size={40} />
          </div>
          <div className="profile-details">
            <h2>{getFullName()}</h2>
            <p>{student.gradeLevel} • {student.section} • ID: {student.id}</p>
          </div>
          <div className="profile-status">
            <RiskBadge level={student.riskLevel} />
          </div>
        </div>

        <nav className="profile-tabs">
          {TABS.map(tab => {
            const Icon = TAB_ICONS[tab.id];
            return (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {renderTab()}
      </div>

      <StudentFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        student={student}
      />
    </div>
  );
};

export default StudentProfile;