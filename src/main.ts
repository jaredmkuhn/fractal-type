import { Application } from 'pixi.js';
import './style.css';
import { ProgressiveFractal } from './ProgressiveFractal';
import { createButton } from './controls/buttonFactory';

const app = new Application();

(async () => {
    await app.init({
        background: '#1099bb',
        resizeTo: window,
        preference: 'webgl', // Force WebGL to ensure our GLShader works
    });

    document.body.appendChild(app.canvas);

    const fractal = new ProgressiveFractal();
    app.stage.addChild(fractal);

    const width = app.screen.width * 0.8;
    const height = app.screen.height * 0.8;

    fractal.x = app.screen.width * 0.1;
    fractal.y = app.screen.height * 0.1;

    const generateBtn = createButton(document, 'Generate', 18, '50%');
    generateBtn.onclick = () => {
        fractal.generate(width, height);
        generateBtn.style.display = 'none';
        setTimeout(() => {
            resetBtn.style.display = 'block';
        }, 5000);
    };

    document.body.appendChild(generateBtn);

    const resetBtn = createButton(document, 'Reset', 12, '20px');
    resetBtn.style.display = 'none';

    resetBtn.onclick = () => {
        fractal.reset();
        resetBtn.style.display = 'none';
        generateBtn.style.display = 'block';
    };

    document.body.appendChild(resetBtn);
})();
