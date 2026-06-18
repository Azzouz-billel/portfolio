export const lerp = (a, b, t) => a + (b - a) * t

export const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value))

export const smoothstep = (t) => {
  const x = clamp(t)
  return x * x * (3 - 2 * x)
}

export const mapRange = (value, inMin, inMax, outMin, outMax) => {
  const t = (clamp(value, inMin, inMax) - inMin) / (inMax - inMin)
  return outMin + t * (outMax - outMin)
}
