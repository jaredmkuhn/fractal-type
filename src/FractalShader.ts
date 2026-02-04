import { Shader, GlProgram } from 'pixi.js';

const vertex = `
    attribute vec2 aPosition;

    uniform mat3 uProjectionMatrix;
    uniform mat3 uWorldTransformMatrix;
    uniform mat3 uTransformMatrix;

    uniform float uPointSize;

    void main() {
        mat3 mvp = uProjectionMatrix * uWorldTransformMatrix * uTransformMatrix;
        gl_Position = vec4((mvp * vec3(aPosition, 1.0)).xy, 0.0, 1.0);
        gl_PointSize = uPointSize;
    }
`;

const fragment = `
    precision mediump float;

    uniform vec4 uColor;

    void main() {
        gl_FragColor = uColor;
    }
`;

export class FractalShader extends Shader {
    constructor() {
        const glProgram = GlProgram.from({
            vertex,
            fragment,
        });

        super({
            glProgram,
            resources: {},
        });

        // Set uniform values after shader creation
        this.resources.uPointSize = { value: 2.0 };
        this.resources.uColor = { value: new Float32Array([1.0, 1.0, 1.0, 1.0]) };
    }
}
