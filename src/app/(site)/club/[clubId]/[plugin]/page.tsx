import Rules from "@/components/pages/club/club-modules/rules";

export default async function Page({
  params,
}: {
  params: Promise<{ plugin: string }>;
}) {
  const slug = (await params).plugin;
  return (
    <div>
      <Rules />
    </div>
  );
}
