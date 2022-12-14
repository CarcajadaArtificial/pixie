import { JSX, Ref } from "preact";
import { Input } from "../deps.ts";

interface iInputUrl {
  onfocusout?: JSX.FocusEventHandler<HTMLInputElement>;
  refInput: Ref<HTMLInputElement>;
  error: string;
}

export default function (props: iInputUrl) {
  return (
    <Input
      label="Image url [PNG, JPG]"
      type="url"
      // placeholder="https://.../image.jpg"
      onfocusout={props.onfocusout}
      required
      error={props.error}
      name="url"
      value="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/325/fairy_1f9da.png"
      maxWidth
      refInput={props.refInput}
    />
  );
}
