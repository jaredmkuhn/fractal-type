# Appendix: Technical B-Spline Implementation

## 1. Mathematical Definitions
A B-spline curve C(t) of degree p is defined as a weighted sum of n+1 control points P_i and their corresponding basis functions N_{i,p}(t):

C(t) = Σ P_i * N_{i,p}(t) (from i=0 to n)

* **Degree (p):** Typically 3 (cubic) for smooth letterforms.
* **Order (k):** Defined as p + 1.
* **Knots (m+1):** A non-decreasing sequence of values {t_0, t_1, ..., t_m}.
* **Relationship:** The number of knots (m+1), control points (n+1), and degree (p) are linked by the formula: m = n + p + 1.

---

## 2. The Cox-de Boor Recursion
The basis functions N_{i,p}(t) are calculated recursively.

**Base Case (Degree 0):**
N_{i,0}(t) = 1 if t_i ≤ t < t_{i+1}, else 0.

**Recursive Step (Degree p > 0):**
N_{i,p}(t) = [(t - t_i) / (t_{i+p} - t_i)] * N_{i,p-1}(t) + [(t_{i+p+1} - t) / (t_{i+p+1} - t_{i+1})] * N_{i+1,p-1}(t)

*Note: If a denominator is zero, that specific term is treated as 0.*

---

## 3. Knot Vector Logic
The knot vector determines the "timing" and "clamping" of the curve.

### Clamped (Open) Knot Vector
Used for letters like **"C"** or **"S"** where the curve must start and end exactly at the first and last control points.
* **Structure:** For n+1 control points and degree p:
    * The first p+1 knots are 0.
    * The last p+1 knots are 1.
    * Interior knots are evenly spaced between 0 and 1.
* **Example (Cubic, 4 points):** `[0, 0, 0, 0, 1, 1, 1, 1]`

### Periodic (Closed) Knot Vector
Used for letters like **"O"** to create a seamless loop.
* **Logic:** Knots are uniform (e.g., `[0, 1, 2, 3, 4, 5, 6, 7]`).
* **Implementation:** To close the loop, the first p control points are duplicated at the end of the control point list (P_{n+1}=P_0, P_{n+2}=P_1, etc.).

---

## 4. de Boor’s Evaluation Algorithm
Rather than calculating every basis function, use **de Boor’s algorithm** to find a single point on the curve at time t. It is numerically stable and efficient.

### Algorithm Logic:
1.  **Find the Knot Span:** Identify index k such that t is in [t_k, t_{k+1}).
2.  **Initialize:** Create a local copy of the p+1 control points that affect this span.
3.  **Iterate:**
    ```python
    # k = active knot span index
    # p = degree
    # P = list of control points
    # t = parameter value (0.0 to 1.0)
    
    for r from 1 to p:
        for j from k down to k - p + r:
            alpha = (t - knots[j]) / (knots[j + p + 1 - r] - knots[j])
            P[j] = (1.0 - alpha) * P[j-1] + alpha * P[j]
    return P[k] # This is the point on the curve C(t)
    ```

---

## 5. Coding Considerations
* **Affine Invariance:** You only need to apply your $3 \times 3$ transformation matrix to the `control_points` list. The curve rendered from these transformed points will automatically follow the transformation.
* **Knot Span Search:** Use binary search to quickly find the active knot span index for a given t.
* **Sampling:** To render the curve, sample t from 0.0 to 1.0 in small increments (e.g., 0.01 for 100 segments).

---

## 6. Implementation Reference Table

| Feature | Selection | Logic |
| :--- | :--- | :--- |
| **Continuity** | C^2 | Standard for B-splines; provides smooth curvature. |
| **Knot Multiplicity** | p+1 | Repeating a knot p+1 times "clamps" the curve to that point. |
| **Sharp Corners** | Multiplicity p | Repeating an interior knot p times creates a sharp "kink". |
| **Resolution** | 100+ steps | Higher sampling = smoother appearance in fractals. |