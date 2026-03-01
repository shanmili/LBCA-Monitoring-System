// PACE Completion Trend Data (for Line Chart)
export const paceCompletionData = [
  { name: 'W1', SectionA: 65, SectionB: 60, SectionC: 70 },
  { name: 'W2', SectionA: 68, SectionB: 62, SectionC: 72 },
  { name: 'W3', SectionA: 72, SectionB: 65, SectionC: 75 },
  { name: 'W4', SectionA: 70, SectionB: 64, SectionC: 73 },
  { name: 'W5', SectionA: 76, SectionB: 70, SectionC: 78 },
  { name: 'W6', SectionA: 81, SectionB: 75, SectionC: 84 },
  { name: 'W7', SectionA: 85, SectionB: 80, SectionC: 88 },
  { name: 'W8', SectionA: 88, SectionB: 82, SectionC: 91 },
];

// Quarterly PACE Data
export const quarterlyPaceData = {
  'Q1': [
    { name: 'W1', SectionA: 12, SectionB: 10, SectionC: 11 },
    { name: 'W2', SectionA: 24, SectionB: 20, SectionC: 22 },
    { name: 'W3', SectionA: 38, SectionB: 32, SectionC: 35 },
    { name: 'W4', SectionA: 52, SectionB: 45, SectionC: 48 },
  ],
  'Q2': [
    { name: 'W1', SectionA: 55, SectionB: 48, SectionC: 50 },
    { name: 'W2', SectionA: 68, SectionB: 60, SectionC: 64 },
    { name: 'W3', SectionA: 78, SectionB: 72, SectionC: 75 },
    { name: 'W4', SectionA: 88, SectionB: 82, SectionC: 85 },
  ],
  'Q3': [
    { name: 'W1', SectionA: 15, SectionB: 12, SectionC: 14 },
    { name: 'W2', SectionA: 30, SectionB: 25, SectionC: 28 },
    { name: 'W3', SectionA: 45, SectionB: 38, SectionC: 42 },
    { name: 'W4', SectionA: 60, SectionB: 52, SectionC: 56 },
  ],
  'Q4': [
    { name: 'W1', SectionA: 18, SectionB: 15, SectionC: 16 },
    { name: 'W2', SectionA: 36, SectionB: 30, SectionC: 32 },
    { name: 'W3', SectionA: 54, SectionB: 46, SectionC: 50 },
    { name: 'W4', SectionA: 72, SectionB: 64, SectionC: 68 },
  ],
};

// Section Statistics with PACE data (for KPI Cards)
export const sectionStatsData = {
  'All': { total: 452, avgPaceCompletion: 76.5, behindPace: 38, atRisk: 18, attendance: 92.3 },
  'Section A': { total: 150, avgPaceCompletion: 78.2, behindPace: 10, atRisk: 4, attendance: 96.5 },
  'Section B': { total: 152, avgPaceCompletion: 68.4, behindPace: 16, atRisk: 8, attendance: 88.2 },
  'Section C': { total: 150, avgPaceCompletion: 71.0, behindPace: 12, atRisk: 6, attendance: 91.0 },
};

// Quarterly section stats
export const quarterlyStatsData = {
  'Q1': {
    'All': { total: 452, avgPaceCompletion: 45.2, behindPace: 52, atRisk: 22 },
    'Section A': { total: 150, avgPaceCompletion: 52.0, behindPace: 14, atRisk: 6 },
    'Section B': { total: 152, avgPaceCompletion: 38.5, behindPace: 24, atRisk: 10 },
    'Section C': { total: 150, avgPaceCompletion: 45.0, behindPace: 14, atRisk: 6 },
  },
  'Q2': {
    'All': { total: 452, avgPaceCompletion: 76.5, behindPace: 38, atRisk: 18 },
    'Section A': { total: 150, avgPaceCompletion: 78.2, behindPace: 10, atRisk: 4 },
    'Section B': { total: 152, avgPaceCompletion: 68.4, behindPace: 16, atRisk: 8 },
    'Section C': { total: 150, avgPaceCompletion: 71.0, behindPace: 12, atRisk: 6 },
  },
  'Q3': {
    'All': { total: 452, avgPaceCompletion: 58.3, behindPace: 44, atRisk: 20 },
    'Section A': { total: 150, avgPaceCompletion: 65.0, behindPace: 12, atRisk: 5 },
    'Section B': { total: 152, avgPaceCompletion: 52.0, behindPace: 20, atRisk: 9 },
    'Section C': { total: 150, avgPaceCompletion: 58.0, behindPace: 12, atRisk: 6 },
  },
  'Q4': {
    'All': { total: 452, avgPaceCompletion: 62.8, behindPace: 40, atRisk: 19 },
    'Section A': { total: 150, avgPaceCompletion: 70.5, behindPace: 10, atRisk: 4 },
    'Section B': { total: 152, avgPaceCompletion: 56.2, behindPace: 18, atRisk: 9 },
    'Section C': { total: 150, avgPaceCompletion: 62.0, behindPace: 12, atRisk: 6 },
  },
};

