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
import { Card, Input, Layout, Text, TextArea } from "../deps.ts";
import { isValidHexColor, removeSpacesAndSplitByComma } from "../utils.ts";
import InputUrl from "../components/InputUrl.tsx";
import InputSize from "../components/InputSize.tsx";
import { Size } from "../types.ts";

interface iMainForm {
  docStepUrl: string;
  docStepSize: string;
  docStepPalette: string;
}

export default function (props: iMainForm) {
  // Url
  const refUrlInput = useRef<HTMLInputElement>(null);
  const [urlError, setUrlError] = useState("");
  const [stepUrlDone, setStepUrlDone] = useState(false);
  const [urlImageWidth, setUrlImageWidth] = useState(0);
  const [urlImageHeight, setUrlImageHeight] = useState(0);
  // Size
  const [widthError, setWidthError] = useState("");
  const [heightError, setHeightError] = useState("");
  const [sizeRecommendations, setSizeRecommendations] = useState<Size[]>([]);
  const refHeightInput = useRef<HTMLInputElement>(null);
  const refWidthInput = useRef<HTMLInputElement>(null);
  const [stepSizeDone, setStepSizeDone] = useState(false);
  // Palette
  const [paletteError, setPaletteError] = useState("");
  const refPaletteInput = useRef<HTMLTextAreaElement>(null);
  // Submit
  const [disabledSubmit, setDisabledSubmit] = useState(true);
  const refSubmitButton = useRef<HTMLInputElement>(null);
  // Form
  const refForm = useRef<HTMLFormElement>(null);

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

  const handle = {
    /** */
    urlCheck: async (url: string) => {
      await fetch("/api/imageOk", {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({ url: url }),
      }).then(async (res) => {
        const { ok, width, height, recommendations } = await res.json();
        setUrlImageHeight(height);
        setUrlImageWidth(width);
        setSizeRecommendations(recommendations);
        setStepUrlDone(ok);
        setUrlError(ok ? "" : "Invalid image, try another url.");
      });
    },
    /** */
    sizeCheck: (
      value: string,
      errorCb: Function,
      imageUrlSize: number,
      noGetSizePreview?: boolean,
    ) => {
      if (value === "") {
        return;
      }
      const numValue = parseInt(value);
      errorCb(
        (numValue <= 0 || numValue > 320 || numValue > imageUrlSize)
          ? "Value must be between 1 and 320, and equal or lower than the image's original size."
          : "",
      );
      if (
        refHeightInput.current?.value !== "" &&
        refWidthInput.current?.value !== "" &&
        !noGetSizePreview
      ) {
        handle.getSizePreview(
          refWidthInput.current?.value as string,
          refHeightInput.current?.value as string,
        );
      }
    },
    /** */
    recommendationsClick: (dataSize?: string) => {
      const size = dataSize ? dataSize.split(",") as string[] : ["0", "0"];
      (refHeightInput.current as HTMLInputElement).value = size[0];
      handle.sizeCheck(size[0], setWidthError, urlImageWidth, true);
      (refWidthInput.current as HTMLInputElement).value = size[1];
      handle.sizeCheck(size[1], setHeightError, urlImageHeight, true);
      refPaletteInput.current?.focus();
      handle.getSizePreview(size[0], size[1]);
    },
    /** */
    getSizePreview: (
      inputWidthValue: string,
      inputHeightValue: string,
    ) => {
      // Fetch the image compression
      setStepSizeDone(true);
    },
    paletteCheck: (value: string) => {
      if (value === "") {
        return;
      }

      let allOk = true;
      removeSpacesAndSplitByComma(value).forEach((color) => {
        if (!isValidHexColor(color)) {
          allOk = false;
        }
      });
      setPaletteError(allOk ? "" : "Invalid color values.");
    },
    formSubmit: () => {
      if (refForm.current) {
        const payload = new FormData(refForm.current);
        console.log(payload.get("palette"));
        // await fetch("/api/compress", {
        //   method: "POST",
        //   body: payload,
        // }).then((res) => res.json())
        //   .then((data) => setColorResults(data.colors));
      }
    },
  };

  return (
    <Layout type="center">
      <Card>
        <form
          ref={refForm}
          class="grid gap-10"
          onSubmit={async (ev) => {
            ev.preventDefault();
            await handle.formSubmit();
          }}
        >
          <div>
            <Text type="heading">Step 1: Choose an image</Text>
            <Text>{props.docStepUrl}</Text>
            <InputUrl
              onfocusout={(ev) => {
                if (ev.currentTarget.value !== "") {
                  handle.urlCheck(ev.currentTarget.value);
                }
              }}
              error={urlError}
              refInput={refUrlInput}
            />
            <div class={stepUrlDone ? "" : "hidden"}>
              <div class="w-full">
                <img src={refUrlInput.current?.value} />
              </div>
              <div class="mt-4">
                <Text noMargins>Width:{` ${urlImageWidth}px`}</Text>
                <Text noMargins>Height:{` ${urlImageHeight}px`}</Text>
              </div>
            </div>
          </div>
          <div class={stepUrlDone ? "" : "opacity-10"}>
            <Text type="heading">Step 2: Determine the size</Text>
            <Text>{props.docStepSize}</Text>
            <InputSize
              widthError={widthError}
              heightError={heightError}
              widthOnfocusout={(ev) =>
                handle.sizeCheck(
                  ev.currentTarget.value,
                  setWidthError,
                  urlImageWidth,
                )}
              heightOnfocusout={(ev) =>
                handle.sizeCheck(
                  ev.currentTarget.value,
                  setHeightError,
                  urlImageHeight,
                )}
              recommendationsOnClick={(ev) =>
                handle.recommendationsClick(ev.currentTarget.dataset.size)}
              refHeight={refHeightInput}
              refWidth={refWidthInput}
              recommendations={sizeRecommendations}
            />
          </div>
          <div
            class={stepSizeDone ? "" : stepUrlDone ? "opacity-10" : "hidden"}
          >
            <Text type="heading">Step 3: Determine the color palette</Text>
            <Text>{props.docStepPalette}</Text>
            <TextArea
              label="Color palette"
              required
              maxWidth
              rows={5}
              onfocusout={(ev) => handle.paletteCheck(ev.currentTarget.value)}
              error={paletteError}
              refTextArea={refPaletteInput}
              name="palette"
            />
            <Input
              disabled={disabledSubmit}
              ref={refSubmitButton}
              type="submit"
              value="Convert"
            />
          </div>
        </form>
      </Card>
    </Layout>
  );
}
