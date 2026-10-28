import ReadingClient from "./ReadingClient";

export async function generateStaticParams() {
  return [{ bookUrl: "_fallback", chapter: "0" }];
}

export const dynamicParams = false;

export default function ReadingPage() {
  return <ReadingClient />;
}
