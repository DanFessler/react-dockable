export const colors = {
  light: {
    headers: "rgb(225, 229, 233)",
    selected: "rgb(66,137,204)",
    background: "rgb(191, 198, 207)",
    document: "rgb(92, 95, 99)",
    border: "rgba(0,0,0,0.1)",
    text: "rgb(63, 63, 63)",
    gap: "rgb(133, 140, 151)",
    input: "rgb(255,255,255)",
    inputText: "rgb(0,0,0)",
  },
  medium: {
    headers: "rgb(80,80,80)",
    selected: "rgb(46,104,162)",
    background: "rgb(60, 60, 60)",
    document: "rgb(32,32,32)",
    border: "rgba(0,0,0,0.125)",
    text: "rgb(255, 255, 255)",
    gap: "rgb(32, 32, 32)",
    input: "rgba(0,0,0,0.2)",
    inputText: "rgb(255,255,255)",
  },
  dark: {
    headers: "rgb(54, 57, 63)",
    selected: "rgb(46,104,162)",
    background: "rgb(40, 44, 48)",
    content: "rgb(46, 49, 54)",
    document: "rgb(13, 13, 14)",
    border: "rgba(0, 0, 0, 0.15)",
    text: "rgb(213, 218, 221)",
    gap: "rgb(24, 24, 26)",
    input: "rgba(0,0,0,0.2)",
    inputText: "rgb(255,255,255)",
  },
  darker: {
    headers: "rgb(39, 44, 53)",
    selected: "rgb(46,104,162)",
    background: "rgb(31, 36, 43)",
    content: "rgb(46, 49, 54)",
    document: "rgb(13, 13, 14)",
    border: "rgba(0, 0, 0, 0.15)",
    text: "rgb(200, 207, 211)",
    gap: "rgb(20, 20, 20)",
    input: "rgba(0,0,0,0.2)",
    inputText: "rgb(200, 207, 211)",
  },
} as const;

export type DockableTheme = keyof typeof colors;

export type DockableThemeColors = (typeof colors)[DockableTheme];

export function getThemeColors(theme: DockableTheme): DockableThemeColors {
  return colors[theme];
}

export type ThemeCssVariablesOptions = {
  gap?: number;
  radius?: number;
};

export function getThemeCssVariables(
  theme: DockableTheme,
  options: ThemeCssVariablesOptions = {}
): Record<string, string> {
  const vars: Record<string, string> = {};

  if (options.radius !== undefined) {
    vars["--dockable-radius"] = `${options.radius}px`;
  }

  if (options.gap !== undefined) {
    vars["--dockable-gap"] = `${options.gap}px`;
  }

  for (const [key, value] of Object.entries(colors[theme])) {
    vars[`--dockable-colors-${key}`] = value;
  }

  return vars;
}

export function applyThemeCssVariables(
  theme: DockableTheme,
  target: HTMLElement = document.documentElement,
  options: ThemeCssVariablesOptions = {}
) {
  for (const [name, value] of Object.entries(getThemeCssVariables(theme, options))) {
    target.style.setProperty(name, value);
  }
}

export function getPreferredTheme(): DockableTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
