//    ___
//   / __|___ _ __  _ __ _ _ ___ ______
//  | (__/ _ \ '  \| '_ \ '_/ -_|_-<_-<
//   \___\___/_|_|_| .__/_| \___/__/__/
//                 |_|
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *
 * @module
 */

import { Handlers } from '$fresh/server.ts';
import {
  decodeImageFromUrl,
  convertBlobToBase64,
  cropImageFromContainedSize,
  pixelateCroppedImage,
  interpolateModeColor,
  interpolateGrayscale,
} from '../../src/back/image.ts';

/**
 * @todo Create type for data object.
 */
export const handler: Handlers = {
  async POST(req, _ctx) {
    const data = await req.json();
    const imageDecoded = await decodeImageFromUrl(data.url.toString());

    // Crops image
    const croppedImage = await cropImageFromContainedSize(
      imageDecoded!,
      data.width,
      data.height
    );
    const compressedColos = await pixelateCroppedImage(
      croppedImage,
      data.width,
      data.height,
      interpolateModeColor
    );
    const compressedGrays = await pixelateCroppedImage(
      croppedImage,
      data.width,
      data.height,
      interpolateGrayscale
    );

    // Converts cropped image to base 64 string.
    const imageEncoded = await croppedImage?.encode();
    const imageBase64 = await convertBlobToBase64(
      new Blob([await imageEncoded!.buffer])
    );

    // Return array of RGBA[] containing the pixel art svg with true colors.
    return new Response(
      JSON.stringify({
        src: imageBase64,
        compressedColos: compressedColos,
        compressedGrays: compressedGrays,
      })
    );
  },
};
