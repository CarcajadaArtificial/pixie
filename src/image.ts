import { Image } from 'imagescript';
import { ColorNames } from './palette.ts';

export type Pixel = {
  r: number;
  g: number;
  b: number;
  a: number;
  hex?: string;
  h?: number;
  s?: number;
  l?: number;
  neighbors?: ColorNames[];
};

/** This function splits an image into a grid of cropped square chunks. */
export function cropPixelChunks(image: Image, gridWidth: number, gridHeight: number): Image[] {
  const chunkSize = image.width / gridWidth;
  const chunkArray: Image[] = [];
  for (let j = 0; j < gridHeight; j++) {
    for (let i = 0; i < gridWidth; i++) {
      chunkArray.push(image.clone().crop(i * chunkSize, j * chunkSize, chunkSize, chunkSize));
    }
  }
  return chunkArray;
}
[].map;

/** This function calls a defined callback function on each Pixel of an Image, and returns an array that contains the results. It is an adaptation of Array.map(). */
export function imagePixelsMap<T>(image: Image, cb: (pixel: Pixel) => T): T[] {
  const [height, width] = [image.height, image.width];
  const mapResult: T[] = [];
  for (let x = 1; x <= width; x++) {
    for (let y = 1; y <= height; y++) {
      const pixel = Image.colorToRGBA(image.getPixelAt(x, y));
      mapResult.push(
        cb({
          r: pixel[0],
          g: pixel[1],
          b: pixel[2],
          a: pixel[3],
        })
      );
    }
  }
  return mapResult;
}

/** This function finds the average color in an Image. */
export const getAverageChunkColor = (chunk: Image): Pixel => {
  const avgPixel: Pixel = {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
  };

  imagePixelsMap(chunk, (pixel) => {
    avgPixel.a += pixel.a;
    avgPixel.r += pixel.r;
    avgPixel.g += pixel.g;
    avgPixel.b += pixel.b;
  });

  const pixelCount = chunk.width * chunk.height;
  avgPixel.a = avgPixel.a / pixelCount / 255;

  if (avgPixel.a <= 0.01) {
    return {
      r: 0,
      g: 0,
      b: 0,
      a: 0,
    };
  } else {
    avgPixel.r = Math.round(avgPixel.r / pixelCount);
    avgPixel.g = Math.round(avgPixel.g / pixelCount);
    avgPixel.b = Math.round(avgPixel.b / pixelCount);

    return avgPixel;
  }
};
