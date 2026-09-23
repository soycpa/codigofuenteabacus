import FunnelStep from "./funnel-step";
import { FunnelProvider } from "@/lib/funnel-context";
export const dynamic = "force-dynamic";

export default function StepPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  const safeId = isNaN(id) || id < 1 || id > 17 ? 1 : id;
  return (
    <FunnelProvider>
      <FunnelStep stepId={safeId} basePath="/step" />
    </FunnelProvider>
  );
}
