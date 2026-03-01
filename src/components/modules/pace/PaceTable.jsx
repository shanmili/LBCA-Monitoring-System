import { useState, useEffect } from 'react';
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
  const [paceTotals, setPaceTotals] = useState({});

  useEffect(() => {
    setLocalData(data);
    
    // Initialize pace totals from existing data
    if (data && data.length > 0 && data[0]?.paceRecords) {
      const totals = {};
      data[0].paceRecords.forEach((record, index) => {
        if (record.totalScore) {
          totals[index] = record.totalScore;
        }
      });
      setPaceTotals(totals);
    }
  }, [data]);

  const handleScoreChange = (studentId, paceIndex, value) => {
    const score = value === '' ? null : parseInt(value, 10);
    const maxScore = paceTotals[paceIndex];
    if (!isNaN(score) && maxScore && (score < 0 || score > maxScore)) return;

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

  const handleTotalScoreChange = (paceIndex, value) => {
    // Allow empty string while typing
    if (value === '') {
      setPaceTotals(prev => ({ ...prev, [paceIndex]: '' }));
      return;
    }

    const total = parseInt(value, 10);
    if (!isNaN(total) && total > 0) {
      setPaceTotals(prev => ({ ...prev, [paceIndex]: total }));
      
      // Update all students' pace records with new total
      const updatedData = localData.map(row => {
        const updatedPaceRecords = [...row.paceRecords];
        if (updatedPaceRecords[paceIndex]) {
          updatedPaceRecords[paceIndex] = {
            ...updatedPaceRecords[paceIndex],
            totalScore: total
          };
        }
        return { ...row, paceRecords: updatedPaceRecords };
      });
      
      onDataChange(updatedData);
    }
  };

  const handleTotalBlur = (paceIndex) => {
    // If field is empty on blur, remove the total
    if (!paceTotals[paceIndex]) {
      const newTotals = { ...paceTotals };
      delete newTotals[paceIndex];
      setPaceTotals(newTotals);
      
      // Update all students' pace records to remove total
      const updatedData = localData.map(row => {
        const updatedPaceRecords = [...row.paceRecords];
        if (updatedPaceRecords[paceIndex]) {
          const { totalScore, ...rest } = updatedPaceRecords[paceIndex];
          updatedPaceRecords[paceIndex] = rest;
        }
        return { ...row, paceRecords: updatedPaceRecords };
      });
      
      onDataChange(updatedData);
    }
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
          PACE
        </button>
      </div>
      <div className="pace-table-wrapper">
        <table className="pace-table">
          <thead>
            <tr>
              <th className="sticky-header">Student</th>
              {hasPaceRecords ? (
                localData[0]?.paceRecords?.map((record, index) => (
                  <th key={index} className="pace-record-header">
                    <div className="pace-header-content">
                      <span>PACE #{record.paceNo}</span>
                      <input
                        type="number"
                        min="1"
                        placeholder="Total"
                        value={paceTotals[index] ?? ''}
                        onChange={(e) => handleTotalScoreChange(index, e.target.value)}
                        onBlur={() => handleTotalBlur(index)}
                        className="total-input"
                      />
                    </div>
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
                <td className="student-name sticky-col">{row.name}</td>
                {row.paceRecords?.length > 0 ? (
                  row.paceRecords.map((record, recordIndex) => (
                    <td key={recordIndex} className="score-cell">
                      <input
                        type="number"
                        min="0"
                        max={paceTotals[recordIndex] || undefined}
                        placeholder="Score"
                        value={record.testScore ?? ''}
                        onChange={(e) => handleScoreChange(row.studentId, recordIndex, e.target.value)}
                        className="score-input"
                        disabled={!paceTotals[recordIndex]}
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