require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ID de voz marcante e firme da ElevenLabs (Adam / Locutor clássico)
const DEFAULT_VOICE_ID = "pNInz6obpgDQGcFmaJgB";

app.get("/", (req, res) => {
  res.json({
    status: "online",
    sistema: "ESTUDIO VOICE DJ",
    versao: "1.0.0",
    mensagem: "Backend funcionando!"
  });
});

app.get("/api/status", (req, res) => {
  res.json({
    online: true,
    service: "ESTUDIO VOICE DJ API",
    hasApiKey: !!process.env.ELEVENLABS_API_KEY
  });
});

app.post("/api/voice/generate", async (req, res) => {
  const { text, voiceId } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({
      success: false,
      error: "O texto da locução é obrigatório."
    });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      success: false,
      error: "Chave da ElevenLabs não configurada no servidor (Environment)."
    });
  }

  try {
    const selectedVoice = voiceId || DEFAULT_VOICE_ID;
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8
          }
        })
      }
    );

    if (!response.ok) {
      const errDetail = await response.text();
      console.error("Erro ElevenLabs:", errDetail);
      return res.status(response.status).json({
        success: false,
        error: "Falha ao gerar voz na ElevenLabs. Verifique os créditos ou a chave."
      });
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");

    return res.json({
      success: true,
      audioUrl: `data:audio/mp3;base64,${audioBase64}`,
      message: "Locução gerada com sucesso!"
    });
  } catch (error) {
    console.error("Erro interno do servidor:", error);
    return res.status(500).json({
      success: false,
      error: "Erro interno ao processar a geração de voz."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ESTUDIO VOICE DJ API rodando na porta ${PORT}`);
});
