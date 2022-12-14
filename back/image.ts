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
