---
name: Development API routing
description: Keep Expo previews connected to the workspace API while release builds retain their configured production service.
---

Expo development builds should use the Replit development domain when it is available, even if `EXPO_PUBLIC_API_URL` contains a deployed API URL. Release builds should continue to use the configured API URL.

**Why:** A shared production URL can point at an older backend revision, causing the preview to appear stale even though the workspace API and mobile code have both been updated.

**How to apply:** Preserve the development-first routing decision in the API base URL helper whenever changing Expo environment handling. Validate a feature against the Expo preview and the workspace API together before treating production data as the source of truth.