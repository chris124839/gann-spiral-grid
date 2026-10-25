# Gann Spiral Workstation (Desktop foundation)

Offline-first Windows desktop shell for OHLC research and Gann learning. This work is isolated on the `desktop-app-foundation` branch; the existing GitHub Pages grid and dashboard are not changed.

## Current foundation
- Electron desktop shell and local CSV picker.
- OHLC CSV validation for Date/Open/High/Low/Close; optional Volume.
- Dataset overview and row inspection.
- Square-spiral visualization, explicit square-root price-rotation convention, candidate level list and CSV export.
- Learning Centre and rule/risk checklist.
- Windows CI workflow creates portable EXE and installer artifacts.

## Build on Windows
Install Node.js LTS, then:
```powershell
cd desktop
npm install
npm run start
npm run dist
```
Artifacts are written to `desktop/dist`. A Windows executable must be built on a Windows runner or Windows laptop. The GitHub Actions workflow builds it on Windows.

## CSV format
```csv
Date,Open,High,Low,Close,Volume
2026-01-02,26000,26100,25900,26050,123456
```
Date and OHLC are required; Volume is optional. Export historical OHLC from a source you are entitled to use.

## Important limitations
This is a foundation, not yet a validated trading system. It does not fetch live market data, place trades, or guarantee forecast accuracy. Formula conventions must be explicit: the selected square-root rotation formula is one implementation choice and should not be misrepresented as universal across Gann literature. Add further methods only with documented rules, tests, source attribution and failure conditions.

## Planned modules
1. OHLC charting and multi-timeframe handling.
2. Pivot detection and user-reviewed anchor selection.
3. Gann angle scaling and midpoint tools.
4. Book-referenced lessons and source notes.
5. Historical backtesting with fees, slippage, out-of-sample splits and drawdown.
6. Tests for calculations, data validation, and timezone/session boundaries.
