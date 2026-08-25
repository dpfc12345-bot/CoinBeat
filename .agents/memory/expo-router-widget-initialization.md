---
name: Expo Router widget initialization
description: Required initialization order for react-native-android-widget in Expo Router apps.
---

Register the `react-native-android-widget` task handler before loading the Expo Router entry module.

**Why:** With Expo Router loaded first, Android can discover the widget provider but the headless widget task may not register in time for its first update, leaving the placed widget empty.

**How to apply:** Keep the custom Expo entry file as the package main entry; import and register the widget handler first, then load `expo-router/entry`. Preserve this order whenever the app entry is edited or upgraded.