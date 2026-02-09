# Project Design: Fractal Letter Generator (Affine & B-Spline)

## 1. Core Geometric Principles
The project relies on two mathematical pillars to generate natural-looking, recursive letterforms.

### Affine Transformations
All shapes (blocks or curves) are defined in a **unit coordinate space** ([0,0] to [1,1]). To render them, we apply a $3 \times 3$ transformation matrix:
* **Translation:** Moves the unit square to a specific position on the screen.
* **Scaling:** Adjusts the width and height.
* **Rotation/Shearing:** Tilts or turns the coordinate system to create slanted or rotated letter components.

### B-Spline Curves
For "natural" letters, we use Cubic B-splines (Degree 3) due to their **Affine Invariance**. Transforming the control points via the affine matrix automatically transforms the resulting curve.
* **Local Control:** Modifying one control point only affects a small portion of the letter.
* **Continuity:** $C^2$ continuity ensures smooth curvature, preventing "kinks" in letters like **S** or **O**.

---

## 2. Proposed Data Structure
To maintain a clean **separation of concerns**, the letter system will treat every letter as a collection of "Blocks."

### The `Block` Object
```json
{
  "type": "RECTANGLE | CURVE",
  "transform": "Matrix3x3",
  "data": {
    "control_points": "List<Vector2> (Local coords 0-1)",
    "is_closed": "Boolean",
    "knot_type": "CLAMPED | PERIODIC"
  }
}

## 3. Implementation Roadmap

### Version 1: Hardcoded Alphabet (Current Goal)
Focus on building a robust "library" of capital letters using hardcoded coordinates.
* **Standard Stems:** Use rectangle blocks (e.g., the stem of **D**, **P**, **H**).
* **Curves:** Implement a B-spline renderer that accepts 4+ control points.
* **The "Knot" Logic:** * Use **Clamped Knots** (repeating 4x at start/end) for open letters like **C** and **S**.
    * Use **Periodic/Uniform Knots** for closed letters like **O**.

### Version 2: Data-Driven Configuration
Move the hardcoded logic into an external configuration file (JSON or YAML).
* Allows for easy "font" swapping.
* Enables the program to load different styles (e.g., Serif vs. Sans-Serif) without recompiling.

### Version 3: Visual Shape Builder (Future)
An interactive UI where users can:
* Drag and drop blocks onto a canvas.
* Manipulate control points in real-time to "draw" custom letters.
* Toggle "Curved" flags to instantly smooth out paths.

---

## 4. Geometrical Appendix (V1 Reference)

| Letter | Structure | Logic |
| :--- | :--- | :--- |
| **D** | 1 Rect + 1 Curve | Rect for stem; 4-point Clamped Curve for the bowl. |
| **O** | 1 Curve | 4 or 8 points in a diamond/circle; Periodic Knot for a loop. |
| **S** | 1 Curve | 6-8 control points in a "snake" path; Clamped Knot. |
| **Q** | 2 Blocks | Same as **O**, plus a sheared parallelogram for the tail. |
| **P** | 1 Rect + 1 Curve | Rect for stem; Curve block scaled to 50% height. |
