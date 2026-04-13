import React, { useState } from 'react';
import useProfileSettingsState from "../../hooks/useProfileSettingsState";
import UploadPhotoModal from './profileSetting/UploadPhoto';
import '../../styles/profileSetting/ProfileSetting.css';

const ProfileSetting = ({ onNavigate, onAdminPhotoUpdate, userRole = 'admin' }) => {
  const { 
    fname, setFname, 
    lname, setLname, 
    email, setEmail, 
    phone, setPhone,
    username,
    accountStatus,
    memberSince,
    lastLogin,
    toast, showToast, 
    displayName, initials,
    schedule, updateScheduleDay, setSchedule, defaultSchedule,
    sections, toggleSection, availableSections,
    saveUserData, updateUserPassword, isLoading
  } = useProfileSettingsState(userRole);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const handleSaveProfile = async () => {
    await saveUserData({
      first_name: fname,
      last_name: lname,
      email: email,
      contact_number: phone,
    });

    const currentUser = JSON.parse(sessionStorage.getItem('lbca_user') || '{}');
    currentUser.firstName = fname;
    currentUser.lastName = lname;
    sessionStorage.setItem('lbca_user', JSON.stringify(currentUser));

    window.dispatchEvent(new Event('storage'));
  };

  const handlePasswordChange = async () => {
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
    
    try {
      await updateUserPassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      // Error already shown in hook
    }
  };

  const handlePhotoUpload = (file) => {
    const photoUrl = URL.createObjectURL(file);
    setProfilePhoto(photoUrl);
    
    if (onAdminPhotoUpdate) {
      onAdminPhotoUpdate(photoUrl);
    }
    
    showToast('Profile photo updated successfully!');
    setShowPhotoModal(false);
  };

  const handleCancelProfile = () => {
    window.location.reload();
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
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
                <img src={profilePhoto} alt="Profile" className="avatar-image" />
              ) : (
                <span className="avatar-initials">{initials}</span>
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
                disabled={isLoading}
              />
            </div>
            <div className="field">
              <label className="field-label">Last Name</label>
              <input 
                className="field-input" 
                type="text" 
                value={lname} 
                onChange={e => setLname(e.target.value)} 
                disabled={isLoading}
              />
            </div>
            <div className="field field-full">
              <label className="field-label">User ID</label>
              <input 
                className="field-input" 
                type="text" 
                value={username} 
                disabled 
              />
            </div>
          </div>
          <div className="card-actions">
            <button className="btn-secondary" onClick={handleCancelProfile} disabled={isLoading}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSaveProfile} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
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
                disabled={isLoading}
              />
            </div>
            <div className="field field-full">
              <label className="field-label">Phone Number</label>
              <input 
                className="field-input" 
                type="tel" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="Enter your phone number"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="card-actions">
            <button className="btn-secondary" onClick={handleCancelProfile} disabled={isLoading}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSaveProfile} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
          </div>
    
          <div className="card-actions">
            <button className="btn-secondary" onClick={() => {
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
            }} disabled={isLoading}>
              Clear
            </button>
            <button className="btn-primary" onClick={handlePasswordChange} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>

        {/* Schedule Availability Card (Teacher only) */}
        {userRole === 'teacher' && (
          <div className="profile-card">
            <div className="card-label">Schedule Availability</div>
            <p className="schedule-hint">Set your available days and time slots for classes.</p>
            <div className="schedule-list">
              {schedule.map((slot, index) => (
                <div key={slot.day} className={`schedule-row ${!slot.available ? 'schedule-row-disabled' : ''}`}>
                  <label className="schedule-day-toggle">
                    <input
                      type="checkbox"
                      checked={slot.available}
                      onChange={(e) => updateScheduleDay(index, 'available', e.target.checked)}
                      className="schedule-checkbox"
                    />
                    <span className="schedule-day-name">{slot.day}</span>
                  </label>
                  <div className="schedule-time-group">
                    <input
                      type="time"
                      className="field-input schedule-time-input"
                      value={slot.startTime}
                      onChange={(e) => updateScheduleDay(index, 'startTime', e.target.value)}
                      disabled={!slot.available}
                    />
                    <span className="schedule-time-separator">to</span>
                    <input
                      type="time"
                      className="field-input schedule-time-input"
                      value={slot.endTime}
                      onChange={(e) => updateScheduleDay(index, 'endTime', e.target.value)}
                      disabled={!slot.available}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="card-actions">
              <button className="btn-secondary" onClick={() => setSchedule(defaultSchedule)}>
                Reset to Default
              </button>
              <button className="btn-primary" onClick={() => showToast('Schedule updated successfully.')}>
                Save Schedule
              </button>
            </div>
          </div>
        )}

        {/* Section Handled Card (Teacher only) */}
        {userRole === 'teacher' && (
          <div className="profile-card">
            <div className="card-label">Section Handled</div>
            <p className="schedule-hint">Select the sections you are currently handling.</p>
            <div className="sections-grid">
              {availableSections.map((section) => (
                <label key={section} className={`section-chip ${sections.includes(section) ? 'section-chip-active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={sections.includes(section)}
                    onChange={() => toggleSection(section)}
                    className="section-chip-input"
                  />
                  <span className="section-chip-label">{section}</span>
                </label>
              ))}
            </div>
            {sections.length > 0 && (
              <div className="sections-summary">
                <span className="sections-summary-label">Currently handling:</span>
                <span className="sections-summary-value">{sections.join(', ')}</span>
              </div>
            )}
            <div className="card-actions">
              <button className="btn-secondary" onClick={() => setSections([])}>Cancel</button>
              <button className="btn-primary" onClick={() => showToast('Sections updated successfully.')}>
                Save Sections
              </button>
            </div>
          </div>
        )}

        {/* Account Details Card */}
        <div className="profile-card">
          <div className="card-label">Account Details</div>
          <div className="info-row">
            <span className="info-key">Account Status</span>
            <span className={`badge ${accountStatus === 'Active' ? 'badge-success' : 'badge-danger'}`}>
              ● {accountStatus}
            </span>
          </div>
          <div className="info-row">
            <span className="info-key">Member Since</span>
            <span className="info-value">{memberSince}</span>
          </div>
          <div className="info-row info-row-last">
            <span className="info-key">Last Login</span>
            <span className="info-value">{lastLogin}</span>
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