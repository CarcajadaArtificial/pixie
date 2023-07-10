import { Handlers } from '$fresh/server.ts';
import { decodeImageFromUrl } from '../../src/decode.ts';
import { cropPixelChunks, imagePixelsMap, Pixel } from '../../src/image.ts';

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
 * @todo [!!] Create type for data object.
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

    const pixels = cropPixelChunks(image, pixelartWidth, pixelartHeight).map<Pixel>((chunk) => {
      let avgGrey = 0;
      let avgRed = 0;
      let avgGreen = 0;
      let avgBlue = 0;
      let avgAlpha = 0;

      imagePixelsMap(chunk, (pixel) => {
        avgAlpha += pixel.a;
        avgGrey += (pixel.r + pixel.g + pixel.b) / 3;
        avgRed += pixel.r;
        avgGreen += pixel.g;
        avgBlue += pixel.b;
      });

      const pixelCount = chunk.width * chunk.height;
      avgAlpha = avgAlpha / pixelCount / 255;

      if (avgAlpha <= 0.01) {
        return {
          r: 0,
          g: 0,
          b: 0,
          a: 0,
        };
      } else {
        avgGrey = Math.round(avgGrey / pixelCount);
        avgRed = Math.round(avgRed / pixelCount);
        avgGreen = Math.round(avgGreen / pixelCount);
        avgBlue = Math.round(avgBlue / pixelCount);

        return {
          r: avgRed,
          g: avgGreen,
          b: avgBlue,
          a: avgAlpha,
        };
      }
    });

    const response: convert_response = {
      ok: true,
      pixels: pixels,
    };

    return new Response(JSON.stringify(response));
  },
};
