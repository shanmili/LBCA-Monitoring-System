import { useState } from 'react';
import useProfileSettingsState from "../../hooks/useProfileSettingsState";
import UploadPhotoModal from './profileSetting/UploadPhoto';
import '../../styles/profileSetting/ProfileSetting.css';

const ProfileSetting = ({ onNavigate, onAdminPhotoUpdate, userRole = 'admin' }) => { // Add prop
  const { 
    fname, setFname, 
    lname, setLname, 
    email, setEmail, 
    toast, showToast, 
    displayName, initials 
  } = useProfileSettingsState(userRole);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill in all password fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters');
      return;
    }
    
    showToast('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handlePhotoUpload = (file) => {
    const photoUrl = URL.createObjectURL(file);
    setProfilePhoto(photoUrl);
    
    // Update admin photo in parent if this is admin
    if (onAdminPhotoUpdate) {
      console.log('Calling onAdminPhotoUpdate with:', photoUrl);
      onAdminPhotoUpdate(photoUrl);
    }
    
    showToast('Profile photo updated successfully!');
    setShowPhotoModal(false);
  };

  const handleCancelProfile = () => {
    setFname(userRole === 'teacher' ? 'Teacher' : 'Admin');
    setLname('User');
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Back Button */}
        <button className="back-btn" onClick={() => onNavigate('dashboard')}>
          ← Back to Dashboard
        </button>

        <h1 className="profile-title">Account Settings</h1>
        <p className="profile-subtitle">Manage your personal profile information.</p>

        {/* Profile Card */}
        <div className="profile-card">
          <div className="card-label">Profile</div>
          <div className="avatar-section">
            <div className="avatar-large">
              {profilePhoto ? (
                <img 
                  src={profilePhoto} 
                  alt="Profile" 
                  className="avatar-image" 
                />
              ) : (
                initials
              )}
            </div>
            <div className="avatar-info">
              <h3 className="avatar-name">{displayName}</h3>
              <p className="avatar-email">{email}</p>
              <button className="btn-upload" onClick={() => setShowPhotoModal(true)}>
                Change photo
              </button>
            </div>
          </div>
          <div className="field-grid">
            <div className="field">
              <label className="field-label">First Name</label>
              <input 
                className="field-input" 
                type="text" 
                value={fname} 
                onChange={e => setFname(e.target.value)} 
              />
            </div>
            <div className="field">
              <label className="field-label">Last Name</label>
              <input 
                className="field-input" 
                type="text" 
                value={lname} 
                onChange={e => setLname(e.target.value)} 
              />
            </div>
            <div className="field field-full">
              <label className="field-label">Username</label>
              <input className="field-input" type="text" defaultValue="admin" />
            </div>
          </div>
          <div className="card-actions">
            <button className="btn-secondary" onClick={handleCancelProfile}>
              Cancel
            </button>
            <button className="btn-primary" onClick={() => showToast('Profile updated successfully.')}>
              Save Changes
            </button>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="profile-card">
          <div className="card-label">Contact Information</div>
          <div className="field-grid">
            <div className="field field-full">
              <label className="field-label">Email Address</label>
              <input 
                className="field-input" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            <div className="field field-full">
              <label className="field-label">Phone Number</label>
              <input className="field-input" type="tel" placeholder="+1 (555) 000-0000" />
            </div>
            <div className="field field-full">
              <label className="field-label">Website</label>
              <input className="field-input" type="url" placeholder="https://yourwebsite.com" />
            </div>
            <div className="field">
              <label className="field-label">Country</label>
              <select className="field-select">
                <option>Philippines</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Australia</option>
                <option>Singapore</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label">City</label>
              <input className="field-input" type="text" placeholder="Davao City" />
            </div>
          </div>
          <div className="card-actions">
            <button className="btn-secondary">Cancel</button>
            <button className="btn-primary" onClick={() => showToast('Contact info updated.')}>
              Save Changes
            </button>
          </div>
        </div>

        {/* Password Card */}
        <div className="profile-card">
          <div className="card-label">Password & Security</div>
          <div className="field-grid">
            <div className="field field-full">
              <label className="field-label">Current Password</label>
              <input 
                className="field-input" 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            <div className="field field-full">
              <label className="field-label">New Password</label>
              <input 
                className="field-input" 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min. 6 characters)"
              />
            </div>
            <div className="field field-full">
              <label className="field-label">Confirm New Password</label>
              <input 
                className="field-input" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <div className="password-hint">
            Password must be at least 6 characters
          </div>
          <div className="card-actions">
            <button className="btn-secondary" onClick={() => {
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
            }}>
              Clear
            </button>
            <button className="btn-primary" onClick={handlePasswordChange}>
              Update Password
            </button>
          </div>
        </div>

        {/* Account Details Card */}
        <div className="profile-card">
          <div className="card-label">Account Details</div>
          <div className="info-row">
            <span className="info-key">Account Status</span>
            <span className="badge badge-success">● Active</span>
          </div>
          <div className="info-row">
            <span className="info-key">Member Since</span>
            <span className="info-value">January 12, 2024</span>
          </div>
          <div className="info-row info-row-last">
            <span className="info-key">Last Login</span>
            <span className="info-value">Today at 9:41 AM</span>
          </div>
        </div>

        {/* Danger Zone Card */}
        <div className="profile-card">
          <div className="card-label">Danger Zone</div>
          <div className="danger-header">
            <div>
              <p className="danger-title">Delete Account</p>
              <p className="danger-desc">Permanently remove your account and all associated data.</p>
            </div>
            <button className="btn-danger" onClick={() => showToast('Contact support to delete your account.')}>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Photo Upload Modal */}
      <UploadPhotoModal 
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onUpload={handlePhotoUpload}
      />

      {/* Toast Notification */}
      {toast && <div className="profile-toast">{toast}</div>}
    </div>
  );
};

export default ProfileSetting;