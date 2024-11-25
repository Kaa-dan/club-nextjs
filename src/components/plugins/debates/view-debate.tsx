import { DebateSection } from "./debate-section";
import DebateInfo from "./debate-info";
export default function ViewDebate({ forum }: { forum: TForum }) {
  return (
    <div className="space-y-8">
      <DebateInfo />
      <DebateSection forum={forum} />
    </div>
  );
}
