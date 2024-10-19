import { Dispatch } from "react";

export const initProgressCallback =
	(setResponse: Dispatch<string>) => (initProgress: any) => {
		setResponse(initProgress["text"]);
	};
