---
name: Upbit USD price proxy
description: How to derive a live USD price for a KRW-only exchange (Upbit) without a separate FX API.
---

Upbit (the price source for Market Pulse) only quotes assets in KRW — there is no official USD ticker and no FX-rate endpoint on the API being used.

**Why:** adding a second FX-rate provider (API key, quota, another failure mode) is unnecessary when Upbit already lists `KRW-USDT` — a KRW/USDT pair. USDT tracks USD closely enough (within a small basis-point spread) to serve as a live proxy rate for a "show prices in USD" feature that doesn't need forex-grade precision.

**How to apply:** fetch the `KRW-USDT` ticker alongside the other tickers, use its `trade_price` as `krwPerUsd`, and derive `usdPrice = krwTradePrice / krwPerUsd` per asset. Keep a hardcoded fallback (e.g. 1400) for the rare case the `KRW-USDT` ticker is missing from the response, so the endpoint never 500s over a missing FX proxy.
