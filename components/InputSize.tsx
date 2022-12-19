import { JSX, Ref } from "preact";
import { getRecommendations } from "../src/back/aspectRatio.ts";
import { Input, Text } from "../deps.ts";
import { Size } from "../src/types.ts";

interface iInputUrl {
  // Height
  refHeight: Ref<HTMLInputElement>;
  heightOnfocusout?: JSX.FocusEventHandler<HTMLInputElement>;
  heightError: string;
  // Width
  refWidth: Ref<HTMLInputElement>;
  widthOnfocusout?: JSX.FocusEventHandler<HTMLInputElement>;
  widthError: string;
  // Recommendations
  recommendations: Size[];
  recommendationsOnClick?: JSX.FocusEventHandler<HTMLDivElement>;
}

export default function (props: iInputUrl) {
  return (
    <div>
      <div class="grid grid-cols-2 gap-4">
        <Input
          label="Width"
          type="number"
          error={props.widthError}
          onfocusout={props.widthOnfocusout}
          name="width"
          refInput={props.refWidth}
          required
        />
        <Input
          label="Height"
          type="number"
          error={props.heightError}
          onfocusout={props.heightOnfocusout}
          name="height"
          refInput={props.refHeight}
          required
        />
      </div>
      <div class={props.recommendations.length === 0 ? "hidden" : ""}>
        <Text noMargins>Recommendations</Text>
        <div class="flex flex-wrap gap-4">
          {props.recommendations.map((recommendation) => (
            <div
              onMouseUp={props.recommendationsOnClick}
              class="flex gap-2 items-center px-4 py-2 clr-bg-main rounded-full"
              data-size={`${recommendation.width},${recommendation.height}`}
            >
              <Text noMargins>
                {recommendation.width}x{recommendation.height}
              </Text>
              <Text noMargins type="small">
                {100 - recommendation.difference}% match
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
