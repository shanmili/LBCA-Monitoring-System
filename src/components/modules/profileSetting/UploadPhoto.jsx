import { useState } from 'react';
import "../../../styles/profileSetting/UploadPhoto.css";

const UploadPhoto = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      // Reset state
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="upload-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Change Profile Photo</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        
        <div className="modal-body">
          {previewUrl ? (
            <div className="preview-container">
              <img src={previewUrl} alt="Preview" className="image-preview" />
            </div>
          ) : (
            <div className="upload-area" onClick={() => document.getElementById('file-upload').click()}>
              <div className="upload-icon">📸</div>
              <p>Click to browse or drag and drop</p>
              <p className="upload-hint">PNG, JPG, GIF up to 5MB</p>
            </div>
          )}
          
          <input
            type="file"
            id="file-upload"
            accept="image/*"
            onChange={handleFileSelect}
            className="file-input"
          />
          
          {!previewUrl && (
            <label htmlFor="file-upload" className="btn-browse">
              Choose Image
            </label>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button 
            className="btn-primary" 
            onClick={handleUpload}
            disabled={!selectedFile}
          >
            Upload Photo
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPhoto;