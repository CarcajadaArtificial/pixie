// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/_app.tsx";
import * as $1 from "./routes/api/compress.ts";
import * as $2 from "./routes/api/dither.ts";
import * as $3 from "./routes/api/imageOk.ts";
import * as $4 from "./routes/index.tsx";
import * as $$0 from "./islands/MainForm.tsx";

const manifest = {
  routes: {
    "./routes/_app.tsx": $0,
    "./routes/api/compress.ts": $1,
    "./routes/api/dither.ts": $2,
    "./routes/api/imageOk.ts": $3,
    "./routes/index.tsx": $4,
  },
  islands: {
    "./islands/MainForm.tsx": $$0,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;
