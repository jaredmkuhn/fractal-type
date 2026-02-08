import { Application } from 'pixi.js';
import './style.css';
import { ProgressiveFractal } from './ProgressiveFractal';

const app = new Application();

(async () => {
    // Initialize the application
    await app.init({
        background: '#1099bb',
        resizeTo: window,
        preference: 'webgl', // Force WebGL to ensure our GLShader works
    });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Create the fractal renderer
    const fractal = new ProgressiveFractal();
    app.stage.addChild(fractal);

    // Calculate size (smaller of width/height with padding)
    const width = app.screen.width * 0.8;
    const height = app.screen.height * 0.8;

    // Center the container
    // Fractal will be generated in 0..size space
    fractal.x = app.screen.width * 0.1;
    fractal.y = app.screen.height * 0.1;

    // Create Generate button
    const generateBtn = document.createElement('button');
    generateBtn.innerText = 'Generate';
    generateBtn.style.position = 'absolute';
    generateBtn.style.top = '50%';
    generateBtn.style.left = '50%';
    generateBtn.style.transform = 'translate(-50%, -50%)';
    generateBtn.style.fontSize = '18pt';
    generateBtn.style.padding = '10px 20px';
    generateBtn.style.zIndex = '100';

    generateBtn.onclick = () => {
        fractal.generate(width, height);
        generateBtn.style.display = 'none';
        setTimeout(() => {
            resetBtn.style.display = 'block';
        }, 5000);
    };

    document.body.appendChild(generateBtn);

    // Create Reset button
    const resetBtn = document.createElement('button');
    resetBtn.innerText = 'Reset';
    resetBtn.style.position = 'absolute';
    resetBtn.style.top = '20px';
    resetBtn.style.left = '50%';
    resetBtn.style.transform = 'translateX(-50%)';
    resetBtn.style.fontSize = '12pt';
    resetBtn.style.padding = '10px 20px';
    resetBtn.style.zIndex = '100';
    resetBtn.style.display = 'none';

    resetBtn.onclick = () => {
        fractal.reset();
        resetBtn.style.display = 'none';
        generateBtn.style.display = 'block';
    };

    document.body.appendChild(resetBtn);
})();
