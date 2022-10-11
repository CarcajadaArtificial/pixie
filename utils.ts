//   _   _ _   _ _ _ _
//  | | | | |_(_) (_) |_ ___ ___
//  | |_| |  _| | | |  _/ -_|_-<
//   \___/ \__|_|_|_|\__\___/__/
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *
 * @module
 */

/**
 *
 * @param hexValue
 * @returns
 */
export const isValidHexColor = (hexValue: string) =>
  /^#([0-9a-f]{3}){1,2}$/i.test(hexValue);

/**
 *
 * @param csvString
 * @returns
 */
export const removeSpacesAndSplitByComma = (csvString: string) =>
  csvString.replace(/\s/g, '').split(',');

/**
 *
 * @param imageWidth
 * @param imageHeight
 * @param areaWidth
 * @param areaHeight
 * @returns
 */
export function contain(
  imageWidth: number,
  imageHeight: number,
  areaWidth: number,
  areaHeight: number
) {
  const imageRatio = imageWidth / imageHeight;
  return imageRatio >= areaWidth / areaHeight
    ? [areaWidth, Math.floor(areaWidth / imageRatio)]
    : [Math.floor(areaHeight * imageRatio), areaHeight];
}

/**
 *
 * @param numerator
 * @param denominator
 * @returns
 */
export function reduce(
  numerator: number,
  denominator: number
): [number, number] {
  let a = numerator;
  let b = denominator;
  let c;
  while (b) {
    c = a % b;
    a = b;
    b = c;
  }
  return [numerator / a, denominator / a];
}

/**
 *
 * @param arr
 * @returns
 */
export function mode(arr: string[]): string {
  const obj: {
    [key: string]: number;
  } = {};
  let mostFreq = 0;
  let which: string[] = [];

  arr.forEach((ea) => {
    if (!obj[ea]) {
      obj[ea] = 1;
    } else {
      obj[ea]++;
    }

    if (obj[ea] > mostFreq) {
      mostFreq = obj[ea];
      which = [ea];
    } else if (obj[ea] === mostFreq) {
      which.push(ea);
    }
  });

  return which[0];
}

/**
 *
 * @param hex
 * @returns
 */
const hexToRgb = (hex: string) =>
  hex
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (_m, r, g, b) => '#' + r + r + g + g + b + b
    )
    .substring(1)
    .match(/.{2}/g)!
    .map((x) => parseInt(x, 16));

/**
 *
 * @param mainRgb
 * @param colorList
 * @returns
 */
export function getClosestColor(
  mainRgb: number[],
  colorList: string[]
): number[] {
  const rgbColorList = colorList.map((color) => hexToRgb(color));

  const colorDifferenceList = rgbColorList.map((color) =>
    Math.floor(
      Math.sqrt(
        Math.pow(mainRgb[0] - color[0], 2) +
          Math.pow(mainRgb[1] - color[1], 2) +
          Math.pow(mainRgb[2] - color[2], 2)
      )
    )
  );

  const closestRgb = hexToRgb(
    colorList[
      colorDifferenceList.indexOf(Math.min.apply(Math, colorDifferenceList))
    ]
  );

  return [...closestRgb, mainRgb[3]];
}
