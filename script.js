const API_URL = "https://estudio-voice-dj.onrender.com";

function showToast(message, type = "info") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.padding = "12px 20px";
  toast.style.borderRadius = "8px";
  toast.style.color = "#fff";
  toast.style.fontWeight = "bold";
  toast.style.zIndex = "99999";
  toast.style.boxShadow = "0 4px 14px rgba(0,0,0,0.4)";
  toast.style.display = "block";
  toast.style.opacity = "1";
  toast.style.transition = "opacity 0.3s ease";

  if (type === "success") {
    toast.style.background = "#10b981";
  } else if (type === "error") {
    toast.style.background = "#ef4444";
  } else {
    toast.style.background = "#6366f1";
  }

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => { toast.style.display = "none"; }, 300);
  }, 4000);
}

document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.querySelector("textarea");
  const charCounter = document.querySelector(".char-counter") || document.querySelector("span:has-text('/1000')") || document.querySelector("div:contains('/1000')");

  // Atualizar contador de carateres ao escrever
  if (textarea) {
    textarea.addEventListener("input", () => {
      const len = textarea.value.length;
      const counterEl = document.querySelector("div:has(> span)") || charCounter;
      // Procura qualquer elemento de texto que contenha /1000
      const allElements = document.querySelectorAll("*");
      for (const el of allElements) {
        if (el.children.length === 0 && el.innerText && el.innerText.includes("/1000")) {
          el.innerText = `${len}/1000`;
          break;
        }
      }
    });
  }

  // Identificar qualquer botão de geração de locução na página
  const buttons = Array.from(document.querySelectorAll("button"));
  const generateBtn = buttons.find(b => b.innerText.includes("Gerar locução") || b.innerText.includes("Gerar")) || document.querySelector("button#generate-btn") || buttons[0];

  if (!generateBtn) return;

  generateBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const text = textarea ? textarea.value.trim() : "";

    if (!text) {
      showToast("Por favor, digite o texto da vinheta antes de gerar.", "error");
      return;
    }

    const originalText = generateBtn.innerText;
    generateBtn.innerText = "A gerar locução...";
    generateBtn.disabled = true;
    showToast("A ligar ao servidor e à ElevenLabs...", "info");

    try {
      const response = await fetch(`${API_URL}/api/voice/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Erro ao gerar áudio.");
      }

      showToast("Locução gerada com sucesso!", "success");

      const audio = new Audio(data.audioUrl);
      audio.play();

      let downloadLink = document.getElementById("audio-download-link");
      if (!downloadLink) {
        downloadLink = document.createElement("a");
        downloadLink.id = "audio-download-link";
        downloadLink.innerText = "⬇️ Baixar MP3 da Locução";
        downloadLink.style.display = "block";
        downloadLink.style.marginTop = "15px";
        downloadLink.style.color = "#10b981";
        downloadLink.style.fontWeight = "bold";
        downloadLink.style.textAlign = "center";
        downloadLink.style.textDecoration = "underline";
        generateBtn.parentNode.appendChild(downloadLink);
      }
      downloadLink.href = data.audioUrl;
      downloadLink.download = "locucao-dj-marcelo.mp3";

    } catch (error) {
      console.error(error);
      showToast(error.message || "Servidor a iniciar. Aguarde 30s e tente de novo.", "error");
    } finally {
      generateBtn.innerText = originalText;
      generateBtn.disabled = false;
    }
  });
});
