export interface ResponsiveValues {
  spacing: number;
  cubeScale: number;
  gridScale: number;
}

export interface ResponsiveConfig {
  mobile: ResponsiveValues;
  tablet: ResponsiveValues;
  desktop: ResponsiveValues;
}

export const RESPONSIVE_CONFIG: ResponsiveConfig = {
  mobile: {
    spacing: 0.85,
    cubeScale: 0.75,
    gridScale: 1.4,
  },
  tablet: {
    spacing: 0.95,
    cubeScale: 0.9,
    gridScale: 1.5,
  },
  desktop: {
    spacing: 1.08,
    cubeScale: 1.0,
    gridScale: 1.5,
  },
};

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1200,
} as const;

export function getResponsiveValues(viewportWidth: number): ResponsiveValues {
  if (viewportWidth < BREAKPOINTS.mobile) {
    return RESPONSIVE_CONFIG.mobile;
  } else if (viewportWidth < BREAKPOINTS.tablet) {
    return RESPONSIVE_CONFIG.tablet;
  } else {
    return RESPONSIVE_CONFIG.desktop;
  }
}
