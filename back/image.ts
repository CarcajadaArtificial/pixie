//   ___                                _      _
//  |_ _|_ __  __ _ __ _ ___ ___ __ _ _(_)_ __| |_
//   | || '  \/ _` / _` / -_|_-</ _| '_| | '_ \  _|
//  |___|_|_|_\__,_\__, \___/__/\__|_| |_| .__/\__|
//                 |___/                 |_|
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *
 * @module
 */

import { decode, Image } from 'https://deno.land/x/imagescript@v1.2.14/mod.ts';
import { mode } from '../utils.ts';

// -----------------------------------------------------------------------------------------------------
// Image format conversion functions
// -----------------------------------------------------------------------------------------------------
/**
 *
 * @param url
 * @returns
 */
export async function decodeImageFromBuffer(
  buffer: ArrayBuffer
): Promise<Image | null> {
  try {
    const imageDecoded = await decode(buffer);
    return imageDecoded instanceof Image ? imageDecoded : null;
  } catch (_error) {
    return null;
  }
}

/**
 *
 * @param url
 * @returns
 */
export async function decodeImageFromUrl(url: string): Promise<Image | null> {
  const imageFetch = await fetch(url, { method: 'GET' })
    .then(async (res) => await res.blob())
    .catch(() => null);

  if (imageFetch) {
    return decodeImageFromBuffer(await imageFetch.arrayBuffer());
  } else {
    return null;
  }
}

/**
 *
 * @param blob
 * @returns
 */
export function convertBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(typeof reader.result === 'string' ? reader.result : '');
    };
    reader.readAsDataURL(blob);
  });
}

// -----------------------------------------------------------------------------------------------------
// Image interpolation algorithms for compression.
// -----------------------------------------------------------------------------------------------------
/**
 * @todo Better desaturator than the average or the max of the three rbg values.
 * @param image
 * @param alphaThreshold
 * @returns
 */
export function interpolateGrayscale(
  image: Image,
  alphaThreshold = 50
): number[] {
  const [height, width] = [image.height, image.width];
  let averageAlpha = 0;

  const grays = imagePixelsMap<number | null>(image, (pixel) => {
    averageAlpha += pixel[3];
    if (pixel[3] > alphaThreshold) {
      return (pixel[0] + pixel[1] + pixel[2]) / 3;
    }
    return null;
  });

  averageAlpha = averageAlpha / (height * width) / 255;

  const filteredGrays = grays.filter((color) => color !== null) as number[];
  if (filteredGrays.length === 0) {
    return [0, 0, 0, averageAlpha];
  }
  const averageGray =
    filteredGrays.reduce((a, b) => a + b, 0) / filteredGrays.length;

  return [averageGray, averageGray, averageGray, averageAlpha];
}

/**
 * This function interpolates an image to it's most popular RGB color. Then it looks for the average pixel alpha to return a rgba value.
 *
 * @param alphaThreshold This must be a number between 0 and 255. States the minimum alpha a pixel must have to count for the mode. Any pixel more transparent than this will not have its rbg values count.
 *
 * @returns Array of numbers `[r, g, b, a]`
 */
export function interpolateModeColor(
  image: Image,
  alphaThreshold = 50
): number[] {
  const [height, width] = [image.height, image.width];
  let averageAlpha = 0;

  const colors = imagePixelsMap<string | null>(image, (pixel) => {
    averageAlpha += pixel[3];
    if (pixel[3] > alphaThreshold) {
      return `${pixel[0]} ${pixel[1]} ${pixel[2]}`;
    }
    return null;
  }).filter((color) => color !== null) as string[];

  const dominantColor =
    colors.length > 0
      ? mode(colors)
          .split(' ')
          .map((stringColor) => parseInt(stringColor))
      : [0, 0, 0];
  return [...dominantColor, averageAlpha / (height * width) / 255];
}

/**
 * @deprecated Couldn't get it to work, when using a .png with transparent backgrounds, I found an aura around the foreground image made out of wierd and random colors.
 *
 * This function uses the `Image.averageColor()` function from imagescript to interpolate an image to a single color.
 *
 * @param image
 * @returns Array of numbers `[r, g, b, a]`
 */
