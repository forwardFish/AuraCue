import { ActivatePageFlow } from "@/components/result-activation-flow";

type ActivatePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ActivatePage({ params }: ActivatePageProps) {
  const { id } = await params;
  return <ActivatePageFlow cardId={id} />;
}
