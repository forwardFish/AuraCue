import { SavedPageFlow } from "@/components/share-save-flow";

type SavedPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SavedPage({ params }: SavedPageProps) {
  const { id } = await params;
  return <SavedPageFlow cardId={id} />;
}
