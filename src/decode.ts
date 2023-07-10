import { decode, Image } from 'imagescript';

/**
 * @todo [!!] Complete documentation
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
 * @todo [!!] Complete documentation
 */
export async function decodeImageFromUrl(url: string): Promise<Image | null> {
  const imageBuffer = await decodeBufferFromUrl(url);

  if (!imageBuffer) {
    return null;
  }

  return await decodeImageFromBuffer(imageBuffer);
}

/**
 * @todo [!!] Complete documentation
 */
export async function decodeBufferFromUrl(url: string): Promise<ArrayBuffer | null> {
  const imageFetch = await fetch(url, { method: 'GET' })
    .then(async (res) => await res.blob())
    .catch(() => null);

  if (!imageFetch) {
    return null;
  }

  return imageFetch.arrayBuffer();
}
