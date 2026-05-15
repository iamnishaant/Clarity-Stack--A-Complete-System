import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hexToHSL(hex: string) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  r /= 255; g /= 255; b /= 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function applyAccentColor(color: string) {
  if (color.startsWith('#')) {
    document.documentElement.setAttribute('data-accent', 'custom');
    const { h, s, l } = hexToHSL(color);
    document.documentElement.style.setProperty('--primary', `${h} ${s}% ${l}%`);
    document.documentElement.style.setProperty('--ring', `${h} ${s}% ${l}%`);
    document.documentElement.style.setProperty('--accent', `${h} ${s}% ${Math.max(0, l - 10)}%`);
    document.documentElement.style.setProperty('--gradient-primary', `linear-gradient(135deg, hsl(${h} ${s}% ${Math.max(0, l - 10)}%), hsl(${h} ${s}% ${Math.min(100, l + 5)}%))`);
  } else {
    document.documentElement.setAttribute('data-accent', color);
    document.documentElement.style.removeProperty('--primary');
    document.documentElement.style.removeProperty('--ring');
    document.documentElement.style.removeProperty('--accent');
    document.documentElement.style.removeProperty('--gradient-primary');
  }
}

