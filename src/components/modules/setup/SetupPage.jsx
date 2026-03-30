import { useState } from 'react';
import {
  BookOpen, CalendarDays, Layers, ChevronDown, ChevronRight,
  Plus, Pencil, Trash2, CheckCircle, Clock, Group, X,
} from 'lucide-react';
import SchoolYearModal from './SchoolYearModal.jsx';
import GradeLevelModal from './GradeLevelModal.jsx';
import SectionModal from './SectionModal.jsx';
import '../../../styles/setup/SetupPage.css';
import '../../../styles/setup/UnifiedSetup.css';

/* ── Mock Data ─────────────────────────────────────────────── */
const mockSchoolYears = [
  { school_year_id: 1, year: '2024-2025', is_current: true,  start_date: '2024-06-03', end_date: '2025-03-28' },
  { school_year_id: 2, year: '2023-2024', is_current: false, start_date: '2023-06-05', end_date: '2024-03-29' },
  { school_year_id: 3, year: '2022-2023', is_current: false, start_date: '2022-06-06', end_date: '2023-03-31' },
];

const mockGradeLevels = [
  { grade_level_id: 1, level: 'Grade 1', name: 'First Grade' },
  { grade_level_id: 2, level: 'Grade 2', name: 'Second Grade' },
  { grade_level_id: 3, level: 'Grade 3', name: 'Third Grade' },
  { grade_level_id: 4, level: 'Grade 4', name: 'Fourth Grade' },
  { grade_level_id: 5, level: 'Grade 5', name: 'Fifth Grade' },
  { grade_level_id: 6, level: 'Grade 6', name: 'Sixth Grade' },
];

const mockSections = [
  { section_id: 1, grade_level: 1, section_code: '1-A', name: 'Section A' },
  { section_id: 2, grade_level: 1, section_code: '1-B', name: 'Section B' },
  { section_id: 3, grade_level: 2, section_code: '2-A', name: 'Section A' },
  { section_id: 4, grade_level: 3, section_code: '3-A', name: 'Section A' },
];

