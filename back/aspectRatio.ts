//     _                    _   ___      _   _
//    /_\   ____ __  ___ __| |_| _ \__ _| |_(_)___
//   / _ \ (_-< '_ \/ -_) _|  _|   / _` |  _| / _ \
//  /_/ \_\/__/ .__/\___\__|\__|_|_\__,_|\__|_\___/
//            |_|
////////////////////////////////////////////////////////////////////////////////////////////////////////

import { Size } from '../types.ts';

/**
 * Static and arbitrary list of dimentions oriented to pixel art.
 */
const recommendedLengths = [
  8, 12, 16, 20, 24, 27, 34, 37, 39, 48, 54, 62, 75, 87, 144, 160, 224, 240,
  256, 320,
];

/**
 * This function helps to find how similar two ratios are to each other. Quantified by the difference between both ratios divided by the comparing one.
 * @param comparingRatio The ratio of the original image.
 * @param recommendedRatio The ratio of the current potential suggestion.
 * @returns The porcentual difference between the two ratios.
 */
function compareRatios(
  comparingRatio: number,
  recommendedRatio: number
): number {
  if (comparingRatio > recommendedRatio) {
    return Math.ceil(
      (Math.abs(comparingRatio - recommendedRatio) / comparingRatio) * 100
    );
  } else if (comparingRatio < recommendedRatio) {
    return Math.ceil(
      (Math.abs(comparingRatio - recommendedRatio) / comparingRatio) * 100
    );
  } else {
    return 0;
  }
}

/**
 * This function converts a width and height to a Size object.
 * @param comparingRatio If present, compares the calculated ratio to the main image's ratio.
 * @returns An object of type Size that contains all properties
 */
function calcRatio(
  width: number,
  height: number,
  comparingRatio?: number
): Size {
  return {
    width: width,
    height: height,
    ratio: width / height,
    difference: comparingRatio
      ? compareRatios(comparingRatio, width / height)
      : -1,
  };
}

/**
 * This function uses the `recommendedLengths` list to calculate all possible recommendations and their ratio difference to the comparingRatio.
 * @param comparingRatio The ratio of the original image.
 * @returns A list of Size ordered by difference and sliced to 20 items.
 */
function getRecommendedRectangularRatios(comparingRatio: number) {
  const recommendations: Size[] = [];
  recommendedLengths.forEach((startLength, startIndex) => {
    if (startIndex >= recommendedLengths.length - 1) {
      return;
    }
    recommendedLengths
      .slice(startIndex + 1)
      .forEach((endLength) =>
        recommendations.push(
          comparingRatio > 1
            ? calcRatio(endLength, startLength, comparingRatio)
            : calcRatio(startLength, endLength, comparingRatio)
        )
      );
  });
  return recommendations
    .sort((a, b) => a.difference - b.difference)
    .slice(0, 20);
}

/**
 * This function uses the `recommendedLengths` list to calculate all possibles square recommendations.
 * @param comparingLength The original image's side length, recommendations must not be larger than this.
 * @returns A static list of Size objects representing squares.
 */
function getRecommendedSquareRatios(comparingLength: number) {
  return recommendedLengths
    .map((recommendedLength) =>
      calcRatio(recommendedLength, recommendedLength, 1)
    )
    .filter((recommendedLength) => recommendedLength.width < comparingLength);
}

/**
 * Function that looks for size recommendations relative to the param's width and height.
 * @returns List of 20 Size object closest to the param's size.
 */
export function getRecommendations(width: number, height: number) {
  const comparingRatio = calcRatio(width, height);
  return comparingRatio.ratio === 1
    ? getRecommendedSquareRatios(width)
    : getRecommendedRectangularRatios(comparingRatio.ratio);
}
