import { Handlers } from '$fresh/server.ts';
import { decodeImageFromUrl } from '../../back/image.ts';

export const handler: Handlers = {
  async POST(req, _ctx) {
    const data = await req.json();
    const image = await decodeImageFromUrl(data.url);
    const response = { ok: true };

    if (!image) {
      response.ok = false;
    }
    return new Response(JSON.stringify(response));
  },
};
