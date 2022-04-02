import { observer, useLocalObservable } from "mobx-react"
import classNames from "classnames"
import color from "color"
import { autorun } from "mobx"
import { range } from "lodash"

import { rgb2qmk, tryParse } from "../helpers/utils"
import { COLORS, LOCAL_STORAGE_KEY } from "../helpers/constants"

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

const PanelButton = ({ className, as: Component = "a", ...props }) => {
  return (
    <Component
      className={classNames(
        "inline-block p-2 font-medium bg-neutral-700 rounded cursor-pointer hover:bg-neutral-600",
        className,
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
  const store = useLocalObservable(() => {
    let initialState = {}

    const data = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (data) {
      initialState = JSON.parse(data)
    }

    return {
      activeLayer: 0,
      activeColor: COLORS[0],
      input: "",
      layers: [],
      layerCount: 4,
      layoutError: "",
      lightsOff: true,
      displayLabels: false,
      isEditingLayout: false,
      ...initialState,

      get asQMK() {
        return `const uint8_t PROGMEM rgb_matrix_led_map[][DRIVER_LED_TOTAL][${
          store.layerCount
        }] = {\n${store.layers
          .map((leds) => `   { ${leds.map(rgb2qmk).join(", ")} }`)
          .join(",\n")}\n};`
      },
      get isLayoutEmpty() {
        return store.layout.keys.length === 0
      },
      get isLayoutValid() {
        return !store.layoutError
      },
      setActiveColor(color) {
        store.activeColor = color
      },
      setActiveLayer(index) {
        store.activeLayer = index
      },
      toggleRGBColor(i) {
        if (store.layers[store.activeLayer][i] === store.activeColor) {
          store.layers[store.activeLayer][i] = color.hsv(0, 0, 0)
        } else {
          store.layers[store.activeLayer][i] = store.activeColor
        }
      },
      fillLayer(color) {
        store.layers[store.activeLayer].forEach((_, i) => {
          store.layers[store.activeLayer][i] = color
        })
      },
      toggleLabels() {
        store.displayLabels = !store.displayLabels
      },
      toggleLights() {
        store.lightsOff = !store.lightsOff
      },
      toggleEditingLayout() {
        store.isEditingLayout = !store.isEditingLayout
      },
      setInput(input, resetLayers = false) {
        store.input = input
        if (resetLayers) store.resetLayers()
      },
      get layout() {
        try {
          return tryParse(store.input)
        } catch (e) {
          store.layoutError = e.message
          return { meta: {}, keys: [] }
        }
      },
      resetLayers() {
        store.layers = range(store.layerCount).map(() => {
          return new Array(store.layout.keys.length).map(() =>
            color.hsv(0, 0, 0),
          )
        })
      },
      setLayerCount(count) {
        if (store.activeLayer >= count) {
          store.activeLayer = count - 1
        }

        if (count > store.layerCount) {
          store.activeLayer = count - 1
        }

        store.layers = range(count).map((l) => {
          return range(store.layout.keys.length).map(
            (i) =>
              (store.layers[l] && store.layers[l][i]) ?? color.hsv(0, 0, 0),
          )
        })
        store.layerCount = count
      },

      loadFile(e) {
        const [file] = e.target.files
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
          // handle KLE JSON(L)
          const result = tryParse(e.target.result)

          if (result.keys && result.keys.length === 0) {
            // handle VIA JSON
            const parsed = JSON.parse(e.target.result)
            if (parsed.layouts && parsed.layouts.keymap) {
              store.setInput(JSON.stringify(parsed.layouts.keymap), true)
            }
          } else {
            store.setInput(e.target.result, true)
          }
        }
        reader.readAsText(file)
      },
      async paste() {
        store.setInput(await navigator.clipboard.readText(), true)
      },
    }
  })

  autorun(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        input: store.input,
        layerCount: store.layerCount,
        layers: store.layers.map((layer) =>
          layer.map((x) => color(x).hsl().toString()),
        ),
        lightsOff: store.lightsOff,
        displayLabels: store.displayLabels,
      }),
    )
  })

  return (
    <div className="container flex flex-col mx-auto px-16 py-8 space-y-8 min-h-screen">
      <div className="flex space-x-1">
        <PanelButton as="label">
          <IcBaselineFolderOpen />
          <input type="file" hidden onChange={store.loadFile} />
        </PanelButton>

        <PanelButton onClick={store.paste}>
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
              store.setInput(e.target.value, false)
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
