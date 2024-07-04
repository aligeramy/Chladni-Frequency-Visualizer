let dnaHeight = 50; 

const chladniCanvas = document.getElementById('chladniCanvas');
const chladniCtx = chladniCanvas.getContext('2d');
const dnaCanvas = document.getElementById('dnaCanvas');
const dnaCtx = dnaCanvas.getContext('2d');

const frequencySlider = document.getElementById('frequencySlider');
const dnaSlider = document.getElementById('dnaSlider');
const amplitudeSlider = document.getElementById('amplitudeSlider');
const dampingSlider = document.getElementById('dampingSlider');
const playButton = document.getElementById('playButton');
const presetButtons = document.querySelectorAll('.preset-button');

const frequencyValue = document.getElementById('frequencyValue');
const dnaHeightValue = document.getElementById('dnaHeightValue');
const amplitudeValue = document.getElementById('amplitudeValue');
const dampingValue = document.getElementById('dampingValue');

let audioContext;
let oscillator;
let gainNode;
let isPlaying = false;

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
        playButton.textContent = 'Play Sound';
    } else {
        gainNode.gain.setValueAtTime(parseFloat(amplitudeSlider.value), audioContext.currentTime);
        isPlaying = true;
        playButton.textContent = 'Pause Sound';
    }
}

function updateChladniPattern() {
    const frequency = parseFloat(frequencySlider.value);
    const amplitude = parseFloat(amplitudeSlider.value);
    const damping = parseFloat(dampingSlider.value);

    chladniCtx.clearRect(0, 0, chladniCanvas.width, chladniCanvas.height);
    chladniCtx.fillStyle = '#1d1d1f';

    for (let x = 0; x < chladniCanvas.width; x += 2) {
        for (let y = 0; y < chladniCanvas.height; y += 2) {
            const normX = x / chladniCanvas.width - 0.5;
            const normY = y / chladniCanvas.height - 0.5;

            const value = Math.sin(normX * frequency) * Math.sin(normY * frequency) * amplitude;
            const dampedValue = value * Math.exp(-damping * (Math.abs(normX) + Math.abs(normY)));

            if (Math.abs(dampedValue) < 0.01) {
                chladniCtx.fillRect(x, y, 2, 2);
            }
        }
    }
}

function drawDNA() {
    const frequency = parseFloat(frequencySlider.value);
    const amplitude = parseFloat(amplitudeSlider.value);
    const damping = parseFloat(dampingSlider.value);

    dnaCtx.clearRect(0, 0, dnaCanvas.width, dnaCanvas.height);

    // Draw DNA double helix
    dnaCtx.beginPath();
    for (let x = 0; x < dnaCanvas.width; x += 5) {
        const y1 = dnaCanvas.height / 2 + Math.sin(x * 0.1) * dnaHeight;
        const y2 = dnaCanvas.height / 2 + Math.sin(x * 0.1 + Math.PI) * dnaHeight;
        dnaCtx.moveTo(x, y1);
        dnaCtx.lineTo(x, y2);
    }
    dnaCtx.strokeStyle = '#86868b';
    dnaCtx.stroke();

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

        const y1 = dnaCanvas.height / 2 + Math.sin(x * 0.1) * dnaHeight;
        const y2 = dnaCanvas.height / 2 + Math.sin(x * 0.1 + Math.PI) * dnaHeight;
        if (y >= Math.min(y1, y2) && y <= Math.max(y1, y2)) {
            dnaCtx.fillStyle = '#ff3b30';
            dnaCtx.fillRect(x - 2, y - 2, 4, 4);
        }
    }
    dnaCtx.strokeStyle = '#0071e3';
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
            if (slider === dnaSlider) {
                dnaHeight = value; // Update dnaHeight if dnaSlider is changed
            }
            element.textContent = value + unit;
            input.replaceWith(element);
            updateVisualizations();
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                input.blur();
            }
        });
    });
}

frequencySlider.addEventListener('input', () => {
    const frequency = parseFloat(frequencySlider.value);
    frequencyValue.textContent = frequency.toFixed(0) + ' Hz';
    if (oscillator) oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    updateVisualizations();
});

dnaSlider.addEventListener('input', () => {
    dnaHeight = parseFloat(dnaSlider.value);
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
enableEditing(dnaHeightValue, dnaSlider);
enableEditing(amplitudeValue, amplitudeSlider);
enableEditing(dampingValue, dampingSlider);

// Animation loop
function animate() {
    updateVisualizations();
    requestAnimationFrame(animate);
}
animate();
