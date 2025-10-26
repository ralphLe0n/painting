// Convert hex color to RGB
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : { r: 0, g: 0, b: 0 }
}

// Convert RGB to hex
export function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return '#' + toHex(r) + toHex(g) + toHex(b)
}

// Mix colors with given ratios
// paints: array of { hex: string, ratio: number (0-1) }
export function mixColors(paints) {
  if (!paints || paints.length === 0) {
    return '#000000'
  }

  let r = 0
  let g = 0
  let b = 0

  paints.forEach(({ hex, ratio }) => {
    const rgb = hexToRgb(hex)
    r += rgb.r * ratio
    g += rgb.g * ratio
    b += rgb.b * ratio
  })

  return rgbToHex(r, g, b)
}

// Generate a formula string for display
export function generateFormula(paints) {
  return paints
    .map(({ name, ratio }) => `${Math.round(ratio * 100)}% ${name}`)
    .join(' + ')
}
