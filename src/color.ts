import { Pixel } from './image.ts';

/**
 * During the dithering process, it is important to quantify exactly how different is a color from its
 * closest neighbor.
 *
 * @returns {Pixel}
 *  The difference in red, green and blue values, with an alpha of 100%
 */
export function calculatePixelColorError(base: Pixel, compare: Pixel): Pixel {
  return {
    r: base.r - compare.r,
    g: base.g - compare.g,
    b: base.b - compare.b,
    a: 1,
  };
}

/**
 * This function looks for the closest color in a list to a base pixel.
 *
 * @returns {Pixel}
 *  The closest color to `base`.
 */
export function findClosestColor(base: Pixel, palette: Pixel[]): Pixel {
  let minDistance = Infinity;
  let closestColor = base;

  palette.forEach((color) => {
    const distance = calculateColorDistance(base, color);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color;
    }
  });

  return closestColor;
}

/** Finds the euclidean distance between two colors. */
function calculateColorDistance(clrA: Pixel, clrB: Pixel): number {
  const rDiff = clrA.r - clrB.r;
  const gDiff = clrA.g - clrB.g;
  const bDiff = clrA.b - clrB.b;

  // Euclidean distance formula
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}
