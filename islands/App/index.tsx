import { Input, Button } from 'ana-components';
import { useState, useRef } from 'preact/hooks';
import PixelArtSvg from '../../components/PixelArtSvg.tsx';
import { convert_request, convert_response } from '../../routes/api/convert.ts';
import { Pixel } from '../../src/image.ts';

export default function App() {
  const [urlerror, setUrlerror] = useState<string>('');
  const [pixels, setPixels] = useState<Pixel[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [pixelartWidth, pixelartHeight] = [64, 64];

  const handle = {
    urlCheck: async () => {
      const req: convert_request = {
        url: inputRef.current?.value!,
        pixelartWidth: pixelartWidth,
        pixelartHeight: pixelartHeight,
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
          /** @todo [!!] Add a loading animation when waiting for this to load. */
          const { ok, pixels } = (await res.json()) as convert_response;
          if (ok) {
            // alert(`ok ${width}`);
            setPixels(pixels);
            setUrlerror('');
          } else {
            setUrlerror('Invalid image, try another url.');
          }
        })
        .catch(() => {
          setUrlerror('Server error, please contact developer.');
        });
    },
  };

  return (
    <>
      <Input
        value="https://em-content.zobj.net/thumbs/240/apple/354/fairy_1f9da.png"
        type="url"
        label="Image URL"
        placeholder="image"
        error={urlerror}
        fref={inputRef}
      />
      <Button
        onClick={(ev) => {
          ev.preventDefault();
          handle.urlCheck();
        }}
      >
        Check
      </Button>
      <PixelArtSvg pixels={pixels} width={pixelartWidth} height={pixelartHeight} />
    </>
  );
}
