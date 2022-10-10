//   ___ _         _   ___             _
//  | _ (_)_ _____| | | _ \_ _ _____ _(_)_____ __ __
//  |  _/ \ \ / -_) | |  _/ '_/ -_) V / / -_) V  V /
//  |_| |_/_\_\___|_| |_| |_| \___|\_/|_\___|\_/\_/
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @module
 */

interface PixelPreview {
  colors: number[][];
  multiplier: number;
}

export default function PixelPreview(props: PixelPreview) {
  const sqrt = Math.sqrt(props.colors.length);
  const mul = Math.floor(1 / sqrt * props.multiplier);

  return (
    <svg
      height={sqrt * mul}
      width={sqrt * mul}
      xmlns="http://www.w3.org/2000/svg"
    >
      {props.colors.map((color, index) => (
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
