import classNames from "classnames"
import color from "color"
import { isEqual } from "lodash"
import { observer } from "mobx-react"

// check https://github.com/Ciantic/keymapceditor

const LABEL_CLASSES = [
  "items-start justify-start",
  "items-start justify-center",
  "items-start justify-end",
  "items-center justify-start",
  "items-center justify-center ",
  "items-center justify-end",
  "items-end justify-start",
  "items-end justify-center",
  "items-end justify-end",
]

const Keycap = ({
  x,
  y,
  width,
  height,
  keySize,
  padding,
  color: keyColor,
  rgbColor = color.hsv(0, 0, 0),
  onClick,
  labels,
  legendColor,
  textColor,
  title,
  lightsOff = false,
  displayLabels = false,
}) => {
  const actualWidth = keySize * width
  const actualHeight = keySize * height

  const innerScale = keySize / 4
  const innerWidth = actualWidth - innerScale
  const innerHeight = actualHeight - innerScale

  keyColor = color(keyColor).fade(lightsOff ? 0.96 : 0)
  rgbColor = color(rgbColor)

  if (isEqual(rgbColor.hsv().array(), [0, 0, 0])) {
    rgbColor = color("transparent")
  }

  const borderRadius = keySize * 0.1
  const positions = ["bottom", "left"]

  return (
    <a
      {...{ onClick, title }}
      className="absolute text-xs cursor-copy select-none"
      style={{
        borderRadius,
        width: actualWidth - padding,
        height: actualHeight - padding,
        top: keySize * y,
        left: keySize * x,
        background: [
          `linear-gradient(${keyColor}, ${keyColor}) no-repeat border-box`,
          ...positions.map(
            (side) =>
              `radial-gradient(circle at ${side}, ${keyColor.darken(
                0.2,
              )} 90%, transparent 70%) no-repeat border-box`,
          ),
          keyColor,
        ],
        boxShadow: [
          `inset ${color("black").alpha(0.2)} 0px ${
            keySize * 0.05
          }px ${Math.round(keySize * 0.1)}px`,
          `inset ${rgbColor.alpha(0.25)} 0px -${keySize * 0.05}px ${Math.round(
            keySize * 0.1,
          )}px`,
          ...(rgbColor && [
            `inset ${rgbColor.alpha(0.1)} 0px 0px ${Math.round(
              keySize * 0.3,
            )}px `,
            `inset ${rgbColor.alpha(0.5)} 0px -${keySize * 0.05}px ${Math.round(
              keySize * 0.1,
            )}px`,
            `${rgbColor} 0px 0px ${Math.round(keySize * 0.1)}px ${
              keySize * 0.04
            }px`,
          ]),
        ],
      }}
    >
      <div
        className="relative border"
        style={{
          top: keySize * 0.05,
          left: (actualWidth - padding - innerWidth) / 2,
          width: innerWidth,
          height: innerHeight,
          color: legendColor,
          borderColor: keyColor.lighten(0.05),
          boxShadow: [
            `inset ${color("white").alpha(0.2)} 0px 0px ${Math.round(
              keySize * 0.1,
            )}px`,
          ],
          background: [
            `linear-gradient(${keyColor}, ${keyColor}) no-repeat border-box`,
            `linear-gradient(${keyColor}, ${keyColor.darken(
              0.1,
            )}) no-repeat border-box`,
            `radial-gradient(circle at center, ${keyColor}, ${keyColor}, ${keyColor.darken(
              0.2,
            )}) no-repeat border-box`,
          ],
          borderRadius,
        }}
      >
        {displayLabels &&
          labels.map(
            (label, i) =>
              label && (
                <span
                  key={i}
                  className={classNames(
                    "absolute flex overflow-hidden",
                    LABEL_CLASSES[i],
                  )}
                  style={{
                    top: borderRadius / 2,
                    left: borderRadius / 2,
                    bottom: borderRadius / 2,
                    right: borderRadius / 2,
                    color: textColor[i],
                  }}
                >
                  {label}
                </span>
              ),
          )}
      </div>
    </a>
  )
}

export default observer(Keycap)
