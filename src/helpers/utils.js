import color from "color"
import jsonic from "jsonic"

import { deserialize } from "./kle"

export function rgb2qmk(hex) {
  const [h, s, v] = color(hex).hsv().array()

  return `{${[
    Math.round((h / 360) * 255),
    Math.round((s / 100) * 255),
    Math.round((v / 100) * 255),
  ].join(",")}}`
}

export function tryParse(input) {
  let parsed = []

  try {
    parsed = JSON.parse(input)
  } catch (e1) {
    try {
      // try to parse as JSONL
      parsed = jsonic(`[${input}]`)
    } catch (e2) {}
  }

  return deserialize(parsed)
}
