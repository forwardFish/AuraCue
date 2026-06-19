import { LatestActivatePage } from "@/components/latest-ui-pages";

type ActivatePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ActivatePage({ params }: ActivatePageProps) {
  await params;
  return <LatestActivatePage />;
}
