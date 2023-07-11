import { calculatePixelColorError, findClosestColor } from './color.ts';
import { Pixel } from './image.ts';

export type DitheringStep = {
  x: number;
  y: number;
  value: number;
};

// prettier-ignore
/** Contains all dithering algorithms names */
export type DitheringAlgorithmNames = 'floyd_steinberg' | 'false_floyd_steinberg' | 'jarvis_judice_ninke' | 'stucki' | 'atkinson' | 'burkes' | 'sierra' | 'two_row_sierra' | 'sierra_lite';

// prettier-ignore
/** Contains the dithering algorithms schemas */
export const algorithms: { [key in DitheringAlgorithmNames]: DitheringStep[] } = {
  floyd_steinberg: [
    {   x: 1,     y: 0,     value: 7 / 16    },
    {   x: -1,    y: 1,     value: 3 / 16    },
    {   x: 0,     y: 1,     value: 5 / 16    },
    {   x: 1,     y: 1,     value: 1 / 16    },
  ],
  false_floyd_steinberg: [
    {   x: 1,     y: 0,     value: 3 / 8    },
    {   x: -1,    y: 1,     value: 3 / 8    },
    {   x: 0,     y: 1,     value: 2 / 8    },
  ],
  jarvis_judice_ninke: [
    {   x: 1,     y: 0,     value: 7 / 48   },
    {   x: 2,     y: 0,     value: 5 / 48   },
    {   x: -2,    y: 1,     value: 5 / 48   },
    {   x: -1,    y: 1,     value: 3 / 48   },
    {   x: 0,     y: 1,     value: 7 / 48   },
    {   x: 1,     y: 1,     value: 5 / 48   },
    {   x: 2,     y: 1,     value: 3 / 48   },
    {   x: -2,    y: 2,     value: 1 / 48   },
    {   x: -1,    y: 2,     value: 3 / 48   },
    {   x: 0,     y: 2,     value: 5 / 48   },
    {   x: 1,     y: 2,     value: 3 / 48   },
    {   x: 2,     y: 2,     value: 1 / 48   },
  ],
  stucki: [
    {   x: 1,     y: 0,     value: 8 / 42   },
    {   x: 2,     y: 0,     value: 4 / 42   },
    {   x: -2,    y: 1,     value: 2 / 42   },
    {   x: -1,    y: 1,     value: 4 / 42   },
    {   x: 0,     y: 1,     value: 8 / 42   },
    {   x: 1,     y: 1,     value: 4 / 42   },
    {   x: 2,     y: 1,     value: 2 / 42   },
    {   x: -2,    y: 2,     value: 1 / 42   },
    {   x: -1,    y: 2,     value: 2 / 42   },
    {   x: 0,     y: 2,     value: 4 / 42   },
    {   x: 1,     y: 2,     value: 2 / 42   },
    {   x: 2,     y: 2,     value: 1 / 42   },
  ],
  atkinson: [
    {   x: 1,     y: 0,     value: 1 / 8    },
    {   x: 2,     y: 0,     value: 1 / 8    },
    {   x: -1,    y: 1,     value: 1 / 8    },
    {   x: 0,     y: 1,     value: 1 / 8    },
    {   x: 1,     y: 1,     value: 1 / 8    },
    {   x: 0,     y: 2,     value: 1 / 8    },
  ],
  burkes: [
    {   x: 1,     y: 0,     value: 8 / 32   },
    {   x: 2,     y: 0,     value: 4 / 32   },
    {   x: -2,    y: 1,     value: 2 / 32   },
    {   x: -1,    y: 1,     value: 4 / 32   },
    {   x: 0,     y: 1,     value: 8 / 32   },
    {   x: 1,     y: 1,     value: 4 / 32   },
    {   x: 2,     y: 1,     value: 2 / 32   },
  ],
  sierra: [
    {   x: 1,     y: 0,     value: 5 / 32   },
    {   x: 2,     y: 0,     value: 3 / 32   },
    {   x: -2,    y: 1,     value: 2 / 32   },
    {   x: -1,    y: 1,     value: 4 / 32   },
    {   x: 0,     y: 1,     value: 5 / 32   },
    {   x: 1,     y: 1,     value: 4 / 32   },
    {   x: 2,     y: 1,     value: 2 / 32   },
    {   x: -1,    y: 2,     value: 2 / 32   },
    {   x: 0,     y: 2,     value: 3 / 32   },
    {   x: 1,     y: 2,     value: 2 / 32   },
  ],
  two_row_sierra: [
    {   x: 1,     y: 0,     value: 4 / 16   },
    {   x: 2,     y: 0,     value: 3 / 16   },
    {   x: -2,    y: 1,     value: 1 / 16   },
    {   x: -1,    y: 1,     value: 2 / 16   },
    {   x: 0,     y: 1,     value: 3 / 16   },
    {   x: 1,     y: 1,     value: 2 / 16   },
    {   x: 2,     y: 1,     value: 1 / 16   },
  ],
  sierra_lite: [
    {   x: 1,     y: 0,     value: 2 / 4    },
    {   x: -1,    y: 1,     value: 1 / 4    },
    {   x: 0,     y: 1,     value: 1 / 4    },
  ],
};

/**
 * @todo [!!] Complete documentation
 */
export const dither = (
  pixels: Pixel[],
  width: number,
  height: number,
  palette: Pixel[],
  algorithm: DitheringAlgorithmNames
): Pixel[] =>
  pixels.map((pixel, index) => {
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

    algorithms[algorithm].forEach((dither) => {
      const targetIndex = getIndexFromCoordinates(width, height, index, dither.x, dither.y);

      if (targetIndex) {
        pixels[targetIndex].r += errorPixel.r * dither.value;
        pixels[targetIndex].g += errorPixel.g * dither.value;
        pixels[targetIndex].b += errorPixel.b * dither.value;
      }
    });

    return closestColor;
  });

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
