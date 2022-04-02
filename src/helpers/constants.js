import color from "color"
import { range } from "lodash"

const LOCAL_STORAGE_KEY = "qmk-matrix-configurator"

const COLORS = range(360)
  .filter((i) => i % 16 === 0)
  .map((h) => {
    return color.hsl(h, 100, 50)
  })
  .concat([color.hsv(0, 0, 100), color.hsv(0, 100, 0)])

export { LOCAL_STORAGE_KEY, COLORS }
