export    const initProgressCallback =(setResponse:React.Dispatch<React.SetStateAction<string>> ) => (initProgress: any) => {
        setResponse(initProgress["text"]);
      }