/* ── Main Component ─────────────────────────────────────────── */
const SetupPage = () => {
  // School Years state
  const [schoolYears, setSchoolYears] = useState(mockSchoolYears);
  const [syModalOpen, setSyModalOpen] = useState(false);
  const [editingSY, setEditingSY] = useState(null);
  const [syExpanded, setSyExpanded] = useState(true);

  // Grade Levels state
  const [gradeLevels, setGradeLevels] = useState(mockGradeLevels);
  const [glModalOpen, setGlModalOpen] = useState(false);
  const [editingGL, setEditingGL] = useState(null);
  const [glExpanded, setGlExpanded] = useState(true);
  const [expandedGrades, setExpandedGrades] = useState({});

  // Sections state
  const [sections, setSections] = useState(mockSections);
  const [secModalOpen, setSecModalOpen] = useState(false);
  const [editingSec, setEditingSec] = useState(null);
  const [prefillGrade, setPrefillGrade] = useState(null);

  /* ── School Year handlers ── */
  const handleSaveSY = (data) => {
    if (editingSY) {
      setSchoolYears(prev => prev.map(sy => {
        if (sy.school_year_id === editingSY.school_year_id) return { ...sy, ...data };
        if (data.is_current) return { ...sy, is_current: false };
        return sy;
      }));
    } else {
      const newItem = { school_year_id: Date.now(), ...data };
      setSchoolYears(prev =>
        data.is_current
          ? [newItem, ...prev.map(sy => ({ ...sy, is_current: false }))]
          : [newItem, ...prev]
      );
    }
    setSyModalOpen(false);
    setEditingSY(null);
  };

  const handleDeleteSY = (id) => {
    const target = schoolYears.find(sy => sy.school_year_id === id);
    if (target?.is_current) { alert('Cannot delete the currently active school year.'); return; }
    if (window.confirm('Delete this school year?')) {
      setSchoolYears(prev => prev.filter(sy => sy.school_year_id !== id));
    }
  };

  /* ── Grade Level handlers ── */
  const handleSaveGL = (data) => {
    if (editingGL) {
      setGradeLevels(prev => prev.map(gl => gl.grade_level_id === editingGL.grade_level_id ? { ...gl, ...data } : gl));
    } else {
      setGradeLevels(prev => [...prev, { grade_level_id: Date.now(), ...data }]);
    }
    setGlModalOpen(false);
    setEditingGL(null);
  };

  const handleDeleteGL = (id) => {
    const hasSections = sections.some(s => s.grade_level === id);
    if (hasSections) { alert('Cannot delete a grade level that has sections. Remove its sections first.'); return; }
    if (window.confirm('Delete this grade level?')) {
      setGradeLevels(prev => prev.filter(gl => gl.grade_level_id !== id));
    }
  };

  const toggleGrade = (id) => {
    setExpandedGrades(prev => ({ ...prev, [id]: !prev[id] }));
  };

  /* ── Section handlers ── */
  const handleSaveSec = (data) => {
    const gradeLevel = gradeLevels.find(gl => gl.grade_level_id === Number(data.grade_level));
    const enriched = { ...data, grade_level_display: gradeLevel?.level || '' };
    if (editingSec) {
      setSections(prev => prev.map(s => s.section_id === editingSec.section_id ? { ...s, ...enriched } : s));
    } else {
      setSections(prev => [...prev, { section_id: Date.now(), ...enriched }]);
    }
    setSecModalOpen(false);
    setEditingSec(null);
    setPrefillGrade(null);
  };

  const handleDeleteSec = (id) => {
    if (window.confirm('Delete this section?')) {
      setSections(prev => prev.filter(s => s.section_id !== id));
    }
  };

  const openAddSection = (gradeId) => {
    setPrefillGrade(gradeId);
    setEditingSec(null);
    setSecModalOpen(true);
    // Auto-expand the grade
    setExpandedGrades(prev => ({ ...prev, [gradeId]: true }));
  };

  const current = schoolYears.find(sy => sy.is_current);

  return (
    <div className="setup-page unified-setup">

      {/* ── Page Header ── */}
      <div className="setup-header-row">
        <div className="setup-header-title">
          <div className="setup-title-wrapper">
            <BookOpen size={24} />
            <h2>Class Management</h2>
          </div>
          <p className="setup-header-subtitle">Configure school years, grade levels, and sections</p>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 1 — SCHOOL YEARS
      ══════════════════════════════════════════ */}
      <div className="us-card">
        <div className="us-card-header" onClick={() => setSyExpanded(v => !v)}>
          <div className="us-card-title">
            <CalendarDays size={18} />
            <span>School Years</span>
            <span className="us-count-badge">{schoolYears.length}</span>
          </div>
          <div className="us-card-actions" onClick={e => e.stopPropagation()}>
            <button className="setup-add-btn us-add-btn" onClick={() => { setEditingSY(null); setSyModalOpen(true); }}>
              <Plus size={14} /> Add
            </button>
            <button className="us-chevron-btn">
              {syExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </div>

        {syExpanded && (
          <div className="us-card-body">
            {current && (
              <div className="setup-current-banner us-banner">
                <CheckCircle size={14} />
                <span>Active: <strong>{current.year}</strong> &nbsp;({current.start_date} – {current.end_date})</span>
              </div>
            )}

            <div className="setup-table-card us-table-card">
              <table className="setup-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schoolYears.length === 0 ? (
                    <tr><td colSpan={5} className="setup-empty">No school years yet. Add one above.</td></tr>
                  ) : schoolYears.map(sy => (
                    <tr key={sy.school_year_id}>
                      <td className="setup-td-bold">{sy.year}</td>
                      <td>{sy.start_date}</td>
                      <td>{sy.end_date}</td>
                      <td>
                        {sy.is_current
                          ? <span className="setup-badge setup-badge-active"><CheckCircle size={11} /> Current</span>
                          : <span className="setup-badge setup-badge-inactive"><Clock size={11} /> Past</span>}
                      </td>
                      <td>
                        <div className="setup-actions">
                          <button className="setup-action-btn edit" onClick={() => { setEditingSY(sy); setSyModalOpen(true); }} title="Edit"><Pencil size={14} /></button>
                          <button className="setup-action-btn delete" onClick={() => handleDeleteSY(sy.school_year_id)} title="Delete" disabled={sy.is_current}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          SECTION 2 — GRADE LEVELS + SECTIONS
      ══════════════════════════════════════════ */}
      <div className="us-card">
        <div className="us-card-header" onClick={() => setGlExpanded(v => !v)}>
          <div className="us-card-title">
            <Layers size={18} />
            <span>Grade Levels & Sections</span>
            <span className="us-count-badge">{gradeLevels.length} grades · {sections.length} sections</span>
          </div>
          <div className="us-card-actions" onClick={e => e.stopPropagation()}>
            <button className="setup-add-btn us-add-btn" onClick={() => { setEditingGL(null); setGlModalOpen(true); }}>
              <Plus size={14} /> Add Grade
            </button>
            <button className="us-chevron-btn">
              {glExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </div>

        {glExpanded && (
          <div className="us-card-body">
            {gradeLevels.length === 0 ? (
              <p className="us-empty-hint">No grade levels yet. Add one above.</p>
            ) : gradeLevels.map(gl => {
              const glSections = sections.filter(s => s.grade_level === gl.grade_level_id);
              const isOpen = !!expandedGrades[gl.grade_level_id];

              return (
                <div key={gl.grade_level_id} className="us-grade-block">

                  {/* Grade row */}
                  <div className="us-grade-row" onClick={() => toggleGrade(gl.grade_level_id)}>
                    <div className="us-grade-left">
                      <span className="us-grade-chevron">
                        {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                      </span>
                      <Layers size={15} className="us-grade-icon" />
                      <span className="us-grade-name">{gl.level}</span>
                      <span className="us-grade-subname">{gl.name}</span>
                      <span className="us-section-count">{glSections.length} section{glSections.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="us-grade-right" onClick={e => e.stopPropagation()}>
                      <button className="us-inline-add-btn" onClick={() => openAddSection(gl.grade_level_id)} title="Add section">
                        <Plus size={13} /> Section
                      </button>
                      <button className="setup-action-btn edit" onClick={() => { setEditingGL(gl); setGlModalOpen(true); }} title="Edit grade"><Pencil size={13} /></button>
                      <button className="setup-action-btn delete" onClick={() => handleDeleteGL(gl.grade_level_id)} title="Delete grade"><Trash2 size={13} /></button>
                    </div>
                  </div>

                  {/* Sections sub-table */}
                  {isOpen && (
                    <div className="us-sections-panel">
                      {glSections.length === 0 ? (
                        <div className="us-sections-empty">
                          <Group size={14} />
                          <span>No sections yet.</span>
                          <button className="us-inline-add-btn" onClick={() => openAddSection(gl.grade_level_id)}>
                            <Plus size={12} /> Add Section
                          </button>
                        </div>
                      ) : (
                        <table className="setup-table us-sections-table">
                          <thead>
                            <tr>
                              <th>Code</th>
                              <th>Section Name</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {glSections.map(sec => (
                              <tr key={sec.section_id}>
                                <td className="setup-td-bold">{sec.section_code}</td>
                                <td>{sec.name}</td>
                                <td>
                                  <div className="setup-actions">
                                    <button className="setup-action-btn edit" onClick={() => { setEditingSec(sec); setPrefillGrade(null); setSecModalOpen(true); }} title="Edit"><Pencil size={13} /></button>
                                    <button className="setup-action-btn delete" onClick={() => handleDeleteSec(sec.section_id)} title="Delete"><Trash2 size={13} /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <SchoolYearModal
        isOpen={syModalOpen}
        onClose={() => { setSyModalOpen(false); setEditingSY(null); }}
        onSave={handleSaveSY}
        editingItem={editingSY}
      />
      <GradeLevelModal
        isOpen={glModalOpen}
        onClose={() => { setGlModalOpen(false); setEditingGL(null); }}
        onSave={handleSaveGL}
        editingItem={editingGL}
      />
      <SectionModal
        isOpen={secModalOpen}
        onClose={() => { setSecModalOpen(false); setEditingSec(null); setPrefillGrade(null); }}
        onSave={handleSaveSec}
        editingItem={editingSec}
        gradeLevels={gradeLevels}
        prefillGradeId={prefillGrade}
      />
    </div>
  );
};

export default SetupPage;