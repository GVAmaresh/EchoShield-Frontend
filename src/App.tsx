import React, { createContext, useContext, useState } from 'react';
import NavBar from './components/NavBar/NavBar';
import MainBody from './components/MainBody/MainBody';

interface AppContextType {
  totalChunks: Blob[];
  setTotalChunks: React.Dispatch<React.SetStateAction<Blob[]>>;
  submit?: boolean;
  setSubmit: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with a default value of undefined
const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

const App: React.FC = () => {
  const [totalChunks, setTotalChunks] = useState<Blob[]>([]);
  const[submit, setSubmit] = useState<boolean>(false)

  return (
    <div>
      <AppContext.Provider value={{ totalChunks, setTotalChunks,submit, setSubmit }}>
        <NavBar />
        <MainBody />
      </AppContext.Provider>
    </div>
  );
};

export default App;