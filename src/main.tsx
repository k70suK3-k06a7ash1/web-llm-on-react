import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Chat } from "./components/Chat.tsx";
import "./index.css";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Chat />
	</StrictMode>,
);
