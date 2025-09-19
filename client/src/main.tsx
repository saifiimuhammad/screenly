import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "@progress/kendo-theme-default/dist/all.css";

createRoot(document.getElementById("root")!).render(<App />);
