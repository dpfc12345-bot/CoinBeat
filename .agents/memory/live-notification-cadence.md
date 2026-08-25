---
name: Live notification cadence
description: Prevent Android notification churn while retaining fast in-app and widget market updates.
---

Persistent market notifications must refresh on their own conservative cadence and suppress heads-up banners. Foreground market queries and home-screen widget redraws can refresh more frequently.

**Why:** Replacing an ongoing notification at the same rate as a fast market refresh produces repeated Android heads-up interruptions and redundant market/news requests.

**How to apply:** Keep notification refresh independent from widget refresh, guard overlapping notification work, and preserve the notification in the shade without treating every data update as a user-facing alert.