import { useState } from "react";

import "./Chat.css";
import type { ChatCompletionMessageParam } from "@mlc-ai/web-llm";
import { useLlmEngine } from "../hooks/use-llm-engine";
export function Chat() {
	const [inputText, setInputText] = useState<string>(""); // 入力
	const { state, withLoadingHasDispatch, engine } = useLlmEngine();

	const handleClick = (inputText: string) => () =>
		withLoadingHasDispatch(async (setResponse) => {
			// メッセージの準備
			const messages: ChatCompletionMessageParam[] = [
				{ role: "user", content: inputText },
			];
			if (!engine) return;
			const reply = await engine.chat.completions.create({
				messages,
			});
			if (reply.choices[0].message.content) {
				setResponse(reply.choices[0].message.content);
			}
		});

	// UI
	return (
		<div style={{ padding: "20px" }}>
			<textarea
				value={inputText}
				onChange={(e) => setInputText(e.target.value)}
				rows={4}
				cols={50}
			/>
			<br />
			<button
				type="button"
				onClick={handleClick(inputText)}
				disabled={state.loading}
			>
				{state.loading ? "Loading..." : "Send"}
			</button>
			<pre style={{ whiteSpace: "pre-wrap" }}>{state.response}</pre>
		</div>
	);
}
