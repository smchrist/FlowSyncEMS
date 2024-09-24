const bpmInput = document.getElementById('bpm');
const bpmValue = document.getElementById('bpmValue');
const medications = document.getElementById('medications');
const beatIndicator = document.getElementById('beatIndicator');
const clickSound = document.getElementById('clickSound');

let interval;
let isPlaying = false;

document.getElementById('startStop').addEventListener('click', function() {
  if (isPlaying) {
    clearInterval(interval);
    isPlaying = false;
    this.textContent = 'Start';
  } else {
    const bpm = parseInt(bpmInput.value);
    const intervalTime = (60 / bpm) * 1000;
    interval = setInterval(playBeat, intervalTime);
    isPlaying = true;
    this.textContent = 'Stop';
  }
});

bpmInput.addEventListener('input', function() {
  bpmValue.textContent = this.value;
  if (isPlaying) {
    clearInterval(interval);
    const bpm = parseInt(this.value);
    const intervalTime = (60 / bpm) * 1000;
    interval = setInterval(playBeat, intervalTime);
  }
});

// Medication Presets
medications.addEventListener('change', function() {
  switch (this.value) {
    case 'amiodarone':
      bpmInput.value = 50; // Example BPM for Amiodarone
      break;
    case 'epinephrine':
      bpmInput.value = 100; // Example BPM for Epinephrine
      break;
    case 'levophed':
      bpmInput.value = 80; // Example BPM for Levophed
      break;
    default:
      bpmInput.value = 60;  // Default BPM
      break;
  }
  bpmValue.textContent = bpmInput.value;
});

function playBeat() {
  clickSound.play();
  beatIndicator.style.animation = 'pulse 0.5s ease-in-out';
  setTimeout(() => beatIndicator.style.animation = 'none', 500);
}
