# Fractal Type

A web application that generates fractal art based on user-defined characters.

## Features

- **Fractal Generation**: Creates intricate fractal patterns using affine transformations.
- **Character Input**: Users can define custom fractals for each letter of the alphabet.
- **Progressive Rendering**: Points are generated progressively, allowing for real-time visualization.
- **PixiJS Powered**: Utilizes PixiJS for high-performance 2D graphics rendering.

## Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd fractal-type
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

## Usage

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

### Build

Build the application for production:

```bash
npm run build
```

### Run Tests

Run unit tests:

```bash
npm test
```

## Project Structure

```
fractal-type/
├── src/
│   ├── common/         # Common utilities and interfaces
│   │   ├── affineHelpers.ts
│   │   ├── interfaces.ts
│   │   └── letterMaps.ts
│   ├── FractalShader.ts  # Custom shader for fractal rendering
│   ├── ProgressiveFractal.ts # Main fractal generation logic
│   ├── App.tsx           # Main application component
│   └── main.ts           # Entry point
├── test/               # Unit tests
├── index.html          # HTML entry point
├── package.json        # Project dependencies
└── vite.config.ts      # Vite configuration
```

## License

This project is licensed under GPLv3 (see LICENSE file or https://www.gnu.org/licenses/gpl-3.0.en.html).
