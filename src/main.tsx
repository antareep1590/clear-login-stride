import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CustomFieldsProvider } from "./contexts/CustomFieldsContext";

createRoot(document.getElementById("root")!).render(
  <CustomFieldsProvider>
    <App />
  </CustomFieldsProvider>
);
