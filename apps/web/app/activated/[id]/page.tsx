import { ActivatedPageFlow } from "@/components/result-activation-flow";

type ActivatedPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ActivatedPage({ params }: ActivatedPageProps) {
  const { id } = await params;
  return <ActivatedPageFlow cardId={id} />;
}
