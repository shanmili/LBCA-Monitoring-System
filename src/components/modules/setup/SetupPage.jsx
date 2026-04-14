import { useState, useEffect, useCallback } from 'react';
import {
  BookOpen, CalendarDays, Layers, ChevronDown, ChevronRight,
  Plus, Pencil, Trash2, CheckCircle, Clock, Group, BookMarked,
} from 'lucide-react';
import SchoolYearModal from './SchoolYearModal.jsx';
import GradeLevelModal from './GradeLevelModal.jsx';
import SectionModal from './SectionModal.jsx';
import SubjectModal from './SubjectModal.jsx';
import '../../../styles/setup/SetupPage.css';
import '../../../styles/setup/UnifiedSetup.css';

import {
  getSchoolYears, createSchoolYear, updateSchoolYear, deleteSchoolYear,
  getGradeLevels, createGradeLevel, updateGradeLevel, deleteGradeLevel,
  getSections, createSection, updateSection, deleteSection,
  getSubjects, createSubject, updateSubject, deleteSubject,
} from '../../../api/setupApi.js';

/* ── Toast helper ───────────────────────────────────────────── */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg = type === 'error' ? '#ef4444' : '#10b981';
  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999,
      background: bg, color: '#fff', padding: '0.75rem 1.25rem',
      borderRadius: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,.2)',
      fontSize: '0.875rem', maxWidth: '320px',
    }}>
      {message}
    </div>
  );
};

