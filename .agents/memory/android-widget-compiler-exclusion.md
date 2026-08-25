---
name: Android widget compiler exclusion
description: React Compiler must not transform React Native Android Widget component functions.
---

Widget JSX modules used by `react-native-android-widget` must begin with the React Compiler opt-out directive `"use no memo";`.

**Why:** The library invokes widget component functions directly to convert their JSX into Android RemoteViews. React Compiler transformations are incompatible with that execution model and can make a newly placed widget remain blank even when its network request succeeds.

**How to apply:** Add the directive to every module that exports or returns a widget JSX component, including fallback/error widget components. Keep the regular app screens eligible for compilation.