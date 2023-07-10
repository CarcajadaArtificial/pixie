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
 * @todo [!!] Complete documentation
 */
function getIndexFromCoordinates(
  width: number,
  height: number,
  currentIndex: number,
  x: number,
  y: number
): number | null {
  if (x < 0 || x >= width || y < 0 || y >= height) {
    // Coordinates are out of bounds
    return null;
  }

  const currentX = currentIndex % width;
  const currentY = Math.floor(currentIndex / width);

  const targetX = currentX + x;
  const targetY = currentY + y;

  if (targetX < 0 || targetX >= width || targetY < 0 || targetY >= height) {
    // Target coordinates are out of bounds
    return null;
  }

  return targetY * width + targetX;
}
