import { Image } from 'imagescript';

export type Pixel = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export function cropPixelChunks(image: Image, width: number, height: number): Image[] {
  const chunkSize = image.width / width;
  const chunkArray: Image[] = [];
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      chunkArray.push(image.clone().crop(i * chunkSize, j * chunkSize, chunkSize, chunkSize));
    }
  }
  return chunkArray;
}

export function imagePixelsMap<T>(image: Image, cb: (pixel: Pixel) => T): T[] {
  const [height, width] = [image.height, image.width];
  const mapResult: T[] = [];
  for (let x = 1; x <= width; x++) {
    for (let y = 1; y <= height; y++) {
      const pixel = Image.colorToRGBA(image.getPixelAt(x, y));
      mapResult.push(
        cb({
          r: pixel[0],
          g: pixel[1],
          b: pixel[2],
          a: pixel[3],
        })
      );
    }
  }
  return mapResult;
}
