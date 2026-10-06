const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Rota inicial
app.get("/", (req, res) => {
  res.json({
    status: "online",
    sistema: "ESTUDIO VOICE DJ",
    versao: "1.0.0",
    mensagem: "Backend funcionando!"
  });
});

// Rota de teste
app.get("/api/status", (req, res) => {
  res.json({
    online: true,
    service: "ESTUDIO VOICE DJ API"
  });
});

// Rota de geração de voz
app.post("/api/voice/generate", (req, res) => {
  const { text, voice, style, speed } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({
      success: false,
      error: "O texto da locução é obrigatório."
    });
  }

  res.json({
    success: true,
    message: "Solicitação recebida pelo backend.",
    data: {
      text,
      voice: voice || "Locutor Masculino — Grave",
      style: style || "Profissional",
      speed: speed || 1
    }
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ESTUDIO VOICE DJ API rodando na porta ${PORT}`);
});
