# Changelog

v0.1.4

## Comming Soon (v1.0.0)

### Features

- [x] Compress the image using most common color.
- [x] Filter image using a color palette.
- [ ] Preview image and aspect ratop before creating svg.
- [ ] Page logo.
- [ ] Credits and tech stack.
- [x] Download button for SVG result.
- [ ] Instructions.

### Issues

- [ ] Missing support for non-square results.
- [ ] Make optional the palette textarea. If null, do not filter the colors.

### Documentation

- [ ] `utils.ts`

- back
  - [ ] `image.ts`

- components
  - [ ] `PixelPreview.tsx`

- islands
  - [ ] `MainForm.tsx`

- routes
  - [ ] `api/compress.tsx`
  - [ ] `api/imageOk.ts`
  - [ ] `_app.tsx`
  - [ ] `index.tsx`

## Changes

### Added

- Download button
  - `~/islands/MainForm.tsx`

- Custom preview size input.
  - `~/components/PixelPreview.tsx`

### Removed

- Nothing
