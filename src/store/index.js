import { range } from "lodash";
import { rgb2qmk, tryParse } from "../helpers/utils";
import { COLORS, LOCAL_STORAGE_KEY } from "../helpers/constants";
import color from 'color'

export function createStore() {
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

    get asQMK() {
      return `const uint8_t PROGMEM rgb_matrix_led_map[][DRIVER_LED_TOTAL][${
        this.layerCount
      }] = {\n${this.layers
        .map((leds) => `   { ${leds.map(rgb2qmk).join(", ")} }`)
        .join(",\n")}\n};`;
    },
    get isLayoutEmpty() {
      return this.layout.keys.length === 0 || this.layers.length == 0;
    },
    get isLayoutValid() {
      return !this.layoutError;
    },
    setActiveColor(color) {
      this.activeColor = color;
    },
    setActiveLayer(index) {
      this.activeLayer = index;
    },
    toggleRGBColor(i) {
      if (this.layers[this.activeLayer][i] === this.activeColor) {
        this.layers[this.activeLayer][i] = color.hsv(0, 0, 0);
      } else {
        this.layers[this.activeLayer][i] = this.activeColor;
      }
    },
    fillLayer(color) {
      this.layers[this.activeLayer].forEach((_, i) => {
        this.layers[this.activeLayer][i] = color;
      });
    },
    toggleLabels() {
      this.displayLabels = !this.displayLabels;
    },
    toggleLights() {
      this.lightsOff = !this.lightsOff;
    },
    toggleEditingLayout() {
      this.isEditingLayout = !this.isEditingLayout;
    },
    setInput(input) {
      this.input = input;
      this.resetLayers();
    },
    get layout() {
      try {
        return tryParse(this.input);
      } catch (e) {
        this.layoutError = e.message;
        return { meta: {}, keys: [] };
      }
    },
    resetLayers() {
      this.layers = range(this.layerCount).map(() => {
        return new Array(this.layout.keys.length).map(() =>
          color.hsv(0, 0, 0)
        );
      });
    },
    setLayerCount(count) {
      if (this.activeLayer >= count) {
        this.activeLayer = count - 1;
      }

      if (count > this.layerCount) {
        this.activeLayer = count - 1;
      }

      this.layers = range(count).map((l) => {
        return range(this.layout.keys.length).map(
          (i) => (this.layers[l] && this.layers[l][i]) ?? color.hsv(0, 0, 0)
        );
      });
      this.layerCount = count;
    },

    loadFile(e) {
      const [file] = e.target.files;
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        // handle KLE JSON(L)
        const result = tryParse(e.target.result);

        if (result.keys && result.keys.length === 0) {
          // handle VIA JSON
          const parsed = JSON.parse(e.target.result);
          if (parsed.layouts && parsed.layouts.keymap) {
            this.setInput(JSON.stringify(parsed.layouts.keymap));
          }
        } else {
          this.setInput(e.target.result);
        }
      };
      reader.readAsText(file);
    },
    async paste() {
      this.setInput(await navigator.clipboard.readText());
    },
    restoreState(){
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (data) {
        Object.assign(this, JSON.parse(data))
      }
    },
    persistState(){
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          input: this.input,
          layerCount: this.layerCount,
          layers: this.layers.map((layer) =>
            layer.map((x) => color(x).hsl().toString()),
          ),
          lightsOff: this.lightsOff,
          displayLabels: this.displayLabels,
        }),
      )
    }
  };
}
