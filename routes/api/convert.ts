import { Handlers } from '$fresh/server.ts';
import { decodeImageFromUrl } from '../../src/decode.ts';
import { dither, DitheringAlgorithmNames } from '../../src/dither.ts';
import { cropPixelChunks, getAverageChunkColor, Pixel } from '../../src/image.ts';
import { createPalette } from '../../src/palette.ts';

/** The request data object for the `convert` service. */
export type convertReq = {
  /** This url will be fetched and decoded using `imagescript` */
  url: string;
  /** Amount of "pixels" that fit horizontally in the resulting SVG.  */
  pixelartWidth: number;
  /** Amount of "pixels" that fit vertically in the resulting SVG.  */
  pixelartHeight: number;
  /** */
  algorithm: DitheringAlgorithmNames;
};

/** The response data object for the `convert` service. */
export type convertRes = {
  /** True if everything went well, false if anything went wrong. */
  ok: boolean;
  /** The "pixels" make up the resulting SVG. */
  pixels: Pixel[];
};

/**
 * This service converts an image URL into a SVG dithered pixel art with certain dimensions.
 *
 * * This is a temporary service. In the future of this app, this service will become deprecated in
 *    favor of ones with more specific uses. *
 */
export const handler: Handlers = {
  async POST(req, _ctx) {
    const { url, pixelartWidth, pixelartHeight, algorithm } = (await req.json()) as convertReq;

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

    const response: convertRes = {
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
        ]),
        algorithm
      ),
    };

    return new Response(JSON.stringify(response));
  },
};
