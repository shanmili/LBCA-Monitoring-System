import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../../../styles/setup/SetupModal.css';

const GradeLevelModal = ({ isOpen, onClose, onSave, editingItem }) => {
  const [formData, setFormData] = useState({ level: '', name: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setFormData({ level: editingItem.level, name: editingItem.name });
      } else {
        setFormData({ level: '', name: '' });
      }
      setErrors({});
    }
  }, [isOpen, editingItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.level.trim()) newErrors.level = 'Level is required (e.g. Grade 7)';
    if (!formData.name.trim()) newErrors.name = 'Name is required (e.g. Seventh Grade)';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="setup-modal-overlay" onClick={onClose}>
      <div className="setup-modal-content" onClick={e => e.stopPropagation()}>
        <div className="setup-modal-header">
          <h3>{editingItem ? 'Edit Grade Level' : 'Add Grade Level'}</h3>
          <button className="setup-modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="setup-modal-form">
          <div className="setup-form-section">
            <h4 className="setup-form-section-title">Grade Level Details</h4>

            <div className="setup-form-group">
              <label>Level <span className="required">*</span></label>
              <input
                type="text"
                name="level"
                value={formData.level}
                onChange={handleChange}
                placeholder="e.g. Grade 7"
                className={errors.level ? 'error' : ''}
              />
              {errors.level && <span className="setup-error-text">{errors.level}</span>}
              <span className="setup-field-hint">Max 10 characters</span>
            </div>

            <div className="setup-form-group">
              <label>Name <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Seventh Grade"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="setup-error-text">{errors.name}</span>}
              <span className="setup-field-hint">Max 20 characters</span>
            </div>
          </div>

          <div className="setup-modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">
              {editingItem ? 'Save Changes' : 'Add Grade Level'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeLevelModal;