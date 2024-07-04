// Design variables
let dnaHeight = 30;
let dnaLength = 100; // Length of DNA segments

let colorYin = 'rgba(255, 182, 193, 1)';
let colorYang = 'rgba(137, 207, 255, 1)';

let waveColor = 'rgba(0, 0, 255, 0.2)';
let intersectionColor = 'rgba(255, 0, 0, 1)';

let backBoneWidth = 2;
let baseWidth = 1;

let leftBackboneWidth = backBoneWidth;
let rightBackboneWidth = backBoneWidth;

let leftBackboneColor = colorYin;
let baseLeftColor = colorYin;

let rightBackboneColor = colorYang;
let baseRightColor = colorYang;

let invertColors = false;
let hideDnaBackbones = false;

// Get canvas and context
const chladniCanvas = document.getElementById('chladniCanvas');
const chladniCtx = chladniCanvas.getContext('2d');
const dnaCanvas = document.getElementById('dnaCanvas');
const dnaCtx = dnaCanvas.getContext('2d');

// Get sliders and buttons
const frequencySlider = document.getElementById('frequencySlider');
const dnaHeigthSlider = document.getElementById('dnaHeigthSlider');
const amplitudeSlider = document.getElementById('amplitudeSlider');
const dampingSlider = document.getElementById('dampingSlider');
const dnaLengthSlider = document.getElementById('dnaLengthSlider');
const invertCheckbox = document.getElementById('invertCheckbox');
const hideDnaCheckbox = document.getElementById('hideDnaCheckbox');
const playButton = document.getElementById('playButton');
const presetButtons = document.querySelectorAll('.preset-button');

// Get display elements
const frequencyValue = document.getElementById('frequencyValue');
const dnaHeightValue = document.getElementById('dnaHeightValue');
const amplitudeValue = document.getElementById('amplitudeValue');
const dampingValue = document.getElementById('dampingValue');
const dnaLengthValue = document.getElementById('dnaLengthValue');

let audioContext;
let oscillator;
let gainNode;
let isPlaying = false;

const presetFrequencies = Array.from(presetButtons).map(button => parseFloat(button.getAttribute('data-freq')));

function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(parseFloat(frequencySlider.value), audioContext.currentTime);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    
    oscillator.start();
}

function togglePlay() {
    if (!audioContext) initAudio();
    if (isPlaying) {
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        isPlaying = false;
        playButton.innerHTML = '<i class="fas fa-play"></i> Play Sound';
    } else {
        gainNode.gain.setValueAtTime(parseFloat(amplitudeSlider.value), audioContext.currentTime);
        isPlaying = true;
        playButton.innerHTML = '<i class="fas fa-pause"></i> Pause Sound';
    }
}

function updateChladniPattern() {
    const frequency = parseFloat(frequencySlider.value);
    const amplitude = parseFloat(amplitudeSlider.value);
    const damping = parseFloat(dampingSlider.value);

    chladniCtx.clearRect(0, 0, chladniCanvas.width, chladniCanvas.height);

    if (invertColors) {
        chladniCtx.fillStyle = '#000000';
        chladniCtx.fillRect(0, 0, chladniCanvas.width, chladniCanvas.height);
    } else {
        chladniCtx.fillStyle = '#ffffff';
        chladniCtx.fillRect(0, 0, chladniCanvas.width, chladniCanvas.height);
    }

    chladniCtx.fillStyle = invertColors ? '#ffffff' : '#1d1d1f';

    for (let x = 0; x < chladniCanvas.width; x += 2) {
        for (let y = 0; y < chladniCanvas.height; y += 2) {
            const normX = x / chladniCanvas.width - 0.5;
            const normY = y / chladniCanvas.height - 0.5;

            const value = Math.sin(normX * frequency) * Math.sin(normY * frequency) * amplitude;
            const dampedValue = value * Math.exp(-damping * (Math.abs(normX) + Math.abs(normY)));

            if (Math.abs(dampedValue) < 0.01) {
                chladniCtx.fillStyle = invertColors ? '#ffffff' : '#000000';
                chladniCtx.fillRect(x, y, 2, 2);
            }
        }
    }
}

function drawDNA() {
    const frequency = parseFloat(frequencySlider.value);
    const amplitude = parseFloat(amplitudeSlider.value);
    const damping = parseFloat(dampingSlider.value);

    const segmentLength = dnaLength * 2; // Use the DNA length from the slider

    dnaCtx.clearRect(0, 0, dnaCanvas.width, dnaCanvas.height);

    if (!hideDnaBackbones) {
        // Draw left DNA backbone
        dnaCtx.beginPath();
        dnaCtx.lineWidth = leftBackboneWidth;
        dnaCtx.strokeStyle = leftBackboneColor;
        for (let x = 0; x < dnaCanvas.width; x += 5) {
            const y = dnaCanvas.height / 2 + Math.sin(x * (2 * Math.PI / segmentLength)) * dnaHeight;
            if (x === 0) {
                dnaCtx.moveTo(x, y);
            } else {
                dnaCtx.lineTo(x, y);
            }
        }
        dnaCtx.stroke();

        // Draw right DNA backbone
        dnaCtx.beginPath();
        dnaCtx.lineWidth = rightBackboneWidth;
        dnaCtx.strokeStyle = rightBackboneColor;
        for (let x = 0; x < dnaCanvas.width; x += 5) {
            const y = dnaCanvas.height / 2 + Math.sin(x * (2 * Math.PI / segmentLength) + Math.PI) * dnaHeight;
            if (x === 0) {
                dnaCtx.moveTo(x, y);
            } else {
                dnaCtx.lineTo(x, y);
            }
        }
        dnaCtx.stroke();
    }

    // Draw DNA bases
    for (let x = 0; x < dnaCanvas.width; x += 5) {
        const y1 = dnaCanvas.height / 2 + Math.sin(x * (2 * Math.PI / segmentLength)) * dnaHeight;
        const y2 = dnaCanvas.height / 2 + Math.sin(x * (2 * Math.PI / segmentLength) + Math.PI) * dnaHeight;

        // Left base
        dnaCtx.beginPath();
        dnaCtx.lineWidth = baseWidth;
        dnaCtx.strokeStyle = baseLeftColor;
        dnaCtx.moveTo(x, y1);
        dnaCtx.lineTo(x, (y1 + y2) / 2);
        dnaCtx.stroke();

        // Right base
        dnaCtx.beginPath();
        dnaCtx.lineWidth = baseWidth;
        dnaCtx.strokeStyle = baseRightColor;
        dnaCtx.moveTo(x, y2);
        dnaCtx.lineTo(x, (y1 + y2) / 2);
        dnaCtx.stroke();
    }

    // Draw wave and intersection points with damping effect
    dnaCtx.beginPath();
    for (let x = 0; x < dnaCanvas.width; x++) {
        const effectiveAmplitude = amplitude * Math.exp(-damping * x / dnaCanvas.width);
        const y = dnaCanvas.height / 2 + Math.sin(x * 0.05 * frequency / 440) * effectiveAmplitude * 100;
        if (x === 0) {
            dnaCtx.moveTo(x, y);
        } else {
            dnaCtx.lineTo(x, y);
        }

        const y1 = dnaCanvas.height / 2 + Math.sin(x * (2 * Math.PI / segmentLength)) * dnaHeight;
        const y2 = dnaCanvas.height / 2 + Math.sin(x * (2 * Math.PI / segmentLength) + Math.PI) * dnaHeight;
        if (y >= Math.min(y1, y2) && y <= Math.max(y1, y2)) {
            dnaCtx.fillStyle = intersectionColor;
            dnaCtx.fillRect(x - 2, y - 2, 4, 4);
        }
    }
    dnaCtx.strokeStyle = waveColor;
    dnaCtx.stroke();
}

function updateVisualizations() {
    updateChladniPattern();
    drawDNA();
}

function updateFrequency(freq) {
    frequencySlider.value = freq;
    frequencyValue.textContent = freq + ' Hz';
    if (oscillator) oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
    updateVisualizations();
    updatePresetButtonState(freq);
}

function enableEditing(element, slider, unit = '') {
    element.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'number';
        input.value = element.textContent.replace(unit, '').trim();
        input.style.width = '50px';
        input.style.textAlign = 'center';
        element.replaceWith(input);
        input.focus();

        input.addEventListener('blur', () => {
            const value = parseFloat(input.value);
            slider.max = Math.max(slider.max, value); // Update slider max if needed
            slider.value = value;
            if (slider === dnaHeigthSlider) {
                dnaHeight = value; // Update dnaHeight if dnaHeigthSlider is changed
            }
            if (slider === dnaLengthSlider) {
                dnaLength = value; // Update dnaLength if dnaLengthSlider is changed
            }
            element.textContent = value + unit;
            input.replaceWith(element);
            updateVisualizations();
            if (slider === frequencySlider) {
                updatePresetButtonState(value);
            }
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                input.blur();
            }
        });
    });
}

function updatePresetButtonState(frequency) {
    presetButtons.forEach(button => {
        const freq = parseFloat(button.getAttribute('data-freq'));
        if (Math.abs(freq - frequency) < 1e-5) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

frequencySlider.addEventListener('input', () => {
    const frequency = parseFloat(frequencySlider.value);
    frequencyValue.textContent = frequency.toFixed(1) + ' Hz';
    if (oscillator) oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    updateVisualizations();
    updatePresetButtonState(frequency);
});

dnaHeigthSlider.addEventListener('input', () => {
    dnaHeight = parseFloat(dnaHeigthSlider.value);
    dnaHeightValue.textContent = dnaHeight.toFixed(0);
    updateVisualizations();
});

amplitudeSlider.addEventListener('input', () => {
    const amplitude = parseFloat(amplitudeSlider.value);
    amplitudeValue.textContent = amplitude.toFixed(3);
    if (gainNode && isPlaying) gainNode.gain.setValueAtTime(amplitude, audioContext.currentTime);
    updateVisualizations();
});

dampingSlider.addEventListener('input', () => {
    const damping = parseFloat(dampingSlider.value);
    dampingValue.textContent = damping.toFixed(3);
    updateVisualizations();
});

dnaLengthSlider.addEventListener('input', () => {
    dnaLength = parseFloat(dnaLengthSlider.value);
    dnaLengthValue.textContent = dnaLength.toFixed(0);
    updateVisualizations();
});

invertCheckbox.addEventListener('change', () => {
    invertColors = invertCheckbox.checked;
    updateVisualizations();
});

hideDnaCheckbox.addEventListener('change', () => {
    hideDnaBackbones = hideDnaCheckbox.checked;
    updateVisualizations();
});

playButton.addEventListener('click', togglePlay);

presetButtons.forEach(button => {
    button.addEventListener('click', () => {
        const freq = parseFloat(button.getAttribute('data-freq'));
        updateFrequency(freq);
        presetButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

updateVisualizations();

// Enable editing of displayed values
enableEditing(frequencyValue, frequencySlider, ' Hz');
enableEditing(dnaHeightValue, dnaHeigthSlider);
enableEditing(amplitudeValue, amplitudeSlider);
enableEditing(dampingValue, dampingSlider);
enableEditing(dnaLengthValue, dnaLengthSlider);

// Animation loop
function animate() {
    updateVisualizations();
    requestAnimationFrame(animate);
}
animate();
