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
import PixelPreview from "../components/PixelPreview.tsx";
import InputSize from "../components/InputSize.tsx";
import { Size } from "../types.ts";

interface iMainForm {
  docStepUrl: string;
  docStepSize: string;
  docStepPalette: string;
}

export default function (props: iMainForm) {
  // ---------------------------------------------------------------------------------------------------
  //   _  _          _
  //  | || |___  ___| |__ ___
  //  | __ / _ \/ _ \ / /(_-<
  //  |_||_\___/\___/_\_\/__/
  //
  // ---------------------------------------------------------------------------------------------------
  // Url
  // - Errors
  const [urlError, setUrlError] = useState("");
  // - Input Values
  const [imageUrl, setImageUrl] = useState("");
  // - Input References
  const refUrlInput = useRef<HTMLInputElement>(null);
  // - Fetched values
  const [urlImageWidth, setUrlImageWidth] = useState(0);
  const [urlImageHeight, setUrlImageHeight] = useState(0);
  const [sizeRecommendations, setSizeRecommendations] = useState<Size[]>([]);
  // - Step Done
  const [stepUrlDone, setStepUrlDone] = useState(false);
  //   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
  // Size
  // - Errors
  const [widthError, setWidthError] = useState("");
  const [heightError, setHeightError] = useState("");
  // - Input Values
  const [widthInputValue, setWidthInputValue] = useState(0);
  const [heightInputValue, setHeightInputValue] = useState(0);
  // - Input References
  const refHeightInput = useRef<HTMLInputElement>(null);
  const refWidthInput = useRef<HTMLInputElement>(null);
  // - Fetched values
  const [croppedImageSrc, setCroppedImageSrc] = useState("");
  const [compressedImageColors, setCompressedImageColors] = useState<
    number[][]
  >([[0, 0, 0, 0]]);
  // - Step Done
  const [stepSizeDone, setStepSizeDone] = useState(false);
  //   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
  // Palette
  const [paletteError, setPaletteError] = useState("");
  const refPaletteInput = useRef<HTMLTextAreaElement>(null);
  //   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
  // Submit
  const [disabledSubmit, setDisabledSubmit] = useState(true);
  const refSubmitButton = useRef<HTMLInputElement>(null);
  //   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
  // Form
  const refForm = useRef<HTMLFormElement>(null);

  //   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
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

  // ---------------------------------------------------------------------------------------------------
  //   _  _              _ _
  //  | || |__ _ _ _  __| | |___ _ _ ___
  //  | __ / _` | ' \/ _` | / -_) '_(_-<
  //  |_||_\__,_|_||_\__,_|_\___|_| /__/
  //
  // ---------------------------------------------------------------------------------------------------
  const handle = {
    /** */
    urlCheck: async (url: string) => {
      if (url === "") {
        return;
      }
      setImageUrl(url);
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
          refWidthInput.current?.valueAsNumber!,
          refHeightInput.current?.valueAsNumber!,
        );
      }
    },
    /** */
    recommendationsClick: (dataSize?: string) => {
      const size = dataSize ? dataSize.split(",") as string[] : ["0", "0"];
      (refHeightInput.current as HTMLInputElement).value = size[1];
      (refWidthInput.current as HTMLInputElement).value = size[0];
      handle.sizeCheck(
        size[0],
        setHeightError,
        urlImageHeight,
        true,
      );
      handle.sizeCheck(
        size[1],
        setWidthError,
        urlImageWidth,
        true,
      );
      refPaletteInput.current?.focus();
      handle.getSizePreview(parseInt(size[0]), parseInt(size[1]));
    },
    /** */
    getSizePreview: async (
      inputWidthValue: number,
      inputHeightValue: number,
    ) => {
      setWidthInputValue(inputWidthValue);
      setHeightInputValue(inputHeightValue);
      // Fetch the image compression
      await fetch("/api/compress", {
        method: "POST",
        body: JSON.stringify({
          url: imageUrl,
          width: inputWidthValue,
          height: inputHeightValue,
        }),
      }).then((res) => res.json())
        .then((data) => {
          setCroppedImageSrc(data.src);
          setCompressedImageColors(data.compressedColos);
        });
      // Set cropped Image Src
      setStepSizeDone(true);
    },
    /** */
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
    /** */
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

  // ---------------------------------------------------------------------------------------------------
  //   ___             _
  //  | _ \___ _ _  __| |___ _ _
  //  |   / -_) ' \/ _` / -_) '_|
  //  |_|_\___|_||_\__,_\___|_|
  //
  // ---------------------------------------------------------------------------------------------------
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
              onfocusout={(ev) => handle.urlCheck(ev.currentTarget.value)}
              error={urlError}
              refInput={refUrlInput}
            />
            <div class={stepUrlDone ? "" : "hidden"}>
              <img class="max-h-80" src={imageUrl} />
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
            <div class={stepSizeDone ? "flex flex-col mt-4 gap-2" : "hidden"}>
              <img
                class="max-h-80"
                /** @todo trun this into an override class for max-w-fit */
                style="max-width: fit-content;"
                src={croppedImageSrc}
              />
              <PixelPreview
                height={heightInputValue}
                width={widthInputValue}
                colors={compressedImageColors}
              />
            </div>
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
