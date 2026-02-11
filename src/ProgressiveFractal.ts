import { Mesh, Geometry, Buffer, Ticker, BufferUsage } from 'pixi.js';
import { buildAffinesForGrid } from './transforms/affineHelpers';
import { FractalShader } from './FractalShader';
import type { AffineTransform2D } from './common/interfaces';
import { GridBuilder } from './transforms/gridBuilder';

export class ProgressiveFractal extends Mesh<Geometry, FractalShader> {
    private readonly MAX_POINTS = 1_000_000;
    private readonly POINTS_PER_FRAME = 15_000;
    private points: Float32Array;
    private pointsBuffer: Buffer;
    private currentPointIndex = 0;
    private currentX = 0;
    private currentY = 0;
    private isGenerating = false;

    constructor() {
        const points = new Float32Array(1_000_000 * 2); // 2 floats per point (x, y)
        const pointsBuffer = new Buffer({
            data: points,
            usage: BufferUsage.VERTEX,
            label: 'fractal-points',
        });

        const geometry = new Geometry({
            attributes: {
                aPosition: {
                    buffer: pointsBuffer,
                    stride: 2 * 4, // 2 floats * 4 bytes
                },
            },
            topology: 'point-list',
        });

        const shader = new FractalShader();

        super({ geometry, shader });

        this.points = points;
        this.pointsBuffer = pointsBuffer;

        this.currentX = Math.random();
        this.currentY = Math.random();

        // Don't start automatically; wait for generate call
        Ticker.shared.add(this.update, this);
    }

    public generate(width: number, height: number): void {
        this.currentPointIndex = 0;
        this.isGenerating = true;

        const grid = new GridBuilder('HEEH', 2);

        const rawMaps = buildAffinesForGrid(grid);
        if (rawMaps) {
            this.scaledMaps = this.scaleTransforms(rawMaps, width, height);
        }

        this.currentX = Math.random() * width;
        this.currentY = Math.random() * height;
    }

    public reset(): void {
        this.isGenerating = false;
        this.currentPointIndex = 0;
        this.points.fill(0);
        this.pointsBuffer.update();
    }

    private scaledMaps: AffineTransform2D[] = [];

    private scaleTransforms(transforms: AffineTransform2D[], width: number, height: number): AffineTransform2D[] {
        return transforms.map((t) => ({
            s: { ...t.s },
            r: {
                x: t.r.x * (height / width),
                y: t.r.y * (width / height),
            },
            t: {
                x: t.t.x * width,
                y: t.t.y * height,
            },
        }));
    }

    private update(): void {
        if (!this.isGenerating || !this.scaledMaps.length) return;

        const maps = this.scaledMaps;
        let pointsGenerated = 0;

        const pts = this.points;
        let idx = this.currentPointIndex * 2;

        while (pointsGenerated < this.POINTS_PER_FRAME && this.currentPointIndex < this.MAX_POINTS) {
            const tIndex = Math.floor(Math.random() * maps.length);
            const transform = maps[tIndex];

            const nextX = this.currentX * transform.s.x + this.currentY * transform.r.y + transform.t.x;
            const nextY = this.currentX * transform.r.x + this.currentY * transform.s.y + transform.t.y;

            this.currentX = nextX;
            this.currentY = nextY;

            pts[idx++] = this.currentX;
            pts[idx++] = this.currentY;

            this.currentPointIndex++;
            pointsGenerated++;
        }

        this.pointsBuffer.update();

        if (this.currentPointIndex >= this.MAX_POINTS) {
            this.isGenerating = false;
        }
    }
}
