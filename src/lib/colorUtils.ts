import chroma from "chroma-js";
import nearestColor from "nearest-color";
import { colornames } from "color-name-list";

let _getColorName: ReturnType<typeof nearestColor.from>;
export function getColorName(hex: string) {
  if (!_getColorName) {
    _getColorName = nearestColor.from(
      colornames.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {})
    );
  }

  return _getColorName(hex)?.name || "";
}
