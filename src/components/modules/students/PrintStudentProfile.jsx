// This component generates the HTML for printing student profiles
const PrintStudentProfile = (studentData, getFullName, getGuardianFullName, printDate) => {
  // Generate HTML for PACE table
  const paceTableRows = studentData.subjects?.map(subj => {
    const pct = Math.round((subj.completed / subj.total) * 100);
    return `
      <tr>
        <td>${subj.name}</td>
        <td>${subj.completed}/${subj.total}</td>
        <td>${pct}%</td>
        <td>${subj.testScore}%</td>
        <td><span class="status-badge ${subj.status === 'Behind' ? 'status-behind' : 'status-ontrack'}">${subj.status}</span></td>
      </tr>
    `;
  }).join('');

  // Generate HTML for risk details
  const riskDetailsHtml = studentData.riskDetails?.map(detail => `
    <div class="risk-detail ${detail.severity.toLowerCase()}">
      <div class="risk-detail-header">
        <strong>${detail.factor}</strong>
        <span class="severity-badge ${detail.severity.toLowerCase()}">${detail.severity}</span>
      </div>
      <p>${detail.detail}</p>
    </div>
  `).join('') || '<p>No risk factors detected.</p>';

  // Complete HTML for print with separate CSS file
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Student Profile - ${getFullName(studentData)}</title>
      <link rel="stylesheet" href="/src/styles/students/PrintStudentProfile.css">
    </head>
    <body>
      <div class="print-header">
        <div class="print-title">
          <h1>Student Profile</h1>
          <p>Generated on ${printDate}</p>
        </div>
        <div class="print-date">
          <strong>ID:</strong> ${studentData.id}
        </div>
      </div>

      <!-- Student Basic Information -->
      <div class="student-info-card">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Full Name</div>
            <div class="info-value">${getFullName(studentData)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Grade & Section</div>
            <div class="info-value">${studentData.gradeLevel} - ${studentData.section}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Date of Birth</div>
            <div class="info-value">${studentData.dateOfBirth}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Gender</div>
            <div class="info-value">${studentData.gender}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Address</div>
            <div class="info-value">${studentData.address}</div>
          </div>
        </div>
      </div>

      <!-- Guardian Information -->
      <h2 class="section-title">Guardian Information</h2>
      <div class="student-info-card">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Guardian Name</div>
            <div class="info-value">${getGuardianFullName(studentData)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Contact Number</div>
            <div class="info-value">${studentData.guardianContact}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Relationship</div>
            <div class="info-value">${studentData.guardianRelationship}</div>
          </div>
        </div>
      </div>

      <!-- Performance Stats -->
      <h2 class="section-title">Performance Overview</h2>
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-number">${studentData.pacePercent}%</div>
          <div class="stat-label">PACE Completion</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${studentData.attendance}%</div>
          <div class="stat-label">Attendance</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">
            <span class="risk-badge risk-${studentData.riskLevel.toLowerCase()}">${studentData.riskLevel}</span>
          </div>
          <div class="stat-label">Risk Level</div>
        </div>
      </div>

      <!-- PACE Progress -->
      <h2 class="section-title">PACE Progress by Subject</h2>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Completed/Total</th>
            <th>Progress</th>
            <th>Test Score</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${paceTableRows}
        </tbody>
      </table>

      <!-- Attendance Summary -->
      <h2 class="section-title">Attendance Summary</h2>
      <div class="attendance-summary">
        <div class="att-card att-present">
          <div class="att-number">${studentData.attendanceSummary?.present || 0}%</div>
          <div class="att-label">Present</div>
        </div>
        <div class="att-card att-late">
          <div class="att-number">${studentData.attendanceSummary?.late || 0}%</div>
          <div class="att-label">Late</div>
        </div>
        <div class="att-card att-absent">
          <div class="att-number">${studentData.attendanceSummary?.absent || 0}%</div>
          <div class="att-label">Absent</div>
        </div>
      </div>

      <!-- Risk Details -->
      <h2 class="section-title">Risk Assessment</h2>
      ${riskDetailsHtml}

      ${studentData.suggestedAction && studentData.suggestedAction !== 'None' ? `
        <div class="risk-detail" style="border-left-color: #3B82F6; background: #EFF6FF;">
          <div class="risk-detail-header">
            <strong>Suggested Action</strong>
          </div>
          <p>${studentData.suggestedAction}</p>
        </div>
      ` : ''}

      <div style="margin-top: 2rem; text-align: center; color: #666; font-size: 0.8rem;">
        <p>This is an official student profile generated by LBCA Monitoring System</p>
      </div>
    </body>
    </html>
  `;
};

export default PrintStudentProfile;