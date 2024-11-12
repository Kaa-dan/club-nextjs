import Rules from "@/components/pages/club/club-modules/rules";

export default async function Page({
  params,
}: {
  params: Promise<{ plugin: string; clubId: string }>;
}) {
  const plugin = (await params).plugin;
  const clubId = (await params).clubId;
  return (
    <div>
      <Rules clubId={clubId} />
    </div>
  );
}
