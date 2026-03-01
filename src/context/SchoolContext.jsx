import { createContext, useContext, useState } from 'react';

const SchoolContext = createContext();

export function SchoolProvider({ children }) {
  const [selectedSchool, setSelectedSchool] = useState('LBCA');

  return (
    <SchoolContext.Provider value={{ selectedSchool, setSelectedSchool }}>
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
}

export default SchoolContext;
