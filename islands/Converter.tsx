import { Input, Button, Separator, Text } from 'ana-components';
import { useState, useRef } from 'preact/hooks';
import { ComponentProps, ComponentType, JSX } from 'preact';

export default function Converter() {
  const [width, setWitdh] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [imgok, setImgok] = useState<boolean | undefined>(undefined);
  const [urlerror, setUrlerror] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

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
        const { ok, width, height, recommendations } = await res.json();
        setWitdh(height);
        setHeight(width);
        setImgok(recommendations);
        setUrlerror(ok ? '' : 'Invalid image, try another url.');
      });
    },
  };

  return (
    <div>
      <Input
        value="https://em-content.zobj.net/thumbs/240/apple/354/fairy_1f9da.png"
        ref={inputRef}
        type="url"
        label="Image URL"
        placeholder="image"
        error={urlerror}
      />
      <Button
        onclick={(ev) => {
          ev.preventDefault();
          handle.urlCheck(inputRef.current?.props.value);
        }}
      >
        Check
      </Button>
      <Text>
        Width: {width} <br /> Height: {height}
      </Text>
      <Separator />
    </div>
  );
}
