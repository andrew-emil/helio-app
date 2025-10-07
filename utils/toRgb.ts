export function toRgba(color: string, alpha = 0.5) {
    if (!color) return `rgba(0,0,0,${alpha})`;
    const c = color.trim();
    if (c.startsWith("#")) {
        const hex = c.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    }
    if (c.startsWith("rgba")) {
        // already rgba — try to replace alpha
        return c.replace(/rgba\(([^)]+),\s*([0-9.]+)\)/, (m, rgb) => `rgba(${rgb},${alpha})`);
    }
    if (c.startsWith("rgb")) {
        return c.replace("rgb(", "rgba(").replace(")", `,${alpha})`);
    }
    // fallback to the color as-is with alpha appended (may be invalid, but try)
    return c;
}