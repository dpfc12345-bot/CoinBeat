export type WidgetColorTheme = 'midnight' | 'ocean' | 'sunset' | 'forest' | 'graphite' | 'rose';
export type WidgetFontSize = 'small' | 'default' | 'large';

/** Hex color literal required by react-native-android-widget's ColorProp type. */
type WidgetHexColor = `#${string}`;

export type WidgetThemeColors = {
  background: WidgetHexColor;
  surface: WidgetHexColor;
  border: WidgetHexColor;
  foreground: WidgetHexColor;
  muted: WidgetHexColor;
  primary: WidgetHexColor;
  positive: WidgetHexColor;
  negative: WidgetHexColor;
};

export const widgetColorThemes: Record<WidgetColorTheme, WidgetThemeColors> = {
  midnight: {
    background: '#080A0B',
    surface: '#111620',
    border: '#263044',
    foreground: '#F7FAFF',
    muted: '#91A0B8',
    primary: '#3D8BFF',
    positive: '#36D399',
    negative: '#FF7185',
  },
  ocean: {
    background: '#04151C',
    surface: '#0C2733',
    border: '#164A5B',
    foreground: '#EAFBFF',
    muted: '#7FB4C4',
    primary: '#22C7E5',
    positive: '#3EE6A6',
    negative: '#FF8B7A',
  },
  sunset: {
    background: '#1A0E0A',
    surface: '#2B1710',
    border: '#4A2A1A',
    foreground: '#FFF3E8',
    muted: '#CFA688',
    primary: '#FF8A3D',
    positive: '#6FD98C',
    negative: '#FF5C6C',
  },
  forest: {
    background: '#0A140D',
    surface: '#132217',
    border: '#25402C',
    foreground: '#EFFBF1',
    muted: '#8FB49A',
    primary: '#4CD97B',
    positive: '#8CE29A',
    negative: '#FF7B6E',
  },
  graphite: {
    background: '#0D0D0F',
    surface: '#19191C',
    border: '#2E2E33',
    foreground: '#F5F5F7',
    muted: '#9A9AA2',
    primary: '#D8D8E0',
    positive: '#4CD97B',
    negative: '#FF6B6B',
  },
  rose: {
    background: '#170810',
    surface: '#28101B',
    border: '#472234',
    foreground: '#FFEEF4',
    muted: '#CE93AC',
    primary: '#FF5B93',
    positive: '#4FD9A7',
    negative: '#FF6B6B',
  },
};

export const widgetColorThemeValues = Object.keys(widgetColorThemes) as WidgetColorTheme[];

export const widgetColorThemeLabels: Record<WidgetColorTheme, string> = {
  midnight: '미드나잇',
  ocean: '오션',
  sunset: '선셋',
  forest: '포레스트',
  graphite: '그래파이트',
  rose: '로즈',
};

export const widgetFontScale: Record<WidgetFontSize, number> = {
  small: 0.86,
  default: 1,
  large: 1.2,
};

export const widgetFontSizeValues = Object.keys(widgetFontScale) as WidgetFontSize[];

export const widgetFontSizeLabels: Record<WidgetFontSize, string> = {
  small: '작게',
  default: '기본',
  large: '크게',
};

export function getWidgetThemeColors(themeId: WidgetColorTheme): WidgetThemeColors {
  return widgetColorThemes[themeId] ?? widgetColorThemes.midnight;
}

export function scaleWidgetFont(baseSize: number, fontSize: WidgetFontSize): number {
  return Math.round(baseSize * widgetFontScale[fontSize]);
}

/** @deprecated Use `getWidgetThemeColors` with a selected `WidgetColorTheme` instead. */
export const widgetTheme = widgetColorThemes.midnight;
