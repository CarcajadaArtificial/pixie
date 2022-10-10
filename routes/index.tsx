//   ___         _
//  |_ _|_ _  __| |_____ __
//   | || ' \/ _` / -_) \ /
//  |___|_||_\__,_\___/_\_\
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @module
 */

import MainForm from "../islands/MainForm.tsx";
import { Page } from "../deps.ts";

export default function Home() {
  return (
    <Page title="Pixie">
      <MainForm />
    </Page>
  );
}
