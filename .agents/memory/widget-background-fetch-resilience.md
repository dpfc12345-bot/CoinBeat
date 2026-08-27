---
name: Widget background fetch resilience
description: Android widget data fetches must survive transient background network gaps, not just foreground app fetches.
---

Home-screen widget updates (react-native-android-widget's WorkManager-driven headless task, ~30 min period, or a fresh widget placement) can run before the device network is actually usable — right after boot, during a connectivity handoff, etc. A single failed fetch inside the widget task handler gets caught and rendered as a permanent error placeholder ("탭하여 앱에서 설정 확인"-style widget), and it stays that way until the app is opened in the foreground and calls its own refresh path (which always works because the process/network are already up by then).

**Why:** the original data-fetch helper (`artifacts/market-pulse/src/widgets/data.ts`) had no timeout, no retry, and no fallback — one failed `fetch` propagated straight to the task handler's catch block, which renders the error state as a *successful* widget draw. Native scheduling then has no reason to retry until the next long period.

**How to apply:** for any Android widget (or similar background-rendered surface) that fetches remote data, wrap the fetch with (1) a short timeout via `AbortController`, (2) a couple of retries with backoff before giving up, and (3) a cache of the last successful payload (e.g. AsyncStorage) to fall back to when all retries fail — only show the hard error placeholder if there is truly no prior data. This keeps transient background failures invisible to the user instead of surfacing as a stuck error widget.
