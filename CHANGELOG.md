# Changelog

## v0.1.5

### Added

- Added the page component
  - `~/components/Page.tsx`

- Updated app to latest components
  - `~/routes/_app.tsx`
  - `~/deps.ts`

- New components to the MainForm island and index route
  - `~/routes/index.tsx`
  - `~/islands/MainForm.tsx`

### Removed

- Nothing

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
