import { Handlers } from '$fresh/server.ts';
import { decodeImageFromUrl } from '../../src/decode.ts';
import { dither } from '../../src/dither.ts';
import { cropPixelChunks, getAverageChunkColor, Pixel } from '../../src/image.ts';
import { createPalette } from '../../src/palette.ts';

export type convert_request = {
  url: string;
  pixelartWidth: number;
  pixelartHeight: number;
};

export type convert_response = {
  ok: boolean;
  pixels: Pixel[];
};

/**
 * @todo [!!] Complete documentation
 */
export const handler: Handlers = {
  async POST(req, _ctx) {
    const { url, pixelartWidth, pixelartHeight } = (await req.json()) as convert_request;

    const image = await decodeImageFromUrl(url);

    if (!image) {
      const response = {
        ok: false,
        width: null,
        height: null,
        sum: null,
      };
      return new Response(JSON.stringify(response));
    }

    const pixels = cropPixelChunks(image, pixelartWidth, pixelartHeight).map<Pixel>((chunk) =>
      getAverageChunkColor(chunk)
    );

    const response: convert_response = {
      ok: true,
      pixels: dither(
        pixels,
        pixelartWidth,
        pixelartHeight,
        createPalette([
          'blanco',
          'papel',
          'plata',
          'acero',
          'hierro',
          'grafito',
          'chapopote',
          'obsidiana',
        ])
      ),
    };

    return new Response(JSON.stringify(response));
  },
};
