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
  multiplier: number;
}

export default function PixelPreview(props: Partial<PixelPreview>) {
  const { colors, multiplier, ...svgProps } = applyDefaults<PixelPreview>({
    colors: [],
    multiplier: 100,
  }, props);
  const sqrt = Math.sqrt(colors.length);
  const mul = Math.floor(1 / sqrt * multiplier);

  return (
    <svg
      {...svgProps}
      height={sqrt * mul}
      width={sqrt * mul}
      xmlns="http://www.w3.org/2000/svg"
    >
      {colors.map((color, index) => (
        <rect
          width={1 * mul}
          height={1 * mul}
          fill={`rgba(${color[0]},${color[1]},${color[2]},${
            color[3].toFixed(2)
          })`}
          x={(index % sqrt) * mul}
          y={Math.floor(index / sqrt) *
            mul}
        />
      ))}
    </svg>
  );
}
