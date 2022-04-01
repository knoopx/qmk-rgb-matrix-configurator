import color from "color"

const LOCAL_STORAGE_KEY = "qmk-matrix-configurator"

const COLORS = [...Array(360).keys()]
  .filter((i) => i % 16 === 0)
  .map((h) => {
    return color.hsl(h, 100, 50)
  })
  .concat([color.hsv(0, 0, 100), color.hsv(0, 100, 0)])

// const COLOR_MAP = {
//   RGB_AZURE: "#99f5ff",
//   RGB_BLUE: "#0000ff",
//   RGB_CHARTREUSE: "#80ff00",
//   RGB_CORAL: "#ff7c4d",
//   RGB_CYAN: "#00ffff",
//   RGB_GOLD: "#ffd900",
//   RGB_GOLDENROD: "#d9a521",
//   RGB_GREEN: "#00ff00",
//   RGB_MAGENTA: "#ff00ff",
//   RGB_ORANGE: "#ff8000",
//   RGB_PINK: "#ff80bf",
//   RGB_PURPLE: "#7a00ff",
//   RGB_RED: "#ff0000",
//   RGB_SPRINGGREEN: "#00ff80",
//   RGB_TEAL: "#008080",
//   RGB_TURQUOISE: "#476e6a",
//   RGB_WHITE: "#ffffff",
//   RGB_YELLOW: "#ffff00",
//   RGB_OFF: "#000000",
// }
// const COLOR_NAMES = Object.keys(COLOR_MAP).reduce((acc, key) => {
//   acc[COLOR_MAP[key]] = key
//   return acc
// }, {})

// console.log(chroma.distance("#ff0000", "#ffffff"))
// const COLORS = Object.values(COLOR_MAP).sort((a, b) => chroma.distance(a, b))

export { LOCAL_STORAGE_KEY, COLORS }
