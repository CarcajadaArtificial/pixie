/**
 *
 * @module
 */

import { Handlers } from '$fresh/server.ts';
import { decode, Image } from 'imagescript';

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

export async function decodeImageFromUrl(url: string): Promise<Image | null> {
  const imageFetch = await fetch(url, { method: 'GET' })
    .then(async (res) => await res.blob())
    .catch(() => null);

  if (!imageFetch) {
    return null;
  } else {
    return await decodeImageFromBuffer(await imageFetch.arrayBuffer());
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
      sum: image.width + image.height,
    };

    return new Response(JSON.stringify(response));
  },
};
