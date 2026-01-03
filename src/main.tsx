import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("🚀 [Main] Iniciando aplicação...");

// Error boundary global
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("❌ [Main] Elemento root não encontrado!");
  document.body.innerHTML = '<div style="min-height:100vh;background:#22c55e;display:flex;align-items:center;justify-content:center;color:white;font-size:18px;">Erro: elemento root não encontrado</div>';
} else {
  console.log("✅ [Main] Elemento root encontrado");
  
  // Mostrar fallback imediatamente
  rootElement.innerHTML = '<div style="min-height:100vh;background:linear-gradient(to bottom right, #22c55e, #16a34a, #15803d);display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;"><div style="width:96px;height:96px;background:white;border-radius:24px;margin-bottom:16px;display:flex;align-items:center;justify-content:center;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);"><div style="width:40px;height:40px;border:4px solid #22c55e;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;"></div></div><h1 style="font-size:24px;font-weight:bold;margin-bottom:8px;">Calc</h1><p style="font-size:14px;opacity:0.8;">Carregando...</p></div><style>@keyframes spin{to{transform:rotate(360deg);}}</style>';
  
  try {
    console.log("🔄 [Main] Criando root do React...");
    const root = createRoot(rootElement);
    
    console.log("🔄 [Main] Renderizando App...");
    root.render(<App />);
    
    console.log("✅ [Main] App renderizado com sucesso");
  } catch (error: any) {
    console.error("❌ [Main] Erro ao renderizar app:", error);
    const errorMessage = error?.message || String(error || "Erro desconhecido");
    rootElement.innerHTML = `
      <div style="min-height:100vh;background:linear-gradient(to bottom right, #22c55e, #16a34a);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;color:white;">
        <h2 style="font-size:20px;margin-bottom:12px;">Erro ao carregar aplicação</h2>
        <p style="font-size:14px;opacity:0.9;text-align:center;max-width:500px;">${errorMessage}</p>
        <button onclick="window.location.reload()" style="margin-top:20px;padding:10px 20px;background:white;color:#22c55e;border:none;border-radius:8px;font-weight:bold;cursor:pointer;">Recarregar</button>
      </div>
    `;
  }
}
