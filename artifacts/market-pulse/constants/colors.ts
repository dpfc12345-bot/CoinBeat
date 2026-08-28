/**
 * "Night Ticker Pulse" — CoinBeat's design language.
 *
 * The idea: standing on a trading floor after hours, the room is dark and the
 * only light comes from a single glowing blue pulse. That pulse (the same
 * waveform used in the app icon) threads through the UI as the signature
 * motif. Surfaces are built with soft elevation (shadow), not borders — flat
 * bordered boxes read as a template; layered depth reads as considered.
 */

const palette = {
  text: '#F2F6FF',
  tint: '#4C8DFF',
  background: '#05070E',
  foreground: '#F2F6FF',
  card: '#0E1424',
  cardForeground: '#F2F6FF',
  cardElevated: '#141C33',
  primary: '#4C8DFF',
  primaryForeground: '#03060F',
  secondary: '#161F38',
  secondaryForeground: '#BBCCFF',
  muted: '#0A0E1A',
  mutedForeground: '#7C89AC',
  accent: '#7FE3FF',
  accentForeground: '#03060F',
  destructive: '#FF5C72',
  destructiveForeground: '#FFFFFF',
  border: '#1B2440',
  input: '#1B2440',
  positive: '#38E2A6',
  negative: '#FF5C72',
  amber: '#FFB65C',
  teal: '#57D9E0',
};

const colors = { light: palette, dark: palette, radius: 20 };

export default colors;
