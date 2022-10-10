# Changelog

v0.1.0

## Comming Soon (v1.0.0)

### Features

- [x] Compress the image using most common color.
- [ ] Filter image using a color palette.
- [ ] Preview image and aspect ratop before creating svg.
- [ ] Page logo.
- [ ] Credits and tech stack.
- [ ] Download button for SVG result.

### Issues

- [ ] Missing support for non-square results.

## Changes

### Added

- Api for compressing the image and it's color palette.
  - `~/routes/api/compress.ts`

- Api for verifying image url.
  - `~/routes/api/imageOk.ts`

- Main Form island for the apps inout form.
  - `~/islands/MainForm.tsx`
  - `~/routes/index.tsx`

- Pixel Preview component, to see a preview of the resulting pixelated image.
  - `~/components/PixelPreview.tsx`

- Backend imagescript functions.
  - `~/back/image.ts`

### Removed

- Nothing
