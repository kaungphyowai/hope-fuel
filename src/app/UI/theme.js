import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#dc2626',
      red50: '#fef2f2',
      red100: '#fee2e2',
      red200: '#fecaca',
      red300: '#fca5a5',
      red400: '#f87171',
      red500: '#ef4444',
      red600: '#dc2626',
      red700: '#b91c1c',
      red800: '#991b1b',
      red900: '#7f1d1d',
    },
    secondary: {
      main: '#2563EB',
      yellow50: '#fffbeb',
      yellow100: '#fef3c7',
      yellow200: '#fde68a',
      yellow300: '#fcd34d',
      yellow400: '#fbbf24',
      yellow500: '#f59e0b',
      yellow600: '#d97706',
      yellow700: '#b45309',
      yellow800: '#92400e',
      yellow900: '#78350f',
    },
    neutral: {
      main: '#64748b',
      grey50: '#f8fafc',
      grey100: '#f1f5f9',
      grey200: '#e2e8f0',
      grey300: '#cbd5e1',
      grey400: '#94a3b8',
      grey500: '#64748b',
      grey600: '#475569',
      grey700: '#334155',
      grey800: '#1e293b',
      grey900: '#0f172a',
    },
    shades: {
      main: '#ffffff',
      white: '#ffffff',
      black: '#000000',
    },
  },
  // You can define other theme customizations here
});

export default theme;
