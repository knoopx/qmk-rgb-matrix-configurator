import color from "color"

export function rgb2qmk(hex) {
  const [h, s, v] = color(hex).hsv().array()

  return `{${[
    Math.round((h / 360) * 255),
    Math.round((s / 100) * 255),
    Math.round((v / 100) * 255),
  ].join(",")}}`
}
