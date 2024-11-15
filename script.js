// Selecting UI elements
const dripPreset = document.getElementById('dripPreset');
const concentration = document.getElementById('concentration');
const mixingInstructions = document.getElementById('mixingInstructions');
const rate = document.getElementById('rate');
const dripSet = document.getElementById('dripSet');
const bpmSlider = document.getElementById('bpm');
const bpmValue = document.getElementById('bpmValue');
const startStopBtn = document.getElementById('startStopBtn');
const visualIndicator = document.getElementById('visualIndicator');
const increaseBpmBtn = document.getElementById('increaseBpm');
const decreaseBpmBtn = document.getElementById('decreaseBpm');
const levophedTable = document.getElementById('levophedTable');
const epiTable = document.getElementById('epiTable');

let metronomeInterval;
let isMetronomeRunning = false;

// Sound setup
const clickSound = new Audio('click.mp3');

// Drip preset details
const dripDetails = {
    levophed: {
        concentration: "8 mcg/mL",
        mixingInstructions: "4 mg (4 mL) in 500 mL NS",
        rate: "2-12 mcg/min (Titrated)",
        dripSet: "60 gtt/mL",
    },
    epinephrine: {
        concentration: "1 mcg/mL",
        mixingInstructions: "1 mL (1 mg) in 1 L NS",
        rate: "2-10 mcg/min (Titrated)",
        dripSet: "20 gtt/mL",
    },
    amiodarone: {
        concentration: "150 mg in 50 mL D5W",
        mixingInstructions: "Administer over 10 minutes",
        rate: "For resolved VF/VT with ROSC",
        dripSet: "20 gtt/mL",
    },
    magnesium: {
        concentration: "2 g in 50 mL NS",
        mixingInstructions: "Administer at 33 mg/min (50 drops/min)",
        rate: "Non-titrated",
        dripSet: "60 gtt/mL",
    }
};

// Function to update drip details
function updateDripDetails(selectedDrip) {
    // Hide all tables by default
    levophedTable.style.display = "none";
    epiTable.style.display = "none";

    if (selectedDrip === "select") {
        concentration.textContent = "Concentration: --";
        mixingInstructions.textContent = "Mixing Instructions: --";
        rate.textContent = "Rate: --";
        dripSet.textContent = "Drip Set: --";
    } else {
        concentration.textContent = `Concentration: ${dripDetails[selectedDrip].concentration}`;
        mixingInstructions.textContent = `Mixing Instructions: ${dripDetails[selectedDrip].mixingInstructions}`;
        rate.textContent = `Rate: ${dripDetails[selectedDrip].rate}`;
        dripSet.textContent = `Drip Set: ${dripDetails[selectedDrip].dripSet}`;

        // Show specific tables based on the selected drip
        if (selectedDrip === "levophed") {
            levophedTable.style.display = "block";
        } else if (selectedDrip === "epinephrine") {
            epiTable.style.display = "block";
        }
    }
}

// Update drip details when a preset is selected
dripPreset.addEventListener('change', () => {
    updateDripDetails(dripPreset.value);
});

// Function to update BPM value and restart metronome if running
function updateBpm(newBpm) {
    bpmSlider.value = newBpm;
    bpmValue.textContent = newBpm;
    if (isMetronomeRunning) {
        clearInterval(metronomeInterval); // Clear the current interval
        startMetronome(); // Restart the metronome with the new BPM
    }
}

// Add click events to Levophed and Epinephrine drip rate elements
document.querySelectorAll('.drip-rate, .drip-rate-epi').forEach(element => {
    element.addEventListener('click', () => {
        const newBpm = element.getAttribute('data-rate');
        updateBpm(newBpm);
        // Highlight the selected rate
        document.querySelectorAll('.drip-rate, .drip-rate-epi').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
    });
});

// Increase BPM
increaseBpmBtn.addEventListener('click', () => {
    let newBpm = Math.min(parseInt(bpmSlider.value) + 1, 200); // Max BPM is 200
    updateBpm(newBpm);
});

// Decrease BPM
decreaseBpmBtn.addEventListener('click', () => {
    let newBpm = Math.max(parseInt(bpmSlider.value) - 1, 30); // Min BPM is 30
    updateBpm(newBpm);
});

// Update BPM when slider is moved
bpmSlider.addEventListener('input', () => {
    updateBpm(bpmSlider.value);
});

// Function to start the metronome
function startMetronome() {
    const bpm = parseInt(bpmSlider.value);
    const interval = 60000 / bpm; // Calculate interval in milliseconds
    clearInterval(metronomeInterval); // Clear any existing interval

    metronomeInterval = setInterval(() => {
        clickSound.play(); // Play the click sound
        const drop = document.getElementById('drop');
        drop.classList.add('drop-animation'); // Add animation class

        // Remove the animation class after the animation ends to reset
        setTimeout(() => {
            drop.classList.remove('drop-animation');
        }, 1200); // Match the duration of the animation
    }, interval);
}

// Start/Stop the metronome
startStopBtn.addEventListener('click', () => {
    if (isMetronomeRunning) {
        clearInterval(metronomeInterval);
        isMetronomeRunning = false;
        startStopBtn.textContent = 'Start';
    } else {
        startMetronome();
        isMetronomeRunning = true;
        startStopBtn.textContent = 'Stop';
    }
});