/* ── Main Component ─────────────────────────────────────────── */
const SetupPage = () => {
  // ── Data state ──
  const [schoolYears, setSchoolYears] = useState([]);
  const [gradeLevels, setGradeLevels] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // ── Loading/error state ──
  const [loading, setLoading] = useState({ sy: true, gl: true, sec: true, sub: true });
  const [toast, setToast] = useState(null);

  // ── Modal state ──
  const [syModalOpen, setSyModalOpen] = useState(false);
  const [editingSY, setEditingSY] = useState(null);
  const [syExpanded, setSyExpanded] = useState(true);

  const [glModalOpen, setGlModalOpen] = useState(false);
  const [editingGL, setEditingGL] = useState(null);
  const [glExpanded, setGlExpanded] = useState(true);
  const [expandedGrades, setExpandedGrades] = useState({});

  const [secModalOpen, setSecModalOpen] = useState(false);
  const [editingSec, setEditingSec] = useState(null);
  const [prefillGrade, setPrefillGrade] = useState(null);

  const [subModalOpen, setSubModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [subExpanded, setSubExpanded] = useState(true);

  const showToast = (message, type = 'success') => setToast({ message, type });

  /* ── Fetch all data on mount ── */
  const fetchSchoolYears = useCallback(async () => {
    try {
      const data = await getSchoolYears();
      setSchoolYears(data);
    } catch (err) {
      showToast('Failed to load school years.', 'error');
    } finally {
      setLoading(prev => ({ ...prev, sy: false }));
    }
  }, []);

  const fetchGradeLevels = useCallback(async () => {
    try {
      const data = await getGradeLevels();
      setGradeLevels(data);
    } catch (err) {
      showToast('Failed to load grade levels.', 'error');
    } finally {
      setLoading(prev => ({ ...prev, gl: false }));
    }
  }, []);

  const fetchSections = useCallback(async () => {
    try {
      const data = await getSections();
      setSections(data);
    } catch (err) {
      showToast('Failed to load sections.', 'error');
    } finally {
      setLoading(prev => ({ ...prev, sec: false }));
    }
  }, []);

  const fetchSubjects = useCallback(async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (err) {
      showToast('Failed to load subjects.', 'error');
    } finally {
      setLoading(prev => ({ ...prev, sub: false }));
    }
  }, []);

  useEffect(() => {
    fetchSchoolYears();
    fetchGradeLevels();
    fetchSections();
    fetchSubjects();
  }, [fetchSchoolYears, fetchGradeLevels, fetchSections, fetchSubjects]);

  /* ── School Year handlers ── */
  const handleSaveSY = async (data) => {
    try {
      if (editingSY) {
        await updateSchoolYear(editingSY.school_year_id, data);
        showToast('School year updated successfully.');
      } else {
        await createSchoolYear(data);
        showToast('School year created successfully.');
      }
      await fetchSchoolYears();
    } catch (err) {
      showToast(err.message || 'Failed to save school year.', 'error');
    } finally {
      setSyModalOpen(false);
      setEditingSY(null);
    }
  };

  const handleDeleteSY = async (id) => {
    const target = schoolYears.find(sy => sy.school_year_id === id);
    if (target?.is_current) {
      showToast('Cannot delete the currently active school year.', 'error');
      return;
    }
    if (!window.confirm('Delete this school year?')) return;
    try {
      await deleteSchoolYear(id);
      showToast('School year deleted.');
      setSchoolYears(prev => prev.filter(sy => sy.school_year_id !== id));
    } catch (err) {
      // Check if it's a 500 caused by related students
      showToast('Cannot delete this school year because it has students currently enrolled.', 'error');
    }
  };

  /* ── Grade Level handlers ── */
  const handleSaveGL = async (data) => {
    try {
      if (editingGL) {
        await updateGradeLevel(editingGL.grade_level_id, data);
        showToast('Grade level updated successfully.');
      } else {
        await createGradeLevel(data);
        showToast('Grade level created successfully.');
      }
      await fetchGradeLevels();
    } catch (err) {
      showToast(err.message || 'Failed to save grade level.', 'error');
    } finally {
      setGlModalOpen(false);
      setEditingGL(null);
    }
  };

  const handleDeleteGL = async (id) => {
    const hasSections = sections.some(s => s.grade_level === id);
    if (hasSections) {
      showToast('Cannot delete a grade level that has sections. Remove its sections first.', 'error');
      return;
    }
    if (!window.confirm('Delete this grade level?')) return;
    try {
      await deleteGradeLevel(id);
      showToast('Grade level deleted.');
      setGradeLevels(prev => prev.filter(gl => gl.grade_level_id !== id));
    } catch (err) {
      showToast(err.message || 'Failed to delete grade level.', 'error');
    }
  };

  const toggleGrade = (id) => {
    setExpandedGrades(prev => ({ ...prev, [id]: !prev[id] }));
  };

  /* ── Section handlers ── */
  const handleSaveSec = async (data) => {
    try {
      if (editingSec) {
        await updateSection(editingSec.section_id, data);
        showToast('Section updated successfully.');
      } else {
        await createSection(data);
        showToast('Section created successfully.');
      }
      await fetchSections();
    } catch (err) {
      showToast(err.message || 'Failed to save section.', 'error');
    } finally {
      setSecModalOpen(false);
      setEditingSec(null);
      setPrefillGrade(null);
    }
  };

  const handleDeleteSec = async (id) => {
    if (!window.confirm('Delete this section?')) return;
    try {
      await deleteSection(id);
      showToast('Section deleted.');
      setSections(prev => prev.filter(s => s.section_id !== id));
    } catch (err) {
      showToast('Cannot delete this section because it has students currently enrolled.', 'error');
    }
  };

  const openAddSection = (gradeId) => {
    setPrefillGrade(gradeId);
    setEditingSec(null);
    setSecModalOpen(true);
    setExpandedGrades(prev => ({ ...prev, [gradeId]: true }));
  };

  const openAddSubject = (gradeId) => {
    setEditingSub({ grade_level: gradeId });
    setSubModalOpen(true);
  };

  /* ── Subject handlers ── */
  const handleSaveSub = async (data) => {
    try {
      if (editingSub) {
        await updateSubject(editingSub.subject_id, data);
        showToast('Subject updated successfully.');
      } else {
        await createSubject(data);
        showToast('Subject created successfully.');
      }
      await fetchSubjects();
    } catch (err) {
      showToast(err.message || 'Failed to save subject.', 'error');
    } finally {
      setSubModalOpen(false);
      setEditingSub(null);
    }
  };

  const handleDeleteSub = async (id) => {
    if (!window.confirm('Delete this subject?')) return;
    try {
      await deleteSubject(id);
      showToast('Subject deleted.');
      setSubjects(prev => prev.filter(s => s.subject_id !== id));
    } catch (err) {
      showToast(err.message || 'Failed to delete subject.', 'error');
    }
  };

  const current = schoolYears.find(sy => sy.is_current);
  const isLoading = loading.sy || loading.gl || loading.sec || loading.sub;

  return (
    <div className="setup-page unified-setup">

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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
            <button
              className="setup-add-btn us-add-btn"
              onClick={() => { setEditingSY(null); setSyModalOpen(true); }}
            >
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
                  {loading.sy ? (
                    <tr><td colSpan={5} className="setup-empty">Loading school years...</td></tr>
                  ) : schoolYears.length === 0 ? (
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
                          <button
                            className="setup-action-btn edit"
                            onClick={() => { setEditingSY(sy); setSyModalOpen(true); }}
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className="setup-action-btn delete"
                            onClick={() => handleDeleteSY(sy.school_year_id)}
                            title="Delete"
                            disabled={sy.is_current}
                          >
                            <Trash2 size={14} />
                          </button>
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
            <button
              className="setup-add-btn us-add-btn"
              onClick={() => { setEditingGL(null); setGlModalOpen(true); }}
            >
              <Plus size={14} /> Add Grade
            </button>
            <button className="us-chevron-btn">
              {glExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </div>

        {glExpanded && (
          <div className="us-card-body">
            {loading.gl || loading.sec ? (
              <p className="us-empty-hint">Loading...</p>
            ) : gradeLevels.length === 0 ? (
              <p className="us-empty-hint">No grade levels yet. Add one above.</p>
            ) : gradeLevels.map(gl => {
              // sections use grade_level as the FK integer (grade_level field)
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
                      <button
                        className="us-inline-add-btn"
                        onClick={() => openAddSection(gl.grade_level_id)}
                        title="Add section"
                      >
                        <Plus size={13} /> Section
                      </button>
                      <button
                        className="setup-action-btn edit"
                        onClick={() => { setEditingGL(gl); setGlModalOpen(true); }}
                        title="Edit grade"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        className="setup-action-btn delete"
                        onClick={() => handleDeleteGL(gl.grade_level_id)}
                        title="Delete grade"
                      >
                        <Trash2 size={13} />
                      </button>
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
                                    <button
                                      className="setup-action-btn edit"
                                      onClick={() => { setEditingSec(sec); setPrefillGrade(null); setSecModalOpen(true); }}
                                      title="Edit"
                                    >
                                      <Pencil size={13} />
                                    </button>
                                    <button
                                      className="setup-action-btn delete"
                                      onClick={() => handleDeleteSec(sec.section_id)}
                                      title="Delete"
                                    >
                                      <Trash2 size={13} />
                                    </button>
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

      {/* ══════════════════════════════════════════
          SECTION 3 — SUBJECTS
      ══════════════════════════════════════════ */}
      <div className="us-card">
        <div className="us-card-header" onClick={() => setSubExpanded(v => !v)}>
          <div className="us-card-title">
            <BookMarked size={18} />
            <span>Subjects</span>
            <span className="us-count-badge">{subjects.length}</span>
          </div>
          <div className="us-card-actions" onClick={e => e.stopPropagation()}>
            <button
              className="setup-add-btn us-add-btn"
              onClick={() => { setEditingSub(null); setSubModalOpen(true); }}
            >
              <Plus size={14} /> Add
            </button>
            <button className="us-chevron-btn">
              {subExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </div>

        {subExpanded && (
          <div className="us-card-body">
            {loading.sub ? (
              <p className="us-empty-hint">Loading subjects...</p>
            ) : gradeLevels.length === 0 ? (
              <p className="us-empty-hint">No grade levels available. Add grade levels first.</p>
            ) : (
              gradeLevels.map(gl => {
                const glSubjects = subjects.filter(s => s.grade_level === gl.grade_level_id);
                return (
                  <div key={gl.grade_level_id} style={{ marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '1rem', color: '#333' }}>
                      {gl.level} - {gl.name}
                    </h4>
                    {glSubjects.length === 0 ? (
                      <div className="us-sections-empty">
                        <BookMarked size={14} />
                        <span>No subjects yet for this grade level.</span>
                      </div>
                    ) : (
                      <div className="setup-table-card us-table-card">
                        <table className="setup-table">
                          <thead>
                            <tr>
                              <th>Subject Code</th>
                              <th>Subject Name</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {glSubjects.map(sub => (
                              <tr key={sub.subject_id}>
                                <td className="setup-td-bold">{sub.subject_code}</td>
                                <td>{sub.subject_name}</td>
                                <td>
                                  <div className="setup-actions">
                                    <button
                                      className="setup-action-btn edit"
                                      onClick={() => { setEditingSub(sub); setSubModalOpen(true); }}
                                      title="Edit"
                                    >
                                      <Pencil size={13} />
                                    </button>
                                    <button
                                      className="setup-action-btn delete"
                                      onClick={() => handleDeleteSub(sub.subject_id)}
                                      title="Delete"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
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
      <SubjectModal
        isOpen={subModalOpen}
        onClose={() => { setSubModalOpen(false); setEditingSub(null); }}
        onSave={handleSaveSub}
        editingItem={editingSub}
        gradeLevels={gradeLevels}
      />
    </div>
  );
};

export default SetupPage;