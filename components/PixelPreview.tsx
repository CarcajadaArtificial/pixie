//   ___ _         _   ___             _
//  | _ (_)_ _____| | | _ \_ _ _____ _(_)_____ __ __
//  |  _/ \ \ / -_) | |  _/ '_/ -_) V / / -_) V  V /
//  |_| |_/_\_\___|_| |_| |_| \___|\_/|_\___|\_/\_/
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @module
 */

import { JSX } from "preact";
import { applyDefaults } from "../deps.ts";

interface PixelPreview extends JSX.HTMLAttributes<SVGSVGElement> {
  colors: number[][];
  width: number;
  height: number;
  multiplier: number;
}

export default function PixelPreview(props: Partial<PixelPreview>) {
  const { colors, height, width, multiplier, ...svgProps } = applyDefaults<
    PixelPreview
  >({
    colors: [[0, 0, 0, 0]],
    multiplier: 10,
    height: 0,
    width: 0,
  }, props);

  return (
    <svg
      {...svgProps}
      height={height * multiplier}
      width={width * multiplier}
      xmlns="http://www.w3.org/2000/svg"
    >
      {height === 0 || width === 0 ? null : colors.map((color, index) => (
        <rect
          width={1 * multiplier}
          height={1 * multiplier}
          fill={`rgba(${color[0]},${color[1]},${color[2]},${
            color[3].toFixed(2)
          })`}
          x={(index % width) * multiplier}
          y={Math.floor(index / width) * multiplier}
        />
      ))}
    </svg>
  );
}
