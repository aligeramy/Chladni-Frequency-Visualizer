![Harmonic Resonance DNA Visualizer](https://github.com/aligeramy/chladni-pattern-visualizer/blob/main/preview.gif)

# Chladni Frequency Visualizer

This project is a Chladni Frequency Visualizer built with plain HTML/JavaScript. It demonstrates the relationship between sound frequencies and their visual (Chladni) patterns.
_Note: This is purely for entertainment and visualization purposes. It is not based on scientific research or intended for scientific use._

## Description

This project visualizes harmonic resonance patterns, known as Chladni patterns, and simulates their effects on DNA bases. By adjusting the frequency, DNA height, amplitude, and damping, users can see how different sound frequencies might influence visual patterns.

## Features

- **Frequency Control:** Adjust the frequency to see different Chladni patterns.
- **DNA Height Control:** Modify the height of the DNA helix to observe changes in pattern visualization.
- **Amplitude Control:** Change the amplitude to see how the intensity of the wave affects the patterns.
- **Damping Control:** Adjust the damping factor to see how quickly the patterns fade out.
- **Preset Buttons:** Quickly set common frequencies with descriptive labels.

## Usage

1. Open the `index.html` file in a web browser.
2. Use the sliders to adjust the visualization parameters:
   - **Frequency:** Changes the sound frequency to display different Chladni patterns.
   - **DNA Height:** Alters the height of the DNA double helix visualization.
   - **Amplitude:** Adjusts the wave's amplitude.
   - **Damping:** Controls the rate at which the pattern fades.
3. Click the preset buttons to set common frequencies and observe their specific effects on the visual patterns.



## Technical Overview

### Core Technologies

- **HTML5 Canvas**: Used for rendering the Chladni pattern and DNA visualizations.
- **Web Audio API**: Handles audio generation and manipulation.
- **Vanilla JavaScript**: Manages user interactions, audio-visual synchronization, and dynamic updates.

### Key Components

1. **Canvas Contexts**:
   - `chladniCtx`: 2D context for the Chladni pattern canvas.
   - `dnaCtx`: 2D context for the DNA structure canvas.

2. **Audio Components**:
   - `AudioContext`: Manages audio processing.
   - `OscillatorNode`: Generates sine wave tones.
   - `GainNode`: Controls audio volume.

3. **UI Elements**:
   - Sliders for frequency, DNA height, amplitude, and damping.
   - Play/pause button for audio control.
   - Preset buttons for quick frequency selection.

### Core Functions

1. `initAudio()`:
   - Initializes the Web Audio API components.
   - Sets up the audio graph: Oscillator -> Gain -> AudioContext destination.

2. `updateChladniPattern()`:
   - Clears and redraws the Chladni pattern based on current parameters.
   - Uses nested loops to iterate over canvas pixels.
   - Applies sine wave calculations and damping effects.

3. `drawDNA()`:
   - Renders the DNA-like double helix structure.
   - Overlays a frequency-based wave.
   - Highlights intersection points between the wave and DNA strands.

4. `updateVisualizations()`:
   - Calls both `updateChladniPattern()` and `drawDNA()` to refresh visuals.

5. `updateFrequency(freq)`:
   - Updates the frequency slider, oscillator, and visualizations.
   - Manages the state of preset buttons.

6. `togglePlay()`:
   - Starts or stops audio playback.
   - Initializes audio context if it's the first play.

### Event Listeners and Interactivity

- Slider inputs trigger real-time updates to audio and visuals.
- Play button toggles audio state.
- Preset buttons update frequency and visual state.
- Value displays are clickable for direct numerical input.

### Animation Loop

The `animate()` function uses `requestAnimationFrame` to continuously update visualizations, ensuring smooth real-time interactions.

## Implementation Details

### Chladni Pattern Algorithm

1. Iterate over canvas pixels in 2x2 blocks for efficiency.
2. Calculate normalized coordinates (-0.5 to 0.5) for each point.
3. Apply sine wave calculations based on frequency and amplitude.
4. Implement damping effect using exponential decay.
5. Draw pixels where the calculated value is close to zero (nodal lines).

### DNA Visualization

1. Draw double helix using sine waves with phase difference.
2. Overlay a frequency-based wave with damping applied.
3. Detect and highlight intersection points between the wave and DNA strands.

### Audio Management

- Uses `OscillatorNode` for continuous tone generation.
- `GainNode` controls volume and enables smooth play/pause transitions.
- Frequency updates are applied in real-time using `setValueAtTime`.

### UI Responsiveness

- Slider inputs directly update audio parameters and trigger visual refreshes.
- Debouncing or throttling is not implemented, which might be a consideration for performance optimization on slower devices.

### Dynamic Value Editing

The `enableEditing` function allows for inline editing of displayed values:
1. Replaces text display with an input field on click.
2. Updates corresponding slider and internal values on blur.
3. Handles 'Enter' key for confirming input.

## Potential Enhancements

1. Make it more _scientific_.
2. Add touch event support for better mobile experience.
3. Introduce more complex waveforms beyond sine waves.
4. Implement color gradients in visualizations for more dynamic representations.
5. Add option to save the generated patterns / sound wave.

