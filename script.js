const text = document.getElementById('scriptText');
const charCount = document.getElementById('charCount');
const speed = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');
const toast = document.getElementById('toast');
const startButton = document.getElementById('startButton');
const generateButton = document.getElementById('generateButton');

function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(()=>toast.classList.remove('show'),3000);
}

text.addEventListener('input', ()=>{
  charCount.textContent = text.value.length;
});

speed.addEventListener('input', ()=>{
  speedValue.textContent = Number(speed.value).toFixed(1) + 'x';
});

startButton.addEventListener('click', ()=>{
  document.getElementById('studio').scrollIntoView({behavior:'smooth'});
  setTimeout(()=>text.focus(),500);
});

document.querySelectorAll('.quick-tags button').forEach(button=>{
  button.addEventListener('click', ()=>{
    text.value = button.dataset.text;
    charCount.textContent = text.value.length;
    text.focus();
  });
});

generateButton.addEventListener('click', ()=>{
  if(!text.value.trim()){
    showToast('Digite um texto antes de gerar sua locução.');
    text.focus();
    return;
  }
  showToast('Modo demonstração: o gerador de voz será conectado na próxima etapa.');
});

document.querySelectorAll('.play-small').forEach(button=>{
  button.addEventListener('click', ()=>{
    showToast('Player de demonstração — áudio real será conectado em breve.');
  });
});
