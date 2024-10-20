import { CreateMLCEngine, type MLCEngine } from "@mlc-ai/web-llm";
import { type Dispatch, useEffect, useReducer, useState } from "react";
import { initProgressCallback } from "../helpers/initProgressCallback";
import { initialState } from "../constants";
import { engineReducer } from "../functions/engine-reducer";
import type { EngineAction } from "../types";

export const useLlmEngine = () => {
	const [engine, setEngine] = useState<MLCEngine | null>(null);
	const [state, dispatch] = useReducer(engineReducer, initialState);

	const setResponse = (message: string) =>
		dispatch({ type: "SET_RESPONSE", payload: message });

	const withLoading =
		(setResponse: Dispatch<string>) =>
		async (
			asyncFunc: (setResponse: Dispatch<string>) => Promise<void>,
			dispatch: Dispatch<EngineAction>,
		): Promise<void> => {
			try {
				dispatch({ type: "START_LOADING" });
				await asyncFunc(setResponse);
			} catch (error) {
				dispatch({ type: "SET_RESPONSE", payload: JSON.stringify(error) });
				console.error(error);
			} finally {
				dispatch({ type: "STOP_LOADING" });
			}
		};

	const withLoadingHasSetResponse = withLoading(setResponse);

	const initializeEngine = async () =>
		withLoadingHasSetResponse(async (setResponse) => {
			const engine = await CreateMLCEngine(
				"Qwen2.5-1.5B-Instruct-q4f16_1-MLC",
				{ initProgressCallback: initProgressCallback(setResponse) },
			);
			setEngine(engine);
		}, dispatch);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		(async () => {
			await initializeEngine();
		})();
	}, []);

	return { state, dispatch, setResponse, withLoadingHasSetResponse, engine };
};
