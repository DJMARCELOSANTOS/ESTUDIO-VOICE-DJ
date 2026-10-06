const API_URL = "https://estudio-voice-dj.onrender.com";

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.innerText = message;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.padding = "12px 20px";
  toast.style.borderRadius = "8px";
  toast.style.color = "#fff";
  toast.style.fontWeight = "bold";
  toast.style.zIndex = "9999";
  toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
  toast.style.transition = "all 0.3s ease";

  if (type === "success") {
    toast.style.background = "#10b981";
  } else if (type === "error") {
    toast.style.background = "#ef4444";
  } else {
    toast.style.background = "#2563eb";
  }

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.querySelector("textarea");
  const generateBtn = document.querySelector("button#generate-btn") || document.querySelector("button");

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
    showToast("A processar a voz na ElevenLabs...", "info");

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

      // Tocar o áudio gerado
      const audio = new Audio(data.audioUrl);
      audio.play();

      // Disponibilizar link/botão para descarregar o ficheiro MP3
      let downloadLink = document.getElementById("audio-download-link");
      if (!downloadLink) {
        downloadLink = document.createElement("a");
        downloadLink.id = "audio-download-link";
        downloadLink.innerText = "Baixar MP3 da Locução";
        downloadLink.style.display = "block";
        downloadLink.style.marginTop = "15px";
        downloadLink.style.color = "#10b981";
        downloadLink.style.fontWeight = "bold";
        downloadLink.style.textDecoration = "underline";
        generateBtn.parentNode.appendChild(downloadLink);
      }
      downloadLink.href = data.audioUrl;
      downloadLink.download = "vinheta-dj.mp3";

    } catch (error) {
      console.error(error);
      showToast(error.message || "Falha na comunicação com o servidor.", "error");
    } finally {
      generateBtn.innerText = originalText;
      generateBtn.disabled = false;
    }
  });
});
