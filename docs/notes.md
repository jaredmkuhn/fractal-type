Here is the comprehensive project specification and environment guide, formatted in Markdown for you to save as `README.md` or `DEVELOPMENT_PLAN.md` in your project folder.

# Project: Fractal Type (TypeScript Port)

## Project Overview

A modern, web-based port of a 2D fractal typesetting engine originally developed in C++/OpenGL. The system uses an **Iterated Function System (IFS)** to generate high-density point clouds (1,000,000+ points) that form character shapes based on affine transformations.

## 1. Technical Stack

- **Language:** TypeScript (Strict Mode)
- **Build Tool:** Vite (Vanilla-TS template)
- **Graphics Engine:** PixiJS (v8+)
- **Rendering Method:** Custom Shader (GLSL) using `PIXI.DRAW_MODES.POINTS`
- **Deployment:** AWS S3 + CloudFront (Static Site)

---

## 2. Core Architecture

### Coordinate System

- **Logic Space:** Unit Square (0,0 to 1,1).
- **Screen Space:** Dynamic (based on `window.innerWidth/Height`).
- **Origin:** Bottom-Left (OpenGL Style). _Implementation requires a Y-flip: `screenY = CanvasHeight - (UnitY _ Scale)`.\*

### Class Structure

1. **`FractalShader`**: Extends `PIXI.Shader`. Encapsulates GLSL code and handles uniforms (Point Size, Color, Alpha).
2. **`ProgressiveFractal`**: The engine.

- Holds a `Float32Array` buffer of 1M points.
- Implements the "Chaos Game" logic.
- Handles "Chunking": Uploading ~15,000 points per frame to the GPU to create a 2-3 second "drawing" animation.

3. **`AffineTransform` Interface**: Defines the 2D matrix constants `a, b, c, d, e, f`.

---

## 3. Implementation Milestones

### Milestone 1: Local Environment

1. Navigate to `C:\Users\impro\OneDrive\Documents\apps\fractal-type`.
2. `npm install pixi.js`
3. `npm install -D @webgpu/types` (for future-proofing).
4. Run `npm run dev` and attach VSCode debugger to `localhost:5173`.

### Milestone 2: The "H" Letter Fractal

Implement three base transforms to map a unit square into an "H" shape:

- **Left Bar:** `x' = 0.33x, y' = y`
- **Middle Bar:** `x' = 0.34x + 0.33, y' = 0.34y + 0.33`
- **Right Bar:** `x' = 0.33x + 0.67, y' = y`

### Milestone 3: Shader Extraction

Move GLSL strings into a separate file. Use `PIXI.Geometry.addAttribute` to link the TypeScript `Float32Array` directly to the GPU `aPosition` attribute.

---

## Appendix A: GitHub Repository Setup

Follow these commands to initialize version control for this project.

```bash
# Ensure you are in the project root
cd C:\Users\impro\OneDrive\Documents\apps\fractal-type

# Initialize Git
git init

# Create a .gitignore to keep node_modules out of the cloud
echo "node_modules/" >> .gitignore
echo "dist/" >> .gitignore
echo ".env" >> .gitignore

# Stage and Commit
git add .
git commit -m "Initial commit: Vite + PixiJS setup with Fractal architecture"

# Link to GitHub (Create a 'fractal-type' repo on GitHub first)
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fractal-type.git
git push -u origin main

```

---

## Appendix B: GitHub Authentication on Windows

Since you are using Windows 11, the most seamless way to handle authentication is the **GitHub CLI** or the **Git Credential Manager**.

### Option 1: GitHub CLI (Recommended)

1. **Install:** Open PowerShell as Admin and run: `winget install GitHub.cli`
2. **Authenticate:** Run `gh auth login`
3. **Follow Prompts:** \* Select `GitHub.com`.

- Select `HTTPS` as preferred protocol.
- Select `Login with a web browser`.
- A browser window will open; paste the one-time code provided in the terminal.

### Option 2: Personal Access Token (Classic)

If you prefer standard Git prompts:

1. Go to GitHub **Settings > Developer Settings > Personal Access Tokens (Tokens classic)**.
2. Generate a token with `repo` permissions.
3. When Windows prompts for your GitHub password in the terminal, **paste the Token instead of your password**. Windows will save this in the "Credential Manager" so you don't have to enter it again.

---

## Appendix C: AWS Deployment (S3/CloudFront)

1. **Build:** `npm run build` (generates the `dist` folder).
2. **Sync:** ```powershell
   aws s3 sync dist/ s3://your-bucket-name --delete

```

```

3. **CDN:** Create a CloudFront Distribution pointing to your S3 bucket. Ensure **HTTPS** is enabled, as modern browsers may restrict WebGL/WebGPU features on unencrypted connections.
