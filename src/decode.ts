import { decode, Image } from 'imagescript';

/** Uses `imagescript` to decode an `ArrayBuffer` into an `Image`. */
export async function decodeImageFromBuffer(buffer: ArrayBuffer): Promise<Image | null> {
  try {
    const imageDecoded = await decode(buffer);
    return imageDecoded instanceof Image ? imageDecoded : null;
  } catch (_error) {
    return null;
  }
}

/** Decodes an `Image` fetching its `ArrayBuffer` from an URL.  */
export async function decodeImageFromUrl(url: string): Promise<Image | null> {
  const imageBuffer = await fetchBufferFromUrl(url);

  if (!imageBuffer) {
    return null;
  }

  return await decodeImageFromBuffer(imageBuffer);
}

/** Fetches an image `blob` using a URL string and returns the `ArrayBuffer`. */
export async function fetchBufferFromUrl(url: string): Promise<ArrayBuffer | null> {
  const imageFetch = await fetch(url, { method: 'GET' })
    .then(async (res) => await res.blob())
    .catch(() => null);

  if (!imageFetch) {
    return null;
  }

  return imageFetch.arrayBuffer();
}
