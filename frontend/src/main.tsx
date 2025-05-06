import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set title
document.title = "TrackerGeo - Sistema de Rastreamento Veicular";

createRoot(document.getElementById("root")!).render(<App />);
