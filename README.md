# Gann Spiral Grid

A responsive, standalone browser dashboard for exploring a square number spiral, cardinal and ordinal crosses, number positions, and sample ring levels.

## Features
- 1K, 5K, 10K, 50K, and 100K presets plus a custom positive-integer limit.
- Red North–South and blue East–West cardinal axes.
- Gold NE–SW and orange NW–SE ordinal diagonals.
- Number lookup with ring, coordinates, cross classification, angle, and distance.
- Cell size and label visibility controls.
- Vanilla HTML/CSS/JavaScript; no build step or third-party dependency.

## Run locally
Open `index.html` in a modern browser. For a local web server, run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## GitHub Pages
1. Create a new repository named `gann-spiral-grid`.
2. Upload `index.html`, `styles.css`, `app.js`, and `README.md` to the repository root.
3. In **Settings → Pages**, select **Deploy from a branch**, choose `main` and `/ (root)`, then save.

## Important implementation note
The number-to-coordinate mapping supports positive JavaScript safe integers mathematically. Drawing a huge range is limited by browser CPU, memory, canvas size, and available screen pixels; the UI renders only cells in the visible viewport. The initial implementation is a lightweight prototype, not a financial signal generator. Verify spiral conventions and all price-level calculations against your chosen Gann method before using for trading.
