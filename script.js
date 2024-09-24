const bpmInput = document.getElementById('bpm');
const bpmValue = document.getElementById('bpmValue');
const medications = document.getElementById('medications');
const beatIndicator = document.getElementById('beatIndicator');
const clickSound = document.getElementById('clickSound');

let interval;
let isPlaying = false;

// Function to set the metronome interval
function setMetronomeInterval(bpm) {
  if (isPlaying) {
    clearInterval(interval);
    const intervalTime = (60 / bpm) * 1000;
    interval = setInterval(playBeat, intervalTime);
  }
}

// Event listener for Start/Stop button
document.getElementById('startStop').addEventListener('click', function() {
  if (isPlaying) {
    clearInterval(interval);
    isPlaying = false;
    this.textContent = 'Start';
  } else {
    const bpm = parseInt(bpmInput.value);
    setMetronomeInterval(bpm);
    isPlaying = true;
    this.textContent = 'Stop';
  }
});

// Event listener for manual BPM input changes
bpmInput.addEventListener('input', function() {
  bpmValue.textContent = this.value;
  setMetronomeInterval(parseInt(this.value));
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
  setMetronomeInterval(parseInt(bpmInput.value));
});

// Function to play a beat and trigger the visual effect
function playBeat() {
  clickSound.play();
  beatIndicator.style.animation = 'pulse 0.5s ease-in-out';
  setTimeout(() => beatIndicator.style.animation = 'none', 500);
}

