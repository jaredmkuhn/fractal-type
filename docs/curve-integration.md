# Curve Integration Guide: B-Spline Transform Blocks

## Overview

This document outlines how to extend the fractal generation system to support **B-spline transform blocks** alongside the existing affine transform blocks. Unlike the current approach where each BlockMap becomes one affine transform, a B-spline block defines a **non-affine transformation** that warps the unit square along a curved path.

## Core Concept

### Current System: Affine Transforms

An affine transform maps the unit square [0,1] × [0,1] to a parallelogram:
```
(x', y') = (s.x * x + r.y * y + t.x, r.x * x + s.y * y + t.y)
```

This produces straight-edged letter components (like the bars of "E" or "H").

### New System: B-Spline Transforms

A B-spline transform maps the unit square to a **curved ribbon**:
```
input: (x, y) in unit square [0,1] × [0,1]
1. Evaluate B-spline curve at parameter t = x → point P on curve
2. Calculate tangent vector at t → direction of curve
3. Calculate perpendicular (normal) vector → width direction
4. Map y-coordinate to perpendicular offset from centerline
output: (x', y') on curved ribbon
```

**Key Properties:**
- x-coordinate (0→1) maps to position along curve length
- y-coordinate (0→1) maps to width across ribbon (perpendicular to curve)
- This is NOT an affine transformation (curves don't preserve parallel lines)
- Compatible with IFS chaos game (still maps unit square → letter component)

## Mathematical Details

### Transform Function

Given a B-spline curve C(t) with control points, the transform function is:

```typescript
function bsplineTransform(x: number, y: number, curve: BSplineCurve, ribbonWidth: number): IVector2D {
    // 1. Evaluate curve at parameter t = x
    const P = curve.evaluate(x);

    // 2. Evaluate tangent (derivative) at t = x
    const T = curve.evaluateDerivative(x);
    const tangentLength = Math.sqrt(T.x * T.x + T.y * T.y);

    // 3. Normalize tangent and calculate perpendicular
    const tx = T.x / tangentLength;
    const ty = T.y / tangentLength;
    const nx = -ty;  // Perpendicular (rotated 90°)
    const ny = tx;

    // 4. Offset from curve centerline based on y
    const offset = (y - 0.5) * ribbonWidth;

    return {
        x: P.x + nx * offset,
        y: P.y + ny * offset
    };
}
```

### Visualization

```
Unit Square Input          B-Spline Transform         Curved Ribbon Output
┌─────────┐                                          ╭─────────╮
│ (0,1)   │ (1,1)                                   ╱           ╲
│         │               ─────────────>           │             │
│         │                                         │             │
│ (0,0)   │ (1,0)                                   ╲           ╱
└─────────┘                                          ╰─────────╯

x = 0 → start of curve              y = 0.5 → centerline of ribbon
x = 1 → end of curve                y = 0, 1 → edges of ribbon
```

## Data Structure Design

### Unified Transform Interface

```typescript
// src/common/interfaces.ts

// B-spline curve definition (includes ribbon width)
export interface BSplineCurve {
    controlPoints: IVector2D[];  // In unit square space [0,1]
    degree: number;              // Typically 3 for cubic
    knotType: 'CLAMPED' | 'PERIODIC';
    ribbonWidth: number;         // Width in unit square space (e.g., 0.1)
}

// Unified transform - exactly one of affine or bspline must be defined
export interface Transform {
    affine?: AffineTransform2D;
    bspline?: BSplineCurve;
}

// Letter definitions become arrays of Transforms
export type LetterDefinition = Transform[];
```

### Example Letter Definitions

```typescript
// src/common/letterMaps.ts

export const BASE_MAPS: Partial<Record<CapitalLetters, LetterDefinition>> = {
    // Straight-edged letter using affine transforms
    H: [
        {
            affine: { s: {...}, r: {...}, t: {...} }  // Left bar
        },
        {
            affine: { s: {...}, r: {...}, t: {...} }  // Middle bar
        },
        {
            affine: { s: {...}, r: {...}, t: {...} }  // Right bar
        }
    ],

    // Curved letter using B-spline transform
    C: [
        {
            bspline: {
                controlPoints: [
                    { x: 0.8, y: 0.2 },   // Top-right
                    { x: 0.2, y: 0.0 },   // Top-left
                    { x: 0.0, y: 0.5 },   // Middle-left
                    { x: 0.2, y: 1.0 },   // Bottom-left
                    { x: 0.8, y: 0.8 }    // Bottom-right
                ],
                degree: 3,
                knotType: 'CLAMPED',
                ribbonWidth: 0.15  // 15% of unit square
            }
        }
    ],

    // Mixed: straight stem + curved bowl
    D: [
        {
            affine: { /* ... vertical stem ... */ }
        },
        {
            bspline: {
                controlPoints: [
                    { x: 0.25, y: 0.0 },   // Top of bowl
                    { x: 0.8, y: 0.0 },
                    { x: 1.0, y: 0.5 },
                    { x: 0.8, y: 1.0 },
                    { x: 0.25, y: 1.0 }    // Bottom of bowl
                ],
                degree: 3,
                knotType: 'CLAMPED',
                ribbonWidth: 0.12
            }
        }
    ]
};
```

## Implementation Plan

### Phase 1: B-Spline Evaluator

**Create `src/curves/BSplineEvaluator.ts`:**

```typescript
/**
 * Evaluates B-spline curves using de Boor's algorithm
 */
export class BSplineEvaluator {
    private controlPoints: IVector2D[];
    private degree: number;
    private knots: number[];

    constructor(curve: BSplineCurve) {
        this.controlPoints = curve.controlPoints;
        this.degree = curve.degree;
        this.knots = this.generateKnotVector(curve);
    }

    /**
     * Evaluate curve position at parameter t ∈ [0, 1]
     */
    public evaluate(t: number): IVector2D {
        // Implement de Boor's algorithm
        // See docs/b-spline-technical-details.md
    }

    /**
     * Evaluate curve tangent (derivative) at parameter t
     * Used to calculate ribbon orientation
     */
    public evaluateDerivative(t: number): IVector2D {
        // Derivative of B-spline is another B-spline of degree p-1
        // Evaluate using control point differences
    }

    private generateKnotVector(curve: BSplineCurve): number[] {
        // Generate clamped or periodic knot vector
        // See docs/b-spline-technical-details.md section 3
    }
}
```

**Key Methods:**
- `evaluate(t)`: Returns point on curve using de Boor's algorithm
- `evaluateDerivative(t)`: Returns tangent vector for normal calculation
- Both methods must handle t ∈ [0, 1] domain

### Phase 2: B-Spline Transform Function

**Create `src/transforms/bsplineTransform.ts`:**

```typescript
import { BSplineEvaluator } from '../curves/BSplineEvaluator';

/**
 * Applies a B-spline transform to a point in the unit square
 * Maps (x, y) in [0,1]×[0,1] to a point on a curved ribbon
 */
export function applyBSplineTransform(
    point: IVector2D,
    curve: BSplineCurve
): IVector2D {
    const evaluator = new BSplineEvaluator(curve);

    // 1. Evaluate curve at parameter t = x
    const P = evaluator.evaluate(point.x);

    // 2. Get tangent vector
    const T = evaluator.evaluateDerivative(point.x);
    const tangentLength = Math.sqrt(T.x * T.x + T.y * T.y);

    // Handle degenerate case (zero tangent)
    if (tangentLength < 1e-10) {
        return P;
    }

    // 3. Calculate normalized perpendicular
    const nx = -T.y / tangentLength;
    const ny = T.x / tangentLength;

    // 4. Offset from centerline based on y coordinate
    const offset = (point.y - 0.5) * curve.ribbonWidth;

    return {
        x: P.x + nx * offset,
        y: P.y + ny * offset
    };
}
```

### Phase 3: Update Chaos Game Loop

**Modify `src/ProgressiveFractal.ts`:**

The chaos game loop needs to handle both transform types:

```typescript
export class ProgressiveFractal extends Mesh<Geometry, FractalShader> {
    // Change from AffineTransform2D[] to Transform[]
    private transforms: Transform[] = [];

    public generate(width: number, height: number): void {
        const grid = new GridBuilder('CD', 1);  // Mix of affine and curve

        // Get unified transform list
        this.transforms = buildTransformsForGrid(grid);

        // Scale transforms to screen space (need to handle both types)
        this.transforms = this.scaleTransforms(this.transforms, width, height);

        this.currentX = Math.random();
        this.currentY = Math.random();
        this.isGenerating = true;
    }

    private update(): void {
        if (!this.isGenerating || !this.transforms.length) return;

        // ... existing setup ...

        while (pointsGenerated < this.POINTS_PER_FRAME && this.currentPointIndex < this.MAX_POINTS) {
            // Randomly select a transform
            const tIndex = Math.floor(Math.random() * this.transforms.length);
            const transform = this.transforms[tIndex];

            let nextPoint: IVector2D;

            // Apply transform based on which type is defined
            if (transform.affine) {
                // Existing affine transform logic
                const t = transform.affine;
                nextPoint = {
                    x: this.currentX * t.s.x + this.currentY * t.r.y + t.t.x,
                    y: this.currentX * t.r.x + this.currentY * t.s.y + t.t.y
                };
            } else if (transform.bspline) {
                // New B-spline transform logic
                nextPoint = applyBSplineTransform(
                    { x: this.currentX, y: this.currentY },
                    transform.bspline
                );
            } else {
                throw new Error('Invalid transform: must have either affine or bspline defined');
            }

            this.currentX = nextPoint.x;
            this.currentY = nextPoint.y;

            pts[idx++] = this.currentX;
            pts[idx++] = this.currentY;

            this.currentPointIndex++;
            pointsGenerated++;
        }

        this.pointsBuffer.update();
        // ... rest of existing code ...
    }

    private scaleTransforms(transforms: Transform[], width: number, height: number): Transform[] {
        return transforms.map(t => {
            if (t.affine) {
                // Existing affine scaling logic
                return {
                    affine: {
                        s: { ...t.affine.s },
                        r: {
                            x: t.affine.r.x * (height / width),
                            y: t.affine.r.y * (width / height)
                        },
                        t: {
                            x: t.affine.t.x * width,
                            y: t.affine.t.y * height
                        }
                    }
                };
            } else if (t.bspline) {
                // Scale B-spline control points and ribbon width
                return {
                    bspline: {
                        ...t.bspline,
                        controlPoints: t.bspline.controlPoints.map(p => ({
                            x: p.x * width,
                            y: p.y * height
                        })),
                        ribbonWidth: t.bspline.ribbonWidth * Math.min(width, height)
                    }
                };
            }

            throw new Error('Invalid transform: must have either affine or bspline defined');
        });
    }
}
```

### Phase 4: Update Transform Builders

**Modify `src/transforms/affineHelpers.ts`:**

```typescript
/**
 * Build transforms for entire grid (now returns unified Transform[])
 */
export function buildTransformsForGrid(grid: GridBuilder): Transform[] {
    const transforms: Transform[] = [];
    const sections = grid.getSections();

    sections.forEach(section => {
        if (!section.letter) return;

        const letterDef = BASE_MAPS[section.letter];
        if (!letterDef) {
            throw new Error(`Unknown letter: ${section.letter}`);
        }

        letterDef.forEach(transform => {
            if (transform.affine) {
                // Rebase affine transform to grid section (existing logic)
                // Convert BlockMap to affine, apply grid offset/scale
                transforms.push(/* rebased affine transform */);

            } else if (transform.bspline) {
                // Rebase B-spline to grid section
                const rebasedCurve = rebaseBSplineCurve(
                    transform.bspline,
                    section
                );

                transforms.push({
                    bspline: rebasedCurve
                });
            } else {
                throw new Error('Invalid transform: must have either affine or bspline defined');
            }
        });
    });

    return transforms;
}

/**
 * Rebase B-spline control points and ribbon width to grid section
 */
function rebaseBSplineCurve(
    curve: BSplineCurve,
    section: GridSection
): BSplineCurve {
    return {
        ...curve,
        controlPoints: curve.controlPoints.map(p => ({
            x: p.x * section.celSize.x + section.offset.x,
            y: p.y * section.celSize.y + section.offset.y
        })),
        ribbonWidth: curve.ribbonWidth * Math.min(section.celSize.x, section.celSize.y)
    };
}
```

## Testing Strategy

### Unit Tests

**test/curves/BSplineEvaluator.test.ts:**
```typescript
describe('BSplineEvaluator', () => {
    test('clamped curve starts at first control point', () => {
        const curve = {
            controlPoints: [
                { x: 0.0, y: 0.5 },
                { x: 0.5, y: 0.0 },
                { x: 1.0, y: 0.5 }
            ],
            degree: 2,
            knotType: 'CLAMPED' as const
        };

        const evaluator = new BSplineEvaluator(curve);
        const start = evaluator.evaluate(0);

        expect(start.x).toBeCloseTo(0.0);
        expect(start.y).toBeCloseTo(0.5);
    });

    test('derivative provides valid tangent', () => {
        // Test that derivative has non-zero length
        // Test that it points in expected direction
    });
});
```

**test/transforms/bsplineTransform.test.ts:**
```typescript
describe('applyBSplineTransform', () => {
    test('centerline (y=0.5) maps to curve itself', () => {
        // Point at (x, 0.5) should map close to curve.evaluate(x)
    });

    test('ribbon edges (y=0, y=1) are offset by ribbonWidth', () => {
        // Verify perpendicular offset calculation
    });
});
```

### Visual Testing

Create a test page with:
1. Single "C" letter using B-spline transform
2. Render control points and curve in different color
3. Toggle between showing ribbon and just centerline
4. Adjust ribbonWidth interactively

## Migration Path

### Milestone 1: Foundation
- ✅ Implement `BSplineEvaluator` with de Boor's algorithm
- ✅ Implement `applyBSplineTransform`
- ✅ Create unit tests
- **Deliverable:** Working B-spline evaluation

### Milestone 2: Single Letter Integration
- ✅ Update type definitions (Transform interface)
- ✅ Modify `ProgressiveFractal.update()` to handle both transform types
- ✅ Create one test letter (recommend "C")
- **Deliverable:** Single curved letter renders as fractal

### Milestone 3: Grid Integration
- ✅ Update `buildTransformsForGrid()` to handle unified Transform type
- ✅ Implement grid rebasing for B-splines
- ✅ Test mixed letters (e.g., "HCH")
- **Deliverable:** Curved and straight letters work together

### Milestone 4: Curved Alphabet
- ✅ Define B-spline transforms for all curved letters (C, D, O, P, Q, S, etc.)
- ✅ Tune ribbonWidth per letter
- ✅ Visual quality testing
- **Deliverable:** Full curved alphabet

## Key Design Considerations

### Ribbon Width Selection
- **Too narrow:** Sparse fractal, gaps in curve
- **Too wide:** Self-intersection, muddy appearance
- **Recommendation:** Start with 10-15% of letter height
- May need per-letter tuning

### Control Point Placement
- More control points → more flexible curves, but harder to manage
- For most letters, 4-6 points sufficient
- Consider symmetry (e.g., "O" can use 4 points in diamond pattern)

### Performance
- B-spline evaluation is O(p²) per point (very fast)
- Main cost: derivative calculation (needs separate de Boor evaluation)
- **Optimization:** Cache evaluator instances per transform
- Expected performance: ~same as current affine-only system

### Mathematical Properties
- **Non-linearity:** B-spline transforms don't preserve straight lines
- **Attractor:** IFS still converges (transforms are continuous and bounded)
- **Fractal quality:** Self-similarity still emerges from chaos game

### Edge Cases
- **Zero tangent:** Can occur at curve endpoints or sharp corners
  - Solution: Return curve point without offset
- **Self-intersecting ribbons:** Wide ribbons on tight curves
  - Solution: Reduce ribbonWidth or add more control points
- **Degenerate curves:** Collinear control points
  - Solution: Validate control points in letterMaps

## Next Steps

1. **Immediate:** Implement `BSplineEvaluator.evaluate()` using de Boor's algorithm
2. **Next:** Add `evaluateDerivative()` for tangent calculation
3. **Then:** Create `applyBSplineTransform()` function
4. **Finally:** Update `ProgressiveFractal` to handle Transform union type

## References

- **B-Spline Math:** `docs/b-spline-technical-details.md`
- **Design Vision:** `docs/font-notes.md`
- **Current Architecture:** `CLAUDE.md`
- **de Boor's Algorithm:** Section 4 of b-spline-technical-details.md