// Attendance Data (for Donut Chart)
export const attendanceData = [
  { name: 'Present', value: 92, color: '#10B981' },
  { name: 'Late', value: 4, color: '#F59E0B' },    
  { name: 'Absent', value: 4, color: '#EF4444' },   
];

// School Years
export const schoolYears = ['2025-2026', '2024-2025', '2023-2024'];

// Full Students Data with new structure
export const studentsData = [
  { 
    id: 'S001',
    firstName: 'Mateo',
    middleName: 'D',
    lastName: 'Alvarez',
    dateOfBirth: '2008-05-15',
    gender: 'Male',
    address: '123 Mabini St., Davao City',
    guardianFirstName: 'Roberto',
    guardianMiddleName: 'M',
    guardianLastName: 'Alvarez',
    guardianContact: '09171234567',
    guardianRelationship: 'Father',
    gradeLevel: 'Grade 10',
    section: 'Section A',
    status: 'Behind',
    pacePercent: 52, 
    attendance: 88,
    riskLevel: "High", 
    factor: "Low PACE completion",
    secondaryRisk: "Declining PACE test trend",
    suggestedAction: "Schedule intervention session",
    subjects: [
      { name: "Math", completed: 4, total: 6, testScore: 70, status: "Behind" },
      { name: "English", completed: 3, total: 6, testScore: 65, status: "Behind" },
      { name: "Science", completed: 5, total: 6, testScore: 85, status: "On Track" },
      { name: "Filipino", completed: 4, total: 6, testScore: 72, status: "Behind" },
    ],
    attendanceSummary: { present: 88, late: 4, absent: 8 },
    riskDetails: [
      { factor: "PACE Completion", severity: "High", detail: "Student is at 52% — below the 75% threshold for 4 consecutive weeks." },
      { factor: "Test Scores", severity: "Medium", detail: "Average scores have dropped 12 points over the last 3 PACE cycles." },
      { factor: "Attendance", severity: "Medium", detail: "Missed 3 days this month; approaching the 80% minimum." },
    ]
  },
  { 
    id: 'S002',
    firstName: 'Sophia',
    middleName: 'R',
    lastName: 'Cruz',
    dateOfBirth: '2008-08-22',
    gender: 'Female',
    address: '456 Rizal St., Davao City',
    guardianFirstName: 'Maria',
    guardianMiddleName: 'R',
    guardianLastName: 'Cruz',
    guardianContact: '09179876543',
    guardianRelationship: 'Mother',
    gradeLevel: 'Grade 10',
    section: 'Section B',
    status: 'Behind',
    pacePercent: 65, 
    attendance: 91,
    riskLevel: "Medium", 
    factor: "Pending PACE modules",
    secondaryRisk: "Borderline attendance",
    suggestedAction: "Monitor progress next week",
    subjects: [
      { name: "Math", completed: 5, total: 6, testScore: 78, status: "On Track" },
      { name: "English", completed: 4, total: 6, testScore: 70, status: "Behind" },
      { name: "Science", completed: 5, total: 6, testScore: 82, status: "On Track" },
      { name: "Filipino", completed: 5, total: 6, testScore: 80, status: "On Track" },
    ],
    attendanceSummary: { present: 91, late: 3, absent: 6 },
    riskDetails: [
      { factor: "PACE Completion", severity: "Medium", detail: "Student is at 65% — approaching the 75% threshold." },
      { factor: "Pending Modules", severity: "Medium", detail: "2 English PACEs pending completion." },
    ]
  },
  { 
    id: 'S003',
    firstName: 'Gabriel',
    middleName: 'S',
    lastName: 'Santos',
    dateOfBirth: '2008-03-10',
    gender: 'Male',
    address: '789 Bonifacio St., Davao City',
    guardianFirstName: 'Jose',
    guardianMiddleName: 'S',
    guardianLastName: 'Santos',
    guardianContact: '09171239876',
    guardianRelationship: 'Father',
    gradeLevel: 'Grade 10',
    section: 'Section B',
    status: 'On Track',
    pacePercent: 82, 
    attendance: 95,
    riskLevel: "Low", 
    factor: "None",
    secondaryRisk: "None",
    suggestedAction: "None",
    subjects: [
      { name: "Math", completed: 6, total: 6, testScore: 92, status: "On Track" },
      { name: "English", completed: 5, total: 6, testScore: 88, status: "On Track" },
      { name: "Science", completed: 6, total: 6, testScore: 90, status: "On Track" },
      { name: "Filipino", completed: 5, total: 6, testScore: 88, status: "On Track" },
    ],
    attendanceSummary: { present: 95, late: 3, absent: 2 },
    riskDetails: []
  },
  { 
    id: 'S004',
    firstName: 'Karl',
    middleName: 'M',
    lastName: 'Mendoza',
    dateOfBirth: '2008-11-30',
    gender: 'Male',
    address: '101 Quezon St., Davao City',
    guardianFirstName: 'Elena',
    guardianMiddleName: 'M',
    guardianLastName: 'Mendoza',
    guardianContact: '09175432109',
    guardianRelationship: 'Mother',
    gradeLevel: 'Grade 10',
    section: 'Section B',
    status: 'Behind',
    pacePercent: 60, 
    attendance: 70,
    riskLevel: "High", 
    factor: "Frequent absences",
    secondaryRisk: "Missed tests",
    suggestedAction: "Parent-teacher conference",
    subjects: [
      { name: "Math", completed: 3, total: 6, testScore: 62, status: "Behind" },
      { name: "English", completed: 4, total: 6, testScore: 68, status: "Behind" },
      { name: "Science", completed: 3, total: 6, testScore: 60, status: "Behind" },
      { name: "Filipino", completed: 4, total: 6, testScore: 65, status: "Behind" },
    ],
    attendanceSummary: { present: 70, late: 8, absent: 22 },
    riskDetails: [
      { factor: "Attendance", severity: "High", detail: "Only 70% attendance — well below the 80% minimum threshold." },
      { factor: "PACE Completion", severity: "High", detail: "At 60% completion, behind schedule in 3 out of 4 subjects." },
      { factor: "Test Scores", severity: "Medium", detail: "Missed several PACE tests due to absences." },
    ]
  },
  { 
    id: 'S005',
    firstName: 'Aisha',
    middleName: 'D',
    lastName: 'Reyes',
    dateOfBirth: '2007-05-18',
    gender: 'Female',
    address: '202 Lopez Jaena St., Davao City',
    guardianFirstName: 'Ramon',
    guardianMiddleName: 'D',
    guardianLastName: 'Reyes',
    guardianContact: '09176543210',
    guardianRelationship: 'Father',
    gradeLevel: 'Grade 11',
    section: 'Section C',
    status: 'On Track',
    pacePercent: 90, 
    attendance: 98,
    riskLevel: "Low", 
    factor: "None",
    secondaryRisk: "None",
    suggestedAction: "None",
    subjects: [
      { name: "Math", completed: 6, total: 6, testScore: 95, status: "On Track" },
      { name: "English", completed: 6, total: 6, testScore: 93, status: "On Track" },
      { name: "Science", completed: 5, total: 6, testScore: 88, status: "On Track" },
      { name: "Filipino", completed: 6, total: 6, testScore: 91, status: "On Track" },
    ],
    attendanceSummary: { present: 98, late: 1, absent: 1 },
    riskDetails: []
  },
  { 
    id: 'S006',
    firstName: 'Luis',
    middleName: 'G',
    lastName: 'Bautista',
    dateOfBirth: '2007-09-25',
    gender: 'Male',
    address: '303 Mabuhay St., Davao City',
    guardianFirstName: 'Carmen',
    guardianMiddleName: 'G',
    guardianLastName: 'Bautista',
    guardianContact: '09174321098',
    guardianRelationship: 'Mother',
    gradeLevel: 'Grade 11',
    section: 'Section C',
    status: 'Behind',
    pacePercent: 44, 
    attendance: 80,
    riskLevel: "High", 
    factor: "Low PACE completion + absences",
    secondaryRisk: "Low test scores across subjects",
    suggestedAction: "Immediate intervention required",
    subjects: [
      { name: "Math", completed: 2, total: 6, testScore: 55, status: "Behind" },
      { name: "English", completed: 3, total: 6, testScore: 60, status: "Behind" },
      { name: "Science", completed: 2, total: 6, testScore: 58, status: "Behind" },
      { name: "Filipino", completed: 3, total: 6, testScore: 62, status: "Behind" },
    ],
    attendanceSummary: { present: 80, late: 6, absent: 14 },
    riskDetails: [
      { factor: "PACE Completion", severity: "High", detail: "Only 44% completion — severely behind schedule in all subjects." },
      { factor: "Test Scores", severity: "High", detail: "Average test score is 59% — failing threshold." },
      { factor: "Attendance", severity: "Medium", detail: "At 80% attendance, borderline minimum." },
    ]
  },
  {
    id: 'S007',
    firstName: 'Shanmae Leigh',
    middleName: 'P',
    lastName: 'de Gala',
    dateOfBirth: '2008-02-14',
    gender: 'Female',
    address: '404 San Pedro St., Davao City',
    guardianFirstName: 'Ricardo',
    guardianMiddleName: 'P',
    guardianLastName: 'de Gala',
    guardianContact: '09177654321',
    guardianRelationship: 'Father',
    gradeLevel: 'Grade 10',
    section: 'Section A',
    status: 'On Track',
    pacePercent: 85, 
    attendance: 96,
    riskLevel: "Low", 
    factor: "None",
    secondaryRisk: "None",
    suggestedAction: "None",
    subjects: [
      { name: "Math", completed: 6, total: 6, testScore: 90, status: "On Track" },
      { name: "English", completed: 5, total: 6, testScore: 88, status: "On Track" },
      { name: "Science", completed: 6, total: 6, testScore: 92, status: "On Track" },
      { name: "Filipino", completed: 5, total: 6, testScore: 87, status: "On Track" },
    ],
    attendanceSummary: { present: 96, late: 2, absent: 2 },
    riskDetails: []
  },
  {
    id: 'S008',
    firstName: 'Sef Rowinston',
    middleName: 'M',
    lastName: 'Maco',
    dateOfBirth: '2008-07-08',
    gender: 'Male',
    address: '505 Claveria St., Davao City',
    guardianFirstName: 'Rosario',
    guardianMiddleName: 'M',
    guardianLastName: 'Maco',
    guardianContact: '09178899001',
    guardianRelationship: 'Mother',
    gradeLevel: 'Grade 10',
    section: 'Section B',
    status: 'On Track',
    pacePercent: 78, 
    attendance: 93,
    riskLevel: "Low", 
    factor: "None",
    secondaryRisk: "None",
    suggestedAction: "None",
    subjects: [
      { name: "Math", completed: 5, total: 6, testScore: 82, status: "On Track" },
      { name: "English", completed: 5, total: 6, testScore: 80, status: "On Track" },
      { name: "Science", completed: 5, total: 6, testScore: 84, status: "On Track" },
      { name: "Filipino", completed: 4, total: 6, testScore: 78, status: "On Track" },
    ],
    attendanceSummary: { present: 93, late: 4, absent: 3 },
    riskDetails: []
  },
  {
    id: 'S009',
    firstName: 'Keybird',
    middleName: 'N',
    lastName: 'Evasco',
    dateOfBirth: '2008-12-03',
    gender: 'Male',
    address: '606 Ramon Magsaysay St., Davao City',
    guardianFirstName: 'Rogelio',
    guardianMiddleName: 'N',
    guardianLastName: 'Evasco',
    guardianContact: '09171223344',
    guardianRelationship: 'Father',
    gradeLevel: 'Grade 10',
    section: 'Section B',
    status: 'On Track',
    pacePercent: 88, 
    attendance: 97,
    riskLevel: "Low", 
    factor: "None",
    secondaryRisk: "None",
    suggestedAction: "None",
    subjects: [
      { name: "Math", completed: 6, total: 6, testScore: 91, status: "On Track" },
      { name: "English", completed: 5, total: 6, testScore: 88, status: "On Track" },
      { name: "Science", completed: 6, total: 6, testScore: 90, status: "On Track" },
      { name: "Filipino", completed: 5, total: 6, testScore: 86, status: "On Track" },
    ],
    attendanceSummary: { present: 97, late: 2, absent: 1 },
    riskDetails: []
  },
  {
    id: 'S010',
    firstName: 'Norhaifah',
    middleName: 'P',
    lastName: 'Alion',
    dateOfBirth: '2007-04-19',
    gender: 'Female',
    address: '707 San Jose St., Davao City',
    guardianFirstName: 'Abdullah',
    guardianMiddleName: 'P',
    guardianLastName: 'Alion',
    guardianContact: '09175566778',
    guardianRelationship: 'Father',
    gradeLevel: 'Grade 11',
    section: 'Section C',
    status: 'On Track',
    pacePercent: 83, 
    attendance: 95,
    riskLevel: "Low", 
    factor: "None",
    secondaryRisk: "None",
    suggestedAction: "None",
    subjects: [
      { name: "Math", completed: 5, total: 6, testScore: 86, status: "On Track" },
      { name: "English", completed: 6, total: 6, testScore: 90, status: "On Track" },
      { name: "Science", completed: 5, total: 6, testScore: 84, status: "On Track" },
      { name: "Filipino", completed: 5, total: 6, testScore: 82, status: "On Track" },
    ],
    attendanceSummary: { present: 95, late: 3, absent: 2 },
    riskDetails: []
  },
];

