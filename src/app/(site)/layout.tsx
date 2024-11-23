import LayoutPanel from "@/components/globals/layout-panel/layout-panel";
const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="">
      <LayoutPanel>{children}</LayoutPanel>
    </section>
  );
};

export default SiteLayout;
