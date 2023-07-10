/**
 *
 * @module
 */

import { Handlers } from '$fresh/server.ts';
import { decode, Image } from 'https://deno.land/x/imagescript@v1.2.14/mod.ts';

/**
 *
 * @param url
 * @returns
 */
export async function decodeImageFromBuffer(buffer: ArrayBuffer): Promise<Image | null> {
  try {
    const imageDecoded = await decode(buffer);
    return imageDecoded instanceof Image ? imageDecoded : null;
  } catch (_error) {
    return null;
  }
}

/**
 * @todo Create type for data object.
 */
export const handler: Handlers = {
  async POST(req, _ctx) {
    const data = await req.json();

    const imageFetch = await fetch(data.url, { method: 'GET' })
      .then(async (res) => await res.blob())
      .catch(() => null);

    if (!imageFetch) {
      const response = {
        ok: false,
      };
      return new Response(JSON.stringify(response));
    }

    const imageBuffer = await imageFetch.arrayBuffer();
    console.log(imageBuffer.slice(0));
    const image = await decodeImageFromBuffer(imageBuffer);

    if (!image) {
      const response = {
        ok: false,
      };
      return new Response(JSON.stringify(response));
    }

    const response: {
      ok: boolean;
      width: number;
      height: number;
      sum: number;
    } = {
      ok: true,
      width: image.width,
      height: image.height,
      sum: image.width + image.height,
    };

    return new Response(JSON.stringify(response));
  },
};
