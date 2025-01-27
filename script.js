// Selecting UI elements
const dripPreset = document.getElementById('dripPreset');
const concentration = document.getElementById('concentration');
const mixingInstructions = document.getElementById('mixingInstructions');
const rate = document.getElementById('rate');
const dripSet = document.getElementById('dripSet');
const gttsSlider = document.getElementById('gttsSlider'); // Updated
const gttsValue = document.getElementById('gttsValue'); // Updated
const startStopBtn = document.getElementById('startStopBtn');
const visualIndicator = document.getElementById('visualIndicator');
const increaseGttsBtn = document.getElementById('increaseGtts'); // Updated
const decreaseGttsBtn = document.getElementById('decreaseGtts'); // Updated
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
        indication: "Post cardiac arrest", // Updated
    },
    epinephrine: {
        concentration: "1 mcg/mL",
        mixingInstructions: "1 mL (1 mg) in 1 L NS",
        rate: "2-10 mcg/min (Titrated)",
        dripSet: "20 gtt/mL",
        indication: "Post cardiac arrest", // Updated
    },
    amiodarone: {
        concentration: "3 mg/mL", // Updated
        mixingInstructions: "Place 150 mg (3 mL) in 50 mL D5W", // Updated
        rate: "Non-titrated (100 gtts/min)", // Verified
        dripSet: "20 gtt/mL",
        indication: "For resolved VF/VT with ROSC", // Verified
    },
    magnesium: {
        concentration: "2 g in 50 mL NS",
        mixingInstructions: "Place 2 g of MgSO4 in 50 ml NS (or use pre-mixed bag). Administer at 33 mg/min.",
        rate: "Non-titrated (50 gtts/min)",
        dripSet: "60 gtt/mL",
        indication: "Post cardiac arrest", // Updated
    }
};


// Function to update drip details
function updateDripDetails(selectedDrip) {
    // Hide all tables by default
    levophedTable.style.display = "none";
    epiTable.style.display = "none";

    if (selectedDrip === "select") {
        document.getElementById("indication").textContent = "Indication: --"; // Reset
        concentration.textContent = "Concentration: --";
        mixingInstructions.textContent = "Mixing Instructions: --";
        rate.textContent = "Rate: --";
        dripSet.textContent = "Drip Set: --";
    } else {
        document.getElementById("indication").textContent = `Indication: ${dripDetails[selectedDrip].indication}`;
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

function updateGtts(newGtts) {
    gttsSlider.value = newGtts;
    gttsValue.textContent = `${newGtts}`; // Ensure no duplication here
    if (isMetronomeRunning) {
        clearInterval(metronomeInterval);
        startMetronome();
    }
}

// Add click events to Levophed and Epinephrine drip rate elements
document.querySelectorAll('.drip-rate, .drip-rate-epi').forEach(element => {
    element.addEventListener('click', () => {
        const newGtts = element.getAttribute('data-rate'); // Updated variable
        updateGtts(newGtts); // Updated function call
        // Highlight the selected rate
        document.querySelectorAll('.drip-rate, .drip-rate-epi').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
    });
});

// Increase gtts/min
increaseGttsBtn.addEventListener('click', () => {
    let newGtts = Math.min(parseInt(gttsSlider.value) + 1, 200); // Max gtts/min is 200
    updateGtts(newGtts);
});

// Decrease gtts/min
decreaseGttsBtn.addEventListener('click', () => {
    let newGtts = Math.max(parseInt(gttsSlider.value) - 1, 30); // Min gtts/min is 30
    updateGtts(newGtts);
});

// Update gtts/min when slider is moved
gttsSlider.addEventListener('input', () => {
    updateGtts(gttsSlider.value);
});

// Function to start the metronome
function startMetronome() {
    const gtts = parseInt(gttsSlider.value);
    const interval = 60000 / gtts; // Calculate interval in milliseconds

    clearInterval(metronomeInterval); // Clear any existing interval

    metronomeInterval = setInterval(() => {
        // Play the drop sound
        clickSound.play().catch((error) => {
            console.error("Sound error:", error); // Log any playback errors
        });

        // Create a new drop element
        const drop = document.createElement('div');
        drop.classList.add('drop');
        visualIndicator.appendChild(drop);

        // Force re-trigger animation
        requestAnimationFrame(() => {
            drop.classList.add('drop-animation');
        });

        // Create ripple when the drop reaches the liquid
        setTimeout(() => {
            const ripple = document.createElement('div');
            ripple.classList.add('ripple');
            visualIndicator.appendChild(ripple);

            // Remove the ripple after the animation ends
            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        }, 2000); // Matches the drop animation duration (2s)

        // Remove the drop after the animation ends
        drop.addEventListener('animationend', () => {
            drop.remove();
        });
    }, interval);
}



// Start/Stop the metronome
startStopBtn.addEventListener('click', () => {
    clickSound.play().catch(() => {
        console.log("Audio playback blocked by the browser.");
    });

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

