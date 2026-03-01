import React, { useState, useEffect } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import '../../../styles/pace/PaceTable.css';

const PaceTable = ({ 
  data, 
  onDataChange, 
  onAddPaceForCurrent,
  subject,
  section,
  gradeLevel 
}) => {
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleScoreChange = (studentId, paceIndex, value) => {
    const score = value === '' ? null : parseInt(value, 10);
    if (!isNaN(score) && (score < 0 || score > 100)) return;

    const updatedData = localData.map(row => {
      if (row.studentId === studentId) {
        const updatedPaceRecords = [...row.paceRecords];
        if (updatedPaceRecords[paceIndex]) {
          updatedPaceRecords[paceIndex] = {
            ...updatedPaceRecords[paceIndex],
            testScore: score
          };
        }
        return { ...row, paceRecords: updatedPaceRecords };
      }
      return row;
    });

    setLocalData(updatedData);
    onDataChange(updatedData);
  };

  if (!localData || localData.length === 0) {
    return (
      <div className="no-data-container">
        <BookOpen size={48} />
        <p>No students found for {gradeLevel} {section}.</p>
        <p className="hint">Please add students to this class first.</p>
      </div>
    );
  }

  // Check if any student has pace records
  const hasPaceRecords = localData.some(student => student.paceRecords?.length > 0);

  return (
    <div className="pace-table-container">
      <div className="pace-table-header">
        <h3>{subject} - {gradeLevel} {section}</h3>
        <button className="add-pace-current-btn" onClick={onAddPaceForCurrent}>
          <Plus size={16} />
          New PACE Record
        </button>
      </div>
      <div className="pace-table-wrapper">
        <table className="pace-table">
          <thead>
            <tr>
              <th>Student</th>
              {hasPaceRecords ? (
                localData[0]?.paceRecords?.map((record, index) => (
                  <th key={index} className="pace-record-header">
                    PACE #{record.paceNo}
                  </th>
                ))
              ) : (
                <th className="pace-record-header">
                  No PACE Records Yet
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {localData.map(row => (
              <tr key={row.studentId}>
                <td className="student-name">{row.name}</td>
                {row.paceRecords?.length > 0 ? (
                  row.paceRecords.map((record, recordIndex) => (
                    <td key={recordIndex} className="score-cell">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Score"
                        value={record.testScore ?? ''}
                        onChange={(e) => handleScoreChange(row.studentId, recordIndex, e.target.value)}
                        className="score-input"
                      />
                    </td>
                  ))
                ) : (
                  <td className="score-cell empty">—</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pace-table-footer">
        <p className="auto-save-note"> All changes are automatically saved</p>
      </div>
    </div>
  );
};

export default PaceTable;