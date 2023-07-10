# Changelog

## v0.1.26

### Added functional documentation
  - `/routes/api/convert.ts`
  - `/src/color.ts`
  - `/src/decode.ts`
  - `/src/dither.ts`
  - `/src/image.ts`
  - `/src/palette.ts`

### Minor updates
  - `/components/PixelArtSvg.tsx`
  - `/islands/App/index.tsx`

## Roadmap to v1.0.0

### v0.2.0 - Lean phase
  1. [x] Develop an API service that converts image using hardcoded settings.
  2. [x] Display the resulting SVG image.
  3. [x] Add a dithering engine to the image conversion.

### v0.3.0 - Basic interactions phase
  1. [ ] Add a button to download the resulting SVG.
  2. [ ] Add a loading spinner.

### v0.4.0 - Advanced configuration phase
  1. [ ] Add `width` and `height` input for the resulting SVG dimentions.
  2. [ ] Add an interactive `palette` input for a custom CSV palette.
  3. [ ] Add a dithering algorithm selector.
  4. [ ] Include instructions in the site.

### v0.5.0 - Decoration phase
  1. [ ] Add presentation assets.
  2. [ ] Add an about page.
  3. [ ] Add a custom domain.