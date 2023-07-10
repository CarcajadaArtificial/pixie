import { calculatePixelColorError, findClosestColor } from './color.ts';
import { Pixel } from './image.ts';

/**
 * @todo [!!] Complete documentation
 */
const floydSteinberg = [
  {
    x: 1,
    y: 0,
    value: 7 / 16,
  },
  {
    x: -1,
    y: 1,
    value: 3 / 16,
  },
  {
    x: 0,
    y: 1,
    value: 5 / 16,
  },
  {
    x: 1,
    y: 1,
    value: 1 / 16,
  },
];

/**
 * @todo [!!] Complete documentation
 */
export function dither(pixels: Pixel[], width: number, height: number, palette: Pixel[]): Pixel[] {
  return pixels.map((pixel, index) => {
    if (pixel.a <= 0.01) {
      return {
        r: 0,
        g: 0,
        b: 0,
        a: 0,
      };
    }

    const closestColor = findClosestColor(pixel, palette);
    const errorPixel = calculatePixelColorError(pixel, closestColor);

    floydSteinberg.forEach((dither) => {
      const targetIndex = getIndexFromCoordinates(width, height, index, dither.x, dither.y);

      if (targetIndex) {
        pixels[targetIndex].r += errorPixel.r * dither.value;
        pixels[targetIndex].g += errorPixel.g * dither.value;
        pixels[targetIndex].b += errorPixel.b * dither.value;
      }
    });

    return closestColor;
  });
}

/**
 * This function translates the coordinate system of a one-dimensional array into the one of a two-dimensional array. It finds a new index based on (x, y) coordinate movement relative to a current index in the 1D array.
 *
 * ```
 * // #: Current index
 * // @: Returned index
 *
 * // Array on current iteration:
 * //  0  1
 * // [ ][o][ ][ ]-[ ][ ][ ][ ]-[ ][ ][ ][ ]-[ ][ ][ ][ ]-[ ][ ][ ][ ]
 * //     ^ currentIndex = 1
 *
 * getIndexfromCoordinates(width: 4, height: 5, currentIndex: 1, x: 1, y: 2);
 *
 * // 2D view:
 * // [ ][o][x][ ]
 * // [ ][ ][ ][ ]
 * // [ ][y][@][ ]
 * // [ ][ ][ ][ ]
 * // [ ][ ][ ][ ]
 *
 * // 1D view:
 * //  0  1  2  3   4  5  6  7   8  9  10
 * // [ ][o][ ][ ]-[ ][ ][ ][ ]-[ ][ ][@][ ]-[ ][ ][ ][ ]-[ ][ ][ ][ ]
 * //                       returns 10 ^
 * ```
 *
 * @param {number} width
 *  The dimensional width of the 2D Array.
 *
 * @param {number} height
 *  The dimensional height of the 2D Array.
 *
 * @param {number} currentIndex
 *  This function assumes that the 1D Array is being traversed using this index.
 *
 * @param {number} x
 *  The target index horizontal difference relative to `currentIndex`.
 *
 * @param {number} y
 *  The target index vertical difference relative to `currentIndex`.
 *
 * @returns {number | null}
 *  The target pixel's index on the 1D array.
 *
 */
function getIndexFromCoordinates(
  width: number,
  height: number,
  currentIndex: number,
  x: number,
  y: number
): number | null {
  if (isOutOfBounds(width, height, x, y)) {
    // Coordinates are out of bounds
    return null;
  }

  const currentX = currentIndex % width;
  const currentY = Math.floor(currentIndex / width);

  const targetX = currentX + x;
  const targetY = currentY + y;

  if (isOutOfBounds(width, height, targetX, targetY)) {
    // Target coordinates are out of bounds
    return null;
  }

  return targetY * width + targetX;
}

/** This function checks if a (x, y) point is out of bounds of a (w, h) size grid. */
const isOutOfBounds = (w: number, h: number, x: number, y: number): boolean =>
  x < 0 || x >= w || y < 0 || y >= h;
