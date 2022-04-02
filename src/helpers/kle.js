import { cloneDeep, merge } from "lodash"

const DEFAULT_PROPS = {
  x: 0,
  y: 0,
  x2: 0,
  y2: 0, // position
  width: 1,
  height: 1,
  width2: 1,
  height2: 1, // size
  rotation_angle: 0,
  rotation_x: 0,
  rotation_y: 0, // rotation
  labels: [],
  textColor: [],
  textSize: [], // label properties
  default: { textColor: "#000000", textSize: 3 }, // label defaults
  color: "#cccccc",
  profile: "",
  nub: false, // cap appearance
  ghost: false,
  stepped: false,
  decal: false, // miscellaneous options
  sm: "",
  sb: "",
  st: "", // switch
}

const DEFAULT_META = {
  backcolor: "#eeeeee",
  name: "",
  author: "",
  notes: "",
  background: undefined,
  radii: "",
  switchMount: "",
  switchBrand: "",
  switchType: "",
}

// Map from serialized label position to normalized position,
// depending on the alignment flags.
const labelMap = [
  // 0  1  2  3  4  5  6  7  8  9 10 11   // align flags
  [0, 6, 2, 8, 9, 11, 3, 5, 1, 4, 7, 10], // 0 = no centering
  [1, 7, -1, -1, 9, 11, 4, -1, -1, -1, -1, 10], // 1 = center x
  [3, -1, 5, -1, 9, 11, -1, -1, 4, -1, -1, 10], // 2 = center y
  [4, -1, -1, -1, 9, 11, -1, -1, -1, -1, -1, 10], // 3 = center x & y
  [0, 6, 2, 8, 10, -1, 3, 5, 1, 4, 7, -1], // 4 = center front (default)
  [1, 7, -1, -1, 10, -1, 4, -1, -1, -1, -1, -1], // 5 = center front & x
  [3, -1, 5, -1, 10, -1, -1, -1, 4, -1, -1, -1], // 6 = center front & y
  [4, -1, -1, -1, 10, -1, -1, -1, -1, -1, -1, -1], // 7 = center front & x & y
]

function defaultKeyProps() {
  return cloneDeep(DEFAULT_PROPS)
}

function defaultMetaData() {
  return cloneDeep(DEFAULT_META)
}

function deserializeError(msg, data) {
  throw new Error(`Error: ${msg}${data ? `:\n  ${JSON.stringify(data)}` : ""}`)
}

function reorderLabelsIn(labels, align, skipdefault) {
  const ret = []
  for (let i = skipdefault ? 1 : 0; i < labels.length; ++i) {
    ret[labelMap[align][i]] = labels[i]
  }
  return ret
}

function deserialize(rows) {
  // Initialize with defaults
  const current = defaultKeyProps()
  const meta = defaultMetaData()
  const keys = []
  const cluster = { x: 0, y: 0 }
  let align = 4
  for (let r = 0; r < rows.length; ++r) {
    if (rows[r] instanceof Array) {
      rows[r].forEach((key, k) => {
        if (typeof key === "string") {
          const newKey = cloneDeep(current)
          newKey.width2 = newKey.width2 === 0 ? current.width : current.width2
          newKey.height2 =
            newKey.height2 === 0 ? current.height : current.height2
          newKey.labels = reorderLabelsIn(key.split("\n"), align)
          newKey.textSize = reorderLabelsIn(newKey.textSize, align)

          // Clean up the data
          for (let i = 0; i < 12; ++i) {
            if (!newKey.labels[i]) {
              newKey.textSize[i] = undefined
              newKey.textColor[i] = undefined
            }
            if (newKey.textSize[i] == newKey.default.textSize)
              newKey.textSize[i] = undefined
            if (newKey.textColor[i] == newKey.default.textColor)
              newKey.textColor[i] = undefined
          }

          // Add the key!
          keys.push(newKey)

          // Set up for the next key
          current.x += current.width
          current.width = current.height = 1
          current.x2 = current.y2 = current.width2 = current.height2 = 0
          current.nub = current.stepped = current.decal = false
        } else {
          if (key.r != null) {
            if (k != 0) {
              deserializeError(
                "'r' can only be used on the first key in a row",
                key,
              )
            }
            current.rotation_angle = key.r
          }
          if (key.rx != null) {
            if (k != 0) {
              deserializeError(
                "'rx' can only be used on the first key in a row",
                key,
              )
            }
            current.rotation_x = cluster.x = key.rx
            merge(current, cluster)
          }
          if (key.ry != null) {
            if (k != 0) {
              deserializeError(
                "ry' can only be used on the first key in a row",
                key,
              )
            }
            current.rotation_y = cluster.y = key.ry
            merge(current, cluster)
          }
          if (key.a != null) {
            align = key.a
          }
          if (key.f) {
            current.default.textSize = key.f
            current.textSize = []
          }
          if (key.f2) {
            for (let i = 1; i < 12; ++i) {
              current.textSize[i] = key.f2
            }
          }
          if (key.fa) {
            current.textSize = key.fa
          }
          if (key.p) {
            current.profile = key.p
          }
          if (key.c) {
            current.color = key.c
          }
          if (key.t) {
            const split = key.t.split("\n")
            current.default.textColor = split[0]
            current.textColor = reorderLabelsIn(split, align)
          }
          if (key.x) {
            current.x += key.x
          }
          if (key.y) {
            current.y += key.y
          }
          if (key.w) {
            current.width = current.width2 = key.w
          }
          if (key.h) {
            current.height = current.height2 = key.h
          }
          if (key.x2) {
            current.x2 = key.x2
          }
          if (key.y2) {
            current.y2 = key.y2
          }
          if (key.w2) {
            current.width2 = key.w2
          }
          if (key.h2) {
            current.height2 = key.h2
          }
          if (key.n) {
            current.nub = key.n
          }
          if (key.l) {
            current.stepped = key.l
          }
          if (key.d) {
            current.decal = key.d
          }
          if (key.g != null) {
            current.ghost = key.g
          }
          if (key.sm) {
            current.sm = key.sm
          }
          if (key.sb) {
            current.sb = key.sb
          }
          if (key.st) {
            current.st = key.st
          }
        }
      })

      // End of the row
      current.y++
    } else if (typeof rows[r] === "object") {
      if (r !== 0) {
        deserializeError("keyboard metadata must the be first element", rows[r])
      }
      merge(meta, rows[r])
    }
    current.x = current.rotation_x
  }
  return { meta, keys }
}

export { deserialize }
