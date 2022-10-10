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
export { Image } from 'https://deno.land/x/imagescript@v1.2.14/mod.ts';
import { mode, contain } from '../utils.ts';

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
    const imageBuffer = await imageFetch.arrayBuffer();
    const imageDecoded = await decode(imageBuffer);
    return imageDecoded instanceof Image ? imageDecoded : null;
  } else {
    return null;
  }
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
 * @param width
 * @param height
 * @returns
 */
export function getDominantColorsFromContainedImage(
  image: Image,
  width: number,
  height: number
): number[][] {
  const [imageHeight, imageWidth] = [image.height, image.width];
  const [containedHeight, containedWidth] = contain(
    width,
    height,
    imageWidth,
    imageHeight
  );
  const containCrop = image
    .clone()
    .crop(
      (imageWidth - containedWidth) / 2,
      (imageHeight - containedHeight) / 2,
      containedWidth,
      containedHeight
    );

  const [chunkHeight, chunkWidth] = [
    containCrop.height / height,
    containCrop.width / width,
  ];

  const dominantColors = [];

  for (let iHeight = 0; iHeight < height; iHeight++) {
    for (let iWidth = 0; iWidth < width; iWidth++) {
      const croppedChunk = containCrop
        .clone()
        .crop(
          chunkWidth * iWidth,
          chunkHeight * iHeight,
          chunkWidth,
          chunkHeight
        );

      dominantColors.push(getImageTrueColor(croppedChunk));
    }
  }

  return dominantColors;
}
