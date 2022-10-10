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
import { decodeImageFromUrl } from '../../back/image.ts';

export const handler: Handlers = {
  async POST(req, _ctx) {
    const data = await req.json();
    const image = await decodeImageFromUrl(data.url);
    const response = { ok: true };

    if (!image) {
      response.ok = false;
    }
    return new Response(JSON.stringify(response));
  },
};
