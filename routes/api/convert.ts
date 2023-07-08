/**
 *
 * @module
 */

import { Handlers } from '$fresh/server.ts';
import { decode, Image } from 'https://deno.land/x/imagescript@v1.2.14/mod.ts';
import { rs } from '../../ffi.ts';

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
      width: number;
      height: number;
      sum: number;
    } = {
      ok: true,
      width: image.width,
      height: image.height,
      sum: rs.add(image.width, image.height),
    };

    return new Response(JSON.stringify(response));
  },
};
