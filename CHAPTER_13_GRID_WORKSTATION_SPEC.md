# Chapter 13 Grid Workstation — Product & Validation Specification

## Product scope
Create a new, standalone Windows desktop EXE focused first on Patrick Mikula's Chapter 13, "Price and Time Forecasting Grid #1", from *The Definitive Guide to Forecasting Using W.D. Gann's Square of Nine*. Build one complete tool at a time. This is separate from the Nifty dashboard. Replace the previous terminal-style UI completely; do not carry forward its navigation, screen layout, or visual design. Reuse only packaging infrastructure or calculation utilities after review and tests.

## Confirmed user choices and default controls
- Time spacing: manually entered fixed number of bars.
- Data: daily and intraday OHLC.
- UX: guided steps with visible formulas and intermediate values.
- UI workflow: Google Stitch design first; Antigravity implementation after the design is approved.
- Keep user data local; no paid APIs, login, subscription, or mandatory cloud service.
- Default pivot: Swing Low.
- Default horizontal level direction: both above and below anchor.
- Default angular increment: 45 degrees.
- Default horizontal level count: 10.
- Default first vertical time-line offset: 25 bars after the anchor.
- Default fixed spacing between vertical time lines: 25 bars.
- Default vertical time-line count: 10.
- These are initial UI defaults only, not validated market output. The selected first line is at anchor bar + 25; later lines are at +50, +75, +100 bars, etc., when those bars exist or can be projected.

## Chapter 13 workflow / UI
1. **Import OHLC**: accept Excel (.xlsx) and CSV. Map date/time, open, high, low, close, and optional volume columns. Preview rows before plotting. Validate missing values, duplicate timestamps, invalid OHLC values, sorting and interval assumptions; never silently modify source data.
2. **Plot price chart**: selectable candlestick or OHLC-bar (stick) view. Include zoom, pan, crosshair, tooltips, date/time and price axes. Support daily and intraday bars.
3. **Select pivot**: user clicks a bar/candle and selects Swing High or Swing Low. Default Swing Low. Display selected timestamp, bar index and exact chosen anchor price. Allow editing the anchor price only through a visible, confirmed control.
4. **Configure horizontal price levels**: use the Chapter 3 Square of Nine price-forecasting method from the chosen anchor. Default angular increment is 45 degrees and default count is 10. Default direction is both above and below the anchor. Provide explicit direction and count controls. Keep angle labels and formula/intermediate calculations visible. Do not use a simple linear price increment as a substitute for the book's Square of Nine calculation.
5. **Configure vertical time lines**: default first time-line offset is 25 bars after the anchor; default fixed spacing is 25 bars; default count is 10. User can change all three. Subsequent lines are spaced at the same fixed bar interval. Let the user extend forward, backward, or both. Clearly show bar-index/date mapping, including daily vs intraday session gaps. Do not use Chapter 4 cell-number time forecasting in this Chapter 13 tool.
6. **Generate diagonals**: automatically draw rising and falling diagonal lines through the intersections of horizontal price levels and vertical time lines, following Chapter 13. Regenerate them when relevant grid controls change. Diagonals must be anchored to the actual price/time intersections, not arbitrarily attached to the pivot.
7. **Inspect grid**: allow independent visibility toggles for price levels, time lines, rising diagonals and falling diagonals. Support undo/reset of grid settings without changing imported OHLC data.
8. **Export**: export chart image and grid values/settings to CSV. Include anchor, pivot type, angle increment, level count/direction, first time-line position, bar spacing, line count, data interval, timezone/session assumptions and method version in metadata.

## Method source and interpretation
- Chapter 13 combines the Chapter 3 price-forecasting method with a fixed time-cycle method. Horizontal lines come from Chapter 3; vertical lines use a fixed interval; diagonals connect the horizontal/vertical intersections.
- The book's CRB example starts from the February 24, 2003 high price of 251.59 and draws price lines representing each 45 degrees of Square of Nine movement.
- Chapter 13 says a common way to choose the time cycle is the interval between the starting point used for the price lines and the first significant pivot; the two book examples use this method. In this app, the user specifically wants manual entry of the fixed bar interval, so manual input is the product setting and must be clearly distinguished from the book's example for choosing the interval.
- User-configurable angles and level counts are UI extensions. Default to 45 degrees and 10 levels; validate the price mapping before treating alternate settings as correct. Do not silently interpret an ambiguous example such as "250 degrees" as a standard step.
- A selected Swing High or Swing Low determines the anchor and selected direction controls which side(s) of price to display. Do not assume a swing high means every level is below it or a swing low means every level is above it; expose above/below/both controls.
- Do not substitute Chapter 4's Square of Nine cell-count time method (that belongs to Grid #2 / Chapter 14).
- Do not invent an undocumented angle-to-price formula. Extract the exact Chapter 3 procedure and compare calculated values with the source's worked examples. If scaling or rounding is ambiguous, document it, expose the assumption, and mark it unvalidated until confirmed.

## Validation before declaring calculations correct
1. Extract exact Chapter 3 instructions, formula/scaling conventions and worked example values from the user's supplied book.
2. Record expected results from at least one worked example and compare each 45-degree level against the app's calculation.
3. Verify Chapter 13 grid construction against the CRB and Amazon examples, distinguishing daily bars from 15-minute bars.
4. Unit-test price-level calculations, bar indexing, daily/intraday time mapping, intersections, missing sessions, timezone handling and CSV export.
5. Include synthetic-data tests for monotonic prices, gaps, duplicate timestamps and irregular intraday bars.
6. Any backtest must avoid future-data leakage. Historical confluence is exploratory, not proof of predictive power; no guaranteed signal/profit claims.

## UI direction
A new, polished desktop workspace, not the old terminal UI: dominant chart canvas; left-side guided steps; right-side method/control panel; compact bottom calculation/validation drawer. Beginner-friendly guided setup must show formulas and intermediate values. Provide advanced settings without hiding them. Each overlay is independently toggleable. Provide chart type selection, zoom/pan/crosshair, readable axes, future projection area, reset and local workspace save/load.

## Build and isolation
- Work on the dedicated feature branch only; never push unfinished work to main.
- Do not modify the separate Nifty repository or dashboard.
- Audit Electron packaging/security before reusing it. Replace renderer and shell UI completely.
- Keep renderer sandboxed: context isolation enabled, Node integration disabled, minimal preload API.
- Build Windows EXE/installer using the repository's GitHub Actions workflow and test the actual artifact before claiming success.
- Do not claim the Google Stitch design has been created unless the user supplies/exported it or Stitch is actually accessed. Design in Stitch first; then pass exported screens/spec to Antigravity.
