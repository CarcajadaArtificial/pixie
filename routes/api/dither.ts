//   ___  _ _   _
//  |   \(_) |_| |_  ___ _ _
//  | |) | |  _| ' \/ -_) '_|
//  |___/|_|\__|_||_\___|_|
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *
 * @module
 */

import { Handlers } from '$fresh/server.ts';
import { getClosestColor, removeSpacesAndSplitByComma } from '../../utils.ts';

function splitArray<T>(array: T[], part: number): T[][] {
  const tmp = [];
  for (let i = 0; i < array.length; i += part) {
    tmp.push(array.slice(i, i + part));
  }
  return tmp;
}

type PatternSpread = {
  x: number;
  y: number;
  value: number;
};

type Patterns = {
  floydSteinberg: PatternSpread[];
};

const patterns: Patterns = {
  floydSteinberg: [
    {
      x: 1,
      y: 0,
      value: 7 / 16,
    },
    {
      x: -1,
      y: 1,
      value: 3 / 16,
    },
    {
      x: 0,
      y: 1,
      value: 5 / 16,
    },
    {
      x: 1,
      y: 1,
      value: 1 / 16,
    },
  ],
};

type ReqDither = {
  width: number;
  height: number;
  palette: string;
  colors: number[][];
  grays: number[][];
};

/**
 * @todo Create type for data object.
 */
export const handler: Handlers = {
  async POST(req, _ctx) {
    const { width, height, colors, grays, palette } =
      (await req.json()) as ReqDither;

    // Create pixel matrix
    const colorMatrix = splitArray<number[]>(colors, width);
    const grayMatrix = splitArray<number[]>(grays, width);

    // Create error matrix
    const colorErrorMatrix = splitArray<number[]>(
      new Array(width * height).fill([0, 0, 0]),
      width
    );
    const grayErrorMatrix = splitArray<number[]>(
      new Array(width * height).fill([0, 0, 0]),
      width
    );

    // Create result hex string array
    const resultColors: number[][] = [];
    const resultGrays: number[][] = [];

    // Iterate over every pixel in the matrix.
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        // Get the current pixel
        const colorPx = colorMatrix[i][j];
        const grayPx = grayMatrix[i][j];
        // Get the current error
        const colorErrorPx = colorErrorMatrix[i][j];
        const grayErrorPx = grayErrorMatrix[i][j];

        // Affect the current pixels value with the error.
        const alpha = colorPx[3];
        const gray = grayPx[0] + grayErrorPx[0];
        const colorR = colorPx[0] + colorErrorPx[0];
        const colorG = colorPx[1] + colorErrorPx[1];
        const colorB = colorPx[2] + colorErrorPx[2];

        // Look for the closest color in the palette
        const [closestGray, closestGrayError] = getClosestColor(
          [gray, gray, gray],
          ['#ffffff', '#000000']
        );
        const [closestColor, closestColorError] = getClosestColor(
          [colorR, colorG, colorB],
          removeSpacesAndSplitByComma(palette)
        );

        resultColors.push([
          closestColor[0],
          closestColor[1],
          closestColor[2],
          alpha,
        ]);
        resultGrays.push([
          closestGray[0],
          closestGray[1],
          closestGray[2],
          alpha,
        ]);

        // Spread the error according to the pattern
        patterns.floydSteinberg.forEach((spread) => {
          if (
            i + spread.y >= height ||
            j + spread.x >= width ||
            j + spread.x < 0
          )
            return;

          grayErrorMatrix[i + spread.y][j + spread.x][0] += closestGrayError[0];
          grayErrorMatrix[i + spread.y][j + spread.x][1] += closestGrayError[1];
          grayErrorMatrix[i + spread.y][j + spread.x][2] += closestGrayError[2];

          colorErrorMatrix[i + spread.y][j + spread.x][0] +=
            closestColorError[0];
          colorErrorMatrix[i + spread.y][j + spread.x][1] +=
            closestColorError[1];
          colorErrorMatrix[i + spread.y][j + spread.x][2] +=
            closestColorError[2];
        });
      }
    }

    // Create a dithering pattern framework.
    // Add the pattern object.
    // Create an error matrix where the error displacements are being stored.
    // Go through each pixel
    //    Add the corresponding error value to itself
    //    Calculate closest color and the difference becomes the new error
    //    Spread the new error in the matrix according to the pattern
    //    Repeat until no more pixel.

    return new Response(
      JSON.stringify({ colors: resultColors, grays: resultGrays })
    );
  },
};
