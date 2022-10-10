//     _
//    /_\  _ __ _ __
//   / _ \| '_ \ '_ \
//  /_/ \_\ .__/ .__/
//        |_|  |_|
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @module
 */

import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        <title>Pixie</title>
      </Head>
      <Component />
    </>
  );
}
