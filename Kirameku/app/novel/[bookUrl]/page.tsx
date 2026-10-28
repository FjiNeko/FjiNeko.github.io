import ChapterListClient from "./ChapterListClient";

export async function generateStaticParams() {
  return [{ bookUrl: "_fallback" }];
}

export const dynamicParams = false;

export default function ChapterListPage() {
  return <ChapterListClient />;
}
