import { DebateSection } from "./debate-section";
import DebateInfo from "./debate-info";
export default function ViewDebate() {
  return (
    <div className="space-y-8">
      <DebateInfo />
      <DebateSection />
    </div>
  );
}
