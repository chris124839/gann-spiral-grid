# Chapter 13 Grid Workstation — Product & Validation Specification

## Product scope
Create a new, standalone Windows desktop EXE focused exclusively on Patrick Mikula's Chapter 13, "Price and Time Forecasting Grid #1", from *The Definitive Guide to Forecasting Using W.D. Gann's Square of Nine*. Keep it separate from the Nifty dashboard. Replace the previous terminal-style UI completely; do not carry forward its navigation, screen layout, or visual design. Reuse only packaging infrastructure or calculation utilities after review and tests.

## Confirmed user choices
- Time cycle: manually entered fixed bar count.
- Data: daily and intraday OHLC.
- UX: guided steps, formulas and intermediate values visible.
- UI workflow: design in Google Stitch first, then implement in Antigravity.
- Keep all data local; no paid APIs, login, subscription, or mandatory cloud service.

## Guided workflow
1. Import CSV (required) and XLSX if a compatible free dependency is available. Map timestamp/date, open, high, low, close and optional volume.
2. Validate and preview data. Report missing/duplicate bars, invalid OHLC rows, ordering and interval assumptions. Never silently alter source rows.
3. Select a starting pivot bar and its high/low price as the anchor. Display selected date/time, bar index and price.
4. Set Chapter 3 price-level options. Show the formula, scaling/overlay assumptions, selected 45-degree increments and every intermediate result before drawing lines.
5. Enter the fixed time-cycle size as a positive integer number of bars. Do not auto-select a cycle from a historical pivot. Explain how bars are counted and show projected bar indices and dates.
6. Draw Chapter 13 Grid #1: horizontal price levels, vertical fixed-cycle time lines, and upward/downward diagonals connecting the grid's price/time intersections.
7. Review the seven source-described observations: pivots at price lines; pivots at time lines; fast breaks starting from time lines; pivots at price/time intersections; pivots at diagonal/diagonal intersections; upward diagonal channels; downward diagonal channels.
8. Export chart image and grid calculations/settings to CSV; include data interval, anchor, cycle bars, timezone/session assumptions and method version in export metadata.

## Chapter-specific method rules
- Chapter 13 explicitly combines the Chapter 3 price-forecasting method with a fixed time cycle.
- The Chapter 3 starting price in the book's CRB example is the February 24, 2003 high at 251.59; price lines represent each 45 degrees of Square of Nine movement.
- The time interval is fixed. The examples use the interval between the starting point and the first significant pivot, but this product's user-selected interval is manual by user preference.
- Grid diagonals connect the intersections between vertical time lines and horizontal price lines.
- Do not substitute Chapter 4's Square of Nine cell-count time method (that belongs to Grid #2 / Chapter 14).
- Do not invent an undocumented angle-to-price formula. First transcribe the exact Chapter 3 procedure and compare calculated values to the source examples. If a scaling or rounding convention remains ambiguous, expose it as a documented setting and mark it unvalidated until confirmed.
- Distinguish source-described procedure from implementation choices. Do not copy proprietary software or its UI.

## Validation before declaring calculations correct
1. Extract the exact Chapter 3 instructions, formula/scaling conventions and example values from the user's supplied book.
2. Record expected results from at least one worked example and compare each 45-degree level against the app's calculation.
3. Verify the Chapter 13 grid lines against the CRB and Amazon examples, distinguishing daily bars from 15-minute bars.
4. Unit-test price-level calculations, bar indexing, daily/intraday time mapping, intersections, missing sessions, daylight/timezone handling and CSV export.
5. Include synthetic-data tests for monotonic price, gaps, duplicate timestamps and irregular intraday bars.
6. Backtests must avoid future-data leakage. Historical confluence is exploratory, not proof of predictive power; no guaranteed signal/profit claims.

## UI direction
A new, polished desktop workspace, not the old terminal UI: a dominant chart canvas; a compact guided-step rail; a right-side method/control panel; a bottom calculation/validation drawer. Keep each overlay independently toggleable. Provide candlestick and OHLC-bar modes, zoom/pan/crosshair, readable price/time axes, future projection area, reset and local workspace save/load. Start with simple guided steps but expose formula details and advanced settings.

## Build and isolation
- Work on the dedicated feature branch only; never push unfinished changes to main.
- Do not modify the separate Nifty dashboard or its repository.
- Audit current Electron packaging and security before reusing it. Replace the renderer and shell UI completely.
- Keep renderer sandboxed: context isolation enabled, Node integration disabled, minimal preload API.
- Build Windows EXE/installer using the repository's GitHub Actions workflow and test the actual artifact before claiming success.
- Do not claim the Google Stitch design has been created unless the user supplies/exported it or Stitch is actually accessed. Design in Stitch first; then pass exported screens/spec to Antigravity.
