import { CreateMLCEngine } from "@mlc-ai/web-llm";
import { initProgressCallback } from "../helpers/initProgressCallback";
import type { useLlmEngine } from "../hooks/use-llm-engine";

export const initializeEngine = async (
	hooksProps: Pick<
		ReturnType<typeof useLlmEngine>,
		"setEngine" | "withLoadingHasDispatch"
	>,
) =>
	await hooksProps.withLoadingHasDispatch(async (setResponse) => {
		const engine = await CreateMLCEngine("Qwen2.5-1.5B-Instruct-q4f16_1-MLC", {
			initProgressCallback: initProgressCallback(setResponse),
		});
		hooksProps.setEngine(engine);
	});
