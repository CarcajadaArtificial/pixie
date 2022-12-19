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
import { JSX } from "preact";
import { Button, Card, Input, Layout, Text, TextArea } from "../deps.ts";
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
  const [croppedImageSrc, setCroppedImageSrc] = useState(""); // Used to preview the image after crop
  const [compressedImageColors, setCompressedImageColors] = useState<
    number[][]
  >([[0, 0, 0, 0]]);
  const [compressedImageGrays, setCompressedImageGrays] = useState<
    number[][]
  >([[0, 0, 0, 0]]);
  // - Preview References
  const refCompressedImageColors = useRef<SVGSVGElement>(null);
  const refCompressedImageGrays = useRef<SVGSVGElement>(null);
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
  // - Fetched values
  // const [ditheredImageColors, setDitheredImageColors] = useState<
  //   number[][]
  // >([[0, 0, 0, 0]]);
  // const [ditheredImageGrays, setDitheredImageGrays] = useState<
  //   number[][]
  // >([[0, 0, 0, 0]]);

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
    urlCheck: async (ev: JSX.TargetedEvent<HTMLInputElement, Event>) => {
      const url = ev.currentTarget.value;
      if (url === "") {
        return;
      }
      setImageUrl(url);
      setStepUrlDone(true);
      await fetch("/api/imageOk", {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({ url: url }),
      }).then(async (res) => {
        /** @todo Add a loading animation when waiting for this to load. */
        const { ok, width, height, recommendations } = await res.json();
        setUrlImageHeight(height);
        setUrlImageWidth(width);
        setSizeRecommendations(recommendations);
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
        (numValue <= 7 || numValue > 320 || numValue > imageUrlSize)
          ? "Value must be between 8 and 320, and equal or lower than the image's original size."
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
          setCompressedImageGrays(data.compressedGrays);
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
    downloadSVG: (svg: SVGSVGElement, name: string) => {
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const svgData = svg.outerHTML;
      const preface = '<?xml version="1.0" standalone="no"?>\r\n';
      const svgBlob = new Blob([preface, svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = name;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    },
    /** */
    formSubmit: async (ev: JSX.TargetedEvent<HTMLFormElement, Event>) => {
      ev.preventDefault();
      await fetch("/api/dither", {
        method: "POST",
        body: JSON.stringify({
          colors: compressedImageColors,
          grays: compressedImageGrays,
          palette: refPaletteInput.current?.value,
          width: widthInputValue,
          height: heightInputValue,
        }),
      }).then((res) => res.json())
        .then((data) => {
          // setDitheredImageColors(data.colors);
          // setDitheredImageGrays(data.grays);
        });
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
          onSubmit={handle.formSubmit}
        >
          <div>
            <Text type="heading">Step 1: Choose an image</Text>
            <Text>{props.docStepUrl}</Text>
            <InputUrl
              onfocusout={handle.urlCheck}
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
            <div class={stepSizeDone ? "flex mt-4 mb-8 gap-2" : "hidden"}>
              <div>
                <PixelPreview
                  height={heightInputValue}
                  width={widthInputValue}
                  colors={compressedImageColors}
                  refSvg={refCompressedImageColors}
                />
                <Button
                  onclick={(ev) => {
                    ev.preventDefault();
                    handle.downloadSVG(
                      refCompressedImageColors.current!,
                      "pixie_compressed_colors.svg",
                    );
                  }}
                >
                  Download
                </Button>
              </div>
              <div>
                <PixelPreview
                  height={heightInputValue}
                  width={widthInputValue}
                  colors={compressedImageGrays}
                  refSvg={refCompressedImageGrays}
                />
                <Button
                  onclick={(ev) => {
                    ev.preventDefault();
                    handle.downloadSVG(
                      refCompressedImageGrays.current!,
                      "pixie_compressed_grayscale.svg",
                    );
                  }}
                >
                  Download
                </Button>
              </div>
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
              value="#fff,#000"
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
