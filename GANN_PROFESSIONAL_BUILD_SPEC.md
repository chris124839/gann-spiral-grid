# Gann Professional Workstation — Build Specification

## Goal
Build an independent, free-to-use Windows desktop application in this repository, using the existing Electron foundation. This is not Optuma software and must not copy proprietary code, branding, or exact UI. Reproduce useful charting capabilities through original implementations and documented methods.

## Working rules
- Work on branch `gann-professional-workstation`; do not push unfinished work to `main`.
- Inspect the existing app before changing it. Preserve the browser-based GitHub Pages tool and existing desktop foundation.
- Prefer free/open-source dependencies with compatible licenses. Document dependency licenses.
- No paid APIs, login, subscriptions, or mandatory cloud services.
- Work offline with user-provided files.
- Separate calculations from UI; add tests and document assumptions.
- Do not claim a Windows EXE is built until CI actually creates the artifact successfully.

## Navigation / independent tabs
1. Chart Studio
2. Data Import & Data Manager
3. Square of Nine
4. Chapter 3 — Price Forecasting (Mikula)
5. Chapter 4 — Time Forecasting by Cell Numbers (Mikula)
6. Chapter 13 — Price and Time Forecasting Grid #1 (Mikula)
7. Chapter 14 — Price and Time Forecasting Grid #2 (Mikula)
8. Gann Fans and Angles
9. Gann Squares / Square divisions
10. Swing High/Low Analysis
11. Time Cycles
12. Historical Validation / Backtesting
13. Reports & Export
14. Method Library / Settings

Every tool must have its own tab, configurable inputs, a plain-language method explanation, visible intermediate calculations, chart overlays, and reset-to-default control. Tools must not silently share or override settings.

## Data and charting
- Import CSV and Excel OHLC data if a compatible free library can be used. If Excel support requires an added dependency, document its license and keep CSV as a reliable fallback.
- Support date/time, open, high, low, close, and optional volume columns with column mapping.
- Validate duplicates, missing fields, invalid OHLC rows, timezone, bar interval, and sorting. Never silently alter source data.
- Candlestick, OHLC bar, and line chart modes.
- Zoom, pan, crosshair, tooltips, price/time axes, visible historical and future projection regions.
- Toggle each overlay independently; user can save and load workspaces locally.
- Export calculated levels and forecast dates to CSV and XLSX; export chart images.

## Method correctness
Use the user's supplied Patrick Mikula book as the source for chapter-specific methods. Preserve each chapter's terminology and actual procedure. Do not infer undocumented formulas from generic Gann lore.
- Chapter 3: measure historical price swings using the Square of Nine overlay; support user-selected starting pivot, scaling, and angles as described by the method. Validate angle-to-price mapping against the book's examples.
- Chapter 4: select a historical top/bottom pivot; count forward by cell numbers on diagonal/cardinal crosses; inspect first two/three historical counts for correlation; project only counts supported by validation. Predict top/bottom direction only when the observed alternating pivot sequence supports it; otherwise forecast date only.
- Chapter 13: combine Chapter 3 horizontal price levels with a user-selected fixed time cycle; draw vertical time lines and up/down diagonals through actual price/time intersections.
- Chapter 14: use Chapter 3 price lines and Chapter 4 time lines, then construct the diagonal grid as specified by the source.
- Square of Nine wheel: display numbering, ring, coordinate, cross, angle, and selected pivot/overlay in a clear interactive view.
- Gann Fans/Angles and squares: user-configurable anchor points, scale, units, and divisions; document coordinate assumptions and chart scaling.

## Historical validation
- Show matched/missed pivots, tolerance in bars or price units, sample count, and calculation details.
- Prevent future-data leakage: only use information available at the forecast origin.
- Separate exploratory settings from validated settings.
- No guaranteed prediction, profit, or accuracy claims. Display results as analytical hypotheses.

## UI quality
- Professional, compact desktop layout; readable typography; consistent tab navigation.
- Avoid a generic template appearance. Prioritize the chart canvas and a side panel for controls/results.
- Beginner-friendly help without hiding advanced parameters.
- Handle large files without freezing the interface.

## Build and tests
1. Audit current Electron main/preload/renderer/package scripts.
2. Build one complete vertical slice first: CSV/Excel import -> candlestick chart -> Square of Nine level overlay -> export.
3. Add tests for OHLC validation, square coordinates, price levels, cell counts, bar/date conversion, grid intersections, and export.
4. Implement remaining tabs in phases with tests per method.
5. Harden Electron security: context isolation, no Node integration in renderer, minimal preload API, no remote code execution.
6. Configure Windows GitHub Actions to install dependencies, run tests, package a Windows installer/portable executable, and upload it as a workflow artifact.
7. Test the artifact launch and core workflows before reporting completion.
8. Update README with setup, build commands, limitations, dependency licenses, and artifact download instructions.

## Required initial report
Before major edits, report current architecture and files to change. Then implement incrementally on this branch. Do not modify the separate Nifty repository or its dashboard.
