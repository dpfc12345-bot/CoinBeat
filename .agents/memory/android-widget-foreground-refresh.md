---
name: Android widget foreground refresh
description: A widget added while the app is backgrounded stays blank until something re-triggers the data push.
---

`react-native-android-widget`-based widgets need the JS app to explicitly call `refreshAndroidWidgets()` to push fresh data into the native headless render. The normal user flow is: open app → background it → long-press the home screen → add the widget from the picker. That flow never restarts the JS process, so a refresh that only runs once on initial mount (in a context provider's launch effect) never fires again, and the newly placed widget renders blank until the user manually finds an in-app "refresh widgets" action.

**Why:** Android's `WIDGET_ADDED` broadcast into the headless JS task can't be reliably observed/tested from this environment (no physical/emulated device), so the practical fix is to widen the app-side refresh trigger rather than depend on catching that native event.

**How to apply:** add an `AppState` listener (`AppState.addEventListener('change', ...)`) in the same provider that does the mount-time refresh, and call `refreshAndroidWidgets()` again whenever the app transitions from `inactive`/`background` to `active`. This covers the add-widget-while-backgrounded case and any other scenario where the widget went stale while the app wasn't foregrounded, without needing a native `configure` activity.
