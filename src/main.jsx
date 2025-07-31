import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import ThemeProvider from "./contexts/ThemeProvider.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>

    <ThemeProvider>
        <AuthProvider>
      <BrowserRouter>
          <App />
      </BrowserRouter>
        </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered:', registration);
    }).catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
}
