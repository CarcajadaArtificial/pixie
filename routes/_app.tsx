//     _
//    /_\  _ __ _ __
//   / _ \| '_ \ '_ \
//  /_/ \_\ .__/ .__/
//        |_|  |_|
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @module
 */

import { AppProps } from '$fresh/server.ts';
import { Head } from '$fresh/runtime.ts';

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        <title>Pixie</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/CarcajadaArtificial/ana-components@0.0.102/static/style.css"
        />
      </Head>
      <body class="clr-bg-panel clr-txt-base txt-paragraph">
        <div class="_screen">
          <Component />
        </div>
      </body>
    </>
  );
}
