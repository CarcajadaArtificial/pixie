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
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/CarcajadaArtificial/ana-components@0.0.29/static/styles.css"
        />
      </Head>
      <Component />
    </>
  );
}
