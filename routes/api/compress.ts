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
  getDominantColorsFromContainedImage,
  Image,
} from '../../back/image.ts';
import { removeSpacesAndSplitByComma } from '../../utils.ts';

interface res {
  colors: number[][];
}

export const handler: Handlers = {
  async POST(req, _ctx) {
    const response = {
      colors: [],
    } as res;

    const data = await req.formData();
    const [dataUrl, dataHeight, dataWidth, dataPalette] = [
      data.get('url'),
      data.get('height'),
      data.get('width'),
      data.get('palette'),
    ];

    if (dataUrl && dataHeight && dataWidth && dataPalette) {
      const [url, height, width, palette] = [
        dataUrl.toString(),
        parseInt(dataHeight.toString()),
        parseInt(dataWidth.toString()),
        removeSpacesAndSplitByComma(dataPalette.toString()),
      ];
      const image = await decodeImageFromUrl(url.toString());

      if (image) {
        console.log(Image.colorToRGBA(image.getPixelAt(1, 1)));
        const dominantColors = getDominantColorsFromContainedImage(
          image,
          width,
          height
        );
        response.colors = dominantColors;
      } else {
        // Respond an error decoding image
      }
    } else {
      // Respond an error getting form data
    }

    return new Response(JSON.stringify(response));
  },
};
