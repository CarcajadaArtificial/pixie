import { Pixel } from './image.ts';

/**
 * @todo [!!] Complete documentation
 */
export function calculatePixelColorError(basePixel: Pixel, correctPixel: Pixel): Pixel {
  return {
    r: basePixel.r - correctPixel.r,
    g: basePixel.g - correctPixel.g,
    b: basePixel.b - correctPixel.b,
    a: 1,
  };
}

/**
 * @todo [!!] Complete documentation
 */
export function findClosestColor(baseColor: Pixel, palette: Pixel[]): Pixel {
  let minDistance = Infinity;
  let closestColor = baseColor;

  palette.forEach((color) => {
    const distance = calculateColorDistance(baseColor, color);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color;
    }
  });

  return closestColor;
}

/**
 * @todo [!!] Complete documentation
 */
function calculateColorDistance(color1: Pixel, color2: Pixel): number {
  const rDiff = color1.r - color2.r;
  const gDiff = color1.g - color2.g;
  const bDiff = color1.b - color2.b;

  // Euclidean distance formula
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}
