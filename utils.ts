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
