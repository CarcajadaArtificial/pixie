import { Input, Button, Separator, Text } from 'ana-components-local';
import { useState, useRef } from 'preact/hooks';

export default function App() {
  const [width, setWitdh] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [sum, setSum] = useState<string>('');
  const [imgok, setImgok] = useState<boolean | undefined>(undefined);
  const [urlerror, setUrlerror] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = {
    urlCheck: async (url: string) => {
      if (url === '') {
        return;
      }
      await fetch('/api/convert', {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ url: url }),
      }).then(async (res) => {
        /** @todo [!!] Add a loading animation when waiting for this to load. */
        const { ok, width, height, sum, recommendations } = await res.json();
        setWitdh(height);
        setHeight(width);
        setSum(sum);
        setImgok(recommendations);
        setUrlerror(ok ? '' : 'Invalid image, try another url.');
      });
    },
  };

  return (
    <div>
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
          handle.urlCheck(inputRef.current?.value!);
        }}
      >
        Check
      </Button>
      <Text>
        Width: {width} <br /> Height: {height} <br /> Sum: {sum}
      </Text>
      <Separator />
    </div>
  );
}
