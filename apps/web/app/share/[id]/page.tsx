import { SharePageFlow } from "@/components/share-save-flow";

type SharePageProps = {
  params: Promise<{ id: string }>;
};

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  return <SharePageFlow cardId={id} />;
}