export function interpolateImagescriptAverageColor(image: Image): number[] {
  const alphaArray = imagePixelsMap<number>(image, (pixel) => pixel[3]);
  const alphaAverage =
    alphaArray.reduce((a, b) => a + b, 0) / alphaArray.length / 255;
  return [...Image.colorToRGB(image.averageColor()), alphaAverage];
}

/**
 * @deprecated Couldn't get it to work, the image gets black spots in wierd and random places.
 *
 * This function uses the `Image.dominantColor()` function from imagescript to interpolate an image to a single color.
 *
 * @param image
 * @returns Array of numbers `[r, g, b, a]`
 */
export function interpolateImagescriptDominantColor(image: Image): number[] {
  const alphaArray = imagePixelsMap<number>(image, (pixel) => pixel[3]);
  const alphaAverage =
    alphaArray.reduce((a, b) => a + b, 0) / alphaArray.length / 255;
  return [...Image.colorToRGB(image.dominantColor()), alphaAverage];
}

/**
 * @deprecated Result is acceptable but outclassed by `interpolateModeColor()`.
 *
 * This function resizes an image using the `Image.resize(1, 1)` function from imagescript. Resulting in a 1x1 pixel image.
 *
 * @returns The single-pixel image's color as an array of numbers. `[r, g, b, a]`
 */
export function interpolateImagescriptResizeColor(image: Image): number[] {
  const colors = Image.colorToRGBA(image.resize(1, 1).getPixelAt(1, 1));
  return [...colors.splice(0, 3), colors[0] / 255];
}

// -----------------------------------------------------------------------------------------------------
// Functions that aid in the correct production images.
// -----------------------------------------------------------------------------------------------------
/**
 *
 * @param image
 * @param cb
 * @returns
 */
export function imagePixelsMap<T>(
  image: Image,
  cb: (pixel: number[]) => T
): T[] {
  const [height, width] = [image.height, image.width];
  const mapResult: T[] = [];
  for (let i = 1; i <= width; i++) {
    for (let j = 1; j <= height; j++) {
      const pixel = Image.colorToRGBA(image.getPixelAt(i, j));
      mapResult.push(cb(pixel));
    }
  }
  return mapResult;
}

/**
 *
 * @param image
 * @param inputWidth
 * @param inputHeight
 */
export function cropImageFromContainedSize(
  image: Image,
  inputWidth: number,
  inputHeight: number
): Promise<Image> {
  return new Promise((resolve) => {
    const [decodedWidth, decodedHeight]: [number, number] = [
      image.width!,
      image.height!,
    ];

    // Contains the input size in the image.
    const precontainedImage = new Image(inputWidth, inputHeight);
    const containedImage = precontainedImage?.contain(
      decodedWidth,
      decodedHeight
    );
    const [containedWidth, containedHeight] = [
      containedImage.width,
      containedImage.height,
    ];

    // Crops the image to the contained image's size, centered vertically and horizontally.
    if (decodedHeight === containedHeight && decodedWidth > containedWidth) {
      // Vertical crop
      const centeringMove = (decodedWidth - containedWidth) / 2;
      image.crop(centeringMove, 0, containedWidth, containedHeight);
    } else if (
      decodedWidth === containedWidth &&
      decodedHeight > containedHeight
    ) {
      // Horizontal crop
      const centeringMove = (decodedHeight - containedHeight) / 2;
      image.crop(0, centeringMove, containedWidth, containedHeight);
    } else if (
      decodedWidth === containedWidth &&
      decodedHeight === containedHeight
    ) {
      // No crop
    } else {
      // Wtf
    }

    resolve(image);
  });
}

/**
 *
 * @param image
 * @param pixelsWidth
 * @param pixelsHeight
 */
export async function pixelateCroppedImage(
  image: Image,
  pixelsWidth: number,
  pixelsHeight: number,
  compressionCb: (image: Image) => number[]
) {
  const chunkSize = image.width / pixelsWidth;
  const pixelColors: number[][] = [];

  for (let i = 0; i < pixelsHeight; i++) {
    for (let j = 0; j < pixelsWidth; j++) {
      pixelColors.push(
        compressionCb(
          await image
            .clone()
            .crop(j * chunkSize, i * chunkSize, chunkSize, chunkSize)
        )
      );
    }
  }

  return pixelColors;
}
