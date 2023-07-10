import { JSX, Ref } from 'preact';
import { Pixel } from '../src/image.ts';
import { applyDefaults } from 'ana-utils';

interface PixelArtSvg extends JSX.HTMLAttributes<SVGSVGElement> {
  pixels: Pixel[] | null;
  width: number;
  height: number;
  fref?: Ref<SVGSVGElement>;
}

export default function PixelArtSvg(props: Partial<PixelArtSvg>) {
  const { fref, pixels, height, width, ...svgProps } = applyDefaults<PixelArtSvg>(
    {
      pixels: null,
      height: 0,
      width: 0,
    },
    props
  );

  if (!pixels) {
    return <></>;
  }

  return (
    <svg
      {...svgProps}
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${height} ${width}`}
      shape-rendering="crispEdges"
      ref={fref}
      class="h-auto py-12"
    >
      {height === 0 || width === 0
        ? null
        : pixels.map((pixel, index) => (
            <rect
              width={1}
              height={1}
              fill={`rgb(${pixel.r},${pixel.g},${pixel.b})`}
              fill-opacity={pixel.a.toFixed(2)}
              x={index % width}
              y={Math.floor(index / width)}
            />
          ))}
    </svg>
  );
}
