import { createSystem, defaultConfig } from "@chakra-ui/react";

// Builds every token a colorPalette needs from one light and one dark colour, so
// colorPalette="accent" works on buttons and pills the same as Chakra's own colours
const palette = (light: string, dark: string) => {
  const mix = (amount: number) => ({
    base: `color-mix(in srgb, ${light} ${amount}%, transparent)`,
    _dark: `color-mix(in srgb, ${dark} ${amount}%, transparent)`,
  });

  return {
    DEFAULT: { value: { base: light, _dark: dark } },
    solid: { value: { base: light, _dark: dark } },
    // Text on top of solid, dark text in dark mode since the solid colour is lighter there
    contrast: { value: { base: "#ffffff", _dark: "#0b0b0f" } },
    fg: { value: { base: light, _dark: dark } },
    subtle: { value: mix(10) },
    muted: { value: mix(18) },
    emphasized: { value: mix(28) },
    focusRing: { value: { base: light, _dark: dark } },
  };
};

// Colours and shapes match the API's status page, so the two feel like one product
const system = createSystem(defaultConfig, {
  globalCss: {
    "html, body": {
      bg: "canvas",
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: `'Inter', sans-serif` },
        body: { value: `'Inter', sans-serif` },
      },
    },
    semanticTokens: {
      colors: {
        // Behind everything, so white panels stand out from it
        canvas: { value: { base: "#f6f6f8", _dark: "#0b0b0f" } },
        // Used sparingly, for the brand name, the selected tab and things waiting on someone
        accent: palette("#7c3aed", "#a78bfa"),
        // Healthy or approved
        ok: palette("#059669", "#34d399"),
        // Broken, rejected or deleted
        bad: palette("#e11d48", "#fb7185"),
        bg: {
          panel: { value: { base: "#ffffff", _dark: "#17171c" } },
        },
        border: {
          DEFAULT: { value: { base: "#e4e4e7", _dark: "#27272a" } },
        },
      },
      // Rounder corners on every input, button, menu and dialog
      radii: {
        l1: { value: "{radii.sm}" },
        l2: { value: "{radii.lg}" },
        l3: { value: "{radii.xl}" },
      },
    },
    keyframes: {
      // A ring that grows out of a status dot and fades, for things that are live or waiting
      "status-pulse": {
        "50%": { boxShadow: "0 0 0 7px transparent" },
      },
    },
  },
});

export default system;
