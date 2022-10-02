import Title from "./Title.tsx";
import { applyDefaults } from "../deps.ts";

interface Page {
  title: string;
}

interface iPage {
  title?: string;
}

const dPage: Page = {
  title: "Page Title",
};

export default function Page(props: iPage) {
  const { title } = applyDefaults<Page, iPage>(dPage, props);
  return (
    <div class="page">
      <main class="p-4 mx-auto max-w-screen-md">
        <Title>{title}</Title>
      </main>
    </div>
  );
}
