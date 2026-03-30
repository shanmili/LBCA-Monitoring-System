import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../../../styles/setup/SetupModal.css';

const SectionModal = ({ isOpen, onClose, onSave, editingItem, gradeLevels = [], prefillGradeId = null }) => {
  const [formData, setFormData] = useState({ grade_level: '', section_code: '', name: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setFormData({
          grade_level: editingItem.grade_level,
          section_code: editingItem.section_code,
          name: editingItem.name,
        });
      } else {
        setFormData({ grade_level: prefillGradeId ?? '', section_code: '', name: '' });
      }
      setErrors({});
    }
  }, [isOpen, editingItem, prefillGradeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.grade_level) newErrors.grade_level = 'Please select a grade level';
    if (!formData.section_code.trim()) newErrors.section_code = 'Section code is required (e.g. 7-A)';
    if (!formData.name.trim()) newErrors.name = 'Section name is required (e.g. Section A)';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onSave({ ...formData, grade_level: Number(formData.grade_level) });
  };

  if (!isOpen) return null;

  return (
    <div className="setup-modal-overlay" onClick={onClose}>
      <div className="setup-modal-content" onClick={e => e.stopPropagation()}>
        <div className="setup-modal-header">
          <h3>{editingItem ? 'Edit Section' : 'Add Section'}</h3>
          <button className="setup-modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="setup-modal-form">
          <div className="setup-form-section">
            <h4 className="setup-form-section-title">Section Details</h4>

            <div className="setup-form-group">
              <label>Grade Level <span className="required">*</span></label>
              <select
                name="grade_level"
                value={formData.grade_level}
                onChange={handleChange}
                className={errors.grade_level ? 'error' : ''}
              >
                <option value="">-- Select Grade Level --</option>
                {gradeLevels.map(gl => (
                  <option key={gl.grade_level_id} value={gl.grade_level_id}>{gl.level}</option>
                ))}
              </select>
              {errors.grade_level && <span className="setup-error-text">{errors.grade_level}</span>}
            </div>

            <div className="setup-form-grid">
              <div className="setup-form-group">
                <label>Section Code <span className="required">*</span></label>
                <input
                  type="text"
                  name="section_code"
                  value={formData.section_code}
                  onChange={handleChange}
                  placeholder="e.g. 7-A"
                  className={errors.section_code ? 'error' : ''}
                />
                {errors.section_code && <span className="setup-error-text">{errors.section_code}</span>}
                <span className="setup-field-hint">Must be unique. Max 20 characters.</span>
              </div>

              <div className="setup-form-group">
                <label>Section Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Section A"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="setup-error-text">{errors.name}</span>}
                <span className="setup-field-hint">Max 30 characters.</span>
              </div>
            </div>
          </div>

          <div className="setup-modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">
              {editingItem ? 'Save Changes' : 'Add Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SectionModal;