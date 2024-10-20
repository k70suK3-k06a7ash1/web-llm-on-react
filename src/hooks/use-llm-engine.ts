import { CreateMLCEngine, type MLCEngine } from "@mlc-ai/web-llm";
import { type Dispatch, useEffect, useReducer, useState } from "react";
import { initProgressCallback } from "../helpers/initProgressCallback";
import { initialState } from "../constants";
import { engineReducer } from "../functions/engine-reducer";
import type { EngineAction } from "../types";

export const useLlmEngine = () => {
	const [engine, setEngine] = useState<MLCEngine | null>(null);
	const [state, dispatch] = useReducer(engineReducer, initialState);

	const withLoading =
		(dispatch: Dispatch<EngineAction>) =>
		async (
			asyncFunc: (setResponse: Dispatch<string>) => Promise<void>,
		): Promise<void> => {
			try {
				dispatch({ type: "START_LOADING" });
				// lambda expression
				await asyncFunc((message: string) =>
					dispatch({ type: "SET_RESPONSE", payload: message }),
				);
			} catch (error) {
				dispatch({ type: "SET_RESPONSE", payload: JSON.stringify(error) });
				console.error(error);
			} finally {
				dispatch({ type: "STOP_LOADING" });
			}
		};
	const withLoadingHasDispatch = withLoading(dispatch);

	const initializeEngine = async () =>
		await withLoadingHasDispatch(async (setResponse) => {
			const engine = await CreateMLCEngine(
				"Qwen2.5-1.5B-Instruct-q4f16_1-MLC",
				{ initProgressCallback: initProgressCallback(setResponse) },
			);
			setEngine(engine);
		});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		(async () => {
			await initializeEngine();
		})();
	}, []);

	return { state, withLoadingHasDispatch, engine };
};