// Derived: At-Risk Students (students with risk level High or Medium)
export const atRiskStudents = studentsData.filter(s => s.riskLevel === 'High' || s.riskLevel === 'Medium');

// Recent Activity Feed
export const activityFeed = [
  { id: 1, type: 'alert', text: "New At-Risk alert: Mateo Alvarez below 40% PACE", time: "10 mins ago" },
  { id: 2, type: 'pace', text: "PACE score updated for Section A — Math", time: "1 hour ago" },
  { id: 3, type: 'attendance', text: "Attendance finalized for Section B", time: "2 hours ago" },
  { id: 4, type: 'risk', text: "Risk alert generated for Karl M.", time: "3 hours ago" },
  { id: 5, type: 'system', text: "New Quarter 1 goals published", time: "5 hours ago" },
];

// PACE Encoding Data
export const paceSubjects = ['Math', 'English', 'Science', 'Filipino'];

export const paceEncodingData = {
  'Section A': {
    'Math': [
      { studentId: 'S001', name: 'Alvarez, Mateo', paceNo: 5, completed: true, testScore: 75 },
      { studentId: 'S007', name: 'de Gala, Shanmae Leigh P.', paceNo: 6, completed: true, testScore: 92 },
    ],
    'English': [
      { studentId: 'S001', name: 'Alvarez, Mateo', paceNo: 4, completed: false, testScore: null },
      { studentId: 'S007', name: 'de Gala, Shanmae Leigh P.', paceNo: 6, completed: true, testScore: 88 },
    ],
    'Science': [
      { studentId: 'S001', name: 'Alvarez, Mateo', paceNo: 6, completed: true, testScore: 85 },
      { studentId: 'S007', name: 'de Gala, Shanmae Leigh P.', paceNo: 6, completed: true, testScore: 92 },
    ],
    'Filipino': [
      { studentId: 'S001', name: 'Alvarez, Mateo', paceNo: 5, completed: false, testScore: null },
      { studentId: 'S007', name: 'de Gala, Shanmae Leigh P.', paceNo: 6, completed: true, testScore: 87 },
    ],
  },
  'Section B': {
    'Math': [
      { studentId: 'S002', name: 'Cruz, Sophia', paceNo: 5, completed: false, testScore: null },
      { studentId: 'S003', name: 'Santos, Gabriel', paceNo: 6, completed: true, testScore: 92 },
      { studentId: 'S004', name: 'Mendoza, Karl', paceNo: 4, completed: true, testScore: 68 },
      { studentId: 'S008', name: 'Maco, Sef Rowinston M.', paceNo: 6, completed: true, testScore: 82 },
      { studentId: 'S009', name: 'Evasco, Keybird N.', paceNo: 6, completed: true, testScore: 91 },
    ],
    'English': [
      { studentId: 'S002', name: 'Cruz, Sophia', paceNo: 5, completed: false, testScore: null },
      { studentId: 'S003', name: 'Santos, Gabriel', paceNo: 6, completed: true, testScore: 88 },
      { studentId: 'S004', name: 'Mendoza, Karl', paceNo: 4, completed: true, testScore: 70 },
      { studentId: 'S008', name: 'Maco, Sef Rowinston M.', paceNo: 5, completed: true, testScore: 80 },
      { studentId: 'S009', name: 'Evasco, Keybird N.', paceNo: 6, completed: true, testScore: 88 },
    ],
  },
  'Section C': {
    'Math': [
      { studentId: 'S005', name: 'Reyes, Aisha', paceNo: 6, completed: true, testScore: 95 },
      { studentId: 'S006', name: 'Bautista, Luis', paceNo: 3, completed: false, testScore: null },
      { studentId: 'S010', name: 'Alion, Norhaifah', paceNo: 6, completed: true, testScore: 86 },
    ],
    'English': [
      { studentId: 'S005', name: 'Reyes, Aisha', paceNo: 6, completed: true, testScore: 93 },
      { studentId: 'S006', name: 'Bautista, Luis', paceNo: 3, completed: false, testScore: null },
      { studentId: 'S010', name: 'Alion, Norhaifah', paceNo: 6, completed: true, testScore: 90 },
    ],
  },
};

