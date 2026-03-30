import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../../../styles/setup/SetupModal.css';

const SchoolYearModal = ({ isOpen, onClose, onSave, editingItem }) => {
  const [formData, setFormData] = useState({
    year: '',
    start_date: '',
    end_date: '',
    is_current: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setFormData({
          year: editingItem.year,
          start_date: editingItem.start_date,
          end_date: editingItem.end_date,
          is_current: editingItem.is_current,
        });
      } else {
        setFormData({ year: '', start_date: '', end_date: '', is_current: false });
      }
      setErrors({});
    }
  }, [isOpen, editingItem]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    const yearPattern = /^\d{4}-\d{4}$/;

    if (!formData.year.trim()) {
      newErrors.year = 'School year is required';
    } else if (!yearPattern.test(formData.year)) {
      newErrors.year = 'Format must be YYYY-YYYY (e.g. 2024-2025)';
    } else {
      const [a, b] = formData.year.split('-').map(Number);
      if (b !== a + 1) newErrors.year = 'The second year must be one after the first';
    }

    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.end_date) newErrors.end_date = 'End date is required';
    if (formData.start_date && formData.end_date && formData.end_date <= formData.start_date) {
      newErrors.end_date = 'End date must be after start date';
    }

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
          <h3>{editingItem ? 'Edit School Year' : 'Add School Year'}</h3>
          <button className="setup-modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="setup-modal-form">
          <div className="setup-form-section">
            <h4 className="setup-form-section-title">School Year Details</h4>

            <div className="setup-form-group">
              <label>Year <span className="required">*</span></label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="e.g. 2024-2025"
                className={errors.year ? 'error' : ''}
              />
              {errors.year && <span className="setup-error-text">{errors.year}</span>}
            </div>

            <div className="setup-form-grid">
              <div className="setup-form-group">
                <label>Start Date <span className="required">*</span></label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className={errors.start_date ? 'error' : ''}
                />
                {errors.start_date && <span className="setup-error-text">{errors.start_date}</span>}
              </div>

              <div className="setup-form-group">
                <label>End Date <span className="required">*</span></label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className={errors.end_date ? 'error' : ''}
                />
                {errors.end_date && <span className="setup-error-text">{errors.end_date}</span>}
              </div>
            </div>

            <div className="setup-form-checkbox">
              <input
                type="checkbox"
                id="is_current"
                name="is_current"
                checked={formData.is_current}
                onChange={handleChange}
              />
              <label htmlFor="is_current">Set as current school year</label>
            </div>
            <p className="setup-helper-text">Setting this as current will unset any previously active school year.</p>
          </div>

          <div className="setup-modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">
              {editingItem ? 'Save Changes' : 'Add School Year'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchoolYearModal;