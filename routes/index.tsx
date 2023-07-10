//   ___         _
//  |_ _|_ _  __| |_____ __
//   | || ' \/ _` / -_) \ /
//  |___|_||_\__,_\___/_\_\
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @module
 */
import App from '../islands/App/index.tsx';
import { Main, Header, Text, Input, Layout, LAYOUT_TYPES, TEXT_TYPES } from 'ana-components';

export default function Home() {
  return (
    <div>
      <Header layout_type={LAYOUT_TYPES.CENTER}>
        <div class="text-center">
          <Text type={TEXT_TYPES.DISPLAY}>
            Pixel-art filter, <br /> SVG converter
            <Text type={TEXT_TYPES.TITLE}>all in one</Text>
          </Text>
        </div>
      </Header>
      <Main layout_type={LAYOUT_TYPES.CENTER}>
        <App />
      </Main>
    </div>
  );
}
