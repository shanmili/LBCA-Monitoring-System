import { X } from 'lucide-react';
import useStudentFormState from '../../../hooks/useStudentFormState';
import '../../../styles/students/StudentFormModal.css';

const StudentFormModal = ({ isOpen, onClose, onSave, student }) => {
  const {
    isEdit,
    formData,
    studentSections,
    studentGrades,
    handleChange,
    handleGuardianChange,
    handleSubmit,
  } = useStudentFormState({ isOpen, student, onSave });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? 'Edit Student' : 'Add New Student'}</h3>
          <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Student Personal Information */}
          <div className="form-section">
            <h4 className="form-section-title">Student Personal Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name <span className="required">*</span></label>
                <input 
                  type="text" 
                  required 
                  placeholder="First name" 
                  value={formData.firstName} 
                  onChange={e => handleChange('firstName', e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>Middle Name</label>
                <input 
                  type="text" 
                  placeholder="Middle name (optional)" 
                  value={formData.middleName} 
                  onChange={e => handleChange('middleName', e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>Last Name <span className="required">*</span></label>
                <input 
                  type="text" 
                  required 
                  placeholder="Last name" 
                  value={formData.lastName} 
                  onChange={e => handleChange('lastName', e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>Date of Birth <span className="required">*</span></label>
                <input 
                  type="date" 
                  required 
                  value={formData.dateOfBirth} 
                  onChange={e => handleChange('dateOfBirth', e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>Gender <span className="required">*</span></label>
                <select 
                  required 
                  value={formData.gender} 
                  onChange={e => handleChange('gender', e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group field-full">
                <label>Address <span className="required">*</span></label>
                <input 
                  type="text" 
                  required 
                  placeholder="Complete address" 
                  value={formData.address} 
                  onChange={e => handleChange('address', e.target.value)} 
                />
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div className="form-section">
            <h4 className="form-section-title">Guardian Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Guardian First Name <span className="required">*</span></label>
                <input 
                  type="text" 
                  required 
                  placeholder="First name" 
                  value={formData.guardianFirstName} 
                  onChange={e => handleGuardianChange('firstName', e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>Guardian Middle Name</label>
                <input 
                  type="text" 
                  placeholder="Middle name (optional)" 
                  value={formData.guardianMiddleName} 
                  onChange={e => handleGuardianChange('middleName', e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>Guardian Last Name <span className="required">*</span></label>
                <input 
                  type="text" 
                  required 
                  placeholder="Last name" 
                  value={formData.guardianLastName} 
                  onChange={e => handleGuardianChange('lastName', e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>Contact Number <span className="required">*</span></label>
                <input 
                  type="tel" 
                  required 
                  placeholder="+63 XXX XXX XXXX" 
                  value={formData.guardianContact} 
                  onChange={e => handleGuardianChange('contact', e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>Relationship <span className="required">*</span></label>
                <select 
                  required 
                  value={formData.guardianRelationship} 
                  onChange={e => handleGuardianChange('relationship', e.target.value)}
                >
                  <option value="">Select Relationship</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Legal Guardian</option>
                  <option value="Grandparent">Grandparent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Enrollment Information */}
          <div className="form-section">
            <h4 className="form-section-title">Enrollment Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Grade Level <span className="required">*</span></label>
                <select 
                  required 
                  value={formData.gradeLevel} 
                  onChange={e => handleChange('gradeLevel', e.target.value)}
                >
                  <option value="">Select Grade</option>
                  {studentGrades.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Section <span className="required">*</span></label>
                <select 
                  required 
                  value={formData.section} 
                  onChange={e => handleChange('section', e.target.value)}
                >
                  <option value="">Select Section</option>
                  {studentSections.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">{isEdit ? 'Save Changes' : 'Add Student'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFormModal;