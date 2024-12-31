declare global {
    namespace NodeJS {
      interface ProcessEnv {
        REACT_APP_ML_API: string;
      }
    }
  }
  
  export {};