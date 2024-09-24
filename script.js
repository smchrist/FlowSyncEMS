const bpmInput = document.getElementById('bpm');
const bpmValue = document.getElementById('bpmValue');
const medications = document.getElementById('medications');
const beatIndicator = document.getElementById('beatIndicator');
const clickSound = document.getElementById('clickSound');

let interval;
let isPlaying = false;

// Function to set the metronome interval
function setMetronomeInterval(bpm) {
  clearInterval(interval);  // Clear any existing interval to avoid overlap
  const intervalTime = (60 / bpm) * 1000;
  interval = setInterval(playBeat, intervalTime);
}

// Function to start or stop the metronome
function toggleMetronome() {
  if (isPlaying) {
    clearInterval(interval);
    isPlaying = false;
    document.getElementById('startStop').textContent = 'Start';
  } else {
    const bpm = parseInt(bpmInput.value); // Get current BPM from the slider
    setMetronomeInterval(bpm);            // Start the metronome with the current BPM
    isPlaying = true;
    document.getElementById('startStop').textContent = 'Stop';
  }
}

// Event listener for Start/Stop button
document.getElementById('startStop').addEventListener('click', toggleMetronome);

// Event listener for manual BPM input changes
bpmInput.addEventListener('input', function() {
  bpmValue.textContent = this.value;
  if (isPlaying) {
    setMetronomeInterval(parseInt(this.value));  // Adjust interval if playing
  }
});

// Medication Presets: Updates BPM and resets metronome if it's running
medications.addEventListener('change', function() {
  switch (this.value) {
    case 'amiodarone':
      bpmInput.value = 100; // Example BPM for Amiodarone
      break;
    case 'epinephrine':
      bpmInput.value = 120; // Example BPM for Epinephrine
      break;
    case 'levophed':
      bpmInput.value = 40; // Example BPM for Levophed
      break;
    default:
      bpmInput.value = 60;  // Default BPM
      break;
  }
  bpmValue.textContent = bpmInput.value;
  
  if (isPlaying) {
    setMetronomeInterval(parseInt(bpmInput.value));  // Restart metronome if it's already running
  }
});

function playBeat() {
  clickSound.play();

  // Trigger a color change and pulse effect
  beatIndicator.style.backgroundColor = 'orange';
  beatIndicator.style.animation = 'pulse 0.3s ease-in-out';  // Faster pulse for higher BPM

  // Reset the color and animation after a delay (keeping orange longer)
  setTimeout(() => {
    beatIndicator.style.backgroundColor = 'lightblue';
    beatIndicator.style.animation = 'none';
  }, 600);  // Increase this to keep the orange longer (adjust based on BPM)
}

