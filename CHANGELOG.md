# Changelog

## v0.1.8

### Added

- A revamped MainForm in index.
  `~/routes/indes.tsx`
  `~/islands/MainForm.tsx`
  `~/components/InputSize.tsx`
  `~/components/InputUrl.tsx`

- ImageOk now returns recommendations
  - `~/routes/api/imageOk.ts`

- Cleaner functions
  - `~/back/image.ts`

- Aspect Ratio fixes
  - `~/back/aspectRatio.ts`

## Comming Soon (v1.0.0)

### Features

- [ ] Automatic aspect ratio calculator
  - [ ] Add custom values for size
  - [ ] Size suggestions for quick customization
  - [ ] Preview the image's crop

- [ ] Compress the image using Dithering
  - [ ] Add a custom palette selector for overriding the colors.
  - [ ] Convert the resulting image into an svg.

- Misc
  - [ ] Instructions
  - [ ] Page logo.
  - [ ] Credits and tech stack.

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
