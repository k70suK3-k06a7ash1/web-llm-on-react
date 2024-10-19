export type EngineState = {
	response: string;
	loading: boolean;
};

export type EngineAction =
	| { type: "START_LOADING" }
	| { type: "SET_RESPONSE"; payload: string }
	| { type: "STOP_LOADING" };
