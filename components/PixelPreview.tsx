//   ___ _         _   ___             _
//  | _ (_)_ _____| | | _ \_ _ _____ _(_)_____ __ __
//  |  _/ \ \ / -_) | |  _/ '_/ -_) V / / -_) V  V /
//  |_| |_/_\_\___|_| |_| |_| \___|\_/|_\___|\_/\_/
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @module
 */

import { JSX, Ref } from "preact";
import { applyDefaults } from "../deps.ts";

interface PixelPreview extends JSX.HTMLAttributes<SVGSVGElement> {
  colors: number[][];
  width: number;
  height: number;
  refSvg?: Ref<SVGSVGElement>;
}

/**
 * @todo Fix issue with vertical images.
 */
export default function PixelPreview(props: Partial<PixelPreview>) {
  const { colors, refSvg, height, width, ...svgProps } = applyDefaults<
    PixelPreview
  >({
    colors: [[0, 0, 0, 0]],
    height: 0,
    width: 0,
  }, props);

  return (
    <svg
      {...svgProps}
      height="100%"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${height} ${width}`}
      shape-rendering="crispEdges"
      ref={refSvg}
    >
      {height === 0 || width === 0 ? null : colors.map((color, index) => (
        <rect
          width={1}
          height={1}
          fill={`rgba(${Math.round(color[0])},${Math.round(color[1])},${
            Math.round(color[2])
          },${color[3].toFixed(2)})`}
          x={index % width}
          y={Math.floor(index / width)}
        />
      ))}
    </svg>
  );
}
