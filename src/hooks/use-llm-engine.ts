import { CreateMLCEngine, MLCEngine } from "@mlc-ai/web-llm";
import { useEffect, useReducer, useState } from "react";
import { initProgressCallback } from "../helpers/initProgressCallback";


type EngineState = {
    response: string
    loading: boolean
}


type Action = 
    | { type: "START_LOADING" }
    | { type: "SET_RESPONSE", payload: string }
    | { type: "STOP_LOADING" };


const engineReducer = (state: EngineState, action: Action): EngineState => {
    switch (action.type) {
        case "START_LOADING":
            return { ...state, loading: true };
        case "SET_RESPONSE":
            return { ...state, response: action.payload, loading: false };
        case "STOP_LOADING":
            return { ...state, loading: false };
        default:
            return state;
    }
};

const initialState: EngineState = {
    response: "",
    loading: false,
};
export const useLlmEngine = () => {
      const [engine, setEngine] = useState<MLCEngine | null>(null); 
    const [state, dispatch] = useReducer(engineReducer, initialState);

    const setResponse = (message: string) =>  dispatch({ type: "SET_RESPONSE", payload: message });

   const initializeEngine = async () => {
    try {
       dispatch({ type: "START_LOADING" });
      const engine = await CreateMLCEngine(
        "Qwen2.5-1.5B-Instruct-q4f16_1-MLC",
        { initProgressCallback: initProgressCallback(setResponse) },
      );
      setEngine(engine)
    } catch (error) {
        // set error message
       dispatch({ type: "SET_RESPONSE", payload: "Error" });
      console.error(error);
    } finally {
      dispatch({ type: "STOP_LOADING" });
    }      
   }
    
      useEffect(() => {
   (async () => {
      await initializeEngine();
    })();
      }, []); 
    
    
    return {state ,dispatch, setResponse, engine}

}