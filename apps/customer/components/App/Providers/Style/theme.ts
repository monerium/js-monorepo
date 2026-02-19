'use client';

import { experimental_extendTheme } from '@mui/material/styles';

declare module '@mui/material/Button' {
   
  interface ButtonPropsVariantOverrides {
    plain: true;
  }
}

const brand = {
  blue50: '#eaf0fe',
  blue400: '#5a8af6',
  blue500: '#316df4',
  blue600: '#2d63de',
  blue700: '#234dad',
  indigo500: '#10182e',
  indigo400: '#404658',
  ice450: '#f6faff',
  ice500: '#f0f6fe',
  ice600: '#eaf0fe',
  ice650: '#e0e9fd',
  grey50: '#eff2f6',
  grey100: '#e1e6ee',
  grey200: '#cad3e2',
  grey300: '#9aa4b3',
  grey400: '#8692a4',
  grey500: '#627188',
  grey900: '#2c323b',
  green500: '#1eb880',
  green700: '#15835b',
  red500: '#d3292f',
  yellow500: '#f2c24f',
  yellow800: '#856b2b',
};

const theme = experimental_extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: brand.blue500,
          light: brand.blue400,
          dark: brand.blue700,
          contrastText: '#fff',
        },
        secondary: {
          main: brand.indigo500,
          contrastText: '#fff',
        },
        background: {
          default: brand.ice600,
          paper: '#ffffff',
        },
        text: {
          primary: brand.indigo500,
          secondary: brand.grey500,
        },
        divider: brand.grey200,
        success: {
          main: brand.green500,
          dark: brand.green700,
          contrastText: '#fff',
        },
        error: {
          main: brand.red500,
        },
        warning: {
          main: brand.yellow500,
          contrastText: brand.yellow800,
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: brand.blue400,
          light: '#759df8',
          dark: brand.blue500,
          contrastText: '#fff',
        },
        secondary: {
          main: '#a0bcfa',
          contrastText: brand.indigo500,
        },
        background: {
          default: '#0d1526',
          paper: '#162040',
        },
        text: {
          primary: brand.ice500,
          secondary: brand.grey300,
        },
        divider: '#263354',
        success: {
          main: brand.green500,
          dark: brand.green700,
          contrastText: '#fff',
        },
        error: {
          main: '#e05560',
        },
        warning: {
          main: brand.yellow500,
          contrastText: brand.yellow800,
        },
      },
    },
  },

  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Inter"',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    subtitle1: {
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    button: {
      fontWeight: 600,
      letterSpacing: 0,
      textTransform: 'none',
    },
    overline: {
      fontWeight: 600,
      letterSpacing: '0.08em',
      fontSize: '0.68rem',
    },
    caption: {
      fontSize: '0.75rem',
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    // ── Card ────────────────────────────────────────────────────────────
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid var(--mui-palette-divider)',
          boxShadow: 'none',
          backgroundImage: 'none',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '20px',
          '&:last-child': {
            paddingBottom: '20px',
          },
        },
      },
    },

    // ── Button ───────────────────────────────────────────────────────────
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: 0,
        },
        sizeLarge: {
          paddingTop: 14,
          paddingBottom: 14,
          fontSize: '1rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          '&:active': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
      variants: [
        {
          props: { variant: 'plain' },
          style: {
            borderRadius: 50,
            textTransform: 'none',
            fontWeight: 500,
            border: 'none',
            backgroundColor: 'transparent',
            '&.Mui-disabled': {
              color: 'var(--mui-palette-text-disabled)',
            },
          },
        },
      ],
    },

    // ── Inputs ───────────────────────────────────────────────────────────
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: 'var(--mui-palette-background-paper)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--mui-palette-divider)',
            borderWidth: '1.5px',
            transition: 'border-color 0.15s ease',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--mui-palette-primary-main)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--mui-palette-primary-main)',
            borderWidth: '2px',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          fontWeight: 500,
        },
      },
    },

    // ── AppBar / TopBar ──────────────────────────────────────────────────
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'var(--mui-palette-background-paper)',
          borderBottom: '1px solid var(--mui-palette-divider)',
          boxShadow: 'none',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '60px !important',
        },
      },
    },

    // ── Bottom nav ───────────────────────────────────────────────────────
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 64,
          backgroundColor: 'var(--mui-palette-background-paper)',
          borderTop: '1px solid var(--mui-palette-divider)',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: 0,
          gap: 2,
          '&.Mui-selected': {
            color: 'var(--mui-palette-primary-main)',
          },
        },
        label: {
          fontSize: '0.7rem',
          fontWeight: 500,
          '&.Mui-selected': {
            fontSize: '0.7rem',
            fontWeight: 700,
          },
        },
      },
    },

    // ── Chip ─────────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 50,
        },
      },
    },

    // ── Alert ─────────────────────────────────────────────────────────────
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
        },
      },
    },

    // ── List ──────────────────────────────────────────────────────────────
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },

    // ── Paper ─────────────────────────────────────────────────────────────
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