// Teacher Accounts Data with assignments
export const teachersData = [
  {
    id: 'T001',
    username: 'teacher_juan',
    password: 'temp123',
    status: 'active',
    lastLogin: '2024-02-26 08:30 AM',
    createdAt: '2023-06-15',
    hasCustomized: false,
    assignedGrades: ['Grade 7', 'Grade 8'],
    assignedSections: ['Section A', 'Section B']
  },
  {
    id: 'T002',
    username: 'teacher_maria',
    password: 'temp123',
    status: 'active',
    lastLogin: '2024-02-26 09:15 AM',
    createdAt: '2023-06-15',
    hasCustomized: true,
    assignedGrades: ['Grade 9', 'Grade 10'],
    assignedSections: ['Section B', 'Section C']
  },
  {
    id: 'T003',
    username: 'teacher_ana',
    password: 'temp123',
    status: 'active',
    lastLogin: '2024-02-25 02:30 PM',
    createdAt: '2023-08-20',
    hasCustomized: false,
    assignedGrades: ['Grade 7', 'Grade 8'],
    assignedSections: ['Section A', 'Section C']
  },
  {
    id: 'T004',
    username: 'teacher_carlos',
    password: 'temp123',
    status: 'inactive',
    lastLogin: '2024-02-20 11:45 AM',
    createdAt: '2023-09-10',
    hasCustomized: false,
    assignedGrades: ['Grade 9', 'Grade 10'],
    assignedSections: ['Section A', 'Section B']
  },
  {
    id: 'T005',
    username: 'teacher_lisa',
    password: 'temp123',
    status: 'active',
    lastLogin: '2024-02-26 10:00 AM',
    createdAt: '2023-07-05',
    hasCustomized: true,
    assignedGrades: ['Grade 7', 'Grade 8', 'Grade 9'],
    assignedSections: ['Section B', 'Section C']
  }
];

// Account status options
export const accountStatuses = ['active', 'inactive'];

// Student Form Constants
export const studentSections = ['Section A', 'Section B', 'Section C'];
export const studentGrades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
export const studentStatuses = ['On Track', 'Behind', 'At Risk'];