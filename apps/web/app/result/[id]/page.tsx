import { ResultPageFlow } from "@/components/result-activation-flow";

type ResultPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ResultPage({ params }: ResultPageProps) {
  const { id } = await params;
  return <ResultPageFlow cardId={id} />;
}
