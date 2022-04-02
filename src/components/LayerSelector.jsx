import classNames from "classnames"
import { observer } from "mobx-react"

import IcBaselineAdd from "~icons/ic/baseline-add"
import IcBaselineMinus from "~icons/ic/baseline-minus"

const Button = ({ className, ...props }) => (
  <a
    {...props}
    className={classNames(
      "cursor-pointer w-8 h-8 flex items-center justify-center rounded",
      className,
    )}
  />
)

const LayerSelector = ({
  layers,
  activeLayer,
  onSelect,
  onChangeLayerCount,
}) => (
  <div className="flex">
    {layers.map((layer, i) => (
      <Button
        key={i}
        className={classNames({
          "font-bold bg-neutral-700 ": activeLayer === i,
        })}
        onSelect={onSelect}
        onClick={() => {
          onSelect(i)
        }}
      >
        {i}
      </Button>
    ))}
    <Button
      onClick={() => {
        onChangeLayerCount(1)
      }}
    >
      <IcBaselineAdd />
    </Button>
    {layers.length > 1 && (
      <Button
        onClick={() => {
          onChangeLayerCount(-1)
        }}
      >
        <IcBaselineMinus />
      </Button>
    )}
  </div>
)

export default observer(LayerSelector)
