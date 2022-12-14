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

/**
 *
 * @param image
 * @returns
 */
function getImageTrueColor(image: Image): number[] {
  const [height, width] = [image.height, image.width];
  let avg = 0;
  const colors = [];
  for (let i = 1; i <= width; i++) {
    for (let j = 1; j <= height; j++) {
      const pixel = Image.colorToRGBA(image.getPixelAt(i, j));
      avg += pixel[3];
      if (pixel[3] > 50) {
        colors.push(`${pixel[0]} ${pixel[1]} ${pixel[2]}`);
      }
    }
  }
  const dominantColor =
    colors.length > 0
      ? mode(colors)
          .split(' ')
          .map((stringColor) => parseInt(stringColor))
      : [0, 0, 0];
  return [...dominantColor, avg / (height * width) / 255];
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

    // Crops the image
    const precontainedImage = new Image(inputWidth, inputHeight);
    const containedImage = precontainedImage?.contain(
      decodedWidth,
      decodedHeight
    );
    const [containedWidth, containedHeight] = [
      containedImage.width,
      containedImage.height,
    ];

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
  pixelsHeight: number
) {
  const chunkSize = image.width / pixelsWidth;
  const pixelColors: number[][] = [];

  for (let i = 0; i < pixelsHeight; i++) {
    for (let j = 0; j < pixelsWidth; j++) {
      pixelColors.push(
        getImageTrueColor(
          await image
            .clone()
            .crop(j * chunkSize, i * chunkSize, chunkSize, chunkSize)
        )
      );
    }
  }

  return pixelColors;
}
