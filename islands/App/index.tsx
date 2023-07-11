import { Input, Button, Separator, Layout, LAYOUT_TYPES, Select } from 'ana-components';
import { useState, useRef } from 'preact/hooks';
import PixelArtSvg from '../../components/PixelArtSvg.tsx';
import { convertReq, convertRes } from '../../routes/api/convert.ts';
import { Pixel } from '../../src/image.ts';
import { DitheringAlgorithmNames, algorithms } from '../../src/dither.ts';

export default function App() {
  const [urlInputError, setUrlInputError] = useState<string>('');
  const [pixels, setPixels] = useState<Pixel[] | null>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const widthInputRef = useRef<HTMLInputElement>(null);
  const heightInputRef = useRef<HTMLInputElement>(null);
  const ditherInputRef = useRef<HTMLSelectElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handle = {
    urlCheck: async () => {
      const req: convertReq = {
        url: urlInputRef.current?.value!,
        algorithm: ditherInputRef.current?.value! as DitheringAlgorithmNames,
        pixelartWidth: parseInt(widthInputRef.current?.value!),
        pixelartHeight: parseInt(heightInputRef.current?.value!),
      };

      if (req.url === '') {
        return;
      }

      await fetch('/api/convert', {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(req),
      })
        .then(async (res) => {
          /** @todo [!] Add a loading animation when waiting for this to load. */
          const { ok, pixels } = (await res.json()) as convertRes;
          if (ok) {
            // alert(`ok ${width}`);
            setPixels(pixels);
            setUrlInputError('');
          } else {
            setUrlInputError('Invalid image, try another url.');
          }
        })
        .catch(() => {
          setUrlInputError('Server error, please contact developer.');
        });
    },
    downloadSVG: () => {
      const svg = svgRef.current;
      const name = 'pixelart';
      svg?.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      const svgData = svg?.outerHTML;
      const preface = '<?xml version="1.0" standalone="no"?>\r\n';
      const svgBlob = new Blob([preface, svgData!], {
        type: 'image/svg+xml;charset=utf-8',
      });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = name;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    },
  };

  return (
    <Layout type={LAYOUT_TYPES.HALVES}>
      <div>
        <Input
          type="url"
          label="Image URL"
          placeholder="image"
          error={urlInputError}
          fref={urlInputRef}
        />
        <Input
          type="number"
          label="Width"
          placeholder="128"
          // error={widthInputError}
          fref={widthInputRef}
        />
        <Input
          type="number"
          label="Height"
          placeholder="128"
          // error={heightInputError}
          fref={heightInputRef}
        />
        <Select fref={ditherInputRef} label="Dithering Algorithm" options={Object.keys(algorithms)} />
        <Button
          onClick={(ev) => {
            ev.preventDefault();
            handle.urlCheck();
          }}
        >
          Convert
        </Button>
      </div>
      {pixels ? (
        <div class="flex flex-col items-center">
          <Button
            onClick={(ev) => {
              ev.preventDefault();
              handle.downloadSVG();
            }}
          >
            Download
          </Button>
          <PixelArtSvg
            fref={svgRef}
            pixels={pixels}
            width={parseInt(widthInputRef.current?.value!)}
            height={parseInt(heightInputRef.current?.value!)}
          />
        </div>
      ) : null}
    </Layout>
  );
}
