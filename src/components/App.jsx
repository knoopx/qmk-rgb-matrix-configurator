import { observer } from "mobx-react"
import classNames from "classnames"
import color from "color"

import { useStore } from "../hooks"
import { COLORS } from "../helpers/constants"

import Palette from "./Palette"
import Keyboard from "./Keyboard"
import TextArea from "./TextArea"
import LayerSelector from "./LayerSelector"

import IcBaselineKeyboard from "~icons/ic/baseline-keyboard"
import IcBaselineLightbulb from "~icons/ic/baseline-lightbulb"
import IcBaselineFolderOpen from "~icons/ic/baseline-folder-open"
import IcBaselineContentPaste from "~icons/ic/baseline-content-paste"
import IcBaselineEdit from "~icons/ic/baseline-edit"
import IcBaselineEmojiSymbols from "~icons/ic/baseline-emoji-symbols"
import IcBaselineFormatColorFill from "~icons/ic/baseline-format-color-fill"
import IcBaselineBorderClear from "~icons/ic/baseline-border-clear"

const PanelButton = ({ className, as: Component = "button", ...props }) => {
  return (
    <Component
      className={classNames(
        "inline-block p-2 font-medium bg-neutral-700 rounded",
        className,
        {
          "hover:bg-neutral-600 cursor-pointer": !props.disabled,
        },
      )}
      {...props}
    />
  )
}

const ToggablePanelButton = ({ value, className, ...props }) => {
  return (
    <PanelButton
      className={classNames({
        "text-neutral-500": !value,
      })}
      {...props}
    />
  )
}

const App = () => {
  const store = useStore()

  const canPaste = "readText" in navigator.clipboard

  return (
    <div className="container flex flex-col mx-auto px-16 py-8 space-y-8 min-h-screen">
      <div className="flex space-x-1">
        <PanelButton as="label">
          <IcBaselineFolderOpen />
          <input type="file" hidden onChange={store.loadFile} />
        </PanelButton>

        <PanelButton
          disabled={!canPaste}
          title={
            !canPaste && "Your browser does not allow to read clipboard content"
          }
          className={{
            "opacity-25": !canPaste,
          }}
          onClick={store.paste}
        >
          <IcBaselineContentPaste />
        </PanelButton>

        <PanelButton onClick={store.toggleEditingLayout}>
          <IcBaselineEdit />
        </PanelButton>
      </div>

      {store.isEditingLayout && (
        <div>
          <TextArea
            value={store.input}
            onChange={(e) => {
              store.setInput(e.target.value)
            }}
          />

          <div className="flex items-center justify-end ml-auto text-right text-xs">
            <IcBaselineKeyboard />
            &nbsp;{store.layout.keys.length} keys
          </div>
        </div>
      )}

      {store.isLayoutEmpty && (
        <div className="flex flex-auto flex-col items-center justify-center text-xl rounded-2xl border-2 border-dashed border-neutral-700">
          <IcBaselineKeyboard className="h-64 w-64 text-neutral-700" />
          <span>
            Open or paste a{" "}
            <a
              className="text-amber-500 underline"
              target="_blank"
              href="http://www.keyboard-layout-editor.com/"
              rel="noreferrer"
            >
              KBL
            </a>{" "}
            layout to get started
          </span>
        </div>
      )}

      {!store.isLayoutEmpty && !store.isLayoutValid && (
        <div className="flex flex-auto flex-col items-center justify-center text-xl rounded-2xl border-2 border-dashed border-neutral-700">
          <IcBaselineKeyboard className="h-64 w-64 text-neutral-700" />
          <span>{store.layoutError}</span>
        </div>
      )}

      {!store.isLayoutEmpty && store.isLayoutValid && (
        <div className="flex flex-col justify-center space-y-8">
          <div className="flex-col space-y-4 f">
            <Keyboard
              layout={store.layout}
              displayLabels={store.displayLabels}
              lightsOff={store.lightsOff}
              rgbColor={(i) => store.layers[store.activeLayer][i]}
              onClickKey={(i) => {
                store.toggleRGBColor(i)
              }}
            />
          </div>
          <div className="flex items-center">
            <LayerSelector
              activeLayer={store.activeLayer}
              layers={store.layers}
              onSelect={store.setActiveLayer}
              onChangeLayerCount={(offset) => {
                store.setLayerCount(store.layerCount + offset)
              }}
            />

            <div className="flex ml-auto space-x-1">
              <ToggablePanelButton
                value={store.displayLabels}
                onClick={store.toggleLabels}
              >
                <IcBaselineEmojiSymbols />
              </ToggablePanelButton>

              <ToggablePanelButton
                value={!store.lightsOff}
                onClick={store.toggleLights}
              >
                <IcBaselineLightbulb />
              </ToggablePanelButton>
            </div>
          </div>

          <div className="flex">
            <Palette
              activeColor={store.activeColor}
              colors={COLORS}
              onSelectColor={store.setActiveColor}
            />
            <div className="flex items-center ml-auto space-x-1">
              <a
                className="flex items-center justify-center h-8 w-8 cursor-pointer"
                onClick={() => {
                  store.fillLayer(store.activeColor)
                }}
              >
                <IcBaselineFormatColorFill />
              </a>
              <a
                className="flex items-center justify-center h-8 w-8 cursor-pointer"
                onClick={() => {
                  store.fillLayer(color.hsv(0, 0, 0))
                }}
              >
                <IcBaselineBorderClear />
              </a>
            </div>
          </div>
          <TextArea showCopy disabled value={store.asQMK} />
        </div>
      )}
    </div>
  )
}

export default observer(App)
