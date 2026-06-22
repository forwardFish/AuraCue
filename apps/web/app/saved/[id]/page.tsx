import { LatestSavedPage } from "@/components/latest-ui-pages";

type SavedPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SavedPage({ params }: SavedPageProps) {
  await params;
  return <LatestSavedPage />;
}
