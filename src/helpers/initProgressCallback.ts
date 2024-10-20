import type { InitProgressReport } from "@mlc-ai/web-llm";
import type { Dispatch } from "react";

export const initProgressCallback =
	(setResponse: Dispatch<string>) => (report: InitProgressReport) => {
		setResponse(report.text);
	};
