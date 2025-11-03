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

// Calculate color distance using Euclidean distance in RGB space
export function colorDistance(hex1, hex2) {
  const rgb1 = hexToRgb(hex1)
  const rgb2 = hexToRgb(hex2)

  const rDiff = rgb1.r - rgb2.r
  const gDiff = rgb1.g - rgb2.g
  const bDiff = rgb1.b - rgb2.b

  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff)
}

// Find the closest paint from a palette to a target color
export function findClosestPaint(targetHex, paints) {
  if (!paints || paints.length === 0) return null

  let closestPaint = paints[0]
  let minDistance = colorDistance(targetHex, paints[0].hex)

  for (let i = 1; i < paints.length; i++) {
    const distance = colorDistance(targetHex, paints[i].hex)
    if (distance < minDistance) {
      minDistance = distance
      closestPaint = paints[i]
    }
  }

  return {
    paint: closestPaint,
    distance: minDistance
  }
}
