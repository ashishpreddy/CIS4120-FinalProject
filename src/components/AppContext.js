import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const AppContext = createContext();

// Create provider component
export const AppProvider = ({ children }) => {
  // Initialize mode from localStorage if available
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('appMode');
    return savedMode ? savedMode : 'buyer';
  });

  // Save mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('appMode', mode);
  }, [mode]);

  // Toggle between buyer and seller modes
  const toggleMode = () => {
    setMode(prevMode => prevMode === 'buyer' ? 'seller' : 'buyer');
  };

  return (
    <AppContext.Provider 
      value={{ 
        mode,
        setMode,
        toggleMode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useAppMode = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppMode must be used within an AppProvider');
  }
  return context;
}; 