import { LatestActivatedPage } from "@/components/latest-ui-pages";

type ActivatedPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ActivatedPage({ params }: ActivatedPageProps) {
  await params;
  return <LatestActivatedPage />;
}
