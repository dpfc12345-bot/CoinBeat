/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const palette = {
  text: '#F4F7F1',
  tint: '#C9F64A',
  background: '#080A0B',
  foreground: '#F4F7F1',
  card: '#111516',
  cardForeground: '#F4F7F1',
  primary: '#C9F64A',
  primaryForeground: '#080A0B',
  secondary: '#1A2020',
  secondaryForeground: '#DCE4DB',
  muted: '#151B1C',
  mutedForeground: '#81908B',
  accent: '#D9FF63',
  accentForeground: '#080A0B',
  destructive: '#FF5B62',
  destructiveForeground: '#080A0B',
  border: '#26302E',
  input: '#26302E',
  positive: '#C9F64A',
  negative: '#FF7A80',
  amber: '#FFB86B',
  teal: '#70E1D2',
};

const colors = { light: palette, dark: palette, radius: 8 };

export default colors;
