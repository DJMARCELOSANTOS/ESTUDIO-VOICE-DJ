const text = document.getElementById('scriptText');
const charCount = document.getElementById('charCount');
const speed = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');
const toast = document.getElementById('toast');
const startButton = document.getElementById('startButton');
const generateButton = document.getElementById('generateButton');

// URL do seu backend ativo no Render
const BACKEND_URL = 'https://estudio-voice-dj.onrender.com';

function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(()=>toast.classList.remove('show'), 4000);
}

text.addEventListener('input', ()=>{
  charCount.textContent = text.value.length;
});

speed.addEventListener('input', ()=>{
  speedValue.textContent = Number(speed.value).toFixed(1) + 'x';
});

startButton.addEventListener('click', ()=>{
  document.getElementById('studio').scrollIntoView({behavior:'smooth'});
  setTimeout(()=>text.focus(), 500);
});

document.querySelectorAll('.quick-tags button').forEach(button=>{
  button.addEventListener('click', ()=>{
    text.value = button.dataset.text;
    charCount.textContent = text.value.length;
    text.focus();
  });
});

generateButton.addEventListener('click', async ()=>{
  const content = text.value.trim();

  if(!content){
    showToast('Digite um texto antes de gerar sua locução.');
    text.focus();
    return;
  }

  // Feedback visual de carregamento
  generateButton.disabled = true;
  const originalText = generateButton.textContent;
  generateButton.textContent = 'A conectar ao backend...';
  showToast('A enviar solicitação ao ESTÚDIO VOICE DJ...');

  try {
    const response = await fetch(`${BACKEND_URL}/api/voice/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: content,
        speed: Number(speed.value) || 1
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      showToast('Sucesso: Backend conectado e solicitação recebida!');
    } else {
      showToast(data.error || 'Ocorreu um erro ao processar a solicitação.');
    }
  } catch (error) {
    console.error('Erro na ligação com o backend:', error);
    showToast('Aviso: O backend pode estar a despertar. Tente novamente em alguns segundos.');
  } finally {
    generateButton.disabled = false;
    generateButton.textContent = originalText;
  }
});

document.querySelectorAll('.play-small').forEach(button=>{
  button.addEventListener('click', ()=>{
    showToast('Player de demonstração — áudio real será conectado em breve.');
  });
});
