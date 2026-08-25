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
  text: '#F4F7FF',
  tint: '#4D9CFF',
  background: '#070D1B',
  foreground: '#F4F7FF',
  card: '#0F1A30',
  cardForeground: '#F4F7FF',
  primary: '#4D9CFF',
  primaryForeground: '#061121',
  secondary: '#14233D',
  secondaryForeground: '#D8E6FB',
  muted: '#0B162A',
  mutedForeground: '#8194B4',
  accent: '#A9CEFF',
  accentForeground: '#061121',
  destructive: '#FF718C',
  destructiveForeground: '#FFFFFF',
  border: '#243B61',
  input: '#243B61',
  positive: '#68D8AB',
  negative: '#FF8097',
  amber: '#FFC36B',
  teal: '#73CFFF',
};

const colors = { light: palette, dark: palette, radius: 16 };

export default colors;
