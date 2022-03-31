import { observer } from "mobx-react"
import { useEffect } from "react"

import Keycap from "./Keycap"

// Check http://www.miragecraft.com/projects/keymason.html

const Keyboard = ({
  layout,
  keySize = 64,
  padding = 5,
  onClickKey,
  rgbColor,
  lightsOff,
  displayLabels,
}) => {
  if (layout.length === 0) {
    return null
  }

  return (
    <div className="flex overflow-x-auto overflow-y-visible items-center justify-center p-1 text-black">
      <div
        className="relative"
        style={{
          height: Math.max(
            ...layout.map((row) => (row.y + row.height) * keySize - padding),
          ),
          width: Math.max(
            ...layout.map((row) => (row.x + row.width) * keySize - padding),
          ),
        }}
      >
        {layout.map((key, i) => {
          return (
            <Keycap
              key={i}
              {...key}
              {...{ keySize, padding, lightsOff, displayLabels }}
              rgbColor={rgbColor(i)}
              onClick={() => {
                onClickKey(i)
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default observer(Keyboard)
