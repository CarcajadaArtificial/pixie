//   __  __      _        ___
//  |  \/  |__ _(_)_ _   | __|__ _ _ _ __
//  | |\/| / _` | | ' \  | _/ _ \ '_| '  \
//  |_|  |_\__,_|_|_||_| |_|\___/_| |_|_|_|
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @module
 */
import { useEffect, useRef, useState } from "preact/hooks";
import PixelPreview from "../components/pixelPreview.tsx";
import { Input, TextArea } from "../deps.ts";
import { isValidHexColor, removeSpacesAndSplitByComma } from "../utils.ts";

export default function MainForm() {
  const [urlError, setUrlError] = useState("");
  const [widthError, setWidthError] = useState("");
  const [heightError, setHeightError] = useState("");
  const [paletteError, setPaletteError] = useState("");
  const [disabledSubmit, setDisabledSubmit] = useState(false);
  const [colorResults, setColorResults] = useState([]);
  const [previewSizeMultiplier, setPreviewSizeMultiplier] = useState(100);
  const refForm = useRef<HTMLFormElement>(null);
  const refSubmitButton = useRef<HTMLInputElement>(null);

  const handle = {
    /** */
    urlFocusOut: async (url: string) => {
      await fetch("/api/imageOk", {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({ url: url }),
      }).then(async (res) => {
        const { ok } = await res.json();
        setUrlError(ok ? "" : "Invalid image, try another url.");
      });
    },
    /** */
    heightFocusOut: (value: number) =>
      setHeightError(
        (value <= 0 || value > 128) ? "Value must be between 1 and 128." : "",
      ),
    /** */
    widthFocusOut: (value: number) =>
      setWidthError(
        (value <= 0 || value > 128) ? "Value must be between 1 and 128." : "",
      ),
    /** */
    paletteFocusOut: (value: string) => {
      let allOk = true;
      removeSpacesAndSplitByComma(value).forEach((color) => {
        if (!isValidHexColor(color)) {
          allOk = false;
        }
      });
      setPaletteError(allOk ? "" : "Invalid color values.");
    },
    /** */
    formSubmit: async () => {
      if (refForm.current) {
        const payload = new FormData(refForm.current);
        await fetch("/api/compress", {
          method: "POST",
          body: payload,
        }).then((res) => res.json())
          .then((data) => setColorResults(data.colors));
      }
    },
  };

  useEffect(() => {
    if (
      [urlError, widthError, heightError, paletteError].filter((errorMessage) =>
        errorMessage !== ""
      ).length > 0
    ) {
      setDisabledSubmit(true);
    } else {
      setDisabledSubmit(false);
    }
  }, [urlError, widthError, heightError, paletteError]);

  return (
    <div>
      <form
        ref={refForm}
        onSubmit={async (ev) => {
          ev.preventDefault();
          await handle.formSubmit();
        }}
      >
        <div class="flex flex-col gap-4 text-sm">
          <Input
            label="Image url [PNG, JPG]"
            type="url"
            placeholder="https://.../image.jpg"
            onfocusout={(ev) => {
              if (ev.currentTarget.value !== "") {
                handle.urlFocusOut(ev.currentTarget.value);
              }
            }}
            required
            error={urlError}
            name="url"
            value="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/325/fairy_1f9da.png"
          />
          <div class="grid grid-cols-2 gap-4">
            <Input
              label="Height (px)"
              type="number"
              placeholder="16"
              required
              error={heightError}
              onfocusout={(ev) => {
                if (ev.currentTarget.value !== "") {
                  handle.heightFocusOut(ev.currentTarget.valueAsNumber);
                }
              }}
              name="height"
              value="16"
            />
            <Input
              label="Width (px)"
              type="number"
              placeholder="16"
              required
              error={widthError}
              onfocusout={(ev) => {
                if (ev.currentTarget.value !== "") {
                  handle.widthFocusOut(ev.currentTarget.valueAsNumber);
                }
              }}
              name="width"
              value="16"
            />
          </div>
          <TextArea
            required
            label="Color palette (Hex values separated by commas)"
            placeholder="#FF000, #00FF00, #0000FF"
            error={paletteError}
            onfocusout={(ev) => {
              if (ev.currentTarget.value !== "") {
                handle.paletteFocusOut(ev.currentTarget.value);
              }
            }}
            name="palette"
            value="#27b69d,#23a68f,#1aa48c,#17846f,#0f8b7d,#0e7e72,#0a876e,#097b64,#0a584d,#095046,#7e888e,#737c81,#383d40,#33373a,#272727,#018391,#017784,#db1e39,#c71b34,#fffee8,#ffb661,#fafafa,#e8e8e8,#d8d8d8,#e7f5f3,#5d6468,#4c5256,#31343b,#2f3335"
          />
          <Input
            disabled={disabledSubmit}
            ref={refSubmitButton}
            type="submit"
            value="Convert"
          />
        </div>
      </form>
      {colorResults.length === 0 ? null : (
        <div>
          <Input
            label="Image Size"
            type="number"
            onKeyUp={(ev) =>
              setPreviewSizeMultiplier(ev.currentTarget.valueAsNumber)}
          />
          <PixelPreview
            multiplier={previewSizeMultiplier}
            colors={colorResults}
            id="result-preview"
          />
          <button
            onClick={(ev) => {
              const preview = document.getElementById("result-preview");
              if (preview) {
                const svg = preview.outerHTML;
                const blob = new Blob([svg.toString()]);
                const element = document.createElement("a");
                element.download = "pixie.svg";
                element.href = window.URL.createObjectURL(blob);
                element.click();
                element.remove();
              }
            }}
          >
            Download
          </button>
        </div>
      )}
    </div>
  );
}
