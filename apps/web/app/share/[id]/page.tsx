import { LatestSharePage } from "@/components/latest-ui-pages";

type SharePageProps = {
  params: Promise<{ id: string }>;
};

export default async function SharePage({ params }: SharePageProps) {
  await params;
  return <LatestSharePage />;
}
