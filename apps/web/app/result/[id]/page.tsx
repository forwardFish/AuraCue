import { LatestResultPage } from "@/components/latest-ui-pages";

type ResultPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ResultPage({ params }: ResultPageProps) {
  await params;
  return <LatestResultPage />;
}
