import type { ComponentChildren } from "preact";
import { applyDefaults } from "../deps.ts";

interface Title {
  children: ComponentChildren;
}

interface iTitle {
  children?: ComponentChildren;
}

const dTitle: Title = {
  children: ["Title"],
};

export default function Title(props: iTitle) {
  const { children } = applyDefaults(dTitle, props);
  return (
    <h1>
      {children}
    </h1>
  );
}
