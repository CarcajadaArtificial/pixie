# Changelog

## v0.1.11

### Added

- Updated the MainForm island, now step two is much more interactive. Preview SVGs can be downloaded.
  - `~/islands/MainForm.tsx`

- Added interpolation methods for image compression.
  - `~/back/image.ts`

- Fixed some issues in the Pixel Preview component.
  - `~/components/PixelPreview.tsx`

## Comming Soon (v1.0.0)

### Features

- [x] Automatic aspect ratio calculator
  - [x] Add custom values for size
  - [x] Size suggestions for quick customization
  - [x] Preview the image's crop
  - [ ] Download button for the pixelated preview.

- [ ] Compress the image using Dithering
  - [ ] Add a custom palette selector for overriding the colors.
  - [ ] Feature at least five existing dithering algorithms.

- Misc
  - [ ] Instructions
  - [ ] Page logo.
  - [ ] Credits and tech stack.

### Documentation

- [ ] `utils.ts`

- back
  - [ ] `image.ts`
  - [x] `aspectRatio.ts`

- components
  - [ ] `PixelPreview.tsx`
  - [ ] `InputSize.tsx`
  - [ ] `InputUrl.tsx`
  - [ ] Comming soon `InputPalette.tsx`

- islands
  - [ ] `MainForm.tsx`

- routes
  - [ ] `api/compress.tsx`
  - [ ] `api/imageOk.ts`
  - [ ] `_app.tsx`
  - [ ] `index.tsx`
  - [ ] Comming soon `app.tsx`
  - [ ] Comming soon `about.tsx`
