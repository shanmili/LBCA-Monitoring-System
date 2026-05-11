// src/api/setupApi.js
// Handles School Years, Grade Levels, and Sections API calls
import { apiRequest } from './client';

// ─── SCHOOL YEARS ────────────────────────────────────────────

export const getSchoolYears = () =>
  apiRequest('/api/school-years/');

export const getCurrentSchoolYear = () =>
  apiRequest('/api/school-years/current/');

export const getSchoolYear = (id) =>
  apiRequest(`/api/school-years/${id}/`);

export const createSchoolYear = (data) =>
  apiRequest('/api/school-years/', { method: 'POST', body: data });

export const updateSchoolYear = (id, data) =>
  apiRequest(`/api/school-years/${id}/`, { method: 'PATCH', body: data });

export const deleteSchoolYear = (id) =>
  apiRequest(`/api/school-years/${id}/`, { method: 'DELETE' });

// ─── GRADE LEVELS ────────────────────────────────────────────

export const getGradeLevels = () =>
  apiRequest('/api/grade-levels/');

export const getGradeLevel = (id) =>
  apiRequest(`/api/grade-levels/${id}/`);

export const createGradeLevel = (data) =>
  apiRequest('/api/grade-levels/', { method: 'POST', body: data });

export const updateGradeLevel = (id, data) =>
  apiRequest(`/api/grade-levels/${id}/`, { method: 'PATCH', body: data });

export const deleteGradeLevel = (id) =>
  apiRequest(`/api/grade-levels/${id}/`, { method: 'DELETE' });

// ─── SECTIONS ────────────────────────────────────────────────

export const getSections = () =>
  apiRequest('/api/sections/');

export const getSectionsByGradeLevel = (gradeLevelId) =>
  apiRequest(`/api/sections/grade-level/${gradeLevelId}/`);

export const getSection = (id) =>
  apiRequest(`/api/sections/${id}/`);

export const createSection = (data) =>
  apiRequest('/api/sections/', { method: 'POST', body: data });

export const updateSection = (id, data) =>
  apiRequest(`/api/sections/${id}/`, { method: 'PATCH', body: data });

export const deleteSection = (id) =>
  apiRequest(`/api/sections/${id}/`, { method: 'DELETE' });

// ─── SUBJECTS ────────────────────────────────────────────────

export const getSubjects = () =>
  apiRequest('/api/subjects/');

export const getSubjectsByGradeLevel = (gradeLevelId) =>
  apiRequest(`/api/subjects/grade-level/${gradeLevelId}/`);

export const getSubject = (id) =>
  apiRequest(`/api/subjects/${id}/`);

export const createSubject = (data) =>
  apiRequest('/api/subjects/', { method: 'POST', body: data });

export const updateSubject = (id, data) =>
  apiRequest(`/api/subjects/${id}/`, { method: 'PATCH', body: data });

export const deleteSubject = (id) =>
  apiRequest(`/api/subjects/${id}/`, { method: 'DELETE' });