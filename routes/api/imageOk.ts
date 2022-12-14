//   ___                      ___  _
//  |_ _|_ __  __ _ __ _ ___ / _ \| |__
//   | || '  \/ _` / _` / -_) (_) | / /
//  |___|_|_|_\__,_\__, \___|\___/|_\_\
//                 |___/
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *
 * @module
 */

import { Handlers } from '$fresh/server.ts';
import { decodeImageFromUrl } from '../../src/back/image.ts';
import { getRecommendations } from '../../src/back/aspectRatio.ts';
import { Size } from '../../src/types.ts';

/**
 * @todo Create type for data object.
 */
export const handler: Handlers = {
  async POST(req, _ctx) {
    const data = await req.json();
    const image = await decodeImageFromUrl(data.url);

    if (!image) {
      const response = {
        ok: false,
      };
      return new Response(JSON.stringify(response));
    }

    const response: {
      ok: boolean;
      recommendations: Size[];
      width: number;
      height: number;
    } = {
      ok: true,
      recommendations: getRecommendations(image.width, image.height),
      width: image.width,
      height: image.height,
    };

    return new Response(JSON.stringify(response));
  },
};
