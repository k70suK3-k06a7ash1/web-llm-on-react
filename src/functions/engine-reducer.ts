import { EngineState, EngineAction } from "../types";

export const engineReducer = (
	state: EngineState,
	action: EngineAction,
): EngineState => {
	switch (action.type) {
		case "START_LOADING":
			return { ...state, loading: true };
		case "SET_RESPONSE":
			return { ...state, response: action.payload };
		case "STOP_LOADING":
			return { ...state, loading: false };
		default:
			return state;
	}
};
