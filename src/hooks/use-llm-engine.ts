import type { MLCEngine } from "@mlc-ai/web-llm";
import { type Dispatch, useEffect, useReducer, useState } from "react";
import { initialState } from "../constants";
import { engineReducer } from "../functions/engine-reducer";
import type { EngineAction } from "../types";
import { initializeEngine } from "../functions/initialize-engine";

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

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		(async () => {
			await initializeEngine({ withLoadingHasDispatch, setEngine })();
		})();
	}, []);

	return { state, setEngine, withLoadingHasDispatch, engine };
};
