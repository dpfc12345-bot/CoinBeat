---
name: Porting web mockup widget designs to native Android widgets
description: How mockup-sandbox Tailwind/web widget previews relate to real react-native-android-widget implementations
---

When porting widget designs explored in the mockup-sandbox (web/Tailwind previews) into real Android home-screen widgets (react-native-android-widget), treat the mockups as design intent only — reimplement each with FlexWidget/TextWidget/ImageWidget/ListWidget primitives, not by reusing web layout code. No blur, box-shadow, or CSS gradients; only the library's supported style props (e.g. backgroundGradient) are available.

**Why:** react-native-android-widget's primitives and style surface are a strict subset of RN/web styling (e.g. `flex` is not a valid TextWidget style — must wrap flexible text in a FlexWidget with flex, then a plain TextWidget inside). Copying JSX/CSS directly from web mockups produces TypeScript errors or silently wrong layouts.

**How to apply:** When a settings/preview screen must mirror the native widget's real appearance (e.g. an in-app "preview" screen for widget configuration), reimplement each native design a second time using plain React Native Views/Text with matching visual structure — don't just call the native FlexWidget components from RN screens (they're for the widget surface only). Keep both implementations behind a shared design-id union type so they can't silently drift out of sync when new designs are added.
