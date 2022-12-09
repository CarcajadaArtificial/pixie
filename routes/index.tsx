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
import Page from "../components/Page.tsx";
import { Card, Header, Layout, Main, Navigation, Text } from "../deps.ts";

export default function Home() {
  return (
    <Page>
      <Header>
        <Text type="title">Pixie</Text>
        <Text>doc.description</Text>
      </Header>
      <Main>
        <Layout type="left">
          <Card>
            <MainForm />
          </Card>
        </Layout>
      </Main>
    </Page>
  );
}
