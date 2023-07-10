# Changelog

## v0.1.22

### Moved the `Converter` island to `App`
  - Removed `/islands/Converter.tsx`.
  - `/fresh.gen.ts`
  - `/islands/App/index.tsx`
  - `/routes/index.tsx`

### Updated dependencies
  - `/import_map.json`
  - `/routes/api/convert.ts`

## Roadmap

### v1.0.0

  1. Implement interaction to Rust functions from Deno.
    - [ ] Develop a Rust function that takes an image's buffer and returns it to the client.
  2. Develop the Rust workflow that converts an image into a pixel art SVG.
    - The workflow must end with an array of colors and the svg-pixel width and height.
    - [ ] Find the "best" aspect ratio.
    - [ ] Divide the image into pieces.
    - [ ] Reduce every piece to a single color.
    - [ ] Implement dithering algorithms.
  3. Display the generated svg and download.
    - [ ] Create and render an SVG with the received data.
    - [ ] Add a Download button.
