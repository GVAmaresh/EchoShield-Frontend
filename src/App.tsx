import React, { createContext, useContext, useState } from "react";
import NavBar from "./components/NavBar/NavBar";
import MainBody from "./components/MainBody/MainBody";

interface AppContextType {
  totalChunks: Blob[];
  setTotalChunks: React.Dispatch<React.SetStateAction<Blob[]>>;
  submit?: boolean;
  setSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  output: IOutput;
  setOutput: React.Dispatch<React.SetStateAction<IOutput>>;
  activeContent: number;
  setActiveContent: React.Dispatch<React.SetStateAction<number>>;
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  walletAdd: string;
  setWalletAdd: React.Dispatch<React.SetStateAction<string>>;
}

interface IOutput {
  audio: File | undefined;
  prediction?: string;
  entropy?: string;
  text?: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

const App: React.FC = () => {
  const [totalChunks, setTotalChunks] = useState<Blob[]>([]);
  const [submit, setSubmit] = useState<boolean>(false);
  const [activeContent, setActiveContent] = useState<number>(0);
  const [inputText, setInputText] = useState<string>("");
  const [walletAdd, setWalletAdd] = useState<string>("");
  const [output, setOutput] = useState<IOutput>({
    audio: undefined,
    prediction: "",
    entropy: "",
    text: ""
  });

  return (
    <div>
      <AppContext.Provider
        value={{
          totalChunks,
          setTotalChunks,
          inputText,
          setInputText,
          activeContent,
          setActiveContent,
          submit,
          walletAdd,
          setWalletAdd,
          setSubmit,
          output,
          setOutput
        }}
      >
        <NavBar />
        <MainBody />
      </AppContext.Provider>
    </div>
  );
};

export default App;
